var request = require('request');
var requestPromise = require('request-promise-native');
var requestPromiseWithFullResponse = requestPromise.defaults({
  resolveWithFullResponse: true
});
var fs = require('fs');

var Conf = {
  login: null,
  pass: null
};

 var selAuthData = {
  x_expire_auth_token: null,
  x_storage_url: null,
  x_auth_token: null,
  is_authorized: false
 };

//var selAuthData = {
//  x_expire_auth_token: 82470,
//  x_storage_url: 'https://190111.selcdn.ru/',
//  x_auth_token: 'b5c7cd90ae14c4d65fd886a36669b5f2',
//  is_authorized: true
//};

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

require('request-debug')(request);

// exports

exports.setConf = function(login, pass) {
  Conf.login = login;
  Conf.pass = pass;
  return Conf;
};

exports.auth = function() {
  return new Promise((resolve, reject) => {
    requestPromiseWithFullResponse({
      url: 'https://auth.selcdn.ru/',
      headers: {
        'X-Auth-User': Conf.login,
        'X-Auth-Key': Conf.pass
      }
    })
      .then((response) => {
        //if (response.statusCode === 204) {
        //}
        //console.log('selAuth', response);
        selAuthData.x_expire_auth_token = ((parseInt(response.headers['x-expire-auth-token'], 10) * 1000) + Date.now());
        selAuthData.x_storage_url = response.headers['x-storage-url'];
        selAuthData.x_auth_token = response.headers['x-auth-token'];
        selAuthData.is_authorized = true;
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
    url: selAuthData.x_storage_url,
    method: 'HEAD',
    headers: {
      'X-Auth-Token': selAuthData.x_auth_token
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
    url: selAuthData.x_storage_url + urlData,
    method: 'GET',
    headers: {
      'X-Auth-Token': selAuthData.x_auth_token
    }
  });
  // 200 - ОК
};

exports.createContainer = function(containerName, type) {
  console.log(selAuthData.x_storage_url + containerName);
  return requestPromiseWithFullResponse({
    url: selAuthData.x_storage_url + containerName,
    method: 'PUT',
    headers: {
      'X-Auth-Token': selAuthData.x_auth_token,
      'X-Container-Meta-Type': type // public, private, gallery
    }
  });
  // 201 (Created) - при успешном создании
  // 202 (Accepted) - если контейнер уже существует
};

exports.infoContainer = function(containerName) {
  return requestPromiseWithFullResponse({
    url: selAuthData.x_storage_url + containerName,
    method: 'HEAD',
    headers: {
      'X-Auth-Token': selAuthData.x_auth_token
    }
  });
  // 204 - ОК
};

exports.editContainer = function(containerName, type) {
  return requestPromiseWithFullResponse({
    url: selAuthData.x_storage_url + containerName,
    method: 'POST',
    headers: {
      'X-Auth-Token': selAuthData.x_auth_token,
      'X-Container-Meta-Type': type // public, private, gallery
    }
  });
  // 202 (Accepted) - изменение выполнено
  // 404 (Not Found) - указанный контейнер не существует
};

exports.deleteContainer = function(containerName) {
  return requestPromiseWithFullResponse({
    url: selAuthData.x_storage_url + containerName,
    method: 'DELETE',
    headers: {
      'X-Auth-Token': selAuthData.x_auth_token
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
    url: selAuthData.x_storage_url + urlData,
    method: 'GET',
    headers: {
      'X-Auth-Token': selAuthData.x_auth_token
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
          url: selAuthData.x_storage_url + hostingPath,
          method: 'PUT',
          headers: {
            'X-Auth-Token': selAuthData.x_auth_token,
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
    url: selAuthData.x_storage_url + hostingPath + '?extract-archive=' + arhFormat,
    headers: {
      'X-Auth-Token': selAuthData.x_auth_token,
      'Accept': 'application/json'
    }
  };

  return new Promise((resolve, reject) => {
    readStream
      .pipe(request(options, (err, data) => {
        if (err || !data) {
          reject(err);
        } else {
          if (data.statusCode === 200) {
            resolve(data.body);
          } else {
            resolve(data.body);
            // TODO: handle this
            //reject(err);
          }
        }
      }))
      //.on('finish', () => { resolve(true); }) // TODO: think about it
      .on('error', (err) => { reject(err); });
  });
  // 200 - ОК
};

exports.copyFile = function(hostingPath, newPath, additionalHeaders) {
  var req = {
    url: selAuthData.x_storage_url + hostingPath,
    method: 'COPY',
    headers: {
      'X-Auth-Token': selAuthData.x_auth_token,
      'Destination': newPath
    }
  };
  copyHeaders(req, additionalHeaders);

  return requestPromise(req);
  // 201 - ОК
};

exports.deleteFile = function(filePath) {
  return requestPromise({
    url: selAuthData.x_storage_url + filePath,
    method: 'DELETE',
    headers: {'X-Auth-Token': selAuthData.x_auth_token}
  });
  // 204 - ОК
};
