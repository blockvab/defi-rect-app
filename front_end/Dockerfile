FROM node:16.13.2

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./

RUN yarn install


COPY . ./

CMD ["yarn", "start"]