module.exports = (app, db, passport) => {
  return {
    signup                  :  getRouter('signup'),
    login                   :  getRouter('login'),
    passwordRecoveryStage1  :  getRouter('passwordRecovery/stage1'),
    passwordRecoveryStage2  :  getRouter('passwordRecovery/stage2'),
    home                    :  getRouter('home'),
    logout                  :  getRouter('logout')
  }

  function getRouter(view) {
    return require(`${__dirname}/${view}.js`)(app, db, passport)
  }
}
