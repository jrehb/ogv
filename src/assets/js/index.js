(function () {
  const doc = document;
  const banner = doc.getElementById("banner");

  fetch("/data/index_banner.json")
    .then((r) => r.json())
    .then((banners) => {
      if (!banners.length) {
        return;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const valid = banners
        .map((b) => ({
          ...b,
          time: new Date(b.datum).setHours(0, 0, 0, 0),
        }))
        .filter((b) => b.time >= today.getTime())
        .sort((a, b) => a.time - b.time);

      const nextBanner = valid[0];

      if (nextBanner) {
        banner.src = nextBanner.file;
      }
    });
})();
