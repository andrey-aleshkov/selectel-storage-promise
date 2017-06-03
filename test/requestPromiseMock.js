const credentials = require('./credentials');

const validAuthToken = '123';
const authUrl = 'https://auth.selcdn.ru/';
const storageUrl = 'https://xxx.selcdn.ru/';
const containerName = 'tests';

const requestPromise = {
  defaults: function() {
    return function(params) {
      let method = params.method;
      let url = params.url;
      let baseUrl = url.split('?')[0];
      let login = params.headers['X-Auth-User'];
      let pass = params.headers['X-Auth-Key'];
      let token = params.headers['X-Auth-Token'];
      let responsePromise;

      // console.log('login = ', login);
      // console.log('pass = ', pass);

      switch (method) {
        case 'HEAD':
          switch (baseUrl) {
            // general information about account
            case storageUrl:
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
          }
          break;
        case 'GET':
          switch (baseUrl) {
            // authentication
            case authUrl:
              responsePromise = new Promise((resolve, reject) => {
                if (login === credentials.valid.login && pass === credentials.valid.pass) {
                  resolve({
                    headers: {
                      'x-expire-auth-token': 1,
                      'x-storage-url': storageUrl,
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
            // Return the list of available containers
            case storageUrl:
              responsePromise = new Promise((resolve, reject) => {
                if (token === validAuthToken) {
                  resolve({
                    headers: {},
                    statusCode: 200
                  });
                } else {
                  reject({
                    statusCode: 403
                  });
                }
              });
              break;
            // Return a list of files stored in the container
            case storageUrl + containerName: // url.match(/test/)
              responsePromise = new Promise((resolve, reject) => {
                if (token === validAuthToken) {
                  resolve({
                    headers: {},
                    statusCode: 200
                  });
                } else {
                  reject({
                    statusCode: 403
                  });
                }
              });
              break;
            default:
          }
          break;
        case 'PUT':
          break;
        case 'POST':
          break;
        case 'COPY':
          break;
        case 'DELETE':
          break;
        default:
      }

      // switch (url) {
      //   default:
      //     responsePromise = new Promise((resolve, reject) => {
      //       reject({
      //         statusCode: 404
      //       });
      //     });
      // }

      return responsePromise;
    };
  }
};

module.exports = requestPromise;
