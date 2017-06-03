/** @module selectel */
/**
 * @see {@link https://support.selectel.ru/storage/api_info/} Selectel's Documentation.
 */

var fs = require('fs');

var Selectel = function(request, requestPromise) {
  this.request = request;
  this.requestPromiseWithFullResponse = requestPromise.defaults({
    resolveWithFullResponse: true
  });
  this.storageUrl = '';
  this.authToken = '';
  this.expireAuthToken = ''; // TODO: Do I need this?
};

Selectel.prototype.copyHeaders = function(req, headers) {
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
 * @interface
 */

/**
 * Gets the authentication token (key) for accessing storage and sets it internally.
 * @param {string} login - account number
 * @param {string} pass - storage password
 * @returns {Promise}
 */
Selectel.prototype.auth = function(login, pass) {
  return new Promise((resolve, reject) => {
    this.requestPromiseWithFullResponse({
      url: 'https://auth.selcdn.ru/',
      method: 'GET',
      headers: {
        'X-Auth-User': login,
        'X-Auth-Key': pass
      }
    })
      .then((response) => {
        this.expireAuthToken = ((parseInt(response.headers['x-expire-auth-token'], 10) * 1000) + Date.now());
        this.storageUrl = response.headers['x-storage-url'];
        this.authToken = response.headers['x-auth-token'];
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
Selectel.prototype.info = function() {
  return this.requestPromiseWithFullResponse({
    url: this.storageUrl,
    method: 'HEAD',
    headers: {
      'X-Auth-Token': this.authToken
    }
  });
  // 204 - ОК
};

/**
 * Returns the list of available containers.
 * @param {string} format - 'json' or 'xml', 'json' is the default value
 * @param {string} limit - the maximum number of objects on a list (default - 10 000)
 * @param {string} marker - the name of the final container from the previous request
 * @returns {Promise}
 */
Selectel.prototype.fetchContainers = function(format = 'json', limit, marker) {
  // TODO: make default values
  var urlData = '?format=' + format;

  if (limit) {
    urlData += '&limit=' + limit;
  }
  if (marker) {
    urlData += '&marker=' + marker;
  }

  return this.requestPromiseWithFullResponse({
    url: this.storageUrl + urlData,
    method: 'GET',
    headers: {
      'X-Auth-Token': this.authToken
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
Selectel.prototype.createContainer = function(containerName, containerType) {
  return this.requestPromiseWithFullResponse({
    url: this.storageUrl + containerName,
    method: 'PUT',
    headers: {
      'X-Auth-Token': this.authToken,
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
Selectel.prototype.infoContainer = function(containerName) {
  return this.requestPromiseWithFullResponse({
    url: this.storageUrl + containerName,
    method: 'HEAD',
    headers: {
      'X-Auth-Token': this.authToken
    }
  });
  // 204 - ОК
};

/**
 * Changes a container's metadata.
 * @param {string} containerName - name of the container
 * @param {string} containerType - container type: 'public', 'private' or 'gallery'
 * @returns {Promise}
 */
Selectel.prototype.editContainer = function(containerName, containerType) {
  return this.requestPromiseWithFullResponse({
    url: this.storageUrl + containerName,
    method: 'POST',
    headers: {
      'X-Auth-Token': this.authToken,
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
Selectel.prototype.deleteContainer = function(containerName) {
  return this.requestPromiseWithFullResponse({
    url: this.storageUrl + containerName,
    method: 'DELETE',
    headers: {
      'X-Auth-Token': this.authToken
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
Selectel.prototype.fetchFiles = function(containerName, params) {
  var urlData = '?format=' + params.format;

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

  return this.requestPromiseWithFullResponse({
    url: this.storageUrl + containerName + urlData,
    method: 'GET',
    headers: {
      'X-Auth-Token': this.authToken
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
Selectel.prototype.uploadFile = function(fullLocalPath, hostingPath, additionalHeaders) {
  return new Promise((resolve, reject) => {
    fs.readFile(fullLocalPath, (fsErr, data) => {
      var options;

      if (fsErr) {
        reject(fsErr);
      } else {
        options = {
          url: this.storageUrl + hostingPath,
          method: 'PUT',
          headers: {
            'X-Auth-Token': this.authToken,
            'Content-Length': fs.statSync(fullLocalPath).size
          },
          body: data
        };
        this.copyHeaders(options, additionalHeaders);
        this.requestPromiseWithFullResponse(options)
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
Selectel.prototype.extractArchive = function(readStream, hostingPath, arhFormat) {
  var options = {
    method: 'PUT',
    url: this.storageUrl + hostingPath + '?extract-archive=' + arhFormat,
    headers: {
      'X-Auth-Token': this.authToken,
      'Accept': 'application/json'
    }
  };

  return new Promise((resolve, reject) => {
    readStream
      .pipe(this.request(options, (err, response) => {
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
Selectel.prototype.copyFile = function(hostingPath, newPath) {
  return this.requestPromiseWithFullResponse({
    url: this.storageUrl + hostingPath,
    method: 'COPY',
    headers: {
      'X-Auth-Token': this.authToken,
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
Selectel.prototype.deleteFile = function(filePath) {
  return this.requestPromiseWithFullResponse({
    url: this.storageUrl + filePath,
    method: 'DELETE',
    headers: {
      'X-Auth-Token': this.authToken
    }
  });
  // 204 - ОК
};

module.exports = Selectel;
