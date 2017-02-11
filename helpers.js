(() => {

  /**
   *  Sanitize inputs upon submission
   */
  const form = document.getElementsByTagName('form')[0]

  form.addEventListener('submit', () => {
    const inputs = document.getElementsByTagName('input')

    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i]
      const sanitize = input.name === 'password'
        ? encodeURIComponentEnhanced
        : encodeURIComponent
      input.value = sanitize(input.value)
    }
  })

  // extend encodeURIComponent to encode "(" and ")"
  function encodeURIComponentEnhanced(input) {
    return encodeURIComponent(input)
            .replace(/\(/g, '%28')
            .replace(/\)/g, '%29')
  }

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
