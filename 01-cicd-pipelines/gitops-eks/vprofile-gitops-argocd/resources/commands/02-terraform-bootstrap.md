# PREREQS

- GoDaddy domain (e.g., sajan.tech)
- AWS Public Certificate for domain (*.sajan.tech)
- IAM user with AdministratorAccess policy

# Install Required Tools

choco install awscli terraform kubernetes-cli kubernetes-helm -y
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser irm get.scoop.sh | iex

scoop install eksctl

brew install awscli terraform kubernetes-cli helm eksctl

# SET IAM Access
Create IAM user with admin policy and download access keys.
aws configure

Clone source code from github by setting ssh keys.
Open the source code in vscode.
Configrue Amazon Q in vscode.

Create minimal Terraform configuration for AWS EKS cluster with these requirements:

**Files to create:**
- main.tf: Core infrastructure (VPC, subnets, IAM roles, EKS cluster, node group)
- variables.tf: All configurable parameters
- outputs.tf: Essential cluster information
- backend.tf: S3 backend

**Specifications:**
- Region: us-east-1
- Cluster name: vprofile-eks-cluster
- Backend: S3 backend without dynamodb locking
- VPC: 10.0.0.0/16 with ONLY public subnets across 2 AZs
- Node group: 1 t3.large instance (min=1, max=2, desired=1) in public subnets
- Use minimal resources for cost optimization - NO private subnets, NO NAT gateways

**Network Architecture:**
- Create only public subnets with direct internet access
- Place EKS cluster and worker nodes in public subnets
- Include proper EKS subnet tags for load balancer integration

**Outputs to include:**
- cluster_endpoint, cluster_name, cluster_arn

**Code Quality Requirements:**
- Ensure all code is properly formatted with `terraform fmt`
- Use consistent indentation and spacing
- Follow Terraform best practices for readability

Keep code minimal - only essential components for functional EKS cluster with public subnet architecture.


After Copilot generates the code:
Review all files (main.tf, variables.tf, outputs.tf, backend.tf)

Run Terraform commands:
Bash
terraform init
terraform plan
terraform apply
Confirm with yes when prompted.



### EBS CSI DRIVER prompt
Prompt to add EBS CSI Driver in EKS

- Add EBS CSI Driver IRSA to EKS cluster in Terraform:

1. Associate OIDC provider with EKS cluster
2. Create IAM role "AmazonEKS_EBS_CSI_DriverRole" with OIDC trust relationship
3. Attach policy "arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy"
4. Enable the aws-ebs-csi-driver addon with the service account role ARN

5. Do NOT create a Kubernetes service account - AWS addon will create it.

terraform init -upgrade
terraform plan
terraform apply
