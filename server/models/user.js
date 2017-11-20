const mongoose = require('mongoose');
const ArtistSchema = require('./artists');
const jwt = require('jsonwebtoken');
const config = require('../config');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {type: String, required: true, trim: true, unique: true},
  password: {type: String, required: true, minlength: 6},
  favArtists: [ArtistSchema],
  tokens: [{ // auth tokens for authenticate user
    access: { // token access level
      type: String,
      required: true
    },
    token: { // token value
      type: String,
      required: true
    }
  }]
});

UserSchema.methods.generateAuthToken = function () {
  const user = this;
  const access = 'auth';
  const token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();
  user.tokens.push({access, token});
  //save the user in db
  return user.save().then(() => {
    // return the token and chain promise if onto this is valid
    return token;
  });
};

// static(model) method
UserSchema.statics.findByToken = function (token) {
  const User = this; //Model method gets called
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    // catch error if token verification fails
    return Promise.reject({e});
  }

  // query
  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

//override its toJSON method
UserSchema.methods.toJSON = function () {
  const user = this;
  //Returns an object with each property name and value corresponding to the entries in this collection.
  const userObject = user.toObject();

  return _.pick(userObject, ['_id', 'name']);
};

// find user by email and password
UserSchema.statics.findByCredentials = function (name, password) {
  const User = this;

  return User.findOne({name}).then((user) => {
    if (!user) {
      return Promise.reject();
    }
    // use bcryptjs to check password matching
    return new Promise((resolve, reject) => {
      // Use bcrypt.compare to compare password and user.password
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

// remove a user's token
UserSchema.methods.removeToken = function (token) {
  const user = this;
  return user.update({
    $pull: {
      tokens: {token}
    }
  });
};

// define a mongoose pre middleware to hash the plain text password
UserSchema.pre('save', function (next) {
  const user = this;
  // we have to structure like this because without the next() inside hash()
  // the lower next() will be execute first and we won't get the hashed password!
  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => { // roung 10
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
