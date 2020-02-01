FROM node:10-alpine

WORKDIR /usr/app
COPY package.json yarn.lock ./
RUN apk add g++ make python

RUN yarn

COPY . . 

EXPOSE 8080

CMD ["yarn","start"]