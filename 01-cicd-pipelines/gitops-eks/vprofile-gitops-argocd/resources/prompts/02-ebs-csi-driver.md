### EBS CSI DRIVER prompt
Prompt to add EBS CSI Driver in EKS

- Add EBS CSI Driver IRSA to EKS cluster in Terraform:

1. Associate OIDC provider with EKS cluster
2. Create IAM role "AmazonEKS_EBS_CSI_DriverRole" with OIDC trust relationship
3. Attach policy "arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy"
4. Enable the aws-ebs-csi-driver addon with the service account role ARN

5. Do NOT create a Kubernetes service account - AWS addon will create it.
