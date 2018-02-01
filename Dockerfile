FROM node:carbon AS Base
WORKDIR /app
EXPOSE 80

FROM Base AS ProdDependencies
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn install --production=true

FROM ProdDependencies AS Dependencies
WORKDIR /src
COPY package.json .
COPY yarn.lock .
COPY --from=ProdDependencies /app/node_modules ./
RUN yarn install
COPY . .

FROM Dependencies AS Test
WORKDIR /src
RUN yarn test

FROM Dependencies AS Build
WORKDIR /src
RUN yarn build

FROM Build AS Release
WORKDIR /app
COPY --from=Build /src/dist/ ./dist/
ENTRYPOINT ["yarn", "start"]