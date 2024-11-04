# text file that will define all of the Docker instructions necessary for Docker Engine to build an image of the service

# Stage 0: Install Alpine Linux + Node + dependencies

FROM node:20-alpine3.18@sha256:53108f67824964a573ea435fed258f6cee4d88343e9859a99d356883e71b490c AS dependencies

ENV NODE_ENV=production

# arbitrary metadata about your image
LABEL maintainer="Gazal Garg <ggarg4@myseneca.ca>"
LABEL description="Fragments node.js microservice"

# We default to use port 8080 in our service
ENV PORT=8080

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Use /app as our working directory
WORKDIR /app

# Option 2: relative path - Copy the package.json and package-lock.json
# files into the working dir (/app).  NOTE: this requires that we have
# already set our WORKDIR in a previous step.
COPY package*.json ./

# Install node dependencies defined in package-lock.json
RUN npm install --production

#######################################################################

# Stage 1: Use dependencies to build the app

FROM node:20-alpine3.18@sha256:53108f67824964a573ea435fed258f6cee4d88343e9859a99d356883e71b490c AS build

WORKDIR /app

# Copying node_modules from the dependencies stage with correct ownership
COPY --from=dependencies /app/node_modules /app/node_modules

# We run our service on port 8080
EXPOSE 8080

# Copy src/
COPY ./src ./src

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

USER node

# Run the server
CMD ["npm", "start"]
