var expect = require('chai').expect;
var selectel = require('../index');
var fs = require('fs');
var targz = require('tar.gz');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe('Storage', function() {
  it('auth', async () => {
    var response = await selectel.auth('your login', 'your pass');
    expect(response.statusCode).to.equal(204);
  });

  it('info', async () => {
    var response = await selectel.info();
    expect(response.statusCode).to.equal(204);
  });
});

describe('Containers', function() {
  it('fetchContainers', async () => {
    var response = await selectel.fetchContainers('json');
    expect(response.statusCode).to.equal(200);
  });

  it('createContainer', async () => {
    var response = await selectel.createContainer('mocha', 'private');
    expect(response.statusCode).to.equal(201);
  });

  it('infoContainer', async () => {
    var response = await selectel.infoContainer('mocha');
    expect(response.statusCode).to.equal(204);
  });

  it('editContainer', async () => {
    var response = await selectel.editContainer('mocha', 'public');
    expect(response.statusCode).to.equal(202);
  });
});

describe('Files', function() {
  it('fetchFiles', async () => {
    var response = await selectel.fetchFiles('mocha', {
      format: 'json'
    });
    expect(response.statusCode).to.equal(200);
  });

  it('uploadFile', async () => {
    var response = await selectel.uploadFile(__dirname + '/files/file.jpg', '/mocha/file.jpg');
    expect(response.statusCode).to.equal(201);
  });

  it('extractArchive', async () => {
    var read = targz({}, { fromBase: true }).createReadStream(__dirname + '/files');
    var response = await selectel.extractArchive(read, '/mocha', 'tar.gz');
    expect(response.statusCode).to.equal(201);
  }).timeout(10000);

  it('copyFile', async () => {
    var response = await selectel.copyFile('/mocha/file.jpg', '/mocha/file-copy.jpg');
    expect(response.statusCode).to.equal(201);
  });

  it('deleteFile', async () => {
    var response = await selectel.deleteFile('/mocha/file.jpg');
    expect(response.statusCode).to.equal(204);
  });
});

//describe('Containers', function() {
//  it('deleteContainer', async () => {
//    var response = await selectel.deleteContainer('mocha');
//    expect(response.statusCode).to.equal(204);
//  });
//});
