# Obst- und Gartenbauverein Wiesbaden-Kloppenheim – Website

Statische Website des OGV Wiesbaden-Kloppenheim, gebaut mit [Eleventy (11ty)](https://www.11ty.dev/).

---

## Voraussetzungen

- [Node.js](https://nodejs.org/) (LTS-Version empfohlen)
- npm (wird mit Node.js mitgeliefert)

---

## Installation

### Linux

```bash
# Repository klonen
git clone <repo-url>
cd ogv

# Abhängigkeiten installieren
npm install
```

### Windows

```powershell
# Repository klonen
git clone <repo-url>
cd ogv

# Abhängigkeiten installieren
npm install
```

---

## Entwicklung

Lokalen Entwicklungsserver starten (mit Hot-Reload):

```bash
npm run dev
```

Die Website ist dann unter [http://localhost:8080](http://localhost:8080) erreichbar.

---

## Build

Fertige Website für den Server generieren:

```bash
npm run build
```

Der fertige `_site/`-Ordner wird erstellt und kann direkt auf den Server hochgeladen werden.

---

## Projektstruktur

```
Ogv_Website/
├── _includes/          # Wiederverwendbare Komponenten (Navbar, Footer, etc.)
├── css/                # Stylesheets
├── js/                 # JavaScript
├── images/             # Bilder
├── files/              # PDFs und sonstige Dateien
├── ueber-uns/          # Unterseiten
├── index.html          # Startseite
├── ...                 # weitere Seiten
├── eleventy.config.mjs # Eleventy-Konfiguration
└── _site/              # Generierte Website (wird nicht ins Repo gepusht)
```
