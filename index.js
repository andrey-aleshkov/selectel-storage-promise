const request = require('request');
const requestPromise = require('request-promise-native');
const Selectel = require('./selectel');

const selectel = new Selectel(request, requestPromise);

module.exports = selectel;
