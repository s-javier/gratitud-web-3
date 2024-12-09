FROM node:22.12.0-alpine3.20 AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm i --force

FROM node:22.12.0-alpine3.20 AS production-dependencies-env
COPY ./package.json /app/
WORKDIR /app
RUN npm i --omit=dev --force

FROM node:22.12.0-alpine3.20 AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN npm run build

FROM node:22.12.0-alpine3.20
COPY ./package.json /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
WORKDIR /app
CMD ["npm", "run", "start"]
