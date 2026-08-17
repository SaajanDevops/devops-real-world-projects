# DevOps Real World Projects

Hands-on DevOps and cloud engineering projects covering CI/CD pipelines,
cloud migration, infrastructure as code, containerization, Kubernetes,
GitOps, monitoring/observability, and multi-cloud deployment.

Each project folder is self-contained: its own README (problem statement,
architecture, stack, how to run), its own code, and its own screenshots.

## About me

[Short intro — who you are, background, and the DevOps/Cloud role you're targeting]

## Projects

### 01 - CI/CD Pipelines
| Project | Description | Stack |
|---|---|---|
| [jenkins-cicd-ecs-pipeline](01-cicd-pipelines/jenkins-cicd-ecs-pipeline) | End-to-end pipeline: build, unit test, Checkstyle, SonarQube quality gate, publish to Nexus, Docker build, deploy to ECS staging, manual-gated promotion to production, Slack notifications | Jenkins, Nexus, SonarQube, Slack, Docker, AWS ECR/ECS |

### 02 - Cloud Migration (AWS)
| Project | Description | Stack |
|---|---|---|
| [lift-and-shift-ec2](02-cloud-migration-aws/lift-and-shift-ec2) | Migrated a multi-tier Java app (Tomcat, MySQL, Memcached, RabbitMQ) from local Vagrant to AWS EC2 via a lift-and-shift strategy — ALB with HTTPS, Auto Scaling Group, private Route 53 DNS, S3-based build/deploy flow | AWS EC2, ALB, Auto Scaling, Route 53, ACM, S3, IAM |
| [paas-saas-rearchitecture](02-cloud-migration-aws/paas-saas-rearchitecture) | Re-architected the same app from self-managed EC2 onto AWS managed services — Elastic Beanstalk, RDS, ElastiCache, Amazon MQ — with CloudFront for global edge delivery. Part 2 of the migration story started in `lift-and-shift-ec2` | AWS Elastic Beanstalk, RDS, ElastiCache, Amazon MQ, CloudFront, Route 53, ACM, IAM, CloudWatch |

### 03 - Infrastructure as Code
| Project | Description | Stack |
|---|---|---|
| [01-terraform-vpc-ec2](03-infrastructure-as-code/01-terraform-vpc-ec2) | VPC built from scratch (subnet, internet gateway, route table) with an EC2 instance bootstrapped via user data to serve NGINX. Uses the modern decoupled security group rule pattern (`aws_vpc_security_group_ingress_rule`/`egress_rule`) | Terraform, AWS VPC, EC2 |
| [02-terraform-s3-static-website](03-infrastructure-as-code/02-terraform-s3-static-website) | Static website hosted directly on S3 — bucket policy, website configuration, and content-aware object uploads with MD5-based change detection, no server to manage | Terraform, AWS S3 |

*(More categories — Containerization, Kubernetes, GitOps, Monitoring, Multi-Cloud — will be added here as each section is completed.)*

## Skills Matrix

| Tool | Projects |
|---|---|
| Jenkins | 01 |
| Docker | 01 |
| SonarQube / Nexus | 01 |
| AWS EC2 / ALB / Auto Scaling | 02, 03 |
| AWS Elastic Beanstalk | 02 |
| AWS RDS / ElastiCache / Amazon MQ | 02 |
| AWS CloudFront | 02 |
| AWS Route 53 / ACM / IAM / CloudWatch | 01, 02 |
| AWS ECR / ECS | 01 |
| AWS S3 | 02, 03 |
| AWS VPC (networking) | 02, 03 |
| Terraform | 03 |
| Slack (CI notifications) | 01 |

## How this repo is organized

Projects are grouped by capability, not by course — each numbered folder
represents a category (CI/CD, Cloud Migration, Infrastructure as Code,
etc.), and inside it are one or more independent, numbered projects. This
structure is intentional: it lets the repo grow indefinitely as new
projects are added, without ever needing to be reorganized.

Within a category, related projects are sequenced to tell a story where
relevant — for example, `lift-and-shift-ec2` and `paas-saas-rearchitecture`
together demonstrate a realistic two-stage cloud migration: rehost first,
then refactor onto managed services. Similarly, the Terraform projects
under `03-infrastructure-as-code` are numbered in the order they were
built, progressing from core resource management toward more advanced
Terraform concepts (modules, state management, remote backends) as new
projects are added.
