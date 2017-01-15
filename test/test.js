var expect = require('chai').expect;
var selectel = require('../index');
var fs = require('fs');

//var mochaAsync = (fn) => {
//  return async (done) => {
//    try {
//      await fn();
//      done();
//    } catch (err) {
//      done(err);
//    }
//  };
//};

selectel.setConf('', '');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

describe('Storage', function() {
  it('auth', async () => {
    var response = await selectel.auth();
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
    var response = await selectel.createContainer('mocha', 'public');
    expect(response.statusCode).to.equal(201);
  });

  it('infoContainer', async () => {
    var response = await selectel.infoContainer('mocha');
    expect(response.statusCode).to.equal(204);
  });
  //it('editContainer', async () => {
  //  var response = await selectel.editContainer('mocha', 'private');
  //  expect(response.statusCode).to.equal(202);
  //});
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
    var read = fs.createReadStream(__dirname + '/files/archive.tar.gz');
    var response = await selectel.extractArchive(read, '/files/archive', 'tar.gz');
    expect(response.statusCode).to.equal(200);
  });
});

//describe('Containers', function() {
//  it('deleteContainer', async () => {
//    var response = await selectel.deleteContainer('mocha');
//    expect(response.statusCode).to.equal(204);
//  });
//});
