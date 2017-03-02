(() => {
  window.helpers = {
    getFormData,
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
    const errorMessage = document.querySelector('.err-message')
    const closeErrorMessageBtn = document.querySelector('.close-err-message')
    const errorMessageContainer = document.querySelector('div.err-message-container')
    const firstLabelContainer = document.querySelector('div.label-container')

    if (errorMessage !== null && errorMessage !== undefined) {
      closeErrorMessageBtn.addEventListener('click', () => {
        // TODO: implement a better way for preventing error msg from
        // displaying after a refresh
        const form = document.getElementsByTagName('form')[0]
        if (form.id === 'login-form') {
          window.location ='https://localhost:3001/login'
        } else if (form.id === 'signup-form') {
          window.location ='https://localhost:3001/signup'
        } else if (form.id === 'forgotpw-form') {
          window.location ='https://localhost:3001/password-recovery/stage1'
        }
      })
    }
  }
})()
