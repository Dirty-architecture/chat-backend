# ====== Stage 1: Build ======
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm i
RUN npm install @nestjs/cli
COPY . .
RUN npx prisma generate
RUN npm run build

# ====== Stage 2: Run ======
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm i --omit=dev
COPY --from=builder /app/dist ./dist

ENV NODE_ENV="development"

ENV APPLICATION_PORT=4000
ENV APPLICATION_URL="http://localhost:${APPLICATION_PORT}"
ENV ALLOWED_ORIGIN="http://localhost:3000"

ENV COOKIES_SECRET='secret'
ENV SESSION_SECRET='secret'
ENV SESSION_NAME='session'
ENV SESSION_DOMAIN='localhost'
ENV SESSION_MAX_AGE='30d'
ENV SESSION_HTTP_ONLY=true
ENV SESSION_SECURE=false
ENV SESSION_FOLDER='sessions:'

ENV POSTGRES_USER="root"
ENV POSTGRES_PASSWORD="123456"
ENV POSTGRES_HOST="db"
ENV POSTGRES_PORT=5432
ENV POSTGRES_DB="codenames"
ENV POSTGRES_URI="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}"

ENV REDIS_USER="default"
ENV REDIS_PASSWORD="pass123456"
ENV REDIS_HOST="redis"
ENV REDIS_PORT=6379

CMD ["node", "dist/main.js"]