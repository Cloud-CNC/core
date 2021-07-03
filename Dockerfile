# Build container
FROM node:current-alpine as build

# Working directory
WORKDIR /src

# Copy source code
COPY . .

# Install development dependencies
ENV NODE_ENV=development
RUN npm install

# Build
RUN npm run build

# Server container
FROM node:current-alpine

# Create a system user
RUN addgroup -S nodejs && adduser -S cloud-cnc -G nodejs

# Working directory
WORKDIR /app
RUN chown cloud-cnc:nodejs /app

# Copy build
COPY --chown=cloud-cnc:nodejs --from=build /src/dist dist

# Copy package info
COPY package.json package.json
COPY npm-shrinkwrap.json npm-shrinkwrap.json

# Install production dependencies
ENV NODE_ENV=production
RUN npm install

# Switch to the cloud-cnc user
USER cloud-cnc

# Run in production by default
ARG DOCKER_ENV=production
ENV NODE_ENV=$DOCKER_ENV

# Start NodeJS
CMD ["node", "dist/index.js"]