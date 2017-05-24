const expect = require('chai').expect;
const selectel = require('../selectel');
const targz = require('tar.gz');

const containerName = 'mocha';

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
    let response = await selectel.createContainer(containerName, 'private');
    expect(response.statusCode).to.equal(201);
  });

  it('infoContainer', async () => {
    let response = await selectel.infoContainer(containerName);
    expect(response.statusCode).to.equal(204);
  });

  it('editContainer', async () => {
    let response = await selectel.editContainer(containerName, 'public');
    expect(response.statusCode).to.equal(202);
  });

  it('deleteContainer', async () => {
    let response = await selectel.deleteContainer(containerName);
    expect(response.statusCode).to.equal(204);
  });
});

describe('Files', function() {
  before('create a container', async () => {
    await selectel.createContainer(containerName, 'private');
  });

  it('fetchFiles', async () => {
    let response = await selectel.fetchFiles(containerName, {
      format: 'json'
    });
    expect(response.statusCode).to.equal(200);
  });

  it('uploadFile', async () => {
    let response = await selectel.uploadFile(__dirname + '/files/file.jpg', `/${containerName}/file.jpg`);
    expect(response.statusCode).to.equal(201);
  });

  it('extractArchive', async () => {
    let read = targz({}, { fromBase: true }).createReadStream(__dirname + '/files');
    let response = await selectel.extractArchive(read, `/${containerName}`, 'tar.gz');
    expect(response.statusCode).to.equal(201);
  }).timeout(10000);

  it('copyFile', async () => {
    let response = await selectel.copyFile(`/${containerName}/file.jpg`, `/${containerName}/file-copy.jpg`);
    expect(response.statusCode).to.equal(201);
  });

  it('deleteFile', async () => {
    let response = await selectel.deleteFile(`/${containerName}/file.jpg`);
    expect(response.statusCode).to.equal(204);
  });

  after('delete the container', async () => {
    await selectel.deleteFile(`/${containerName}/file-copy.jpg`);
    await selectel.deleteFile(`/${containerName}/DS_Store`);
    await selectel.deleteContainer(containerName);
  });
});
