var request = require('request');
var requestPromise = require('request-promise-native');
var fs = require('fs');

var Conf = {
  login: null,
  pass: null
};

// var selAuthData = {
//  x_expire_auth_token: null,
//  x_storage_url: null,
//  x_auth_token: null,
//  is_authorized: false
// };

var selAuthData = {
  x_expire_auth_token: 82470,
  x_storage_url: 'https://190111.selcdn.ru/',
  x_auth_token: 'b5c7cd90ae14c4d65fd886a36669b5f2',
  is_authorized: true
};

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

exports.selAuth = function(callback) {
  request({
    url: 'https://auth.selcdn.ru/',
    proxy: 'http://localhost:8888',
    headers: {
      'X-Auth-User': Conf.login,
      'X-Auth-Key': Conf.pass
    }
  },
    function(err, data) {
      if (err) {
        callback(true, err);
      } else {
        if (data.statusCode === 204) {
          console.log('selAuth 200 ', data.headers);
          selAuthData.x_expire_auth_token = ((parseInt(data.headers['x-expire-auth-token']) * 1000) + Date.now());
          selAuthData.x_storage_url = data.headers['x-storage-url'];
          selAuthData.x_auth_token = data.headers['x-auth-token'];
          selAuthData.is_authorized = true;
          callback(false, selAuthData);
        } else {
          callback(true, data.body);
        }
      }
    });
};

exports.infoStorage = function() {
  return requestPromise({
    url: selAuthData.x_storage_url,
    method: 'HEAD',
    headers: {
      'X-Auth-Token': selAuthData.x_auth_token
    }
  });
  // 204 - ОК
};

exports.listContainers = function(format, limit, marker) {
  var urlData = '?format=' + format;

  if (limit) {
    urlData += '&limit=' + limit;
  }
  if (marker) {
    urlData += '&marker=' + marker;
  }

  return requestPromise({
    url: selAuthData.x_storage_url + urlData,
    method: 'GET',
    headers: {
      'X-Auth-Token': selAuthData.x_auth_token
    }
  });
  // 200 - ОК
};

exports.createContainer = function(containerName, additionalHeaders) {
  var req = {
    url: selAuthData.x_storage_url + containerName,
    method: 'PUT',
    headers: {
      'X-Auth-Token': selAuthData.x_auth_token
    }
  };
  copyHeaders(req, additionalHeaders);
  return requestPromise(req);

  // 201 (Created) - при успешном создании
  // 202 (Accepted) - если контейнер уже существует
};

exports.infoContainer = function(containerName) {
  return requestPromise({
    url: selAuthData.x_storage_url + containerName,
    method: 'HEAD',
    headers: {
      'X-Auth-Token': selAuthData.x_auth_token
    }
  });

  // 204 - ОК
};

exports.editMeta = function(hostingPath, additionalHeaders) {
  var req = {
    url: selAuthData.x_storage_url + hostingPath,
    method: 'POST',
    headers: {
      'X-Auth-Token': selAuthData.x_auth_token
    }
  };
  copyHeaders(req, additionalHeaders);
  return requestPromise(req);

  // 202 (Accepted) - изменение выполнено
  // 404 (Not Found) - указанный контейнер не существует
};

exports.deleteContainer = function(containerName) {
  return requestPromise({
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

exports.listFiles = function(containerName, data) {
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

  return requestPromise({
    url: selAuthData.x_storage_url + urlData,
    method: 'GET',
    headers: {
      'X-Auth-Token': selAuthData.x_auth_token
    }
  });

  // 200 - ОК
};

exports.uploadFile = function(fullLocalPath, hostingPath, additionalHeaders) {
  var options = {
    url: selAuthData.x_storage_url + hostingPath,
    method: 'PUT',
    headers: {
      'X-Auth-Token': selAuthData.x_auth_token,
      'Content-Length': fs.statSync(fullLocalPath).size
    },
    body: file
  };
  copyHeaders(options, additionalHeaders);

  return Promise.all([
    new Promise((resolve, reject) => {
      fs.readFile(fullLocalPath, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
      });
    }),
    requestPromise(options)
  ]);

  // 201 - ОК
};

exports.uploadArhUnpack = function(fullLocalPath, hostingPath, arhFormat, additionalHeaders) {
  var req = {
    url: selAuthData.x_storage_url + hostingPath + '?extract-archive=' + arhFormat,
    method: 'PUT',
    headers: {
      'X-Auth-Token': selAuthData.x_auth_token
    },
    body: file
  };
  copyHeaders(req, additionalHeaders);

  return Promise.all([
    new Promise((resolve, reject) => {
      fs.readFile(fullLocalPath, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
      });
    }),
    requestPromise(options)
  ]);

  // 200 - ОК
};

exports.uploadArhUnpackStream = function(readStream, hostingPath, arhFormat) {
  // var options = {
  //  method: 'PUT',
  //  url: 'https://190111.selcdn.ru/' + 'files/test' + '?extract-archive=' + 'tar.gz',
  //  //proxy: 'http://localhost:8888',
  //  headers: {
  //    'X-Auth-Token': 'b5c7cd90ae14c4d65fd886a36669b5f2',
  //    'Accept': 'application/json'
  //  }
  // };

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
