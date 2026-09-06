# GitHub Actions CI/CD → ECR → ECS Fargate

A VProfile Java web application deployed with a GitHub Actions CI/CD pipeline.

This project implements a complete CI/CD pipeline using GitHub Actions. The AWS infrastructure is provisioned manually, while GitHub Actions automates testing, code analysis, Docker image building and publishing to Amazon ECR, and deployment to Amazon ECS. HTTPS is configured through an Application Load Balancer and ACM, with Route 53 providing the custom domain.

## Architecture

```text
Developer
   |
   v
GitHub Repository
   |
   v
GitHub Actions Workflow
   |
   +--> Testing
   |      +--> Checkout
   |      +--> Maven Test
   |      +--> Checkstyle
   |      +--> SonarCloud Scan
   |      +--> SonarCloud Quality Gate
   |
   +--> BUILD_AND_PUBLISH
   |      +--> Checkout
   |      +--> Inject RDS settings
   |      +--> Build Docker image
   |      +--> Push to Amazon ECR
   |
   +--> Deploy
          +--> Render ECS task definition
          +--> Use GitHub Run Number as image tag
          +--> Deploy new task definition to ECS
          +--> Wait for ECS service stability

Amazon ECR
   |
   v
ECS Fargate
   |
   v
Application Load Balancer
   |
   +--> HTTP :80
   |      (recommended: redirect to HTTPS)
   |
   +--> HTTPS :443
          |
          +--> ACM *.sajan.tech
          |
          v
       Target Group :8080
          |
          v
       VProfile / Tomcat

Route 53
   |
   +--> vprofile.sajan.tech
           CNAME
           |
           v
       ALB DNS name
```

## AWS environment used

- AWS Region: `us-east-2`
- ECR Repository: `github-ci-cd`
- ECS Cluster: `vproapp-github`
- ECS Service: `vproapp-github-svc`
- ECS Task Definition Family: `vproapp-github-tdef`
- Container Name: `vproapp`
- Container Port: `8080`
- Target Group: `vproappECS-TGnew`
- Load Balancer: `vproappECSELB`
- Custom application hostname: `vprofile.sajan.tech`
- ACM certificate: wildcard certificate for `*.sajan.tech`
- ALB HTTPS listener: `443`

## CI/CD jobs

### 1. Testing

The `Testing` job:

1. Checks out the repository.
2. Runs Maven tests.
3. Runs Checkstyle.
4. Uses SonarSource's SonarQube scan action.
5. Checks the SonarCloud quality gate.

The workflow requires the SonarCloud values to be stored as GitHub repository secrets.

### 2. BUILD_AND_PUBLISH

This job waits for `Testing`:

```yaml
needs: Testing
```

It then:

1. Checks out the source.
2. Replaces the database username, password, and endpoint in `application.properties`.
3. Builds the Docker image.
4. Pushes the image to Amazon ECR.

The image receives two tags:

```text
latest
<github.run_number>
```

For example, GitHub Actions run `11` produces:

```text
github-ci-cd:11
```

### 3. Deploy

The deployment job waits for `BUILD_AND_PUBLISH`:

```yaml
needs: BUILD_AND_PUBLISH
```

It uses:

```text
${{ github.run_number }}
```

as the Docker image tag.

The ECS task definition renderer replaces the container image with:

```text
<REGISTRY>/github-ci-cd:<github.run_number>
```

Then the updated task definition is deployed to the ECS service.

`wait-for-service-stability: true` makes the workflow wait until ECS reaches a stable service state.

## Important GitHub Secrets

Create these repository secrets:

```text
SONAR_TOKEN
SONAR_URL
SONAR_ORGANIZATION
SONAR_PROJECT_KEY

AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY

REGISTRY

RDS_USER
RDS_PASS
RDS_ENDPOINT
```

### REGISTRY

The value should be the ECR registry/account URI without the repository name, for example:

```text
368740523992.dkr.ecr.us-east-2.amazonaws.com
```

The workflow constructs:

```text
${{ secrets.REGISTRY }}/${{ env.ECR_REPOSITORY }}:${{ github.run_number }}
```

