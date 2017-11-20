const assert = require('assert');
const User = require('../models/user');
const mongoose = require('mongoose');
const config = require('../config');
const {users, createUsers} = require('./seed');
mongoose.Promise = global.Promise;

before((done) => {
  mongoose.connect(config.MONGO_URI, {useMongoClient: true});
  mongoose.connection
    .once('open', () => {
      console.log('MongoDB Connected');
      done();
    })
    .on('error', (error) => {
      console.warn('Warning, DB CONNECTION FAILURE', error);
    });
});

// drop all collections for each test suite
beforeEach(createUsers);

describe('Test Creating MongoDB Records', () => {
  it('should save a user', (done) => {
    const user = new User({
      name: 'li',
      password: '123456',
      favArtists: [{
        name: 'Taylor Swift',
        url: "https://www.last.fm/music/Taylor+Swift",
        followers: 2036008,
        image: 'https://lastfm-img2.akamaized.net/i/u/300x300/f6f435a67c618221784f5bd27e174372.png',
        mbid: '20244d07-534f-4eff-b4d4-930878889970'
      }]
    });
    user.save().then(() => {
      assert(!user.isNew);
      done();
    });
  });

  it('should add a new artist to the existing user', (done) => {
    const user = new User({
      name: 'Jimmy',
      password: 'password'
    });
    user.save().then(() =>
      User.findOne({name: 'Jimmy'})
    ).then((user) => {
      user.favArtists.push({
        name: 'Lorde',
        image: 'https://lastfm-img2.akamaized.net/i/u/174s/8987fadfc88af0db542ac2f711969c59.png',
        url: 'https://www.last.fm/music/Lorde',
        followers: 1098949,
        mbid: '8e494408-8620-4c6a-82c2-c2ca4a1e4f12'
      });
      return user.save();
    }).then(() =>
      User.findOne({name: 'Jimmy'})
    ).then((user) => {
      assert(user.favArtists.length === 1);
      assert(user.favArtists[0].name = 'Lorde');
      done();
    });
  });

  it('should be able to list favourite artists', (done) => {
    User.findById(users[0]._id).then((user) => {
      assert(user.favArtists.length === 2);
      done();
    });
  });

  it('should be able to add new one in favourite artists', (done) => {
    User.findById(users[0]._id)
      .then((user) => {
        user.favArtists.push({
          name: 'Randy Marsh',
          image: 'https://lastfm-img2.akamaized.net/i/u/174s/8987fadfc88af0db542ac2f711969c59.png',
          url: 'https://www.last.fm/music/Lorde',
          followers: 1098949,
          mbid: '8e494408-8620-4c6a-82c2-c2ca4a1e4f12'
        });
        return user.save();
      })
      .then((user) => {
        assert(user.favArtists.length === 3);
        assert(user.favArtists[2].name === 'Randy Marsh');
        done();
      });
  });

});
