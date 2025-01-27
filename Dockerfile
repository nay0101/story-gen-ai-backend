FROM node:22.13.1-alpine3.20

WORKDIR /api

COPY package.json .

RUN npm install

COPY . .

CMD ["npm", "run" ,"start"]

EXPOSE 8080