var request = require('request');
var requestPromise = require('request-promise-native');
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

/**
 * Gets the authentication token (key) for accessing storage and sets it internally.
 * @param {string} login - account number
 * @param {string} pass - storage password
 * @returns {Promise}
 */
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

/**
 * Returns general information about account: total number of containers, total number of objects,
 * total volume of data stored, total volume of data downloaded.
 * @returns {Promise}
 */
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

/**
 * Returns the list of available containers.
 * @param {string} format - 'json' or 'xml'
 * @param {string} limit - the maximum number of objects on a list (default - 10 000)
 * @param {string} marker - the name of the final container from the previous request
 * @returns {Promise}
 */
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

/**
 * Creates a new container.
 * @param {string} containerName - name of the container
 * @param {string} containerType - container type: 'public', 'private' or 'gallery'
 * @returns {Promise}
 */
exports.createContainer = function(containerName, containerType) {
  return requestPromiseWithFullResponse({
    url: storageUrl + containerName,
    method: 'PUT',
    headers: {
      'X-Auth-Token': authToken,
      'X-Container-Meta-Type': containerType // public, private, gallery
    }
  });
  // 201 (Created) - при успешном создании
  // 202 (Accepted) - если контейнер уже существует
};

/**
 * Returns a container's information.
 * @param {string} containerName - name of the container
 * @returns {Promise}
 */
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

/**
 * Changes a container’s metadata.
 * @param {string} containerName - name of the container
 * @param {string} containerType - container type: 'public', 'private' or 'gallery'
 * @returns {Promise}
 */
exports.editContainer = function(containerName, containerType) {
  return requestPromiseWithFullResponse({
    url: storageUrl + containerName,
    method: 'POST',
    headers: {
      'X-Auth-Token': authToken,
      'X-Container-Meta-Type': containerType // public, private, gallery
    }
  });
  // 202 (Accepted) - изменение выполнено
  // 404 (Not Found) - указанный контейнер не существует
};

/**
 * Deletes the container.
 * @param {string} containerName - name of the container
 * @returns {Promise}
 */
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

/**
 * Returns a list of files stored in the container.
 * @param {string} containerName - name of the container
 * @param {Object} params - parameters.
 * @param {string} params.format - the format results are returned in (json or xml)
 * @param {string} params.limit - the maximum number of objects on a list (default - 10 000)
 * @param {string} params.marker - objects whose value exceeds the given marker (useful for page navigation and for large numbers of files)
 * @param {string} params.prefix - prints objects whose names start with the given prefix in line format
 * @param {string} params.path - returns objects in the given folder (virtual folder)
 * @param {string} params.delimiter - returns objects up to the given delimiter in the filename
 * @returns {Promise}
 */
exports.fetchFiles = function(containerName, params) {
  var urlData = containerName + '?format=' + params.format;

  if (params.limit) {
    urlData += '&limit=' + params.limit;
  }
  if (params.marker) {
    urlData += '&marker=' + params.marker;
  }
  if (params.prefix) {
    urlData += '&prefix=' + params.prefix;
  }
  if (params.path) {
    urlData += '&path=' + params.path;
  }
  if (params.delimiter) {
    urlData += '&delimiter=' + params.delimiter;
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

/**
 * Uploads a file to the container.
 * @param {string} fullLocalPath - full local path to the file
 * @param {string} hostingPath - /{container}/{file}
 * @param {Object} additionalHeaders - { X-Delete-At: ..., X-Delete-After: ..., Etag: ..., X-Object-Meta: ... }
 * @returns {Promise}
 */
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

/**
 * Extracts the archive.
 * @param {pipe} readStream - read stream
 * @param {string} hostingPath - /{container}/{file}
 * @param {string} arhFormat - The archive type: 'tar', 'tar.gz' or 'tar.bz2'
 * @returns {Promise}
 */
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

/**
 * Copies a file to the given folder.
 * @param {string} hostingPath - /{container}/{file}
 * @param {string} newPath - /{container}/{new-file}
 * @returns {Promise}
 */
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

/**
 * Deletes the given file.
 * @param {string} filePath - /{container}/{file}
 * @returns {Promise}
 */
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
