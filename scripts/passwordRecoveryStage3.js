(() => {
  document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('forgotpw-form3')

    if (form.id === 'forgotpw-form3') {

      helpers.attachDirtyCheckingEventListenersToInputs()

      const password = document.getElementById('password')
      const repeatPassword = document.getElementById('repeat-password')

      repeatPassword.addEventListener('focusout', () => {



      }

    }

  })
})()
