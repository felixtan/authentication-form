(() => {
  window.helpers = {
    attachDirtyCheckingEventListenersToInputs,
    setUpCloseErrorMessageIcon,
  }

  Object.freeze(window.helpers)

  /**
   *  Gathers the names and values of html input elements into an object
   *  @param {HTMLCollection} inputs - The array-like object of input elements
   */
  function getFormData(inputs) {
    let data = {}
    for (let i = 0; i < inputs.length; i++) {
      const field = inputs[i]
      if (field.name !== '') data[field.name] = field.value
    }
    return data
  }

  /**
   *  Attach event to x icon for closing error message
   */
  function setUpCloseErrorMessageIcon() {

    const message = document.querySelector('p.message')
    const closeMessageBtn = document.querySelector('i.close-message')

    if (message !== null && message !== undefined) {

      closeMessageBtn.addEventListener('click', () => {

        // TODO: implement a better way for preventing error msg from
        // displaying after a refresh
        const form = document.getElementsByTagName('form')[0]
        console.log(form)
        if (form.id === 'login-form') {

          window.location = 'https://localhost:3001/login'

        } else if (form.id === 'signup-form') {

          window.location = 'https://localhost:3001/signup'

        } else if (form.id === 'forgotpw-form') {

          window.location = 'https://localhost:3001/password-recovery/stage1'

        } else if (form.id === 'forgotpw-form2-resend') {

          hideCheckEmailTip()
          window.location = 'https://localhost:3001/password-recovery/stage2'

        } else if (form.id === 'forgotpw-form3') {

          window.location = 'https://localhost:3001/password-recovery/stage3'

        }
      })
    }
  }

  /**
   * Don't show check email tip anymore for pw recovery workflow
   */
  function hideCheckEmailTip() {

    const xhr = new XMLHttpRequest()
    xhr.open('POST', 'https://localhost:3001/password-recovery/stage2/hide-check-email-tip')
    xhr.send()

  }

  function attachDirtyCheckingEventListenersToInputs() {

    const inputs = document.getElementsByTagName('input')

    /**
     *  Attach dirty-checking event handlers
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

        // Apply classes according to validity
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

        if (input.value.trim() === '') {

          input.classList.add('empty-input')

        } else {

          input.classList.remove('empty-input')

        }
      })
    }
  }

})()
