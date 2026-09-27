# Install Required Tools

## For Windows open Powershell as admin and execute below commands
choco install awscli terraform kubernetes-cli kubernetes-helm -y
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser irm get.scoop.sh | iex

scoop install eksctl


# For MacOS open terminal and execute below commands.
brew install awscli terraform kubernetes-cli helm eksctl
