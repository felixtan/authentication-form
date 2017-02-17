(() => {
  /**
   *  Show password
   */
  const showPasswordCheck = document.querySelector('input.show-password')
  const password = document.querySelector('input.password-input')

  showPasswordCheck.addEventListener('change', () => {
    password.type = showPasswordCheck.checked ? 'text' : 'password'
  })

  /**
   * Parse cookies
   */
   let cookies = document.cookie.split(' ')
   cookies.forEach(c => {
     let pairs = c.split('=')
     sessionStorage[pairs[0]] = pairs[1].replace(/;/g, '')
   })
   console.log(sessionStorage)
})()
