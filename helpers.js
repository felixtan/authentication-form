(() => {
  /**
   *  Show password
   */
  const showPasswordCheck = document.querySelector('input.show-password')
  const password = document.querySelector('input.password-input')

  showPasswordCheck.addEventListener('change', () => {
    password.type = showPasswordCheck.checked ? 'text' : 'password'
  })

})()
