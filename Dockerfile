FROM node:22-alpine

WORKDIR /app
COPY . .

RUN npm install
RUN npm install -g ts-node
RUN npm run build
ENTRYPOINT ["npm", "start"]