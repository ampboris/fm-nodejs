'use strict';
const request = require('request');
const querystring = require('querystring');
const get = (headers, url, qs) => {
  let options = {};
  options.headers = headers;
  options.method = 'GET';
  options.url = url;
  if (qs) {
    options.url += '?' + querystring.stringify(qs);
  }
  console.log(options.url);
  return new Promise((resolve, reject) => {
    request(options, function (error, response, body) {
      if (error) {
        reject(error);
      } else {
        if (response.statusCode >= 300) {
          reject(new Error({statusCode: response.statusCode}));
        }
        resolve(body);
      }
    });
  });
};

module.exports = {get};
