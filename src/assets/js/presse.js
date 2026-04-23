(function () {
  const list = document.getElementById("artikelList");
  const noArtikel = document.getElementById("noArtikel");
  const jahrSelect = document.getElementById("jahrSelect");

  const BILD_EXTS = ["jpg", "jpeg", "png", "webp", "gif"];
  const PDF_EXTS  = ["pdf"];

  function extOf(pfad) { return pfad ? pfad.split(".").pop().toLowerCase() : ""; }
  function istBild(pfad) { return BILD_EXTS.includes(extOf(pfad)); }
  function istPdf(pfad)  { return PDF_EXTS.includes(extOf(pfad)); }

  function formatDatum(datumStr) {
    const d = new Date(datumStr);
    return d.toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });
  }

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

function bilderAus(a) {
    const begleit = [];
    for (let i = 1; i <= 9; i++) {
      if (a[`bild${i}`]) begleit.push({ pfad: a[`bild${i}`], label: a[`bild${i}Label`] });
    }
    return {
      haupt: a.bild ? { pfad: a.bild, label: a.bildLabel } : null,
      begleit,
    };
  }

  // ---- URL-Handling ----

  function jahrAusUrl() {
    const params = new URLSearchParams(window.location.search);
    const j = parseInt(params.get("jahr"), 10);
    return isNaN(j) ? null : j;
  }

  function jahrInUrl(jahr) {
    const url = new URL(window.location.href);
    url.searchParams.set("jahr", jahr);
    // pushState: URL ändert sich, aber kein Seitenreload
    window.history.pushState({ jahr }, "", url.toString());
  }

  // ---- Render ----

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

      const desc = a.beschreibung ? `<p class="artikel-desc">${a.beschreibung}</p>` : "";
      // const hauptBtn = a.pfad ? downloadButton(a.pfad, a.buttonname) : "";
      const hauptBtn = false; // Zeile löschen und obere Zeile auskommentieren für Downloadbutton
      const hauptBtnWrap = hauptBtn ? `<div class="artikel-actions">${hauptBtn}</div>` : "";

      const eaDesc = a.eaAusgabe ? `<p>Quelle: <a href="https://www.erbenheimer-anzeiger.de" target="_blank">Erbenheimer Anzeiger</a>, Ausgabe vom ${formatDatum(a.eaAusgabe)}</p>` : "";

      const { haupt, begleit } = bilderAus(a);

      // Hauptbild: groß, vollbreit
      const hauptBildHtml = haupt ? `
        <div class="artikel-bilder artikel-bilder--haupt">
          <a href="${haupt.pfad}" target="_blank" rel="noopener noreferrer">
            <img src="${haupt.pfad}" alt="${haupt.label || a.titel}" class="artikel-bild" loading="lazy" />
          </a>
        </div>` : "";

      // Begleitbilder: klein, nebeneinander
      const begleitHtml = begleit.length ? `
        <div class="artikel-bilder artikel-bilder--grid">
          ${begleit.map(b => `
            <a href="${b.pfad}" target="_blank" rel="noopener noreferrer">
              <img src="${b.pfad}" alt="${b.label || a.titel}" class="artikel-bild" loading="lazy" />
            </a>`).join("")}
        </div>` : "";

      li.innerHTML = `
        <p class="artikel-date">${formatDatum(a.datum)}</p>
        <p class="artikel-title">${a.titel}</p>
        ${desc}${hauptBtnWrap}${hauptBildHtml}${eaDesc} ${begleitHtml}
      `;
      list.appendChild(li)
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
    return jahre;
  }

  // ---- Init ----

  fetch("/data/presse.json")
    .then(r => r.json())
    .then(artikel => {
      if (!artikel.length) { noArtikel.style.display = ""; return; }

      const jahre = befuelleJahrSelect(artikel);

      // Jahr aus URL nehmen, sonst aktuellstes
      const jahrAusParam = jahrAusUrl();
      const startJahr = (jahrAusParam && jahre.includes(jahrAusParam))
        ? jahrAusParam
        : jahre[0];

      jahrSelect.value = startJahr;
      renderArtikel(artikel, startJahr);

      // Beim ersten Laden URL setzen falls noch kein Parameter da
      if (!jahrAusUrl()) jahrInUrl(startJahr);

      jahrSelect.addEventListener("change", () => {
        const gewähltesJahr = Number(jahrSelect.value);
        jahrInUrl(gewähltesJahr);
        renderArtikel(artikel, gewähltesJahr);
      });

      // Browser-Zurück/Vor-Buttons funktionieren auch
      window.addEventListener("popstate", (e) => {
        const j = e.state?.jahr || jahrAusUrl() || jahre[0];
        jahrSelect.value = j;
        renderArtikel(artikel, j);
      });
    })
    .catch(err => {
      console.error("Fehler beim Laden der Artikel:", err);
      noArtikel.textContent = "Die Artikel konnten nicht geladen werden.";
      noArtikel.style.display = "";
    });
})();