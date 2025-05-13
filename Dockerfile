FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM httpd:alpine

RUN rm -rf /usr/local/apache2/htdocs/*

COPY --from=builder /app/dist/ /usr/local/apache2/htdocs/

EXPOSE 80
