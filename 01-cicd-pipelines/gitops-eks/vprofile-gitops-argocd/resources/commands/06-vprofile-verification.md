# VProfile Verification Commands

## Kubernetes resources

```bash
kubectl get all -n vprofile
kubectl get pvc -n vprofile
kubectl get ingress -n vprofile
kubectl get secrets -n vprofile
```

## Argo CD

```bash
argocd app list
argocd app get vprofile
argocd app sync vprofile
argocd app wait vprofile --health
```

## Application

Confirm the ALB hostname resolves to the configured application domain, HTTPS is working, and the VProfile login page loads.
