FROM node:lts-alpine

# Create app directory
WORKDIR /usr/app

# Install app dependencies
COPY package*.json ./

RUN npm install
# RUN npm i cookie-session
# If you are building your code for production
# RUN npm ci --omit=dev

COPY . .

EXPOSE 5000
CMD [ "npm", "start" ]