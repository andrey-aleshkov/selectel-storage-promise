const chai = require('chai');
const request = process.env.NODE_ENV === 'production' ? require('request') : require('./requestMock');
const requestPromise = process.env.NODE_ENV === 'production' ? require('request-promise-native') : require('./requestPromiseMock');
const targz = require('tar.gz');
const credentials = require('./credentials');
const Selectel = require('../selectel');

const expect = chai.expect;

const containerName = 'tests';
const usedContainerName = process.env.NODE_ENV === 'production' ? 'tests' : 'tests-used';
const nonexistentContainerName = 'nonexistent';
const nonemptyContainerName = 'nonempty';

// const request = sinon.mock();
// const mock = sinon.mock(requestPromise);
const selectel = new Selectel(request, requestPromise);

// ---------------------------------------------------------------------------------------------------------------------

describe('4XX: Failed with invalid credentials', function() {
  it('Get the authentication token', async () => {
    try {
      await selectel.auth(credentials.invalid.login, credentials.invalid.pass);
    } catch (e) {
      expect(e.statusCode).to.equal(403);
    }

    // 2) it works
    // return expect(selectel.auth(credentials.invalid.login, credentials.invalid.pass))
    //   .to.be.rejected
    //   .and
    //   .to.eventually.deep.include({ statusCode: 403 });
  });

  it('Get general information about account', async () => {
    try {
      await selectel.info();
    } catch (e) {
      expect(e.statusCode).to.equal(499);
    }
  });

  it('Get the list of available containers', async () => {
    try {
      await selectel.fetchContainers('json');
    } catch (e) {
      expect(e.statusCode).to.equal(499);
    }
  });

  it('Create a new container', async () => {
    try {
      await selectel.createContainer(containerName, 'private');
    } catch (e) {
      expect(e.statusCode).to.equal(499);
    }
  });

  it("Get a container's information", async () => {
    try {
      await selectel.infoContainer(containerName);
    } catch (e) {
      expect(e.statusCode).to.equal(499);
    }
  });

  it("Change a container's metadata", async () => {
    try {
      await selectel.editContainer(containerName, 'public');
    } catch (e) {
      expect(e.statusCode).to.equal(499);
    }
  });

  it('Delete the container', async () => {
    try {
      await selectel.deleteContainer(containerName);
    } catch (e) {
      expect(e.statusCode).to.equal(499);
    }
  });
});

// ---------------------------------------------------------------------------------------------------------------------

describe('2XX: Successful with valid credentials', function() {
  it('Get the authentication token', async () => {
    try {
      let response = await selectel.auth(credentials.valid.login, credentials.valid.pass);
      expect(response.statusCode).to.equal(204);
    } catch (e) {
      // console.log(e);
    }
  });

  it('Get general information about account', async () => {
    let response = await selectel.info();
    expect(response.statusCode).to.equal(204);
  });

  it('Return the list of available containers in default format', async () => {
    let response = await selectel.fetchContainers();
    expect(response.statusCode).to.equal(200);
  });

  it('Return the list of available containers in json format', async () => {
    let response = await selectel.fetchContainers('json');
    expect(response.statusCode).to.equal(200);
  });

  it('Return the list of available containers in xml format', async () => {
    let response = await selectel.fetchContainers('xml');
    expect(response.statusCode).to.equal(200);
  });

  it('Create a new container with default type', async () => {
    let response = await selectel.createContainer(containerName);
    expect(response.statusCode).to.equal(201);
  });

  //it('Create a new container as public', async () => {
  //  let response = await selectel.createContainer(containerName, 'public');
  //  expect(response.statusCode).to.equal(201);
  //});
  //
  //it('Create a new container as private', async () => {
  //  let response = await selectel.createContainer(containerName, 'private');
  //  expect(response.statusCode).to.equal(201);
  //});
  //
  //it('Create a new container as gallery', async () => {
  //  let response = await selectel.createContainer(containerName, 'gallery');
  //  expect(response.statusCode).to.equal(201);
  //});

  it('Create a new container with already used name', async () => {
    let response = await selectel.createContainer(usedContainerName);
    expect(response.statusCode).to.equal(202);
  });

  //
  // it('Create a new container without name', async () => {
  //   let response = await selectel.createContainer();
  //   expect(response.statusCode).to.equal(201);
  // });

  it("Get a container's information for existed one", async () => {
    let response = await selectel.infoContainer(containerName);
    expect(response.statusCode).to.equal(204);
  });

  it("Change a container's metadata for existed one", async () => {
    let response = await selectel.editContainer(containerName, 'public');
    expect(response.statusCode).to.equal(202);
  });

  it('Delete the container existed one', async () => {
    let response = await selectel.deleteContainer(containerName);
    expect(response.statusCode).to.equal(204);
  });
});

// ---------------------------------------------------------------------------------------------------------------------

describe('4XX: Failed with valid credentials', function() {
  it("Get a nonexistent container's information", async () => {
    try {
      await selectel.infoContainer(nonexistentContainerName);
    } catch (e) {
      expect(e.statusCode).to.equal(404);
    }
  });

  it("Change a nonexistent container's", async () => {
    try {
      selectel.editContainer(nonexistentContainerName, 'public');
    } catch (e) {
      expect(e.statusCode).to.equal(404);
    }
  });

  it('Delete a nonexistent container', async () => {
    try {
      await selectel.deleteContainer(nonexistentContainerName);
    } catch (e) {
      expect(e.statusCode).to.equal(404);
    }
  });

  it('Delete a nonempty container', async () => {
    try {
      await selectel.deleteContainer(nonemptyContainerName);
    } catch (e) {
      expect(e.statusCode).to.equal(404);
    }
  });
});

// ---------------------------------------------------------------------------------------------------------------------

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
    let response = await selectel.uploadFile(__dirname + '/files/file.jpg', `${containerName}/file.jpg`);
    expect(response.statusCode).to.equal(201);
  });

  it('extractArchive', async () => {
    let read = targz({}, { fromBase: true }).createReadStream(__dirname + '/files');
    //let response = {
    //    statusCode: 201
    //};
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
