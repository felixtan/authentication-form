(() => {
  const form = document.getElementsByTagName('form')[0]

  /**
   * Submit on pressing enter/return
   */
  form.addEventListener('keypress', e => {
    if (e.keyCode === 13 && form.checkValidity()) {
      form.submit()
    }
  })

  /**
   *  Show password
   */
  const showPasswordCheck = document.querySelector('input.show-password')
  const password = document.querySelector('input.password-input')

  showPasswordCheck.addEventListener('change', () => {
    password.type = showPasswordCheck.checked ? 'text' : 'password'
  })

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
})()
