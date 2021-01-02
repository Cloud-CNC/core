#Image
FROM node:alpine3.10

#Create directory
WORKDIR /usr/src/core

#Copy source
COPY . .

#Install Node-Gyp
RUN apk add make gcc g++ python
RUN npm install node-gyp -g

#Install dependencies
RUN npm install

#Expose port 443
EXPOSE 443

#Run server (Without NPM)
ENV NODE_ENV=docker
CMD ["node", "app/app.js"]

#Health check
HEALTHCHECK --interval=30s --timeout=5s CMD [ "node", "app/lib/healthcheck" ]