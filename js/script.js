// Drop Down Menu
const btn = document.getElementById("hamburger");
const menu = document.getElementById("nav-menu");

btn.addEventListener("click", () => {
  btn.classList.toggle("open");
  menu.classList.toggle("open");
});

// close menu when a link is clicked
menu.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => {
    btn.classList.remove("open");
    menu.classList.remove("open");
  });
});