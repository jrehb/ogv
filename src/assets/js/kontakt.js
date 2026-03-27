  const params = new URLSearchParams(window.location.search);
  const el = document.getElementById('formular-status');
  if (params.get('erfolg')) {
    el.innerHTML = '<p class="form-success">✓ Nachricht gesendet! Wir melden uns bald.</p>';
  } else if (params.get('fehler') === 'leer') {
    el.innerHTML = '<p class="form-error">Bitte alle Felder ausfüllen.</p>';
  } else if (params.get('fehler') === 'email') {
    el.innerHTML = '<p class="form-error">Bitte eine gültige E-Mail-Adresse eingeben.</p>';
  } else if (params.get('fehler') === 'server') {
    el.innerHTML = '<p class="form-error">Fehler beim Senden. Bitte direkt per E-Mail schreiben.</p>';
  }