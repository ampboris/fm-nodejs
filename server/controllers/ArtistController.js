const httpUtil = require('../utils/http-util');
const config = require('../config');
const _ = require('lodash');
const searchArtist = async (artist, page) => {
  const data = await httpUtil.get({}, config.API_BASE_URL, {
    method: 'artist.search',
    artist: artist,
    api_key: config.APIKEY,
    format: 'json',
    page,
    limit: 10
  });
  let dataObj = JSON.parse(data);
  const artists = remapArtists(dataObj.results.artistmatches.artist);
  return {
    results: artists,
    page: dataObj.results['opensearch:Query'].startPage,
    total: dataObj.results['opensearch:totalResults']
  };
};

const remapArtists = (artists) => {
  for (let artist of artists) {
    const image = findLargeImage(artist.image);
    artist.image = image;
  }
  const resultArray = [];
  artists.forEach((artist) => {
    let item = _.pick(artist, ['name', 'listeners', 'mbid', 'url', 'image']);
    item.followers = item.listeners;
    delete item.listeners;
    resultArray.push(item);
  });
  return resultArray;
};

const findLargeImage = (imgList) => {
  const largeImg = imgList.filter(item => item.size === 'large');
  if (largeImg && largeImg.length) {
    return largeImg[0]['#text'];
  } else {
    return '';
  }
};


module.exports = {searchArtist};
