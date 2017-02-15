(() => {

  const form = document.getElementsByTagName('form')[0]
  const capsLockNotification = document.getElementById('capsLockNotificationContainer')

  // Submit on pressing enter/return
  form.addEventListener('keypress', e => {
    if (e.keyCode === 13 && form.checkValidity()) {
      form.submit()
    }
  })

  // TODO: caps lock detection
  // const fullName = document.getElementById('fullName')
  // document.body.addEventListener('click', e => {
    // const lowerCase = new RegExp('[a-z]')
    // const upperCase = new RegExp('[A-Z]')
    // if (e.shiftKey && lowerCase.test(e.key) || !e.shiftKey && upperCase.test(e.key)) {
    //   console.log('ON?', e.key)
    // } else {
    //   console.log('OFF?', e.key)
    // }
  // })

  if (form.id === 'signupForm') {
    const inputs = document.getElementsByTagName('input')

    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i]

      // Auto-focus the first input
      if (input.id === 'fullName') {
        input.focus()
      }

      const validationMessageContainer = document.querySelector(`input#${input.id} + span.validation-message`)
      const label = document.querySelector(`label[for=${input.id}]`)

      // Skip show password checkbox
      if (validationMessageContainer === null) continue

      const validMessageContainer = validationMessageContainer.children[0]
      const invalidMessageContainer = validationMessageContainer.children[1]

      input.addEventListener('focusout', () => {
        const valid = input.validity.valid

        // Valid?
        if (input.classList.contains('dirty-input')) {
          if (!valid) {
            input.classList.remove('valid-input')
            input.classList.add('invalid-input')
            invalidMessageContainer.style.visibility = 'visible'
            validMessageContainer.style.visibility = 'hidden'
            label.style.color = 'red'
          } else {
            input.classList.remove('invalid-input')
            input.classList.add('valid-input')
            invalidMessageContainer.style.visibility = 'hidden'
            validMessageContainer.style.visibility = 'visible'
            label.style.color = 'black'
          }

          if (input.classList.contains('empty-input') && input.classList.contains('optional')) {
            invalidMessageContainer.style.visibility = 'hidden'
            validMessageContainer.style.visibility = 'hidden'
          }
        }
      })

      // Dirty?
      input.addEventListener('input', () => {
        if (!input.classList.contains('dirty-input')) {
          input.classList.add('dirty-input')
        }
      })

      // Empty?
      input.addEventListener('input', () => {
        if (input.value === '') {
          input.classList.add('empty-input')
        } else {
          input.classList.remove('empty-input')
        }
      })
    }
  }

  /**
 * Check if the keyevent has been triggered with uppercase.
 *
 * @param {Object} e A keypress event
 * @returns {Boolean} isCapsLock
 *
 * source: http://ourcodeworld.com/articles/read/170/how-to-detect-if-caps-lock-uppercase-is-pressed-with-javascript-and-jquery
 */
function isCapsLock(e){
    e = (e) ? e : window.event;

    var charCode = false;
    if (e.which) {
        charCode = e.which;
    } else if (e.keyCode) {
        charCode = e.keyCode;
    }

    var shifton = false;
    if (e.shiftKey) {
        shifton = e.shiftKey;
    } else if (e.modifiers) {
        shifton = !!(e.modifiers & 4);
    }

    if (charCode >= 97 && charCode <= 122 && shifton) {
        return true;
    }

    if (charCode >= 65 && charCode <= 90 && !shifton) {
        return true;
    }

    return false;
  }
})()
