FROM node:18.2.0-alpine3.14
WORKDIR /src

RUN sh -c "yarn install"