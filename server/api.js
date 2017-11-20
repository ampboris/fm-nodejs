// server/api.js
/*
 |--------------------------------------
 | Dependencies
 |--------------------------------------
 */

const httpUtil = require('./utils/http-util');
const config = require('./config');
const {searchArtist} = require('./controllers/ArtistController');
const _ = require('lodash');
const User = require('./models/user');
const {authMid} = require('./middleware/authentication');
module.exports = function (app, config) {

  // GET API root
  app.get('/api/ping', (req, res) => {
    res.send('API works');
  });

  app.get('/api/artist', (req, res) => {
    // TODO: Add validator middleware
    const artistName = req.query.artist;
    const page = req.query.page || 1;
    searchArtist(artistName, page).then((result) => {
      res.status(200).send(result);
    }).catch((err) => {
      console.error(err);
      res.status(400).send({err: 'Error in /api/artist'});
    });
  });

  /**
   *  User part
   */
  app.post('/api/users', (req, res) => {
    const userParam = _.pick(req.body, ['name', 'password']);
    const user = new User(userParam);
    user.save().then(() => {
      return user.generateAuthToken();
    }).then((token) => {
      res.header('x-auth', token).send(user);
    }).catch((e) => {
      res.status(400).send(e);
    })
  });

  app.post('/api/users/login', (req, res) => {
    const body = _.pick(req.body, ['name', 'password']);

    User.findByCredentials(body.name, body.password).then((user) => {
      return user.generateAuthToken().then((token) => {
        res.header('x-auth', token).send(user);
      });
    }).catch((e) => {
      res.status(401).send();
    });
  });

  app.get('/api/users/favourites', authMid, (req, res) => {
    User.findById(req.user._id).then((user) => {
      const favArtists = user.favArtists;
      res.send(favArtists);
    }).catch(err => res.status(400).send({err}));
  });

  app.put('/api/users/favourites', authMid, (req, res) => {
    const list = req.body;
    if (!list || !list.length) {
      res.status(400).send({err: 'Invalid param'})
    }
    User.findById(req.user._id).then((user) => {
      user.favArtists = list;
      return user.save();
    }).then((newUser) => res.send(newUser.favArtists))
      .catch(err => res.status(400).send({err}));
  });

  // private route for validate token
  app.get('/api/users/me', authMid, (req, res) => {
    res.send(req.user);
  });

  // private route for logout user, delete its access token
  app.delete('/api/users/me/token', authMid, (req, res) => {
    req.user.removeToken(req.token).then(() => {
      res.status(200).send();
    }, () => {
      res.status(400).send();
    });
  });

};
