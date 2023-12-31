FROM node:18 as node
WORKDIR /app
COPY . .
RUN ls -l
RUN npm install -g npm@10.2.1
RUN npm install
RUN npm run build --omit=dev

#stage 2
FROM nginx:alpine
COPY --from=node /app/dist/app /usr/share/nginx/html
