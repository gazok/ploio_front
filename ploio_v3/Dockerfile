FROM node:lts-alpine
WORKDIR /app
COPY package.json .
RUN apk update && apk add --no-cache python3 make g++ git pkgconfig pixman-dev cairo-dev pango-dev jpeg-dev giflib-dev
RUN npm install --legacy-peer-deps
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
