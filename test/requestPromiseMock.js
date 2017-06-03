const credentials = require('./credentials');

const validAuthToken = '123';

const requestPromise = {
  defaults: function() {
    return function(params) {
      let url = params.url;
      let login = params.headers['X-Auth-User'];
      let pass = params.headers['X-Auth-Key'];
      let responsePromise;

      // console.log('login = ', login);
      // console.log('pass = ', pass);

      switch (url) {
        // authentication
        case 'https://auth.selcdn.ru/':
          responsePromise = new Promise((resolve, reject) => {
            if (login === credentials.valid.login && pass === credentials.valid.pass) {
              resolve({
                headers: {
                  'x-expire-auth-token': 1,
                  'x-storage-url': 'storage-url',
                  'x-auth-token': validAuthToken
                },
                statusCode: 204
              });
            } else {
              reject({
                statusCode: 403
              });
            }
          });
          break;
        // information
        case 'storage-url':
          let token = params.headers['X-Auth-Token'];
          responsePromise = new Promise((resolve, reject) => {
            if (token === validAuthToken) {
              resolve({
                headers: {
                  'X-Account-Bytes-Used': 0,
                  'X-Account-Container-Count': 0,
                  'X-Account-Object-Count': 0,
                  'X-Transfered-Bytes': 0, // TODO: Typo! Should be 'Transferred' ?
                  'X-Received-Bytes': 0
                },
                statusCode: 204
              });
            } else {
              reject({
                statusCode: 403
              });
            }
          });
          break;
        default:
          responsePromise = new Promise((resolve, reject) => {
            reject({
              statusCode: 403
            });
          });
      }

      return responsePromise;
    };
  }
};

module.exports = requestPromise;
