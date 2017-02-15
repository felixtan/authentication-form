(() => {

  const form = document.getElementsByTagName('form')[0]
  const capsLockNotification = document.getElementById('caps-lock-notification-container')

  // Submit on pressing enter/return
  form.addEventListener('keypress', e => {
    if (e.keyCode === 13 && form.checkValidity()) {
      form.submit()
    }
  })

  // TODO: caps lock detection
  // const fullName = document.getElementById('full-name')
  // document.body.addEventListener('click', e => {
    // const lowerCase = new RegExp('[a-z]')
    // const upperCase = new RegExp('[A-Z]')
    // if (e.shiftKey && lowerCase.test(e.key) || !e.shiftKey && upperCase.test(e.key)) {
    //   console.log('ON?', e.key)
    // } else {
    //   console.log('OFF?', e.key)
    // }
  // })

  if (form.id === 'signup-form') {
    const inputs = document.getElementsByTagName('input')

    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i]

      // Auto-focus the first input
      if (input.id === 'full-name') {
        input.focus()
      }

      const validationMessageContainer = document.querySelector(`input#${input.id} + span.validation-message`)
      const label = document.querySelector(`label[for=${input.id}]`)

      // Skip show password checkbox
      if (validationMessageContainer === null) continue

      const validMessage = validationMessageContainer.children[0]
      const invalidMessage = validationMessageContainer.children[1]

      input.addEventListener('focusout', () => {
        const valid = input.validity.valid

        // Valid?
        if (input.classList.contains('dirty-input')) {
          if (!valid) {
            input.classList.remove('valid-input')
            input.classList.add('invalid-input')
            invalidMessage.style.visibility = 'visible'
            validMessage.style.visibility = 'hidden'
            label.style.color = 'red'
          } else {
            input.classList.remove('invalid-input')
            input.classList.add('valid-input')
            invalidMessage.style.visibility = 'hidden'
            validMessage.style.visibility = 'visible'
            label.style.color = 'black'
          }

          if (input.classList.contains('empty-input') && input.classList.contains('optional')) {
            invalidMessage.style.visibility = 'hidden'
            validMessage.style.visibility = 'hidden'
          }
        }
      })

      // Dirty?
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
