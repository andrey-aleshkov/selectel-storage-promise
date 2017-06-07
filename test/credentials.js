const credentials = {
  invalid: {
    login: 'invalidLogin',
    pass: 'invalidPass'
  },
  valid: {
    login: process.env.NODE_ENV === 'production' ? process.env.SELECTEL_LOGIN : 'validLogin',
    pass: process.env.NODE_ENV === 'production' ? process.env.SELECTEL_PASS : 'validPass'
  }
};

module.exports = credentials;
