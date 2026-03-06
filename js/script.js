// load navbar
async function loadComponent(url, containerId) {
  const response = await fetch(url);
  let data = await response.text();
  // Live-Server Injection entfernen (Kommentar + Script-Tag)
  data = data.replace(/<!--.*?-->/gs, "");
  data = data.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  const container = document.getElementById(containerId);
  container.innerHTML = data;
}

loadComponent("/components/nav.html", "nav-container").then(() => {
  const btn = document.getElementById("hamburger");
  const menu = document.getElementById("nav-menu");
  btn.addEventListener("click", () => {
    btn.classList.toggle("open");
    menu.classList.toggle("open");
  });
  menu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      btn.classList.remove("open");
      menu.classList.remove("open");
    });
  });
});

loadComponent("/components/social-media.html", "social-media-container");
loadComponent("/components/footer.html", "footer-container");