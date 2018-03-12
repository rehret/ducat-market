FROM node:carbon AS ProdDependencies
WORKDIR /src
COPY package.json .
COPY yarn.lock .
RUN yarn install --production

FROM ProdDependencies AS Dependencies
WORKDIR /src
COPY --from=ProdDependencies /src/node_modules ./node_modules
RUN yarn install
COPY . .

FROM Dependencies AS Build
WORKDIR /src
RUN yarn build

FROM Build AS Test
WORKDIR /src
RUN yarn test

FROM node:carbon AS Release
WORKDIR /app
COPY package.json .
COPY openapi.json .
COPY --from=ProdDependencies /src/node_modules ./node_modules
COPY --from=Build /src/dist/ ./dist/
EXPOSE 80
ENTRYPOINT ["yarn", "start"]
