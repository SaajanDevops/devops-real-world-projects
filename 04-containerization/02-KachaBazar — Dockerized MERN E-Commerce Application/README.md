# KachaBazar — Dockerized MERN E-Commerce Application

A full-stack MERN e-commerce application containerized and prepared for production-oriented deployment using **Docker, Docker Compose, MongoDB Atlas, and AWS cloud architecture**.

This project focuses on the **DevOps implementation** around a MERN application, including containerization, multi-service orchestration, environment configuration, database initialization, networking, and preparation for CI/CD and AWS deployment.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [How to Use This Project](#how-to-use-this-project)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [DevOps Implementation](#devops-implementation)
- [Docker Architecture](#docker-architecture)
- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [MongoDB Atlas Setup](#mongodb-atlas-setup)
- [Run the Application](#run-the-application)
- [Database Seeding](#database-seeding)
- [Application URLs](#application-urls)
- [Demo Login](#demo-login)
- [Screenshots](#screenshots)
- [Useful Docker Commands](#useful-docker-commands)
- [Security](#security)
- [Production Architecture](#production-architecture)
- [CI/CD Architecture](#cicd-architecture)
- [Production Components](#production-components)
- [DevOps Transformation](#devops-transformation)
- [DevOps Responsibilities](#devops-responsibilities)
- [Project Goals](#project-goals)
- [Project Status](#project-status)
- [Summary](#summary)

---

# Project Overview

KachaBazar is a MERN-based e-commerce application consisting of:

- **Customer Store** — Next.js
- **Admin Dashboard** — React + Vite
- **Backend API** — Node.js + Express
- **Database** — MongoDB Atlas

The application has been divided into independent services and containerized using Docker.

Docker Compose is used to orchestrate the application locally.

MongoDB is hosted externally using **MongoDB Atlas** instead of running as a MongoDB container.

---

# Architecture

## Local Architecture

```text
                         Docker Compose
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ▼                ▼                ▼
       ┌──────────┐     ┌──────────┐     ┌──────────┐
       │  Admin   │     │  Store   │     │ Backend  │
       │ React    │     │ Next.js  │     │ Node.js  │
       │  :4100   │     │  :3000   │     │  :5055   │
       └────┬─────┘     └────┬─────┘     └────┬─────┘
            │                │                │
            │                │                │
            │                └───────┬────────┘
            │                        │
            │                     REST API
            │                        │
            └────────────────────────▼
                              ┌──────────────┐
                              │ MongoDB Atlas│
                              └──────────────┘
```

### Service Overview

| Service | Technology           |   Port | Purpose                                |
| ------- | -------------------- | -----: | -------------------------------------- |
| Store   | Next.js              | `3000` | Customer-facing e-commerce application |
| Admin   | React + Vite + Nginx | `4100` | Administration dashboard               |
| Backend | Node.js + Express    | `5055` | REST API and application logic         |
| Seed    | Node.js              |      — | Initial database data                  |

The `seed` service runs during initialization and exits after successfully importing the data.

---

# How to Use This Project

Follow these steps to run the complete application locally.

## 1. Clone the Repository

```bash
git clone <repository-url>
cd kachabazar
```

## 2. Create Environment Files

Copy the example environment files:

```bash
cp backend/.env.example backend/.env
cp store/.env.example store/.env
cp admin/.env.example admin/.env
```

## 3. Add Your MongoDB Atlas Connection

Open:

```text
backend/.env
```

Find:

```env
MONGO_URI=<your-mongodb-atlas-connection-string>
```

Replace it with your own MongoDB Atlas connection string.

For example:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
```

> Do not commit your actual `.env` files or database credentials to GitHub.

## 4. Start the Application

From the project root, run:

```bash
docker compose up -d
```

Docker Compose will start:

```text
Admin
Store
Backend
Seed
```

The `seed` service automatically connects to MongoDB Atlas and imports the initial application data.

## 5. Check the Services

Run:

```bash
docker compose ps
```

You should see the main services running:

```text
kachabazar-admin
kachabazar-backend
kachabazar-store
```

The seed container may show:

```text
Exited (0)
```

This is expected because the seed service exits after successfully importing the initial data.

## 6. Verify Database Seeding

Check the seed logs:

```bash
docker compose logs seed
```

A successful import should show:

```text
mongodb connection success!
data inserted successfully!
```

The seed service may take a few moments during the first startup because it installs its dependencies before importing the data.

## 7. Open the Application

After the containers are running:

**Customer Store**

```text
http://localhost:3000
```

**Admin Dashboard**

```text
http://localhost:4100
```

**Backend API**

```text
http://localhost:5055
```

## 8. Test Customer Login

The database seed includes a demo customer account:

```text
Email:    justin@gmail.com
Password: 12345678
```

Open:

```text
http://localhost:3000
```

and use these credentials to test the customer login.

> This account is provided for demonstration and local testing purposes.

## Quick Start

For a fresh setup, the complete flow is:

```bash
git clone <repository-url>
cd kachabazar

cp backend/.env.example backend/.env
cp store/.env.example store/.env
cp admin/.env.example admin/.env
```

Add your MongoDB Atlas URI to:

```text
backend/.env
```

Then:

```bash
docker compose up -d
docker compose ps
docker compose logs seed
```

Finally open:

```text
http://localhost:3000
```

---

# Technology Stack

## Application

- Node.js
- Express.js
- React
- Next.js
- Vite
- Tailwind CSS
- MongoDB
- Mongoose
- Socket.IO
- NextAuth
- Stripe integration
- Cloudinary integration

## DevOps & Infrastructure

- Docker
- Docker Compose
- Multi-stage Docker builds
- Nginx
- MongoDB Atlas

## Planned Cloud Infrastructure

- GitHub
- GitHub Actions
- Amazon ECR
- Amazon ECS
- Application Load Balancer
- AWS Secrets Manager / Parameter Store
- MongoDB Atlas

---

# Project Structure

```text
kachabazar/
│
├── admin/
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
│
├── backend/
│   ├── api/
│   ├── config/
│   ├── models/
│   ├── script/
│   ├── utils/
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
│
├── store/
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   ├── next.config.js
│   ├── package.json
│   └── .env.example
│
├── screenshots/
│   └── ...
│
├── compose.yaml
├── README.md
└── .gitignore
```

---

# DevOps Implementation

The main purpose of this project is to demonstrate the DevOps implementation around a full-stack MERN application.

## 1. Application Containerization

The application is divided into separate Docker containers:

```text
Backend
Store
Admin
Seed
```

Each major application component has its own Docker image:

```text
kachabazar-backend
kachabazar-store
kachabazar-admin
```

This provides service isolation and allows individual components to be built and deployed independently.

## 2. Multi-Stage Docker Builds

Production Dockerfiles use multi-stage builds where appropriate.

The general flow is:

```text
Source Code
     │
     ▼
Dependencies
     │
     ▼
Build
     │
     ▼
Production Runtime
```

This separates build dependencies from the final runtime environment.

## 3. Docker Compose

Docker Compose is used to orchestrate the complete local environment.

```text
Docker Compose
│
├── Admin
├── Store
├── Backend
└── Seed
```

A single command starts the application:

```bash
docker compose up -d
```

## 4. MongoDB Atlas Integration

MongoDB is not run as a local Docker container.

Instead:

```text
Backend Container
       │
       ▼
MongoDB Atlas
```

This keeps the database separate from the application containers and provides a managed database environment.

## 5. Database Initialization

A dedicated `seed` service initializes the MongoDB Atlas database with the application's initial data.

The seed process:

```text
Install Dependencies
        │
        ▼
Connect to MongoDB Atlas
        │
        ▼
Import Initial Data
        │
        ▼
Exit Successfully
```

The seed container is expected to exit after the import completes.

---

# Docker Architecture

The local Docker environment contains:

```text
                    Docker Network
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
       Admin           Store          Backend
       :4100           :3000           :5055
                                         │
                                         ▼
                                  MongoDB Atlas
```

Docker Compose automatically creates a network for communication between the application containers.

---

# Prerequisites

Before running the project, install:

- Git
- Docker Desktop
- Docker Compose
- MongoDB Atlas account

Verify Docker:

```bash
docker --version
```

Verify Docker Compose:

```bash
docker compose version
```

---

# Environment Configuration

Environment variables are provided through `.env.example` files.

Create the required environment files:

```bash
cp backend/.env.example backend/.env
cp store/.env.example store/.env
cp admin/.env.example admin/.env
```

The actual `.env` files are excluded from Git.

## What needs to be changed?

The recruiter only needs to provide their own **MongoDB Atlas connection string**.

In:

```text
backend/.env
```

replace:

```env
MONGO_URI=<your-mongodb-atlas-connection-string>
```

The remaining demonstration configuration is provided in the example files.

> For production use, replace all demonstration/testing credentials and configuration with production-specific values.

---

# MongoDB Atlas Setup

The application requires MongoDB Atlas.

Create your own MongoDB Atlas cluster and database user.

Then update:

```text
backend/.env
```

with your connection string:

```env
MONGO_URI=<your-mongodb-atlas-connection-string>
```

Make sure your MongoDB Atlas Network Access configuration allows the machine running the application to connect.

---

# Run the Application

After configuring the environment files:

```bash
docker compose up -d
```

Check the containers:

```bash
docker compose ps
```

Expected services:

```text
kachabazar-admin      Up
kachabazar-backend    Up
kachabazar-store      Up
```

The seed service may show:

```text
Exited (0)
```

This is expected because it performs a one-time database initialization.

---

# Database Seeding

The seed service automatically imports the initial application data.

Check the seed logs:

```bash
docker compose logs seed
```

Successful initialization:

```text
mongodb connection success!
data inserted successfully!
```

The seed container exits after the import completes.

---

# Application URLs

Once the containers are running:

### Customer Store

```text
http://localhost:3000
```

### Admin Dashboard

```text
http://localhost:4100
```

### Backend API

```text
http://localhost:5055
```

---

# Demo Login

A pre-created customer account is included in the seeded database.

Use the following credentials to test the Store:

```text
Email:    justin@gmail.com
Password: 12345678
```

Open:

```text
http://localhost:3000
```

and use the credentials above to log in.

> This account is provided for demonstration and local testing purposes.

---

# Screenshots

The `screenshots/` directory contains screenshots demonstrating both the application and the DevOps implementation.

## Customer Store

### Store Home

![Store Home](screenshots/01-store-home.png)

### Customer Login

![Store Login](screenshots/02-store-login.png)

### Products

![Store Products](screenshots/03-store-products.png)

## Admin Dashboard

### Admin Login

![Admin Login](screenshots/04-admin-login.png)

### Admin Dashboard

![Admin Dashboard](screenshots/05-admin-dashboard.png)

## Docker & DevOps

### Docker Compose Services

![Docker Compose Services](screenshots/06-docker-compose-services.png)

### Docker Network

![Docker Network](screenshots/07-docker-network.png)

### Backend

![Backend API](screenshots/08-backend-api.png)

### Database Seeding

![Database Seed](screenshots/09-database-seed.png)

---

# Useful Docker Commands

## Start the application

```bash
docker compose up -d
```

## Check containers

```bash
docker compose ps
```

## View all logs

```bash
docker compose logs
```

## Backend logs

```bash
docker compose logs backend
```

## Store logs

```bash
docker compose logs store
```

## Admin logs

```bash
docker compose logs admin
```

## Seed logs

```bash
docker compose logs seed
```

## Follow backend logs

```bash
docker compose logs -f backend
```

## Restart services

```bash
docker compose restart
```

## Stop the application

```bash
docker compose down
```

---

# Security

Actual environment files containing credentials should never be committed.

The repository contains:

```text
.env.example
```

files instead of real environment files.

Never commit:

- MongoDB passwords
- JWT secrets
- SMTP passwords
- Stripe secret keys
- API credentials
- Production credentials

For production deployments, sensitive values should be managed using:

```text
AWS Secrets Manager
```

or:

```text
AWS Systems Manager Parameter Store
```

---

# Testing Email Configuration

SMTP configuration may be provided for local demonstration and testing purposes.

The provided testing credentials allow the recruiter to test email-related functionality without configuring an SMTP provider immediately.

These credentials are:

- For local testing
- For demonstration
- Not intended for production use

For production deployments, dedicated SMTP credentials should be configured through a secure secret-management solution.

---

# Production Architecture

The Dockerized application is designed to move from local Docker Compose to AWS container infrastructure.

```text
                              GitHub
                                 │
                                 ▼
                         GitHub Actions
                                 │
                         Build & Test
                                 │
                                 ▼
                          Docker Images
                                 │
                                 ▼
                            Amazon ECR
                                 │
                  ┌──────────────┼──────────────┐
                  │              │              │
                  ▼              ▼              ▼
               Backend         Store          Admin
                  │              │              │
                  └──────────────┼──────────────┘
                                 │
                                 ▼
                              Amazon ECS
                                 │
                                 ▼
                    Application Load Balancer
                                 │
                                 ▼
                             End Users
                                 │
                                 ▼
                           Backend API
                                 │
                                 ▼
                          MongoDB Atlas
```

---

# CI/CD Architecture

The planned CI/CD pipeline is:

```text
Developer
    │
    ▼
GitHub
    │
    ▼
GitHub Actions
    │
    ├── Checkout
    ├── Install Dependencies
    ├── Run Tests
    ├── Build Docker Images
    ├── Authenticate with AWS
    └── Push Images
            │
            ▼
        Amazon ECR
            │
            ▼
        Amazon ECS
            │
            ▼
        Deployment
```

The goal is to automate the process from source code changes to container deployment.

---

# Production Components

## GitHub

Source control and collaboration.

## GitHub Actions

Automated CI/CD pipeline.

## Amazon ECR

Container image registry.

Separate images can be stored for:

```text
Backend
Store
Admin
```

## Amazon ECS

Container orchestration and service deployment.

## Application Load Balancer

Public entry point for the production application.

## MongoDB Atlas

Managed database service.

## AWS Secrets Manager

Secure storage and injection of sensitive production credentials.

---

# DevOps Transformation

## Before Containerization

```text
Developer Machine
│
├── Node.js
├── npm
├── Backend
├── Store
├── Admin
└── Database
```

## After Containerization

```text
Docker Compose
│
├── Backend Container
├── Store Container
├── Admin Container
└── Seed Container
        │
        ▼
   MongoDB Atlas
```

The containerized architecture provides:

- Reproducible environments
- Service isolation
- Consistent deployments
- Easier local setup
- Independent service images
- Clear separation of application and database infrastructure
- A clear path toward cloud deployment

---

# DevOps Responsibilities

The DevOps implementation in this project includes:

- Dockerizing the MERN application
- Creating production-oriented Dockerfiles
- Implementing multi-stage Docker builds
- Containerizing frontend, backend, and admin services
- Creating Docker Compose orchestration
- Configuring container networking
- Integrating MongoDB Atlas
- Automating database initialization
- Managing environment-based configuration
- Preparing the application for CI/CD
- Designing AWS ECR/ECS architecture
- Preparing production secret management
- Documenting the deployment process

---

# Project Goals

The project demonstrates how an existing full-stack application can be transformed into a containerized and deployment-ready application.

The overall workflow is:

```text
Existing MERN Application
          │
          ▼
      Dockerize
          │
          ▼
   Docker Compose
          │
          ▼
   MongoDB Atlas
          │
          ▼
      CI/CD
          │
          ▼
      Amazon ECR
          │
          ▼
      Amazon ECS
```

---

# Project Status

## Completed

- [x] Backend Dockerization
- [x] Store Dockerization
- [x] Admin Dockerization
- [x] Multi-stage Docker builds
- [x] Docker Compose orchestration
- [x] MongoDB Atlas integration
- [x] Automated database seeding
- [x] Docker networking
- [x] Environment configuration
- [x] Local end-to-end testing
- [x] Production-oriented Docker architecture

## Planned

- [ ] GitHub Actions CI/CD
- [ ] Amazon ECR
- [ ] Amazon ECS
- [ ] Application Load Balancer
- [ ] AWS Secrets Manager
- [ ] Production domain
- [ ] Monitoring and observability

---

# Summary

KachaBazar demonstrates a practical DevOps workflow for taking a full-stack MERN application and preparing it for containerized deployment.

The project focuses on:

```text
Containerization
       ↓
Orchestration
       ↓
Configuration
       ↓
Database Integration
       ↓
CI/CD Preparation
       ↓
Cloud Deployment
```

The local Docker Compose environment provides a reproducible way to run the complete application, while the architecture provides a clear path toward production deployment on AWS.
