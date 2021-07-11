FROM node:12.19.0 AS development
WORKDIR /usr/src/app
COPY package.json .
RUN yarn
COPY . .
CMD ["yarn", "dev"]

FROM node:12.19.0 AS production
WORKDIR /usr/src/app
COPY package.json .
RUN yarn --production=true
COPY . .
ENV NODE_ENV=production \
  NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca.crt
CMD ["yarn", "start"]
