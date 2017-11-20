const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');


const User = require('../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
  _id: userOneId,
  name: 'liquan1992',
  password: 'psw123456',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }],
  favArtists: [{
    name: 'Taylor Swift',
    url: "https://www.last.fm/music/Taylor+Swift",
    followers: 2036008,
    image: 'https://lastfm-img2.akamaized.net/i/u/300x300/f6f435a67c618221784f5bd27e174372.png',
    mbid: '20244d07-534f-4eff-b4d4-930878889970'
  }, {
    name: 'Lorde',
    image: 'https://lastfm-img2.akamaized.net/i/u/174s/8987fadfc88af0db542ac2f711969c59.png',
    url: 'https://www.last.fm/music/Lorde',
    followers: 1098949,
    mbid: '8e494408-8620-4c6a-82c2-c2ca4a1e4f12'
  }]
}, {
  _id: userTwoId,
  name: '1234ggg',
  password: 'userTwoPass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}];

const createUsers = (done) => {

  User.remove({}).then(() => {
    const userOne = new User(users[0]).save();
    const userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo])
  }).then(() => done());
};

module.exports = {users, createUsers};
