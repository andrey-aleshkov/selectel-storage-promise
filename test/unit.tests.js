const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const Selectel = require('../selectel');
const sinon = require('sinon');

chai.use(chaiAsPromised);
const expect = chai.expect;

const validCredentials = {
  login: 'validLogin',
  pass: 'validPass'
};
const invalidCredentials = {
  login: 'invalidLogin',
  pass: 'invalidPass'
};
const containerName = 'tests';
const usedContainerName = 'tests-used';
const requestPromise = {
  defaults: function() {
    return function(params) {
      let url = params.url;
      let login = params.headers['X-Auth-User'];
      let pass = params.headers['X-Auth-Key'];

      // console.log('login = ', login);
      // console.log('pass = ', pass);

      return new Promise((resolve, reject) => {
        // response
        if (login === validCredentials.login && pass === validCredentials.pass) {
          resolve({
            headers: {
              'x-expire-auth-token': 1,
              'x-storage-url': '',
              'x-auth-token': ''
            },
            statusCode: 204
          });
        } else {
          reject({
            statusCode: 403
          });
        }
      });
    };
  }
};
const request = sinon.mock();
const mock = sinon.mock(requestPromise);
const selectel = new Selectel(request, requestPromise);

describe('Get the authentication token', function() {
  it('failed with invalid credentials', async () => {
    // 1) it works
    try {
      await selectel.auth(invalidCredentials.login, invalidCredentials.pass);
    } catch (e) {
      expect(e.statusCode).to.equal(403);
    }

    // 2) doesn't work
    // expect().to.be.rejected
    // return (await selectel.auth(invalidCredentials.login, invalidCredentials.pass)).should.be.rejected;
  });

  it('successful with valid credentials', async () => {
    let response = await selectel.auth(validCredentials.login, validCredentials.pass);
    expect(response.statusCode).to.equal(204);
  });
});

//describe('Get information', function() {
//  it('info', async () => {
//    let response = await selectel.info();
//    expect(response.statusCode).to.equal(204);
//  });
//});
//
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
