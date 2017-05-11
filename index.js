var request = require('request');
var requestPromise = require('request-promise-native');
// TODO: rename requestPromiseWithFullResponse to api
var requestPromiseWithFullResponse = requestPromise.defaults({
  resolveWithFullResponse: true
});
var fs = require('fs');

var storageUrl;
var authToken;
var expireAuthToken;

var copyHeaders = function(req, headers) {
  var fieldName;
  for (fieldName in headers) {
    if (fieldName === 'X-Container-Meta-Gallery-Secret') {
      req.headers[fieldName] = require('crypto').createHash('sha1').update(headers[fieldName]).digest('hex');
    } else {
      req.headers[fieldName] = headers[fieldName];
    }
  }
};

// debug
// require('request-debug')(request);

// exports

exports.auth = function(login, pass) {
  return new Promise((resolve, reject) => {
    requestPromiseWithFullResponse({
      url: 'https://auth.selcdn.ru/',
      headers: {
        'X-Auth-User': login,
        'X-Auth-Key': pass
      }
    })
      .then((response) => {
        expireAuthToken = ((parseInt(response.headers['x-expire-auth-token'], 10) * 1000) + Date.now());
        storageUrl = response.headers['x-storage-url'];
        authToken = response.headers['x-auth-token'];
        resolve({
          statusCode: response.statusCode
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
  // 204 - ОК
  // 403 - Forbidden
};

exports.info = function() {
  return requestPromiseWithFullResponse({
    url: storageUrl,
    method: 'HEAD',
    headers: {
      'X-Auth-Token': authToken
    }
  });
  // 204 - ОК
};

exports.fetchContainers = function(format, limit, marker) {
  // TODO: make default values
  var urlData = '?format=' + format;

  if (limit) {
    urlData += '&limit=' + limit;
  }
  if (marker) {
    urlData += '&marker=' + marker;
  }

  return requestPromiseWithFullResponse({
    url: storageUrl + urlData,
    method: 'GET',
    headers: {
      'X-Auth-Token': authToken
    }
  });
  // 200 - ОК
};

exports.createContainer = function(containerName, type) {
  return requestPromiseWithFullResponse({
    url: storageUrl + containerName,
    method: 'PUT',
    headers: {
      'X-Auth-Token': authToken,
      'X-Container-Meta-Type': type // public, private, gallery
    }
  });
  // 201 (Created) - при успешном создании
  // 202 (Accepted) - если контейнер уже существует
};

exports.infoContainer = function(containerName) {
  return requestPromiseWithFullResponse({
    url: storageUrl + containerName,
    method: 'HEAD',
    headers: {
      'X-Auth-Token': authToken
    }
  });
  // 204 - ОК
};

exports.editContainer = function(containerName, type) {
  return requestPromiseWithFullResponse({
    url: storageUrl + containerName,
    method: 'POST',
    headers: {
      'X-Auth-Token': authToken,
      'X-Container-Meta-Type': type // public, private, gallery
    }
  });
  // 202 (Accepted) - изменение выполнено
  // 404 (Not Found) - указанный контейнер не существует
};

exports.deleteContainer = function(containerName) {
  return requestPromiseWithFullResponse({
    url: storageUrl + containerName,
    method: 'DELETE',
    headers: {
      'X-Auth-Token': authToken
    }
  });
  // 204 (No Content) - при успешном удалении
  // 404 (Not Found) - указанный контейнер не существует
  // 409 (Conflict) - ошибка удаления, контейнер не пустой
};

exports.fetchFiles = function(containerName, data) {
  var urlData = containerName + '?format=' + data.format;

  if (data.limit) {
    urlData += '&limit=' + data.limit;
  }
  if (data.marker) {
    urlData += '&marker=' + data.marker;
  }
  if (data.prefix) {
    urlData += '&prefix=' + data.prefix;
  }
  if (data.path) {
    urlData += '&path=' + data.path;
  }
  if (data.delimiter) {
    urlData += '&delimiter=' + data.delimiter;
  }

  return requestPromiseWithFullResponse({
    url: storageUrl + urlData,
    method: 'GET',
    headers: {
      'X-Auth-Token': authToken
    }
  });
  // 200 - ОК
};

exports.uploadFile = function(fullLocalPath, hostingPath, additionalHeaders) {
  return new Promise((resolve, reject) => {
    fs.readFile(fullLocalPath, (fsErr, data) => {
      var options;

      if (fsErr) {
        reject(fsErr);
      } else {
        options = {
          url: storageUrl + hostingPath,
          method: 'PUT',
          headers: {
            'X-Auth-Token': authToken,
            'Content-Length': fs.statSync(fullLocalPath).size
          },
          body: data
        };
        copyHeaders(options, additionalHeaders);
        requestPromiseWithFullResponse(options)
          .then((response) => {
            resolve({
              statusCode: response.statusCode
            });
          })
          .catch((err) => {
            reject(err);
          });
      }
    });
  });
  // 201 - ОК
};

exports.extractArchive = function(readStream, hostingPath, arhFormat) {
  var options = {
    method: 'PUT',
    url: storageUrl + hostingPath + '?extract-archive=' + arhFormat,
    headers: {
      'X-Auth-Token': authToken,
      'Accept': 'application/json'
    }
  };

  return new Promise((resolve, reject) => {
    readStream
      .pipe(request(options, (err, response) => {
        if (err || !response) {
          reject(err);
        } else {
          resolve(response);
        }
      }));
  });
  // 201 - ОК
};

exports.copyFile = function(hostingPath, newPath) {
  return requestPromiseWithFullResponse({
    url: storageUrl + hostingPath,
    method: 'COPY',
    headers: {
      'X-Auth-Token': authToken,
      'Destination': newPath
    }
  });
  // 201 - ОК
};

exports.deleteFile = function(filePath) {
  return requestPromiseWithFullResponse({
    url: storageUrl + filePath,
    method: 'DELETE',
    headers: {
      'X-Auth-Token': authToken
    }
  });
  // 204 - ОК
};
