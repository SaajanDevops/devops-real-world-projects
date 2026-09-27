# AWS EKS & kubectl Commands

```bash
aws configure
aws sts get-caller-identity

aws eks update-kubeconfig \
  --name vprofile-eks-cluster \
  --region us-east-1

kubectl config current-context
kubectl get nodes
kubectl get pods -A
kubectl get svc -A
```

## EKS node groups

```bash
aws eks list-nodegroups --cluster-name vprofile-eks-cluster --region us-east-1
```
