const credentials = require('./credentials');

const validAuthToken = '123';
const authUrl = 'https://auth.selcdn.ru/';
const storageUrl = 'https://xxx.selcdn.ru/';
const containerName = 'tests';
const usedContainerName = 'tests-used';
const nonexistentContainerName = 'nonexistent';
const nonemptyContainerName = 'nonempty';
const fileName = 'file.jpg';

const request = function(params) {
  let method = params.method;
  let url = params.url;
  let baseUrl = url.split('?')[0];
  let thisContainerName = baseUrl.split('/').splice(-1, 1)[0];
  let login = params.headers['X-Auth-User'];
  let pass = params.headers['X-Auth-Key'];
  let token = params.headers['X-Auth-Token'];
  let responsePromise;

  switch (method) {
    case 'PUT':
      switch (baseUrl) {
        // Extract an archive
        case storageUrl + containerName + '?extract-archive=tar.gz':
          console.log(storageUrl + containerName + '?extract-archive=tar.gz');
          responsePromise = new Promise((resolve, reject) => {
            if (token === validAuthToken) {
              resolve({
                headers: {},
                statusCode: 201
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
    default:
  }

  return responsePromise;
};

module.exports = request;
