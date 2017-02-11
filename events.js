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

      const validationMessageContainer = document.querySelector(`input#${input.id} + span.validation-message`)
      const label = document.querySelector(`label[for=${input.id}]`)

      // Skip show password checkbox
      if (validationMessageContainer === null) continue

      const validMessageContainer = validationMessageContainer.children[0]
      const invalidMessageContainer = validationMessageContainer.children[1]

      input.addEventListener('focusout', () => {
        const valid = input.validity.valid

        // Valid?
        if (input.classList.contains('dirty-input')) {
          if (!valid) {
            input.classList.remove('valid-input')
            input.classList.add('invalid-input')
            invalidMessageContainer.style.visibility = 'visible'
            validMessageContainer.style.visibility = 'hidden'
            label.style.color = 'red'
          } else {
            input.classList.remove('invalid-input')
            input.classList.add('valid-input')
            invalidMessageContainer.style.visibility = 'hidden'
            validMessageContainer.style.visibility = 'visible'
            label.style.color = 'black'
          }

          if (input.classList.contains('empty-input') && input.classList.contains('optional')) {
            invalidMessageContainer.style.visibility = 'hidden'
            validMessageContainer.style.visibility = 'hidden'
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
