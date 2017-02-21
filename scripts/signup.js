(() => {
  document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('signup-form')

    if (form.id === 'signup-form') {

      const inputs = document.getElementsByTagName('input')

      /**
       *  Attach validation event handlers
       */
      for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i]

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
  })
})()
