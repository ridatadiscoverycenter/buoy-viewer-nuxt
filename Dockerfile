FROM node:12

ENV APP_DIR /app/
WORKDIR ${APP_DIR}

COPY . ./
RUN yarn install

ENV HOST 0.0.0.0   # Insensitive environment variable

EXPOSE 8080

CMD ["yarn", "prod"]