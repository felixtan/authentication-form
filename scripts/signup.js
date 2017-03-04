(() => {
  document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('signup-form')

    if (form.id === 'signup-form') {

      helpers.attachDirtyCheckingEventListenersToInputs()

    }

  })
})()
