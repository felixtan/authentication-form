module.exports = (app, db, passport) => {
  return {
    signup    :  getRouter('signup'),
    login     :  getRouter('login'),
    forgotpw  :  getRouter('forgotpw'),
    home      :  getRouter('home')
  }

  function getRouter(view) {
    return require(`${__dirname}/${view}.js`)(app, db, passport)
  }
}
