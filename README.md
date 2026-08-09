# DevOps Real World Projects

Hands-on DevOps and cloud engineering projects covering CI/CD pipelines,
cloud migration, containerization, Kubernetes, GitOps, infrastructure as
code, monitoring/observability, and multi-cloud deployment.

Each project folder is self-contained: its own README (problem statement,
architecture, stack, how to run), its own code, and its own screenshots.

## Projects

### 01 - CI/CD Pipelines

| Project                                                                  | Description                                                                                                                                                                                 | Stack                                                 |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| [jenkins-cicd-ecs-pipeline](01-cicd-pipelines/jenkins-cicd-ecs-pipeline) | End-to-end pipeline: build, unit test, Checkstyle, SonarQube quality gate, publish to Nexus, Docker build, deploy to ECS staging, manual-gated promotion to production, Slack notifications | Jenkins, Nexus, SonarQube, Slack, Docker, AWS ECR/ECS |

### 02 - Cloud Migration (AWS)

| Project                                                         | Description                                                                                                                                                                                                            | Stack                                              |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| [lift-and-shift-ec2](02-cloud-migration-aws/lift-and-shift-ec2) | Migrated a multi-tier Java app (Tomcat, MySQL, Memcached, RabbitMQ) from local Vagrant to AWS EC2 via a lift-and-shift strategy — ALB with HTTPS, Auto Scaling Group, private Route 53 DNS, S3-based build/deploy flow | AWS EC2, ALB, Auto Scaling, Route 53, ACM, S3, IAM |

_(More categories — Infrastructure as Code, Containerization, Kubernetes, GitOps, Monitoring, Multi-Cloud — will be added soon.)_

## Skills Matrix

| Tool                                                            | Projects |
| --------------------------------------------------------------- | -------- |
| Jenkins                                                         | 01       |
| Docker                                                          | 01       |
| SonarQube / Nexus                                               | 01       |
| AWS (VPC, EC2, EKS, ECR, ECS, ALB, ASG, Route 53, ACM, S3, IAM) | 01, 02   |
| Slack (CI notifications)                                        | 01       |

## How this repo is organized

Projects are grouped by capability, not by course — each numbered folder
represents a category (CI/CD, Cloud Migration, etc.), and inside it are
one or more independent projects. This structure is intentional: it lets
the repo grow indefinitely as new projects are added, without ever
needing to be reorganized.
