FROM node:20-bookworm-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_APP_API_BASE_URL
ARG VITE_APP_ENCRYPT_PASSWORD

ENV VITE_APP_API_BASE_URL=$VITE_APP_API_BASE_URL
ENV VITE_APP_ENCRYPT_PASSWORD=$VITE_APP_ENCRYPT_PASSWORD

RUN npm run build


FROM nginx:1.27.0-alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# FROM node:20-bookworm-slim AS builder

# WORKDIR /app

# COPY package*.json ./

# RUN npm ci

# COPY . .

# RUN npm run build


# FROM nginx:1.27.0-alpine AS production

# COPY --from=builder /app/dist /usr/share/nginx/html

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]