#Image
FROM node:alpine3.10

#Create directory
WORKDIR /usr/src/core

#Copy dependencies
COPY package*.json ./

#Install MongoDB
RUN apt install -y mongodb

#Create MongoDB data directory
RUN mkdir /data/db -p

#Install dependencies
RUN npm install

#Create directories
RUN mkdir crypto files

#Generate salt
RUN openssl rand -out ./crypto/secret.txt -base64 512

#Bundle source code
COPY . .

#Expose port 443
EXPOSE 443

#Run server
CMD ["node", "app.js"]