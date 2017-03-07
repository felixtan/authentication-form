(() => {
  document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementsByTagName('form')[0]

    if (!!form) {

      const submitBtn = document.querySelector('button.btn.submit')
      const inputs = document.getElementsByTagName('input')

      /**
       *  Event handler for closing error message
       *  and input validation styles
       */
      setUpCloseErrorMessageIcon()
      attachDirtyCheckingEventListenersToInputs(form)

      // Submit
      submitBtn.addEventListener('click', e => {

        if (form.checkValidity()) {

          if (form.id !== 'forgotpw-form3') {

            form.submit()

          } else {

            if (passwordsMatch()) form.submit()

          }
        }
      })

      /**
       * Submit on pressing enter/return
       *
       * Password recovery stage 3 form will handle it's own
       */
      form.addEventListener('keypress', e => {

        if (e.keyCode === 13 && form.checkValidity()) {

          if (form.id !== 'forgotpw-form3') {

            form.submit()

          } else {

            if (passwordsMatch()) form.submit()

          }
        }
      })

      /**
       *  Show password
       */
      const showPasswordCheck = document.querySelector('input.show-password')
      const password = document.querySelector('input.password-input')
      const repeatPassword = document.getElementById('repeat-password')

      if (!!showPasswordCheck) {

        showPasswordCheck.addEventListener('change', () => {

          password.type = showPasswordCheck.checked ? 'text' : 'password'

          if (!!repeatPassword) repeatPassword.type = showPasswordCheck.checked ? 'text' : 'password'

        })

      }

      /**
       * Check that passwords match for password recovery
       */
      function passwordsMatch() {

        const password = document.getElementById('password')
        const repeatPassword = document.getElementById('repeat-password')
        return password.value === repeatPassword.value

      }

      /**
       *  Auto-focus the first input
       */
      if (inputs.length) {
        inputs[0].focus()
      }

      /**
       *  TODO: caps lock detection
       */
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
    }

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

    function attachDirtyCheckingEventListenersToInputs(form) {

      const inputs = document.getElementsByTagName('input')

      /**
       *  Attach dirty-checking event handlers
       */
      for (let i = 0; i < inputs.length; i++) {

        const input = inputs[i]

        const validationMessageContainer = document.querySelector(`input#${input.id} + span.validation-message`)
        const label = document.querySelector(`label[for=${input.id}]`)

        // Skip show password checkbox
        if (!!!validationMessageContainer) continue

        const validMessage = validationMessageContainer.children[0]
        const invalidMessage = validationMessageContainer.children[1]

        input.addEventListener('focusout', e => {

          const valid = e.target.validity.valid

          // Apply classes according to validity
          if (e.target.classList.contains('dirty-input')) {

            if (form.id !== 'forgotpw-form3') {

              setCSSBasedOnValidity(valid, e.target, label, validMessage, invalidMessage)

            } else {

              const password = document.getElementById('password')
              const repeatPassword = document.getElementById('repeat-password')
              const repeatPasswordLabel = document.querySelector(`label[for=repeat-password]`)
              const repeatPasswordValidationMessageContainer = document.querySelector(`input#repeat-password + span.validation-message`)
              const repeatPasswordValidMessage = repeatPasswordValidationMessageContainer.children[0]
              const repeatPasswordInvalidMessage = repeatPasswordValidationMessageContainer.children[1]

              if (e.target.id === 'repeat-password') {

                setCSSBasedOnValidity((valid && e.target.value === password.value), e.target, label, validMessage, invalidMessage)

              } else if (e.target.id === 'password') {

                setCSSBasedOnValidity(valid, e.target, label, validMessage, invalidMessage)

                if (repeatPassword.classList.contains('dirty-input')) {

                  setCSSBasedOnValidity((repeatPassword.validity.valid && e.target.value === repeatPassword.value), repeatPassword, repeatPasswordLabel, repeatPasswordValidMessage, repeatPasswordInvalidMessage)

                }
              }
            }

            if (e.target.classList.contains('empty-input') && e.target.classList.contains('optional')) {

              invalidMessage.style.visibility = 'hidden'
              validMessage.style.visibility = 'hidden'

            }
          }
        })

        // Dirty?
        input.addEventListener('input', e => {

          if (!e.target.classList.contains('dirty-input')) {

            e.target.classList.add('dirty-input')

          }

        })

        // Empty?
        input.addEventListener('input', e => {

          if (e.target.value.trim() === '') {

            e.target.classList.add('empty-input')

          } else {

            e.target.classList.remove('empty-input')

          }
        })

        /**
         * Change css of input and related elements to reflect validity of input
         *
         * @param {HTMLInputElement} input
         * @param {HTMLLabelElement} inputLabel
         * @param {HTMLSpanElement} validMessage
         * @param {HTMLSpanElement} invalidMessage
         */
        function setCSSBasedOnValidity(valid, input, inputLabel, validMessage, invalidMessage) {

          const classToRemove = valid ? 'invalid-input' : 'valid-input'
          const classToAdd = valid ? 'valid-input' : 'invalid-input'

          input.classList.remove(classToRemove)
          input.classList.add(classToAdd)

          validMessage.style.visibility = valid ? 'visible' : 'hidden'
          invalidMessage.style.visibility = valid ? 'hidden' : 'visible'
          inputLabel.style.color = valid ? 'black' : 'red'

        }

      }
    }
  })
})()
