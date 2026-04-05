(function () {
  const list = document.getElementById("artikelList");
  const noArtikel = document.getElementById("noArtikel");
  const jahrSelect = document.getElementById("jahrSelect");

  const BILD_EXTS = ["jpg", "jpeg", "png", "webp", "gif"];
  const PDF_EXTS  = ["pdf"];

  function extOf(pfad) {
    return pfad ? pfad.split(".").pop().toLowerCase() : "";
  }
  function istBild(pfad) { return BILD_EXTS.includes(extOf(pfad)); }
  function istPdf(pfad)  { return PDF_EXTS.includes(extOf(pfad)); }

  function formatDatum(datumStr) {
    const d = new Date(datumStr);
    return d.toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });
  }

  // ---- Icon SVGs ----
  const ICON_PDF = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="12" y1="12" x2="12" y2="18"></line>
    <line x1="9" y1="15" x2="15" y2="15"></line>
  </svg>`;

  const ICON_IMG = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21 15 16 10 5 21"></polyline>
  </svg>`;

  function downloadButton(pfad, label) {
    if (!pfad) return "";
    const icon = istPdf(pfad) ? ICON_PDF : ICON_IMG;
    const fallbackLabel = istPdf(pfad) ? "PDF öffnen" : "Bild öffnen";
    return `<a class="btn-artikel" href="${pfad}" target="_blank" rel="noopener noreferrer">
      ${icon}${label || fallbackLabel}
    </a>`;
  }

  // Sammelt alle Bilder eines Artikels (bild, bild1, bild2, … oder bilder-Array)
  function bilderAus(a) {
    const bilder = [];
    if (Array.isArray(a.bilder)) {
      a.bilder.forEach(b => bilder.push({ pfad: b.pfad || b, label: b.label }));
    } else {
      // bild, bild1, bild2, bild3 …
      if (a.bild) bilder.push({ pfad: a.bild, label: a.bildLabel });
      for (let i = 1; i <= 9; i++) {
        const key = `bild${i}`;
        if (a[key]) bilder.push({ pfad: a[key], label: a[`bild${i}Label`] });
      }
    }
    return bilder.filter(b => b.pfad);
  }

  function renderArtikel(artikel, jahr) {
    list.innerHTML = "";

    const gefiltert = artikel
      .filter(a => new Date(a.datum).getFullYear() === jahr)
      .sort((a, b) => new Date(b.datum) - new Date(a.datum));

    if (gefiltert.length === 0) {
      noArtikel.style.display = "";
      return;
    }
    noArtikel.style.display = "none";

    gefiltert.forEach(a => {
      const li = document.createElement("li");
      li.className = "artikel-item";

      // --- Kopf: Datum + Titel ---
      const kopf = `
        <p class="artikel-date">${formatDatum(a.datum)}</p>
        <p class="artikel-title">${a.titel}</p>
      `;

      // --- Text ---
      const desc = a.beschreibung
        ? `<p class="artikel-desc">${a.beschreibung}</p>`
        : "";

      // --- Einzelne Haupt-Datei (PDF oder einzelnes Bild ohne bild1/bild2) ---
      // "pfad" = Hauptdatei, immer als Download-Button angeboten
      const hauptBtn = a.pfad ? downloadButton(a.pfad, a.buttonname) : "";
      const hauptBtnWrap = hauptBtn
        ? `<div class="artikel-actions">${hauptBtn}</div>`
        : "";

      // --- Bilder (bild / bild1 / bild2 / bilder[]) ---
      const bilder = bilderAus(a);
      let bilderHtml = "";
      if (bilder.length === 1) {
        // Einzelbild: vollbreit
        bilderHtml = `
          <div class="artikel-bilder artikel-bilder--single">
            <a href="${bilder[0].pfad}" target="_blank" rel="noopener noreferrer">
              <img src="${bilder[0].pfad}" alt="${bilder[0].label || a.titel}" class="artikel-bild" loading="lazy" />
            </a>
          </div>`;
      } else if (bilder.length > 1) {
        // Mehrere Bilder: nebeneinander
        const imgs = bilder.map(b => `
          <a href="${b.pfad}" target="_blank" rel="noopener noreferrer">
            <img src="${b.pfad}" alt="${b.label || a.titel}" class="artikel-bild" loading="lazy" />
          </a>`).join("");
        bilderHtml = `<div class="artikel-bilder artikel-bilder--grid">${imgs}</div>`;
      }

      li.innerHTML = kopf + desc + hauptBtnWrap + bilderHtml;
      list.appendChild(li);
    });
  }

  function befuelleJahrSelect(artikel) {
    const jahre = [...new Set(artikel.map(a => new Date(a.datum).getFullYear()))]
      .sort((a, b) => b - a);
    jahre.forEach(j => {
      const opt = document.createElement("option");
      opt.value = j;
      opt.textContent = j;
      jahrSelect.appendChild(opt);
    });
    return jahre[0];
  }

  fetch("/data/presse.json")
    .then(r => r.json())
    .then(artikel => {
      if (!artikel.length) { noArtikel.style.display = ""; return; }
      const startJahr = befuelleJahrSelect(artikel);
      jahrSelect.value = startJahr;
      renderArtikel(artikel, startJahr);
      jahrSelect.addEventListener("change", () => {
        renderArtikel(artikel, Number(jahrSelect.value));
      });
    })
    .catch(err => {
      console.error("Fehler beim Laden der Artikel:", err);
      noArtikel.textContent = "Die Artikel konnten nicht geladen werden.";
      noArtikel.style.display = "";
    });
})();