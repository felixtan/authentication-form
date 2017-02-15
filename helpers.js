(() => {
  /**
   *  Show password
   */
  const showPasswordCheck = document.getElementById('showPassword')
  const showPasswordLabel = document.getElementById('showPasswordLabel')
  const password = document.getElementById('signupPassword')

  // For convenience on mobile since checkbox might be too small
  showPasswordLabel.addEventListener('click', () => {
    showPasswordCheck.checked = !showPasswordCheck.checked

    // For some reason, the checkbox's onchange event is not triggered
    // when the label is clicked, even though its value does change.
    password.type = showPasswordCheck.checked ? 'text' : 'password'
  })

  showPasswordCheck.addEventListener('change', () => {
    password.type = showPasswordCheck.checked ? 'text' : 'password'
  })

})()
