(() => {
  const signupForm = document.getElementById('signupForm')
  signupForm.addEventListener('keypress', e => {
    if (e.keyCode === 13 && signupForm.checkValidity()) {
      signupForm.submit()
    }
  })
})()
