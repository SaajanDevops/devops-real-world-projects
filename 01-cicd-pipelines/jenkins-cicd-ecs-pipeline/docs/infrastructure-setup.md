# Infrastructure Setup Notes

Reference for how the three CI/CD servers (Jenkins, Nexus, SonarQube) and
the ECS staging/production environments were provisioned.

## EC2 Instances

| Server | AMI | Instance Type | Provisioning |
|---|---|---|---|
| Jenkins | Ubuntu 24.04 | t2.medium (resized after adding Docker) | `userdata/jenkins-setup.sh` |
| Nexus | Amazon Linux | t2.medium / t3.medium | `userdata/nexus-setup.sh` |
| SonarQube | Ubuntu 24.04 | t2.medium / t3.medium | `userdata/sonar-setup.sh` |

Nexus and SonarQube are provisioned automatically via EC2 user-data scripts.

## Security Groups

| Security Group | Inbound Rules |
|---|---|
| Jenkins-SG | 22 (My IP), 8080 (Anywhere — required for GitHub webhook), 8080 (from Sonar-SG) |
| Nexus-SG | 22 (My IP), 8081 (My IP), 8081 (from Jenkins-SG) |
| Sonar-SG | 22 (My IP), 80 (My IP), 80 (from Jenkins-SG) |

## IAM

- User with policies: `AmazonEC2ContainerRegistryFullAccess`, `AmazonECS_FullAccess`
- Access key stored in Jenkins as an **AWS Credentials** entry, ID `awscreds`

## Nexus Repositories

| Repository | Type | Purpose |
|---|---|---|
| `vprofile-release` | Maven (hosted), Release policy | Stores built/tested artifacts |
| `vpro-maven-central` | Maven2 (proxy) → `https://repo1.maven.org/maven2/` | Caches/serves Maven Central dependencies |
| `vprofile-snapshot` | Maven (hosted), Snapshot policy | Snapshot builds |
| `vpro-maven-group` | Maven2 (group) | Combines all three above into one URL for Maven/Jenkins |

## Jenkins Tools

- **JDK17** — system JDK path, "Install automatically" unchecked
- **MAVEN3.9** — version 3.9.9, "Install automatically" checked
- **sonarscanner** — SonarQube Scanner tool

## Jenkins Credentials

| ID | Kind | Used for |
|---|---|---|
| `nexuslogin` | Username with password | Maven/Nexus auth (settings.xml, publish stage) |
| `sonartoken` | Secret text | SonarQube server auth token |
| `slacktoken` | Secret text | Slack incoming notifications |
| `awscreds` | AWS Credentials | ECR push + ECS deploy |

## ECS

- **Staging**: cluster `vproappstaging`, Fargate, Application Load Balancer
- **Production**: cluster `vproappProd`, its own load balancer/target group, same task definition family as staging
- Both use `aws ecs update-service --force-new-deployment` to roll out the latest pushed image
- **Only the Tomcat/app container is deployed** — see `README.md` → Scope. MySQL/RabbitMQ/Memcached are not part of this ECS setup, so "Deployment failure detection" is deliberately unchecked: the app logs an expected RabbitMQ connection error on startup, and leaving detection on would cause ECS to treat that as a failed container and endlessly recreate it.

## Docker Images

- `Docker-files/app/multistage/Dockerfile` — used by the pipeline; builds the .war with Maven in one stage, copies it into a Tomcat runtime in the final stage (only the final stage ships)
- `Docker-files/db/Dockerfile` — MySQL 8 seeded with `db_backup.sql` on first run
- `Docker-files/web/Dockerfile` — Nginx configured via `nginvproapp.conf`

## Known Gotchas (real issues encountered during setup)

- **SSH host key verification failed** on first Jenkins build — fix: `su - jenkins && ssh -T git@github.com`, accept the fingerprint once.
- **Groovy string interpolation** — `${...}` only works inside double-quoted strings; a build failing on the Nexus publish stage with a credentials/syntax complaint is usually a quoting issue.
- **Docker stage name must be lowercase** (`AS build_image`, not `Build_Image`) or the matching `COPY --from=` reference breaks the build.
- **Jenkins' public IP changes every stop/start** — the GitHub webhook URL needs updating each session.
- **ECS "Deployment failure detection"** must be unchecked for staging, since the RabbitMQ dependency isn't deployed — otherwise ECS treats healthy-but-logging-errors containers as failed and recreates them in a loop.
