FROM node:18

WORKDIR /app

COPY package.json .
COPY .npmrc .

ARG CI_JOB_TOKEN
ARG CI_API_V4_URL
ARG CI_PROJECT_ID
RUN npm config set -- "${CI_API_V4_URL#https?}/projects/${CI_PROJECT_ID}/packages/npm/:_authToken" ${CI_JOB_TOKEN}

RUN npm install

COPY . .

CMD ["npm", "start"]
