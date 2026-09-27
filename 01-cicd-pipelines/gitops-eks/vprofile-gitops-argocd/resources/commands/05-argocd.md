# Argo CD Installation & Access

## Install with Helm

```bash
helm repo add argo https://argoproj.github.io/argo-helm
helm repo update

helm upgrade --install argocd argo/argo-cd \
  --create-namespace \
  -n argocd

kubectl rollout status deployment/argocd-server -n argocd
```

## Verify

```bash
kubectl get pods -n argocd
kubectl get svc -n argocd
kubectl get applications -n argocd
```

## Get the initial admin password

```bash
kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath="{.data.password}" | base64 -d; echo
```

Use an ingress/ALB or port-forward according to your environment. Never commit the generated admin password.
