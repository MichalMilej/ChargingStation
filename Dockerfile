FROM node:20

WORKDIR /charging-station-app

COPY . .

RUN npm install
RUN npm run build

EXPOSE ${APP_PORT}

CMD [ "npm", "run", "start:migrate:dev"]