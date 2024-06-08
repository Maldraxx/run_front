FROM node:lts-alpine as build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:lts-alpine as production-stage

WORKDIR /app

COPY --from=build-stage /app/dist ./dist
COPY --from=build-stage /app/server.js ./server.js
COPY package*.json ./

RUN npm ci --only=production


EXPOSE 8080

CMD ["npm", "start"]