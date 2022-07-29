FROM node:alpine

WORKDIR /app

COPY package.json .
COPY .npmrc .

ARG GITLAB_CI
RUN echo $GITLAB_CI
RUN echo ${GITLAB_CI}

RUN npm install --only=prod

COPY . .

CMD ["npm", "start"]
