(() => {
  // document.addEventListener('DOMContentLoaded', () => {
  //
  //   const form = document.getElementById('forgotpw-form3')
  //
  //   if (!!form && form.id === 'forgotpw-form3') {
  //
  //     helpers.attachDirtyCheckingEventListenersToInputs()
  //
  //     const password = document.getElementById('password')
  //     const repeatPassword = document.getElementById('repeat-password')
  //     const repeatPasswordLabel = document.querySelector(`label[for=${repeatPassword.id}]`)
  //     const repeatPasswordValidationMessageContainer = document.querySelectorAll('.validation-message')[1]
  //     const validMessage = repeatPasswordValidationMessageContainer.children[0]
  //     const invalidMessage = repeatPasswordValidationMessageContainer.children[1]
  //     const submitBtn = document.querySelector('button.btn.submit')
  //
  //     function passwordsMatch() {
  //       return repeatPassword.value === password.value
  //     }
  //
  //     /**
  //      * Check that passwords match
  //      */
  //     repeatPassword.addEventListener('focusout', () => {
  //
  //       if (!passwordsMatch()) {
  //         console.log('invalid')
  //         repeatPassword.classList.remove('valid-input')
  //         repeatPassword.classList.add('invalid-input')
  //         invalidMessage.style.visibility = 'visible'
  //         validMessage.style.visibility = 'hidden'
  //         repeatPasswordLabel.style.color = 'red'
  //
  //       } else {
  //         console.log('valid')
  //         repeatPassword.classList.remove('invalid-input')
  //         repeatPassword.classList.add('valid-input')
  //         invalidMessage.style.visibility = 'hidden'
  //         validMessage.style.visibility = 'visible'
  //         repeatPasswordLabel.style.color = 'black'
  //
  //       }
  //
  //     })
  //
  //     submitBtn.addEventListener('click', () => {
  //
  //       trySubmit()
  //
  //     })
  //
  //     // Submit on pressing enter
  //     form.addEventListener('keypress', e => {
  //
  //       if (!!submitBtn && e.keyCode === 13) {
  //
  //         submitBtn.click()
  //
  //       }
  //
  //     })
  //
  //     function trySubmit() {
  //       console.log('trying submit')
  //       if (form.checkValidity() && passwordsMatch()) {
  //         console.log('valid form... submitting')
  //         form.submit()
  //
  //       }
  //
  //     }
  //
  //   }
  //
  // })
})()
