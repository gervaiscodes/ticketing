FROM node:18

WORKDIR /app

COPY package.json .
COPY .npmrc .

ARG GITLAB_TOKEN
RUN npm config set -- '//1337148.com/api/v4/projects/20/packages/npm/:_authToken' ${GITLAB_TOKEN}

RUN npm install

COPY . .

CMD ["npm", "start"]
