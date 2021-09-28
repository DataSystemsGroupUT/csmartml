FROM node:12.16.3 as build-deps
WORKDIR /interface/src/app
COPY /interface/package.json /interface/yarn.lock ./
RUN yarn
COPY . ./
RUN yarn build

FROM nginx:1.12-alpine
COPY --from=build-deps /interface/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

FROM redis
EXPOSE 6379
CMD [ "redis-server"]


FROM python:3

WORKDIR /server/main

COPY /server/dependencies.txt ./
RUN pip install --no-cache-dir -r dependencies.txt

COPY . .

CMD [ "python", "./server/main/sse.py" ]