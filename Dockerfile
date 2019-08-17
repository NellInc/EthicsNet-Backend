FROM node:10

WORKDIR /app

COPY package.json package.json

RUN npm install

COPY . .

EXPOSE 3000

RUN npm install nodemon -g

CMD [ "npm", "start" ]
