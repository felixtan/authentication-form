(() => {
  const form = document.getElementsByTagName('form')[0]

  form.addEventListener('keypress', e => {
    if (e.keyCode === 13 && form.checkValidity()) {
      form.submit()
    }
  })

  if (form.id === 'signupForm') {
    const inputs = document.getElementsByTagName('input')

    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i]

      input.addEventListener('focusout', () => {
        const valid = input.validity.valid

        // Dirty?
        if (input.classList.contains('dirty-input')) {
          if (!valid) {
            input.classList.remove('valid-input')
            input.classList.add('invalid-input')
          } else {
            input.classList.remove('invalid-input')
            input.classList.add('valid-input')
          }
        }
      })

      // Valid?
      input.addEventListener('input', () => {
        if (!input.classList.contains('dirty-input')) {
          input.classList.add('dirty-input')
        }
      })

      // Empty?
      input.addEventListener('input', () => {
        if (input.value === '') {
          input.classList.add('empty-input')
        } else {
          input.classList.remove('empty-input')
        }
      })
    }
  }
})()
