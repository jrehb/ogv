(function () {

    const hamburger = document.getElementById('hamburger');
    const navMenu   = document.getElementById('nav-menu');
    const isMobile  = () => window.innerWidth <= 800;

    // ── Hamburger ─────────────────────────────────────────────────
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navMenu.classList.toggle('open');

        if (!navMenu.classList.contains('open')) {
            closeAllDropdowns();
        }
    });

    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            closeAllDropdowns();
            hamburger.classList.remove('open');
            navMenu.classList.remove('open');
        }
    });

    // ── Hilfsfunktionen ───────────────────────────────────────────

    function closeAllDropdowns() {
        document.querySelectorAll('.nav-dropdown.open').forEach((item) => {
            const menu = item.querySelector('.nav-dropdown-menu');
            menu.style.height = '0';
            item.classList.remove('open');
            item.querySelector('.nav-dropdown-toggle')
                .setAttribute('aria-expanded', 'false');
        });
    }

    function expandMenu(menu) {
        // Transition kurz aus, auf auto messen, dann animieren
        menu.style.transition = 'none';
        menu.style.height = 'auto';
        const fullHeight = menu.getBoundingClientRect().height + 'px';
        menu.style.height = '0';

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                menu.style.transition = 'height 0.3s ease';
                menu.style.height = fullHeight;
            });
        });

        menu.addEventListener('transitionend', () => {
            menu.style.height = 'auto';
        }, { once: true });
    }

    function collapseMenu(menu) {
        menu.style.transition = 'none';
        const currentHeight = menu.getBoundingClientRect().height + 'px';
        menu.style.height = currentHeight;

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                menu.style.transition = 'height 0.3s ease';
                menu.style.height = '0';
            });
        });
    }

    // ── Dropdown-Toggle ───────────────────────────────────────────
    document.querySelectorAll('.nav-dropdown-toggle').forEach((btn) => {
        btn.addEventListener('click', () => {
            if (!isMobile()) return; // Desktop läuft per CSS :hover

            const item = btn.closest('.nav-dropdown');
            const menu = item.querySelector('.nav-dropdown-menu');
            const isOpen = item.classList.contains('open');

            if (isOpen) {
                collapseMenu(menu);
                item.classList.remove('open');
                btn.setAttribute('aria-expanded', 'false');
            } else {
                item.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
                expandMenu(menu);
            }
        });
    });

})();