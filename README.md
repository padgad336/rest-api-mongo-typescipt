# Notification Service
  <h2>NodeJS Typescript PM2</h2>

 ## Installation

Use the package manager [yarn](https://yarnpkg.com/getting-started/install) to install package

```bash
   yarn
```
## Usage
 #### dev
```bash
# start develop
  yarn develop
```
 #### production
```bash
# start production
  docker-compose up -d --build
```
## Config
  #### .env
  ```bash
//config port api 
PORT=8940
//config link url mongoDB
MONGO_URI=mongodb+srv://padgad:padgad@cluster0.ichknrx.mongodb.net/?retryWrites=true&w=majority
//config redis HOST & PORT
REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=localsecret
  ```
## build
  ```bash
  //build image
  docker-compose  --build

  //save image docker to tar
  docker save -o d_notice_api.tar d_notice_api
  //load
  docker load --input d_notice_api.tar     

  //run
  docker run --restart always -p 8070:8070 --env-file .env.prod --name back_api d_notice_api

  ```