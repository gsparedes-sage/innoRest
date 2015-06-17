module.exports = {
  port: 8080,
  prefix: 'api',
  secret: 'innoRest',
  mongo: {
    hostName: 'localhost',
    dataset: 'innoRest'
  },
  session: {
    name: 'rest.sid.8080'
  },
}