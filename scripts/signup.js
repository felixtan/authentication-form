(() => {
  document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('signup-form')

    if (form.id === 'signup-form') {
      const inputs = document.getElementsByTagName('input')

      for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i]

        const validationMessageContainer = document.querySelector(`input#${input.id} + span.validation-message`)
        const label = document.querySelector(`label[for=${input.id}]`)

        // Skip show password checkbox
        if (validationMessageContainer === null) continue

        const validMessage = validationMessageContainer.children[0]
        const invalidMessage = validationMessageContainer.children[1]

        input.addEventListener('focusout', () => {
          const valid = input.validity.valid

          // Valid?
          if (input.classList.contains('dirty-input')) {
            if (!valid) {
              input.classList.remove('valid-input')
              input.classList.add('invalid-input')
              invalidMessage.style.visibility = 'visible'
              validMessage.style.visibility = 'hidden'
              label.style.color = 'red'
            } else {
              input.classList.remove('invalid-input')
              input.classList.add('valid-input')
              invalidMessage.style.visibility = 'hidden'
              validMessage.style.visibility = 'visible'
              label.style.color = 'black'
            }

            if (input.classList.contains('empty-input') && input.classList.contains('optional')) {
              invalidMessage.style.visibility = 'hidden'
              validMessage.style.visibility = 'hidden'
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

      /**
      * Form submission
      */

      const submitBtn = document.querySelector('button.btn.submit')

      submitBtn.addEventListener('click', submit)

      function submit(e) {
        // e.preventDefault()
        if (form.checkValidity()) {
          $.ajax({
            async: true,
            url: form.action,
            method: form.method,
            data: window.helpers.getFormData(inputs),
          })
          .done((data, textStatus, jqXHR) => {
            if (jqXHR.status === 201) {
              location = '/'
            }
          })
          .fail((jqXHR, textStatus, errorThrown) => {
            if (jqXHR.responseText) {
              document.querySelector('html').innerHtml = jqXHR.responseText
              window.helpers.setUpCloseErrorMessageIcon()
            }
          })
          .always((data, textStatus, errorThrown) => {
            // TODO: log the activity
          })
        }
      }
    }

    window.helpers.setUpCloseErrorMessageIcon()
  })
})()
