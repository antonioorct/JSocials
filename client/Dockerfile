FROM node:15.14-slim

WORKDIR /app
COPY *.json ./

RUN npm i

COPY . .

CMD [ "npm", "start" ]