FROM node:15.14-slim

WORKDIR /home/node/app
COPY *.json ./

RUN npm ci

CMD [ "npm", "start" ]