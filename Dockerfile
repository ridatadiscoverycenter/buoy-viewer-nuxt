FROM node:12 as builder

WORKDIR /app

COPY package.json ./
COPY .npmrc ./
RUN yarn --frozen-lockfile --non-interactive
COPY . ./

ENV NODE_ENV=production
RUN yarn build

# remove dev dependencies for copy to app
RUN yarn --frozen-lockfile --non-interactive --production

FROM node:12

WORKDIR /app
ENV HOST=0.0.0.0

ADD package.json ./
ADD nuxt.config.js ./

COPY --from=builder ./app/node_modules ./node_modules/
COPY --from=builder ./app/.nuxt ./.nuxt/
COPY --from=builder ./app/static ./static/

EXPOSE 8080
CMD ["yarn", "start", "-p", "8080"]
