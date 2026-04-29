window.addEventListener('load', () => {
  const widget = document.querySelector('altcha-widget');
  if (widget) {
    widget.configure({
      auto: 'onload',
      hideFooter: true,
      hideLogo: false,
      minDuration : 1000
    });
  }
});


window.addEventListener('load', () => {
  const params = new URLSearchParams(window.location.search);
  const el = document.getElementById('formular-status');

  if (!el) return;

  console.log(el);

  if (params.get('erfolg')) {
    el.innerHTML = '<p class="form-success">✓ Nachricht gesendet! Wir melden uns bald.</p>';
  } else if (params.get('fehler') === 'leer') {
    el.innerHTML = '<p class="form-error">Bitte alle Felder ausfüllen.</p>';
  } else if (params.get('fehler') === 'email') {
    el.innerHTML = '<p class="form-error">Bitte eine gültige E-Mail-Adresse eingeben.</p>';
  } else if (params.get('fehler') === 'server') {
    el.innerHTML = '<p class="form-error">Fehler beim Senden. Bitte direkt per E-Mail schreiben.</p>';
  }
});