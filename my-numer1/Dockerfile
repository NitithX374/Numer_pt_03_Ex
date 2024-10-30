FROM node:20-alpine

WORKDIR /app

COPY package*.json ./


RUN npm install

COPY . .
#mynumerapp01
EXPOSE 3000
CMD ["npm","start"]