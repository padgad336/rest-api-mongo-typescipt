module.exports = {
  app: {
    host: 'localhost',
    port: '4000',
  },
  db: {
    mongodb: {
      uri: "MONGO_URI",
      mongooseOptions: {
        dbName: 'db',
        user: 'user',
        pass: 'pass',
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    },
  },
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
  graphiql: {
    enabled: true,
  },
  jwt: {
    secret: 'defaultsecret',
  },
  mail: {
    link: 'MAIL_LINK',
    user: 'MAIL_USER',
    pass: 'MAIL_PASS',
    port: 'MAIL_PORT',
    secure: 'MAIL_SECURE',
  },
  redis: {
    host: "REDIS_HOST",
    port: "REDIS_PORT",
    user: "REDIS_USERNAME",
    pass: "REDIS_PASSWORD",
  },
  id24: {
    host: "ID24_URL",
    key: "ID24_KEY"
  }
}
