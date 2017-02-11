(() => {
  const form = document.getElementsByTagName('form')[0]

  form.addEventListener('submit', () => {
    const inputs = document.getElementsByTagName('input')

    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i]
      const sanitize = input.name === 'password'
        ? encodeURIComponentEnhanced
        : encodeURIComponent
      input.value = sanitize(input.value)
    }
  })

  // extend encodeURIComponent to encode "(" and ")"
  function encodeURIComponentEnhanced(input) {
    return encodeURIComponent(input)
            .replace(/\(/g, '%28')
            .replace(/\)/g, '%29')
  }
})()
