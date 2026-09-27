# Argo CD — VProfile Application Setup

Use the commands below after Argo CD is installed and the Helm repository is available.

## Login

```bash
argocd login argocd.<YOUR_DOMAIN> --username admin
```

## Add the Helm repository

```bash
argocd repo add git@github.com:<YOUR_GITHUB_USERNAME>/vprofile-helm.git \
  --ssh-private-key-path ~/.ssh/<KEY_NAME>
```

## Verify the EKS node groups

```bash
aws eks list-nodegroups \
  --cluster-name vprofile-eks-cluster \
  --region us-east-1
```

## Inspect the node role

```bash
aws eks describe-nodegroup \
  --cluster-name vprofile-eks-cluster \
  --nodegroup-name <NODEGROUP_NAME> \
  --region us-east-1 \
  --query "nodegroup.nodeRole" \
  --output text
```

Use the least-privilege IAM policy required by the workload. For ECR image pulls, prefer the standard EKS node role permissions rather than broadening permissions unnecessarily.

## Argo CD resources

The Helm repository should contain an Argo CD `AppProject` and `Application` for VProfile. The Application should point to the Helm chart path and target the `vprofile` namespace.
