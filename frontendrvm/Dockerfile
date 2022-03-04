FROM node:16-alpine3.14

WORKDIR /var/www
COPY package*.json ./
COPY . .
EXPOSE 3000

CMD [ "npm", "start" ]