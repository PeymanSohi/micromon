FROM node:18-alpine

WORKDIR /usr/src/app

# Install netcat
RUN apk add --no-cache netcat-openbsd

COPY package.json .
RUN npm install

COPY . .
RUN chmod +x wait-for-it.sh

EXPOSE 3000

CMD ["./wait-for-it.sh", "mysql", "3306", "node", "server.js"]

