# VProfile — Containerized with Docker & Docker Compose

Containerizes the VProfile multi-tier Java app (previously deployed on
EC2/Beanstalk in earlier projects) into 5 Docker containers, orchestrated
with a single `compose.yaml`, images pushed to Docker Hub.

Custom Docker images were built and published to Docker Hub under the `saajandevops` namespace.

## Architecture

```text
Browser
   |
   v
NGINX (vproweb:80)
   |
   v
Tomcat (vproapp:8080)
   |
   +----> MySQL (vprodb:3306)
   |
   +----> Memcached (vprocache01:11211)
   |
   +----> RabbitMQ (vpromq01:5672)
```

## Stack

Docker, Docker Compose, Docker Hub, Maven (multi-stage build), Tomcat 10 / JDK 21, MySQL 8.0, NGINX, Memcached, RabbitMQ

## Published Docker Images

The Docker images for this project were built and published to Docker Hub:

| Service     | Docker Image               |
| ----------- | -------------------------- |
| Application | `saajandevops/vprofileapp` |
| Database    | `saajandevops/vprofiledb`  |
| Web / NGINX | `saajandevops/vprofileweb` |
| Memcached   | `saajandevops/memcached`   |
| RabbitMQ    | `saajandevops/rabbitmq`    |

Pull the published images with:

```bash
docker pull saajandevops/vprofileapp
docker pull saajandevops/vprofiledb
docker pull saajandevops/vprofileweb
docker pull saajandevops/memcached
docker pull saajandevops/rabbitmq
```

## Structure

- `compose.yaml` — defines and links all 5 services
- `Docker-files/app/Dockerfile` — multi-stage: Maven builds the `.war` from source, then copies it into a clean Tomcat image (keeps the final image free of build tools)
- `Docker-files/db/Dockerfile` — MySQL image pre-loaded with schema (`db_backup.sql` auto-runs via MySQL's `docker-entrypoint-initdb.d` convention)
- `Docker-files/web/Dockerfile` — NGINX reverse proxy, config swapped for one that forwards to the `vproapp` container by name
- `vprocache01` (Memcached) and `vpromq01` (RabbitMQ) — official images used as-is, no customization needed

## How to Run

```bash
docker compose up --build -d
docker compose ps
```

Visit `http://localhost` — login admin_vp and password admin_vp Check RabbitMQ
and Memcached via the app's own test pages (linked from the homepage).

```bash
docker compose down -v
```

## Screenshots

### Docker Compose Services

![Docker Compose Services](screenshots/01-docker-compose-ps.png)

### Vprofile Login Page

![Vprofile Login Page](screenshots/02-app-login-page.png)

### Logged in Homepage

![Logged in Homepage](screenshots/03-logged-in-homepage.png)

### RabbiqMQ

![RabbiqMQ](screenshots/04-rabbitmq-verified.png)

### Memcache

![Memcache](screenshots/05-memcache-verified.png)
