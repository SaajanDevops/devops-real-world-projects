FROM node:20-bookworm-slim AS prod-dependencies

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev



FROM gcr.io/distroless/nodejs20-debian12 AS production

WORKDIR /app

COPY --from=prod-dependencies /app/node_modules ./node_modules

COPY . .

EXPOSE 5055

CMD ["api/index.js"]