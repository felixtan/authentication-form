(() => {
  const loginErrorMsg = document.getElementById('login-err-message')
  const closeLoginErrorMsgBtn = document.getElementById('close-login-err-message')
  const emailLabelContainer = document.querySelector('div.label-container')

  if (loginErrorMsg !== null && loginErrorMsg !== undefined) {
    closeLoginErrorMsgBtn.addEventListener('click', () => {
      // TODO: implement a better way for preventing error msg from
      // displaying after a refresh
      window.location ='http://localhost:3000/login'
    })
  }
})()
