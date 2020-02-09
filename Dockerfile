#Image
FROM node:alpine3.10

#Create directory
WORKDIR /usr/src/core

#Copy dependencies
COPY package*.json ./

#Install Node-Gyp
RUN apk add make gcc g++ python
RUN npm install node-gyp -g

#Install dependencies
RUN npm install

#Create directories
RUN mkdir files

#Bundle source code
COPY . .

#Expose port 443
EXPOSE 443

#Run server
CMD ["npm", "start"]