FROM node:14.17-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

CMD [ "yarn", "dev" ]