## GitHub Actions workflow

The workflow is located at:

```text
.github/workflows/main.yml
```

The current trigger is manual:

```yaml
on: workflow_dispatch
```

This means you can run it from:

**GitHub → Actions → github-ci-cd → Run workflow**

If automatic execution on pushes is desired later, the trigger can be changed to a push-based trigger.

## Dockerfile

The Dockerfile uses a multi-stage build:

```text
Maven + Java 21 build image
        |
        v
Build WAR
        |
        v
Tomcat 10 + JDK 21 runtime image
        |
        v
ROOT.war
        |
        v
Port 8080
```

The runtime command is:

```dockerfile
CMD ["catalina.sh", "run"]
```

## Database configuration

The repository contains the default development values in:

```text
src/main/resources/application.properties
```

The CI/CD workflow changes:

```text
jdbc.username
jdbc.password
jdbc.url
```

before the Docker image is built.

The endpoint replacement is:

```bash
sed -i "s/vprodb/${{ secrets.RDS_ENDPOINT }}/" src/main/resources/application.properties
```

This is important because the source file uses `vprodb` as the original database hostname.

## ECS task definition

The source task definition is:

```text
aws-files/taskdeffile.json
```

The deployment action renders the new image tag into this file during the workflow.

The application container listens on:

```text
8080
```

The ALB forwards traffic to the ECS target group on port `8080`.

## HTTPS / ACM / Route 53

The project goes one step further than the original course flow by using a custom DNS name and HTTPS.

### Route 53

Create a CNAME record:

```text
Name:   vprofile
Type:   CNAME
Value:  vproappecselb-130055047.us-east-2.elb.amazonaws.com
```

This gives:

```text
vprofile.sajan.tech
```

### ACM

The ALB HTTPS listener uses the ACM wildcard certificate:

```text
*.sajan.tech
```

Therefore:

```text
https://vprofile.sajan.tech/login
```

can use the certificate.

### ALB listeners

HTTPS:

```text
HTTPS :443
   |
   +--> ACM *.sajan.tech
   |
   +--> vproappECS-TGnew
```

HTTP:

```text
HTTP :80
```

For a production-style setup, HTTP :80 should redirect to HTTPS :443 instead of forwarding directly.

## Screenshots

The `screenshots/` directory contains named PNG placeholders.

Replace each placeholder with your actual AWS/GitHub/Sonar screenshot while keeping the same filename.

```text
screenshots/
├── 01-architecture.png
├── 02-github-actions.png
├── 03-sonar-quality-gate.png
├── 04-ecr-images.png
├── 05-ecs-service.png
├── 06-ecs-task-definition.png
├── 07-alb-https-listener.png
└── 08-route53-dns.png
└── 09-https-login.png
```

Recommended screenshot contents:

| File                         | Screenshot to add                                       |
| ---------------------------- | ------------------------------------------------------- |
| `01-architecture.png`        | Overall GitHub → Actions → ECR → ECS → ALB architecture |
| `02-github-actions.png`      | Successful GitHub Actions workflow                      |
| `03-sonar-quality-gate.png`  | SonarCloud project / quality gate                       |
| `04-ecr-images.png`          | ECR repository showing `latest` and numbered image tags |
| `05-ecs-service.png`         | ECS service showing healthy deployment                  |
| `06-ecs-task-definition.png` | ECS task definition and container image                 |
| `07-alb-https-listener.png`  | ALB HTTPS 443 listener with ACM certificate             |
| `08-route53-dns.png`         | Route 53 CNAME for `vprofile.sajan.tech`                |
| `09-https-login.png`         | Route 53 CNAME for `vprofile.sajan.tech`                |

## Repository structure

```text
github-cicd-ecs/
├── .github/
│   └── workflows/
│       └── main.yml
├── aws-files/
│   └── taskdeffile.json
├── src/
│   └── main/
│       ├── java/
│       ├── resources/
│       └── webapp/
├── Dockerfile
├── pom.xml
├── screenshots/
└── README.md
```
