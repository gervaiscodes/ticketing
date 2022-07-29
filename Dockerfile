FROM node:alpine

WORKDIR /app

COPY package.json .
COPY .npmrc .

ARG GITLAB_TOKEN

RUN npm config set -- '//1337148.com/api/v4/projects/14/packages/npm/:_authToken' ${GITLAB_TOKEN}

RUN npm install --only=prod

COPY . .

CMD ["npm", "start"]
