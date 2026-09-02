FROM node:20-alpine AS build

WORKDIR /app

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/src ./src
COPY frontend/index.html frontend/vite.config.js ./
RUN npm run build

FROM nginx:alpine AS serve

COPY --from=build /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
