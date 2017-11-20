const JWT = 'fda123DO@01Dc';
// Production Env:
let configConfigObj = {
  API_BASE_URL: 'http://ws.audioscrobbler.com/2.0/',
  APIKEY: '501503ccca69e5c794665c5c2b440f30',
  MONGO_URI: 'mongodb://fmlast:123456@ds111476.mlab.com:11476/fmlast',
  JWT_SECRET: JWT
};

process.env.JWT_SECRET = JWT;
// running on local for testing make sure mongodb is running
if (process.env.NODE_ENV === 'dev') {
  configConfigObj = {
    API_BASE_URL: 'http://ws.audioscrobbler.com/2.0/',
    APIKEY: '501503ccca69e5c794665c5c2b440f30',
    MONGO_URI: 'mongodb://localhost/music-fm',
    JWT_SECRET: JWT
  };
}

module.exports = configConfigObj;

