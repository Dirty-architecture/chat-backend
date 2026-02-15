FROM node:20-alpine AS builder
WORKDIR /usr/src/app

COPY package*.json yarn.lock ./
RUN yarn install

COPY . .

RUN yarn prisma generate
RUN yarn build

CMD ["sh", "-c", "yarn prisma:migrate && node dist/main"]