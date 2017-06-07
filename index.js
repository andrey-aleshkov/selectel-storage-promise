const request = require('request');
const requestPromise = require('request-promise-native');
const Selectel = require('./selectel');
// debug
// require('request-debug')(request);

const selectel = new Selectel(request, requestPromise);

module.exports = selectel;
