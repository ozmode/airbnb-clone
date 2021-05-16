FROM node

WORKDIR /abb

COPY ./package.json .
COPY ./yarn.lock .

COPY ./packages/server/package.json ./packages/server/
COPY ./packages/server/tsconfig.json ./packages/server
COPY ./packages/server/src ./packages/server/src

COPY ./packages/common/package.json ./packages/common/
COPY ./packages/common/tsconfig.json ./packages/common
COPY ./packages/common/src ./packages/common/src

RUN yarn install && yarn build:server

COPY ./packages/server/.env.prod ./packages/server/.env
COPY ./ormconfig.json .

WORKDIR /abb/packages/server

ENV NODE_ENV production

EXPOSE 4000

CMD ["node", "dist/index.js"] 