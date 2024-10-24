ARG NODE_VERSION=22.9.0

# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-slim AS base

# set for base and all layer that inherit from it
#ENV NODE_ENV production

# Create a stage for building the application.
FROM base AS deps

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --include=dev

# Setup production node_modules
FROM base AS production-deps

WORKDIR /usr/src/app

COPY --from=deps /usr/src/app/node_modules /usr/src/app/node_modules
COPY package*.json ./

RUN npm prune --omit=dev

# Build the app
FROM base AS build

WORKDIR /usr/src/app

COPY --from=deps /usr/src/app/node_modules /usr/src/app/node_modules
ADD . .
RUN npm run build

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
# where the necessary files are copied from the build stage.
FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV="production"

WORKDIR /usr/src/app

COPY --chown=node:node --from=production-deps /usr/src/app/node_modules /usr/src/app/node_modules
COPY --chown=node:node --from=build /usr/src/app/build /usr/src/app/build
COPY --chown=node:node --from=build /usr/src/app/public /usr/src/app/public
COPY --chown=node:node --from=build /usr/src/app/package.json /usr/src/app/package.json
COPY --chown=node:node --from=build /usr/src/app/.env /usr/src/app/.env

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application as a non-root user.
RUN chown -R node:node /usr/src/app
#USER node

# Run the application.
CMD ["npm","start"]
