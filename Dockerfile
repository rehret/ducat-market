FROM node:carbon

WORKDIR /usr/src/app

# Install dependencies
COPY package.json ./
COPY yarn.lock ./
RUN yarn install

# Copy application source
COPY . .

# Test application
RUN yarn test

# Build application
ENV NODE_ENV=production
RUN yarn build

# Start application
EXPOSE 8000
CMD ["yarn", "start"]