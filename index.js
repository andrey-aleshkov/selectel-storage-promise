const request = require('request');
const requestPromise = require('request-promise-native');
const Selectel = require('./selectel');

module.exports = new Selectel(request, requestPromise);
