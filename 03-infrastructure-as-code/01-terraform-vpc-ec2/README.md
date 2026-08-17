# Terraform VPC and EC2

Provisions a VPC from scratch — subnet, internet gateway, route table,
and a security group — then launches an EC2 instance bootstrapped with
NGINX via user data, fully reachable from the public internet.

## Architecture

```
Internet
    │
    ▼
Internet Gateway ── attached to ── VPC (10.0.0.0/16)
    │                                   │
    ▼                                   ▼
Public Route Table              Public Subnet (10.0.0.0/24)
(0.0.0.0/0 → IGW)                       │
    │ associated with                   ▼
    └──────────────────────────► EC2 Instance (t3.nano)
                                  Security Group: 80/443 in, all out
                                  user_data installs + starts NGINX
```

## Stack

Terraform (~> 1.7), AWS Provider (~> 5.0), AWS VPC, EC2, Internet
Gateway, Route Table, Security Groups

## Structure

- `provider.tf` — Terraform and AWS provider version constraints, region config
- `networking.tf` — VPC, subnet, internet gateway, route table, route table association, and the shared `common_tags` local
- `compute.tf` — EC2 instance (with NGINX bootstrap via `user_data`) and its security group

## Key Concepts Demonstrated

- **Resource dependencies via implicit references** — `aws_subnet.public.id`, `aws_vpc.main.id`, etc. let Terraform build the dependency graph automatically, without explicit `depends_on`
- **Decoupled security group rules** — uses `aws_vpc_security_group_ingress_rule` / `aws_vpc_security_group_egress_rule` as standalone resources rather than inline `ingress {}` / `egress {}` blocks inside `aws_security_group`. This is the current AWS provider (v5+) recommended pattern: each rule is managed independently, which avoids the whole-block replacement behavior of the older inline style and allows rules to be added/removed without touching the security group resource itself
- **Consistent tagging via `locals` + `merge()`** — a single `common_tags` local is merged with a per-resource `Name` override, keeping tagging consistent across every resource while still letting each one have a distinct name
- **Bootstrapping via `user_data`** — the EC2 instance installs and starts NGINX on first boot with a heredoc bash script, so the instance is serving traffic immediately after provisioning with no manual step
- **Root volume configuration** — `root_block_device` explicitly sets volume size/type (`gp3`, 10GB) and `delete_on_termination`, rather than relying on AMI defaults

## How to Run

```bash
terraform init
terraform plan
terraform apply
```

After apply, the EC2 instance's public IP (visible in the AWS console or
via `terraform state show aws_instance.web`) should serve the NGINX
default page on port 80.

```bash
terraform destroy
```

## What I changed from the course version

[Add your own modification here — e.g. different region, added an output for the instance's public IP, restricted ingress to a specific CIDR instead of 0.0.0.0/0, etc.]

## Screenshots

https://github.com/SaajanDevops/devops-real-world-projects/blob/main/03-infrastructure-as-code/01-terraform-vpc-ec2/screenshots/terraform_vpc_ec2_architecture.png
