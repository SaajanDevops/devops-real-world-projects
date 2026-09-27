terraform {
  backend "s3" {
    bucket = "gitops-argo-cd"
    key    = "eks/terraform.tfstate"
    region = "us-east-1"
  }
}