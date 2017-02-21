(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementsByTagName('form')[0]
    const submitBtn = document.querySelector('button.btn.submit')
    const inputs = document.getElementsByTagName('input')

    /**
     * Submit on pressing enter/return
     */
    if (form !== null && form !== undefined) {
      form.addEventListener('keypress', e => {
        if (e.keyCode === 13 && form.checkValidity() && submitBtn !== null) {
          submitBtn.click()
        }
      })
    }

    /**
     *  Show password
     */
    const showPasswordCheck = document.querySelector('input.show-password')
    const password = document.querySelector('input.password-input')

    if (showPasswordCheck !== null && showPasswordCheck !== undefined) {
      showPasswordCheck.addEventListener('change', () => {
        password.type = showPasswordCheck.checked ? 'text' : 'password'
      })
    }

    /**
     *  Auto-focus the first input
     */
    if (!!inputs.length) {
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
    })
})()
