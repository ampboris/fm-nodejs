const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const User = require('../models/user');
const {users, createUsers} = require('./seed');

describe('TEST /api/users create user', () => {
  beforeEach(createUsers);
  it('should create a user', (done) => {
    const name = 'example@example.com';
    const password = '123456!';

    request(app).post('/api/users')
      .send({name, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.name).toBe(name);
      }).end((err) => {
      if (err) {
        return done(err);
      }

      User.findOne({name}).then((user) => {
        expect(user).toExist();
        expect(user.password).toNotBe(password);
        done();
      }).catch((e) => done(e));
    });
  });

  it('should return validation errors registration request invalid', (done) => {
    request(app)
      .post('/api/users')
      .send({
        email: 'and',
        password: '123'
      })
      .expect(400)
      .end(done);
  });


  it('should not create user if a name in use already', (done) => {
    request(app)
      .post('/api/users')
      .send({
        email: users[0].email,
        password: 'Password123!'
      })
      .expect(400)
      .end(done);
  });

});

describe('TEST /api/users/login', () => {
  beforeEach(createUsers);

  it('should login user and return auth token', (done) => {
    request(app)
      .post('/api/users/login')
      .send({
        name: users[1].name,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens[1]).toInclude({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((e) => done(e));
      });
  });

  it('should reject a invalid login', (done) => {
    request(app)
      .post('/api/users/login')
      .send({
        email: users[1].email,
        password: users[1].password + '1'
      })
      .expect(401)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(1);
          done();
        }).catch((e) => done(e));
      });

  });
});

describe('TEST /api/users/me/token', () => {
  beforeEach(createUsers);
  it('should remove auth token on logout', (done) => {
    request(app)
      .delete('/api/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not remove invalid auth token', (done) => {
    request(app)
      .delete('/api/users/me/token')
      .set('x-auth', 'some fake things')
      .expect(401)
      .end(done);
  });
});

describe('TEST /api/users/favourites', () => {
  beforeEach(createUsers);
  it('should get user\'s favourite artists', (done) => {
    request(app)
      .get('/api/users/favourites')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        // console.log(res.body)
        expect(res.body.length).toBe(2);
        done();
      });
  });

  it('should update user\'s favourite artists', (done) => {
    // users[0].favArtists.push();
    const newFavArray = [];
    users[0].favArtists.forEach(item => newFavArray.push(item));
    newFavArray.push({
      name: 'Randy Marsh',
      image: 'https://lastfm-img2.akamaized.net/i/u/174s/8987fadfc88af0db542ac2f711969c59.png',
      url: 'https://www.last.fm/music/Lorde',
      followers: 1098949,
      mbid: '8e494408-8620-4c6a-82c2-c2ca4a1e4f12'
    });
    request(app)
      .put('/api/users/favourites')
      .set('x-auth', users[0].tokens[0].token)
      .send(newFavArray).expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.length).toBe(3);
        done();
      });
  });
});
