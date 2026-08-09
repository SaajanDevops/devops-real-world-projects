# Infrastructure Setup Notes — Lift and Shift on AWS

Reference for how the VProfile multi-tier stack was migrated from a local
Vagrant setup to AWS EC2, using a classic "lift and shift" (rehost)
strategy — same architecture, same services, just moved onto cloud
infrastructure instead of local VMs.

## Migration Strategy

This is a **rehost**, not a re-architecture: every service that ran on a
local VM (Tomcat, MySQL, Memcached, RabbitMQ) is provisioned as its own
EC2 instance, keeping the same multi-tier design. No managed AWS services
(RDS, ElastiCache, etc.) are used here — that re-architecture is a
separate, later project. This project's value is specifically
demonstrating the *rehost* pattern: move first, modernize later.

## EC2 Instances (4 total, region: eu-north-1)

| Instance | AMI | Purpose | Instance Type | Security Group |
|---|---|---|---|---|
| `vprofile-db01` | Amazon Linux 2023 | MariaDB (MySQL) | t3.nano | Backend-SG |
| `vprofile-mc01` | Amazon Linux 2023 | Memcached | t3.micro | Backend-SG |
| `vprofile-rmq01` | Amazon Linux 2023 | RabbitMQ | t3.micro | Backend-SG |
| `vprofile-app01` | Ubuntu 24.04 LTS | Tomcat 10 (app server) | t3.micro | tomcat-SG |

All instances are `t2.micro`/`t3.micro` (free-tier eligible), provisioned
via **EC2 user data** scripts (see `userdata/`) rather than manual setup —
each script installs and configures its service unattended on first boot.

Tomcat runs on Ubuntu specifically (not Amazon Linux, unlike the backend
services) because Ubuntu ships Tomcat 10 directly in its own package
repos — `apt install tomcat10` — versus needing to hand-install the
binary, create a systemd unit, and manage a dedicated Tomcat user, as
required on CentOS/Amazon Linux.

## Security Groups (3 total)

| Security Group | Inbound Rules |
|---|---|
| `vprofile-ELB-SG` | 80 (Anywhere), 443 (Anywhere) — public-facing load balancer traffic |
| `tomcat-SG` | 8080 (from vprofile-ELB-SG only), 22 (My IP) |
| `Backend-SG` | 3306 MySQL, 11211 Memcached, 5672 RabbitMQ (all three from tomcat-SG only), 22 (My IP), all traffic (from itself — allows the backend services to talk to each other) |

Key principle: each tier only accepts traffic from the tier in front of
it — the internet only reaches the load balancer, the load balancer only
reaches Tomcat on 8080, and only Tomcat can reach the backend services on
their specific ports. No service is open to "anywhere" except the load
balancer itself.

## Private DNS (Route 53)

Rather than hardcoding IP addresses in `application.properties` (which
would break every time an instance is replaced), a **private hosted
zone** provides internal name resolution:

| Record (A record) | Resolves to |
|---|---|
| `db01.<yourdomain>.tech` | db01 private IP |
| `mc01.<yourdomain>.tech` | mc01 private IP |
| `rmq01.<yourdomain>.tech` | rmq01 private IP |

The application connects to `db01.<yourdomain>.tech` etc. instead of a
raw IP — if an instance is ever replaced, only the DNS record needs
updating, not the application config or a rebuild.

## Build & Deploy Flow

The build happens **locally**, not on the server:

1. `mvn install` locally produces `vprofile-v2.war`
2. The `.war` is pushed to an S3 bucket (`aws s3 cp`)
3. On `app01`, the artifact is pulled from S3 (`aws s3 cp` again, in the
   other direction), the default Tomcat `ROOT` app is removed, and the new
   `.war` is dropped in as `ROOT.war`
4. Restarting Tomcat auto-extracts it

**IAM setup for this flow:**
- An IAM user (`vprofile-S3-Admin`) with S3 full access, used locally to `aws configure` and push the build
- An IAM role (`S3-Admin`) with S3 full access, attached directly to the `app01` EC2 instance, so the server can pull from S3 without needing stored credentials on the instance itself

## Load Balancer & HTTPS

- Application Load Balancer, listening on 80 and 443
- Target group routes to Tomcat instances on port 8080 (with the health check port explicitly overridden to 8080, since it defaults to 80)
- HTTPS listener uses a certificate issued via AWS Certificate Manager (ACM) for the public domain
- DNS: a CNAME record at the domain registrar points the public app URL at the load balancer's DNS name
- **Target group stickiness is enabled** — required because this app doesn't share session state across instances; without stickiness, a user could authenticate against one instance and get silently logged out if routed to another

## Auto Scaling

- AMI created from a working `app01` instance
- Launch template built from that AMI (security group, key pair, tags)
- Auto Scaling Group: min 1, max 4, desired 1, target tracking on CPU utilization (~50% threshold)
- ASG attached to the existing target group, so new instances register automatically
- ELB health checks enabled at the ASG level (not just target-group level) — this means an instance can be marked unhealthy and cycled out based on actual application health, not just whether the EC2 instance is running

## Known Gotchas

- **RabbitMQ install differs from the local Vagrant/CentOS setup** — Amazon Linux 2023 uses different package repositories, so the install follows RabbitMQ's official docs directly (signing keys + a repo definition file) rather than reusing the CentOS script.
- **Outbound security group rules must be left untouched** — editing outbound rules on any of these security groups blocks the instance from reaching the internet entirely, which silently breaks the user-data script (no error, packages just never install).
- **SSH access breaks the next day** — if using a home/dynamic IP, the "My IP" security group rule goes stale as soon as the IP changes; re-select "My IP" on the rule to refresh it.
- **Health check port must be explicitly overridden** — the target group's health check defaults to port 80, but Tomcat listens on 8080; missing this override makes every instance show unhealthy even though the app is fine.
- **Stickiness must be enabled for multi-instance setups** — without it, users get logged out when the load balancer routes them to a different instance than the one they authenticated against.

## A Note on the `userdata/` Folder

This folder may also contain `backend.sh` (an older, CentOS7/Vagrant-era
combined script referencing yum and a `/vagrant` path) and `nginx.sh`.
Neither is part of this project's actual AWS deployment — MySQL,
Memcached, and RabbitMQ each run on their own EC2 instance via the
dedicated `mysql.sh` / `memcache.sh` / `rabbitmq.sh` scripts above, and
there is no Nginx tier in this architecture (the ALB routes directly to
Tomcat on 8080). If those files aren't actually referenced anywhere in
this deployment, they should be removed from the repo to avoid implying
components that aren't actually wired in.
