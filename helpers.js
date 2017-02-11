(() => {

  const form = document.getElementById('signupForm')

  form.addEventListener('submit', () => {
    form.password.value = sanitize(form.password.value)
  })

  // extend encodeURI to encode "(" and ")"
  // use this to sanitize user input
  function sanitize(input) {
    return encodeURI(input)
            .replace(/\(/g, '%28')
            .replace(/\)/g, '%29')
            .replace(/\//g, '%2F')
  }
})()
