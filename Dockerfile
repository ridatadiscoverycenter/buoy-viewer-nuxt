FROM node:12

ENV APP_DIR /app/
WORKDIR ${APP_DIR}

COPY . ./
RUN yarn install

ENV HOST 0.0.0.0   # Insensitive environment variable

EXPOSE 3000

CMD ["yarn", "prod"]