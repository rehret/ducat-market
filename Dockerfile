FROM node:carbon AS Base
WORKDIR /app
EXPOSE 80

# Install build & test dependencies
FROM Base AS Dependencies
WORKDIR /src
COPY package.json ./
COPY yarn.lock ./
RUN yarn install
COPY . .

# Test application
FROM Dependencies AS Test
WORKDIR /src
RUN yarn test

# Build application
FROM Dependencies AS Build
WORKDIR /src
RUN yarn build

# Start application
FROM Build AS Release
WORKDIR /app
COPY --from=Build /src/package.json .
COPY --from=Build /src/yarn.lock .
RUN yarn install --production=true
COPY --from=Build /src/dist/ ./dist/
ENTRYPOINT ["yarn", "start"]