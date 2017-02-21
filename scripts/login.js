(() => {
  document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('login-form')

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
            // TODO: log the activity
          })
          .fail((jqXHR, textStatus, errorThrown) => {
            // Render the error message
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
  })
})()
