FROM node:20-alpine AS build

ENV NODE_ENV production

CMD [ "cd", "/FE" ]

COPY package.json .

RUN npm cache clean --force

RUN npm install

# RUN npm install vite --save-dev

COPY . .

RUN npm run build

FROM nginx:1.21.3-alpine

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build /build /usr/share/nginx/html

EXPOSE 5173

CMD [ "nginx", "-g", "daemon off;" ]