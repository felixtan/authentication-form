(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form')

    // Prevent attaching multiple event listeners to the same elements
    if (form.id === 'login-form') {

      const inputs = document.getElementsByTagName('input')
      const submitBtn = document.querySelector('button.btn.submit')

      submitBtn.addEventListener('click', submit)

      function submit(e) {
        if (form.checkValidity()) {
          $.ajax({
            async: true,
            url: form.action,
            method: form.method,
            data: window.helpers.getFormData(inputs),
          })
          .done((data, textStatus, jqXHR) => {
            if (jqXHR.status === 200) {
              location = '/'
            }
          })
          .fail((jqXHR, textStatus, errorThrown) => {
            if (jqXHR.responseText) {
              // document.querySelector('section.container').innerHtml = jqXHR.responseText
              document.querySelector('html').innerHtml = jqXHR.responseText
              window.helpers.setUpCloseErrorMessageIcon()
            }
          })
          .always((data, textStatus, errorThrown) => {
            // TODO: log the activity
          })
        }
      }

      // This function won't be called in ajax callback on refresh
      window.helpers.setUpCloseErrorMessageIcon()
    }
  })
})()
