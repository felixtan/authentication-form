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

})()
