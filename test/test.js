const expect = require('chai').expect;
const selectel = require('../index');
const fs = require('fs');
const targz = require('tar.gz');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe('Storage', function() {
  it('auth', async () => {
    let response = await selectel.auth(process.env.SELECTEL_LOGIN, process.env.SELECTEL_PASS);
    expect(response.statusCode).to.equal(204);
  });

  it('info', async () => {
    let response = await selectel.info();
    expect(response.statusCode).to.equal(204);
  });
});

describe('Containers', function() {
  it('fetchContainers', async () => {
    let response = await selectel.fetchContainers('json');
    expect(response.statusCode).to.equal(200);
  });

  it('createContainer', async () => {
    let response = await selectel.createContainer('mocha', 'private');
    expect(response.statusCode).to.equal(201);
  });

  it('infoContainer', async () => {
    let response = await selectel.infoContainer('mocha');
    expect(response.statusCode).to.equal(204);
  });

  it('editContainer', async () => {
    let response = await selectel.editContainer('mocha', 'public');
    expect(response.statusCode).to.equal(202);
  });
});

describe('Files', function() {
  it('fetchFiles', async () => {
    let response = await selectel.fetchFiles('mocha', {
      format: 'json'
    });
    expect(response.statusCode).to.equal(200);
  });

  it('uploadFile', async () => {
    let response = await selectel.uploadFile(__dirname + '/files/file.jpg', '/mocha/file.jpg');
    expect(response.statusCode).to.equal(201);
  });

  it('extractArchive', async () => {
    let read = targz({}, { fromBase: true }).createReadStream(__dirname + '/files');
    let response = await selectel.extractArchive(read, '/mocha', 'tar.gz');
    expect(response.statusCode).to.equal(201);
  }).timeout(10000);

  it('copyFile', async () => {
    let response = await selectel.copyFile('/mocha/file.jpg', '/mocha/file-copy.jpg');
    expect(response.statusCode).to.equal(201);
  });

  it('deleteFile', async () => {
    let response = await selectel.deleteFile('/mocha/file.jpg');
    expect(response.statusCode).to.equal(204);
  });
});

//describe('Containers', function() {
//  it('deleteContainer', async () => {
//    let response = await selectel.deleteContainer('mocha');
//    expect(response.statusCode).to.equal(204);
//  });
//});
