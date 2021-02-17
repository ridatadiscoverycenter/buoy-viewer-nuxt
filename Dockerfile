## Build container
FROM node:14.15.5-buster-slim as builder

WORKDIR /app

COPY package.json ./
COPY .npmrc ./
RUN yarn --frozen-lockfile --non-interactive
COPY . ./

ENV NODE_ENV=production
RUN yarn build

# remove dev dependencies for copy to app
RUN yarn --frozen-lockfile --non-interactive --production


## Production container
FROM node:14.15.5-buster-slim

WORKDIR /app
ENV HOST=0.0.0.0

USER node

COPY --chown=node:node package.json ./
COPY --chown=node:node nuxt.config.js ./

COPY --chown=node:node --from=builder ./app/node_modules ./node_modules/
COPY --chown=node:node --from=builder ./app/.nuxt ./.nuxt/
COPY --chown=node:node --from=builder ./app/static ./static/

EXPOSE 8080
CMD ["yarn", "start", "-p", "8080"]
