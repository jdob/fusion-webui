# base image
FROM node:8.11.2

#file change 1
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000
# start app
CMD ["/usr/src/app/run"]