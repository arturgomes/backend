FROM node:10-alpine

WORKDIR /usr/app

COPY package.json yarn.lock ./
RUN apk --no-cache add --virtual builds-deps build-base python

RUN yarn

COPY . ./

RUN yarn build

EXPOSE 3000

CMD ["yarn","start"]
