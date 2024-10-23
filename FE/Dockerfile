FROM node:20-alpine AS build

WORKDIR /FE

COPY package.json .

RUN npm cache clean --force

RUN npm install

COPY . .

RUN npm run build

FROM nginx:1.21.3-alpine

ENV NODE_ENV production

COPY nginx.conf /etc/nginx/nginx.conf

# Vite의 경우 빌드의 결과물이 dist에 생성됨
COPY --from=build /FE/dist /usr/share/nginx/html
# COPY --from=build /build /usr/share/nginx/html

EXPOSE 5173

CMD [ "nginx", "-g", "daemon off;" ]