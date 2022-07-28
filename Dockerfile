FROM node:alpine

WORKDIR /app

COPY package.json .

RUN npm config set @ticketing:registry https://1337148.com/api/v4/projects/10/packages/npm/
RUN npm config set -- '//1337148.com/api/v4/projects/10/packages/npm/:_authToken' "LciQrsnY_hc_Xc_5J7aP"

RUN npm install --only=prod

COPY . .

CMD ["npm", "start"]
