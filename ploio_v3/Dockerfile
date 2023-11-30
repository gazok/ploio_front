FROM node:lts-alpine
WORKDIR /app
COPY package.json .
RUN apk update && apk add git
RUN npm install --legacy-peer-deps
COPY . .
EXPOSE 3000
CMD ["npm", "start"]

