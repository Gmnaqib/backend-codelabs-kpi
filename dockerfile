FROM node:22-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i
COPY . .

Run npm install
run npm run build

EXPOSE 3000
CMD [ "npm", "start" ]
