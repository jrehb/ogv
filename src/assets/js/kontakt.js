// Altcha konfigurieren
window.addEventListener('DOMContentLoaded', () => {
  const widget = document.querySelector('altcha-widget');
  if (widget) {
    widget.configure({
      auto: 'off',
      hideFooter: true,
      hideLogo: false,
      minDuration: 500
    });
  }
});

// Formular-Handling per AJAX / Fetch
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('kontakt-formular');
  const statusDiv = document.getElementById('formular-status');

  if (!form || !statusDiv) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Verhindert das Neuladen der Seite

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerText;
    submitBtn.innerText = 'Wird gesendet...';
    submitBtn.disabled = true;

    const formData = new FormData(form);

    try {
      const response = await fetch('/kontakt/senden.php', {
        method: 'POST',
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const name = formData.get('name');
        const nachricht = formData.get('nachricht');

        // Erfolgsmeldung inkl. gesendetem Text anzeigen
        statusDiv.innerHTML = `
          <div class="form-success">
            <h3>Vielen Dank für Ihre Nachricht, ${escapeHtml(name)}!</h3>
            <p>Ihre Anfrage wurde erfolgreich übermittelt. Wir melden uns in Kürze bei Ihnen.</p>
            <hr class="separator" />
            <p><strong>Ihre gesendete Nachricht:</strong></p>
            <blockquote><p>${escapeHtml(nachricht)}</p></blockquote>
          </div>
        `;

        form.reset();
        
        // Ganz an den Anfang der Seite scrollen
        window.scrollTo({ top: 0, behavior: 'smooth' });

      } else {
        // Fehlermeldung vom PHP-Server anzeigen
        statusDiv.innerHTML = `<p class="form-error">${escapeHtml(result.message || 'Fehler beim Senden.')}</p>`;
        submitBtn.innerText = originalBtnText;
        submitBtn.disabled = false;

        // Auch bei Fehler ganz nach oben scrollen
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      statusDiv.innerHTML = `
        <p class="form-error">
          <strong>Entschuldigung!</strong> Beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut oder schreiben Sie uns direkt an <a href="mailto:info@ogv-kloppenheim.de">info@ogv-kloppenheim.de</a>.
        </p>
      `;
      submitBtn.innerText = originalBtnText;
      submitBtn.disabled = false;

      // Auch bei Netzwerk-Fehler ganz nach oben scrollen
      window.scrollTo({ top: 0, behavior: 'smooth' });
      console.error(error)
    }
  });
});

// Hilfsfunktion gegen XSS (Sicherheits-Check für Benutzereingaben)
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.innerText = text;
  return div.innerHTML;
}