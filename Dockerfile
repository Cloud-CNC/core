#Image
FROM node:alpine3.10

#Create directory
WORKDIR /usr/src/core

#Copy dependencies
COPY package*.json ./

#Install dependencies
RUN npm install

#Create directories
RUN mkdir files

#Bundle source code
COPY . .

#Expose port 443
EXPOSE 443

#Run server
CMD ["node", "app.js"]