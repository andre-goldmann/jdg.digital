#FROM node:latest as node
FROM alpine:3.18 as node
WORKDIR /
COPY . .
RUN npm install -g npm@9.6.7
RUN npm install
RUN npm run build --prod

#stage 2
FROM nginx:alpine
COPY --from=node /dist/app /usr/share/nginx/html
