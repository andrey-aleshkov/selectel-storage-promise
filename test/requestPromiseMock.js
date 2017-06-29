const credentials = require('./credentials');

const validAuthToken = '123';
const authUrl = 'https://auth.selcdn.ru/';
const storageUrl = 'https://xxx.selcdn.ru/';
const containerName = 'tests';
const usedContainerName = 'tests-used';
const nonexistentContainerName = 'nonexistent';
const nonemptyContainerName = 'nonempty';
const fileName = 'file.jpg';
const copyFileName = 'file-copy.jpg';
const dsStoreFileName = 'DS_Store';

const requestPromise = {
  defaults: function() {
    return function(params) {
      let method = params.method;
      let url = params.url;
      let baseUrl = url.split('?')[0];
      let thisContainerName = baseUrl.split('/').splice(-1, 1)[0];
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
            // Return a container's information
            case storageUrl + containerName:
            case storageUrl + nonexistentContainerName:
              responsePromise = new Promise((resolve, reject) => {
                if (token === validAuthToken) {
                  let statusCode = 204;
                  if (thisContainerName !== containerName && thisContainerName !== usedContainerName) {
                    statusCode = 404;
                  }
                  resolve({
                    headers: {},
                    statusCode: statusCode
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
          switch (baseUrl) {
            // Create a new container
            case storageUrl + containerName:
            case storageUrl + usedContainerName:
              responsePromise = new Promise((resolve, reject) => {
                if (token === validAuthToken) {
                  resolve({
                    headers: {},
                    statusCode: thisContainerName !== usedContainerName ? 201 : 202
                  });
                } else {
                  reject({
                    statusCode: 403
                  });
                }
              });
              break;
            // Upload a file to the container
            case storageUrl + containerName + '/' + fileName:
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
        case 'POST':
          switch (baseUrl) {
            // Change a container's metadata
            case storageUrl + containerName:
            case storageUrl + nonexistentContainerName:
              responsePromise = new Promise((resolve, reject) => {
                if (token === validAuthToken) {
                  let statusCode = 202;
                  if (thisContainerName !== containerName && thisContainerName !== usedContainerName) {
                    statusCode = 404;
                  }
                  resolve({
                    headers: {},
                    statusCode: statusCode
                  });
                } else {
                  reject({
                    statusCode: 403
                  });
                }
              });
              break;
          }
          break;
        case 'COPY':
          switch (baseUrl) {
            // Copy a file to the given folder
            case storageUrl + containerName + '/' + fileName:
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
        case 'DELETE':
          switch (baseUrl) {
            // Delete the container
            case storageUrl + containerName:
            case storageUrl + nonexistentContainerName:
            case storageUrl + nonemptyContainerName:
              responsePromise = new Promise((resolve, reject) => {
                if (token === validAuthToken) {
                  let statusCode;
                  if (thisContainerName === nonemptyContainerName) {
                    statusCode = 409;
                  } else if (thisContainerName === containerName || thisContainerName === usedContainerName) {
                    statusCode = 204;
                  } else {
                    statusCode = 404;
                  }
                  resolve({
                    headers: {},
                    statusCode: statusCode
                  });
                } else {
                  reject({
                    statusCode: 403
                  });
                }
              });
              break;
            // Delete a file
            case storageUrl + containerName + '/' + fileName:
            case storageUrl + containerName + '/' + copyFileName:
            case storageUrl + containerName + '/' + dsStoreFileName:
              responsePromise = new Promise((resolve, reject) => {
                if (token === validAuthToken) {
                  resolve({
                    headers: {},
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
