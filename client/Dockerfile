FROM node:12.19.0 AS development
WORKDIR /usr/src/app
COPY package.json .
RUN yarn
COPY . .
RUN yarn build
CMD ["yarn", "start"]

FROM nginx AS production
COPY --from=development /usr/src/app/build/ /usr/share/nginx/html
COPY --from=development /usr/src/app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
