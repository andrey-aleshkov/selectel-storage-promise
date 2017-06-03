const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const requestPromise = require('./requestPromiseMock');
const credentials = require('./credentials');
const Selectel = require('../selectel');


chai.use(chaiAsPromised);
const expect = chai.expect;

const containerName = 'tests';
const usedContainerName = 'tests-used';

const request = sinon.mock();
const mock = sinon.mock(requestPromise);
const selectel = new Selectel(request, requestPromise);

describe('Get general information about account', function() {
  it('failed without authentication', async () => {
    try {
      await selectel.info();
    } catch (e) {
      expect(e.statusCode).to.equal(403);
    }
  });
});

describe('Get the list of available containers', function() {
  it('failed without authentication', async () => {
    try {
      await selectel.fetchContainers('json');
    } catch (e) {
      expect(e.statusCode).to.equal(403);
    }
  });
});

describe('Create a new container', function() {
  it('failed without authentication', async () => {
    try {
      await selectel.createContainer(containerName, 'private');
    } catch (e) {
      expect(e.statusCode).to.equal(403);
    }
  });
});

describe("Get a container's information", function() {
  it('failed without authentication', async () => {
    try {
      await selectel.infoContainer(containerName);
    } catch (e) {
      expect(e.statusCode).to.equal(403);
    }
  });
});

describe("Change a container's metadata", function() {
  it('failed without authentication', async () => {
    try {
      await selectel.editContainer(containerName, 'public');
    } catch (e) {
      expect(e.statusCode).to.equal(403);
    }
  });
});

describe('Delete the container', function() {
  it('failed without authentication', async () => {
    try {
      await selectel.deleteContainer(containerName);
    } catch (e) {
      expect(e.statusCode).to.equal(403);
    }
  });
});

// ------------------------------------------------------

describe('Get the authentication token', function() {
  it('failed with invalid credentials', async () => {
    // 1) it works
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

  it('successful with valid credentials', async () => {
    let response = await selectel.auth(credentials.valid.login, credentials.valid.pass);
    expect(response.statusCode).to.equal(204);
  });
});

describe('Get general information about account', function() {
  it('successful with valid token', async () => {
    let response = await selectel.info();
    expect(response.statusCode).to.equal(204);
  });
});

//describe('Return the list of available containers', function() {
//  it('in default format', async () => {
//    let response = await selectel.fetchContainers();
//    expect(response.statusCode).to.equal(200);
//  });
//
//  it('in json format', async () => {
//    let response = await selectel.fetchContainers('json');
//    expect(response.statusCode).to.equal(200);
//  });
//
//  it('in xml format', async () => {
//    let response = await selectel.fetchContainers('xml');
//    expect(response.statusCode).to.equal(200);
//  });
//});
//
//describe('Create a new container', function() {
//  it('with name', async () => {
//    let response = await selectel.createContainer(containerName, 'private');
//    expect(response.statusCode).to.equal(201);
//  });
//
//  it('with already used name', async () => {
//    let response = await selectel.createContainer(usedContainerName, 'private');
//    expect(response.statusCode).to.equal(201);
//  });
//
//  it('without name', async () => {
//    let response = await selectel.createContainer();
//    expect(response.statusCode).to.equal(201);
//  });
//
//  it('without type', async () => {
//    let response = await selectel.createContainer(containerName);
//    expect(response.statusCode).to.equal(201);
//  });
//
//  it('as public', async () => {
//    let response = await selectel.createContainer(containerName, 'public');
//    expect(response.statusCode).to.equal(201);
//  });
//
//  it('as private', async () => {
//    let response = await selectel.createContainer(containerName, 'private');
//    expect(response.statusCode).to.equal(201);
//  });
//
//  it('as gallery', async () => {
//    let response = await selectel.createContainer(containerName, 'gallery');
//    expect(response.statusCode).to.equal(201);
//  });
//});
//
//describe('infoContainer', function() {
//  it('infoContainer', async () => {
//    let response = await selectel.infoContainer(containerName);
//    expect(response.statusCode).to.equal(204);
//  });
//});
//
//describe('createContainer', function() {
//  it('editContainer', async () => {
//    let response = await selectel.editContainer(containerName, 'public');
//    expect(response.statusCode).to.equal(202);
//  });
//});
//
//describe('createContainer', function() {
//  it('deleteContainer', async () => {
//    let response = await selectel.deleteContainer(containerName);
//    expect(response.statusCode).to.equal(204);
//  });
//});
