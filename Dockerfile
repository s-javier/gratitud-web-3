FROM node:20-alpine AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm i

FROM node:20-alpine AS production-dependencies-env
COPY ./package.json /app/
WORKDIR /app
RUN npm i --omit=dev

FROM node:20-alpine AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN npm run build

FROM node:20-alpine
COPY ./package.json /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
WORKDIR /app
CMD ["npm", "run", "start"]
