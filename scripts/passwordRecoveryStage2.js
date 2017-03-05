(() => {
  document.addEventListener('DOMContentLoaded', () => {

    const resendForm = document.getElementById('forgotpw-form2-resend')

    if (!!resendForm) {

      const resendCode = document.getElementById('resend-code-link')

      resendCode.addEventListener('click', () => {

        resendForm.submit()

      })
    }
  })
})()
