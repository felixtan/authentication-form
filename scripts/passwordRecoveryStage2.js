(() => {
  document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('forgotpw-form2-resend')

    if (form !== null && form !== undefined) {

      const resendCode = document.getElementById('resend-code-link')

      resendCode.addEventListener('click', () => {

        form.submit()

      })
    }
  })
})()
