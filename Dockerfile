FROM node:18

WORKDIR /home/node/
COPY ./api/node/server.js ./
COPY ./api/node/package.json ./
COPY ./api/node/app/ ./app/

WORKDIR /home/node/
RUN npm install

EXPOSE 8080

CMD ["node", "server.js"]