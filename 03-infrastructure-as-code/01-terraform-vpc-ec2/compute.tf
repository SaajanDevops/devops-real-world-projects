resource "aws_instance" "web" {
  ami                         = "ami-06468be052a4195a6"
  associate_public_ip_address = true
  instance_type               = "t3.nano"
  subnet_id                   = aws_subnet.public.id
  key_name                    = "06-resources-key"
  vpc_security_group_ids      = [aws_security_group.public_http_traffic.id]
  root_block_device {
    delete_on_termination = true
    volume_size           = 10
    volume_type           = "gp3"


  }

  user_data = <<-EOF
              #!/bin/bash
              apt-get update -y
              apt-get install -y nginx
              systemctl enable nginx
              systemctl start nginx
              EOF

  tags = merge(local.common_tags, {
    Name = "06-resources-ec2 "
  })

}


resource "aws_security_group" "public_http_traffic" {
  description = "Security group allowing traffic on port 443 and 80"
  name        = "public_http_traffic"
  vpc_id      = aws_vpc.main.id


  tags = merge(local.common_tags, {
    Name = "06-resources-sg"
  })

}

resource "aws_vpc_security_group_ingress_rule" "http" {
  security_group_id = aws_security_group.public_http_traffic.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 80
  to_port           = 80
  ip_protocol       = "tcp"

}

resource "aws_vpc_security_group_ingress_rule" "https" {
  security_group_id = aws_security_group.public_http_traffic.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 443
  to_port           = 443
  ip_protocol       = "tcp"

}

resource "aws_vpc_security_group_ingress_rule" "ssh" {
  security_group_id = aws_security_group.public_http_traffic.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 22
  to_port           = 22
  ip_protocol       = "tcp"
}


resource "aws_vpc_security_group_egress_rule" "all" {
  security_group_id = aws_security_group.public_http_traffic.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"
}
