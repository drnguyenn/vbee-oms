FROM node:12.19.0 AS development
WORKDIR /usr/src/app
COPY package.json .
RUN yarn
COPY . .
CMD ["yarn", "dev"]

FROM node:12.19.0 AS production
WORKDIR /usr/src/app
COPY package.json .
RUN yarn install --production=true
COPY . .
CMD ["yarn", "start"]
