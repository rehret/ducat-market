FROM node:carbon

WORKDIR /usr/src/app

# Install dependencies
COPY package.json ./
COPY yarn.lock ./
RUN yarn install

# Copy application source
COPY ./src/ ./src/
COPY ./types/ ./types/
COPY ./tsconfig.json .
COPY ./tslint.json .

# Copy the item cache (if it exists)
COPY ./item-cache.json .

# Build application
ENV NODE_ENV=production
RUN yarn build

# Start application
EXPOSE 8000
CMD ["yarn", "start"]