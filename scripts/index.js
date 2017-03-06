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
      helpers.setUpCloseErrorMessageIcon()
      helpers.attachDirtyCheckingEventListenersToInputs(form)

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
  })
})()
