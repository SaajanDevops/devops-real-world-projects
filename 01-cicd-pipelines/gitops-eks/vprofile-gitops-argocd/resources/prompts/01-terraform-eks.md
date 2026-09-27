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
