(function () {
  const heute = new Date();
  heute.setHours(0, 0, 0, 0);

  let zeigeVergangene = false;

  const list = document.getElementById("eventList");
  const noEvents = document.getElementById("noEvents");
  const toggleBtn = document.getElementById("togglePast");

  function formatDatum(event) {
    if (event.datum_anzeige) return event.datum_anzeige;
    const d = new Date(event.datum);
    return d.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  // Datum zu iCal-Format: YYYYMMDD
  // mit Uhrzeit -> DTSTART:20260319T190000
  // ohne Uhrzeit -> DTSTART;VALUE=DATE:20260319

  function toIcalDatumZeit(datumStr, uhrzeit) {
    if (!uhrzeit) return `DTSTART;VALUE=DATE:${datumStr.replace(/-/g, "")}`;
    const [h, m] = uhrzeit.split(":");
    return `DTSTART:${datumStr.replace(/-/g, "")}T${h}${m}00`;
  }
  // Naechsten Tag berechnen fuer DTEND (iCal: Enddatum exklusiv)
  function naechsterTag(datumStr) {
    const d = new Date(datumStr);
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10).replace(/-/g, "");
  }

  function icalDownload(event) {
    const uid = `${event.datum}-${event.titel.replace(/\s+/g, "-").toLowerCase()}@ogv-kloppenheim.de`;
    const beschreibung = event.beschreibung
      ? event.beschreibung
          .replace(/<[^>]*>/g, "") // HTML-Tags entfernen
          .replace(/\n/g, "\\n")
          .replace(/,/g, "\\,")
          .replace(/;/g, "\\;")
      : "";

    const dtstart = toIcalDatumZeit(event.datum, event.uhrzeit);
    const dtend = event.uhrzeit
      ? (() => {
          const [h, m] = event.uhrzeit.split(":").map(Number);
          const end = String(h + 1).padStart(2, "0") + String(m).padStart(2, "0");
          return `DTEND:${event.datum.replace(/-/g, "")}T${end}00`;
        })()
      : `DTEND;VALUE=DATE:${
          event.datum_ende
            ? new Date(new Date(event.datum_ende).setDate(new Date(event.datum_ende).getDate() + 1))
                .toISOString()
                .slice(0, 10)
                .replace(/-/g, "")
            : naechsterTag(event.datum)
        }`;

    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//OGV Kloppenheim//Veranstaltungen//DE",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `SUMMARY:${event.titel}`,
      dtstart,
      dtend,
      beschreibung ? `DESCRIPTION:${beschreibung}` : "",
      "END:VEVENT",
      "END:VCALENDAR",
    ]
      .filter(Boolean)
      .join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.titel.replace(/\s+/g, "-").toLowerCase()}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function pdfDownloadButton(filePath, buttonName) {
    if (!filePath) return "";
    const label = buttonName || "PDF-Download";
    return `<a class="btn-pdf" href="${filePath}" target="_blank" rel="noopener noreferrer">
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="12" y1="12" x2="12" y2="18"></line>
            <line x1="9" y1="15" x2="15" y2="15"></line>
        </svg>
        ${label}
    </a>`;
  }

  function renderEvents(events) {
    list.innerHTML = "";

    const gefiltert = events.filter((e) => {
      const d = new Date(e.datum);
      return zeigeVergangene ? d < heute : d >= heute;
    });

    if (gefiltert.length === 0) {
      noEvents.style.display = "";
      return;
    }

    noEvents.style.display = "none";

    const sortiert = [...gefiltert].sort((a, b) => {
      const da = new Date(a.datum);
      const db = new Date(b.datum);
      return zeigeVergangene ? db - da : da - db;
    });

    sortiert.forEach((event) => {
      const li = document.createElement("li");
      li.className = "event-item";
      if (zeigeVergangene) li.classList.add("event-item--past");

      const desc = event.beschreibung ? `<p class="event-desc">${event.beschreibung}</p>` : "";

      // iCal-Button nur fuer zukuenftige Events
      const icalBtn = !zeigeVergangene
        ? `<button class="btn-ical" aria-label="In Kalender speichern">
             <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
               <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
               <line x1="16" y1="2" x2="16" y2="6"></line>
               <line x1="8" y1="2" x2="8" y2="6"></line>
               <line x1="3" y1="10" x2="21" y2="10"></line>
             </svg>
             Kalender
           </button>`
        : "";

      li.innerHTML = `
    <div class="event-header">
        <p class="event-date">${formatDatum(event)}</p>
        ${icalBtn}
    </div>
    <p class="event-title">${event.titel}</p>
    ${desc}
    ${pdfDownloadButton(event.filepath, event.buttonname)}
`;
      if (!zeigeVergangene) {
        li.querySelector(".btn-ical").addEventListener("click", () => icalDownload(event));
      }

      list.appendChild(li);
    });
  }

  fetch("/data/events.json")
    .then((r) => r.json())
    .then((events) => {
      renderEvents(events);

      toggleBtn.addEventListener("click", () => {
        zeigeVergangene = !zeigeVergangene;
        toggleBtn.textContent = zeigeVergangene
          ? "Nur bevorstehende Termine anzeigen"
          : "Vergangene Termine anzeigen";
        renderEvents(events);
      });
    })
    .catch((err) => {
      console.error("Fehler beim Laden der Veranstaltungen:", err);
      noEvents.textContent = "Die Veranstaltungen konnten nicht geladen werden.";
      noEvents.style.display = "";
    });
})();
