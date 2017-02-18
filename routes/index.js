module.exports = (app, db) => {
  return {
    signup    :  getRouter('signup'),
    login     :  getRouter('login'),
    forgotpw  :  getRouter('forgotpw'),
    home      :  getRouter('home')
  }

  function getRouter(view) {
    // return require(`./routes/${view}.js`)(app, db)
    return require(`${__dirname}/${view}.js`)(app, db)
  }
}
