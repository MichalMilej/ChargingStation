FROM node:20

WORKDIR /charging-station-app

COPY . .

RUN npm install
RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start:migrate:dev"]