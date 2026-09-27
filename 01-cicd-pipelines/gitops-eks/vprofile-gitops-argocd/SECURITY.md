# Security Checklist

This project is intended for portfolio and technical demonstration purposes.

## Never commit

- AWS access keys or secret keys
- GitHub personal access tokens
- SSH private keys
- SonarQube tokens
- Database passwords
- RabbitMQ passwords
- Production Kubernetes secrets
- Terraform state files containing sensitive data

## Recommended authentication

For GitHub Actions → AWS access, prefer GitHub OIDC with a dedicated IAM role and least-privilege policies.

## Environment-specific values

Replace these before deployment:

- AWS account IDs
- AWS region
- ECR repository name
- ACM certificate ARN
- DNS/domain names
- GitHub repository names
- database and messaging credentials

## Demo values

Any sample credentials shown in manifests or documentation are placeholders/demo values only. Do not reuse them in production.
