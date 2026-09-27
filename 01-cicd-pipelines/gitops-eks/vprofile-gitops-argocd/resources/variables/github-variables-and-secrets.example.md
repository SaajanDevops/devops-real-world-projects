# GitHub Variables & Secrets Reference

Use GitHub **Actions Variables** for non-sensitive configuration and **Actions Secrets** for credentials/tokens.

## Variables

| Name             | Type     | Purpose                | Example                     |
| ---------------- | -------- | ---------------------- | --------------------------- |
| `AWS_REGION`     | Variable | AWS deployment region  | `us-east-1`                 |
| `ECR_REPOSITORY` | Variable | ECR repository name    | `vprofileapp`               |
| `HELM_REPO_NAME` | Variable | GitHub Helm repository | `vprofile-helm`             |
| `SONAR_HOST_URL` | Variable | SonarQube server URL   | `http://54.237.200.63:9000` |

## Secrets

| Name                    | Purpose                                            |
| ----------------------- | -------------------------------------------------- |
| `SONAR_TOKEN`           | SonarQube authentication token                     |
| `AWS_ACCESS_KEY_ID`     | AWS authentication when OIDC is not used           |
| `AWS_SECRET_ACCESS_KEY` | AWS authentication when OIDC is not used           |
| `HELM_REPO_USER`        | GitHub identity used by automation                 |
| `GITOPS_PAT`            | Token used to create/update the Helm repository PR |

> Prefer GitHub OIDC with an AWS IAM role instead of long-lived AWS access keys for a production implementation.

Never commit real secret values to this project package.
