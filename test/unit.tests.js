const expect = require('chai').expect;
const Selectel = require('../selectel');
const sinon = require('sinon');

const requestPromise = {
  defaults: function() {
    return function() {
      return new Promise((resolve, reject) => {
        // response
        // reject({});
        resolve({
          headers: {
            'x-expire-auth-token': 1,
            'x-storage-url': '',
            'x-auth-token': ''
          },
          statusCode: 204
        });
      });
    };
  }
};

const request = sinon.mock();
const mock = sinon.mock(requestPromise);
const selectel = new Selectel(request, requestPromise);

const validCredentials = {
  login: '',
  pass: ''
};
const invalidCredentials = {
  login: '',
  pass: ''
};

describe('Storage', function() {
  it('auth with valid credentials', async () => {
    let response = await selectel.auth(validCredentials.login, validCredentials.pass);
    expect(response.statusCode).to.equal(204);
  });

  it('auth with invalid credentials', async () => {
    let response = await selectel.auth(invalidCredentials.login, invalidCredentials.pass);
    expect(response.statusCode).to.equal(403);
  });
});
