FROM node:22-alpine AS build

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./frontend/
COPY qris-dinamis/package.json ./qris-dinamis/
RUN cd frontend && npm ci

COPY frontend ./frontend
COPY qris-dinamis ./qris-dinamis

RUN cd frontend && npm run build

FROM nginx:alpine

COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/frontend/dist /usr/share/nginx/html

EXPOSE 80