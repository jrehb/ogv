(function () {
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.getElementById("nav-menu");
    const isMobile = () => window.innerWidth <= 800;

    // ── Hamburger ─────────────────────────────────────────────────
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("open");
        navMenu.classList.toggle("open");

        if (!navMenu.classList.contains("open")) {
            closeAllDropdowns();
        }
    });

    document.addEventListener("click", (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            closeAllDropdowns();
            hamburger.classList.remove("open");
            navMenu.classList.remove("open");
        }
    });

    // ── Hilfsfunktionen ───────────────────────────────────────────

    function closeAllDropdowns() {
        document.querySelectorAll(".nav-dropdown.open").forEach((item) => {
            const menu = item.querySelector(".nav-dropdown-menu");
            menu.style.height = "0";
            item.classList.remove("open");
            item.querySelector(".nav-dropdown-toggle").setAttribute("aria-expanded", "false");
        });
    }

    function expandMenu(menu) {
        // Transition kurz aus, auf auto messen, dann animieren
        menu.style.transition = "none";
        menu.style.height = "auto";
        const fullHeight = menu.getBoundingClientRect().height + "px";
        menu.style.height = "0";

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                menu.style.transition = "height 0.3s ease";
                menu.style.height = fullHeight;
            });
        });

        menu.addEventListener(
            "transitionend",
            () => {
                menu.style.height = "auto";
            },
            { once: true },
        );
    }

    function collapseMenu(menu) {
        menu.style.transition = "none";
        const currentHeight = menu.getBoundingClientRect().height + "px";
        menu.style.height = currentHeight;

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                menu.style.transition = "height 0.3s ease";
                menu.style.height = "0";
            });
        });
    }

    // ── Dropdown-Toggle ───────────────────────────────────────────
    document.querySelectorAll(".nav-dropdown-toggle").forEach((btn) => {
        btn.addEventListener("click", () => {
            if (!isMobile()) return; // Desktop läuft per CSS :hover

            const item = btn.closest(".nav-dropdown");
            const menu = item.querySelector(".nav-dropdown-menu");
            const isOpen = item.classList.contains("open");

            if (isOpen) {
                collapseMenu(menu);
                item.classList.remove("open");
                btn.setAttribute("aria-expanded", "false");
            } else {
                item.classList.add("open");
                btn.setAttribute("aria-expanded", "true");
                expandMenu(menu);
            }
        });
    });

    // ── Table of contens ───────────────────────────────────────────
    const toc = document.querySelector(".toc");
    if (toc) {
        const mq = window.matchMedia("(min-width: 1400px)");
        const updateToc = () => {
            toc.open = mq.matches;
        };
        mq.addEventListener("change", updateToc);
        updateToc();
    }

    // ── Cookie Hint ───────────────────────────────────────────
    const cookieHint = document.querySelector('.cookie-hint');
    cookieHint.addEventListener('click', () => {
        cookieHint.classList.toggle('expanded');
    });

    // Footer aktuelles Jahr
    const footerYear = document.getElementById("footer-year");
    footerYear.innerText = new Date().getFullYear();
    

    // ── Shortcut Keys ───────────────────────────────────────────
    document.addEventListener('keydown', function(e){

        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
            return; 
        }

        if (e.key === 's') {
            e.preventDefault();
            window.location.href = "https://ogv-kloppenheim.de/"
        } else if (e.key === 'u') {
            e.preventDefault();
            window.location.href = "https://ogv-kloppenheim.de/ueber-uns/"            
        } else if (e.key === 't') {
            e.preventDefault();
            window.location.href = "https://ogv-kloppenheim.de/termine/"            
        } else if (e.key === 'p') {
            e.preventDefault();
            window.location.href = "https://ogv-kloppenheim.de/presse/"            
        } else if (e.key === 'a') {
            e.preventDefault();
            window.location.href = "https://ogv-kloppenheim.de/aktivitaeten/"            
        } else if (e.key === 'f') {
            e.preventDefault();
            window.location.href = "https://ogv-kloppenheim.de/fallobst/"            
        } else if (e.key === 'k') {
            e.preventDefault();
            window.location.href = "https://ogv-kloppenheim.de/kontakt/"            
        } else if (e.key === 'i') {
            e.preventDefault();
            window.location.href = "https://ogv-kloppenheim.de/impressum/"            
        } else if (e.key === 'd') {
            e.preventDefault();
            window.location.href = "https://ogv-kloppenheim.de/datenschutz/"            
        } else if (e.key === 'h') {
            e.preventDefault();
            window.location.href = "https://ogv-kloppenheim.de/ueber-uns/historie/"            
        } else if (e.key === 'm') {
            e.preventDefault();
            window.location.href = "https://ogv-kloppenheim.de/ueber-uns/mitglied-werden/"            
        } else if (e.key === 'r') {
            e.preventDefault();
            window.location.href = "https://ogv-kloppenheim.de/ueber-uns/satzung/"            
        } else if (e.key === 'c') {
            e.preventDefault();
            cookieHint.classList.toggle('expanded');
        }
        
    })
})();
