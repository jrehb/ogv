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
npm run dev-net
```

Die Website ist dann, solange port 8090 nicht belegt ist, unter [http://localhost:8090](http://localhost:8090) erreichbar, sowie im lokalen Netzwerk unter der Ip-Adresse des gehosteten Gerätes. Ist letzeres unerwünschtes verhalten, so reicht der Befehl `npm run dev`. Für den aktuellen Port beachte Terminal output.

---

## Build

Fertige Website für den Server generieren:

```bash
npm run build
```

Der fertige `_site/`-Ordner wird komplett neu erstellt und kann direkt auf den Server hochgeladen werden. Mit `npm run fast` wird nur das geupdated, was neu ist.

---

## Projektstruktur

```
├── README.md
├── _site/                  # Generierte Website (wird nicht ins Repo gepusht)
├── eleventy.config.mjs     # Eleventy-Konfiguration
├── node_modules/
├── ...
└── src
    ├── _includes/          # Wiederverwendbare Komponenten (Navbar, Footer, etc.)
    ├── assets
    │   ├── css             # Stylesheets
    │   ├── data            # Json's
    │   ├── files           # PDFs und Bilder
    │   ├── fonts           # Schriftart
    │   └── js              # JavaScript
    ├── config              # Mail Config
    ├── ...
    ├── index.html
    ├── ...
    ├── mail
    └── phpmailer/
```