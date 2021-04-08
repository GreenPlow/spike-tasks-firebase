FROM node:alpine
WORKDIR /react-client
COPY package.json /react-client
RUN yarn install
COPY . /react-client
CMD ["yarn", "run", "start"]