(function () {
  const doc = document;
  const banner = doc.getElementById("banner");
  const aiLabel = doc.getElementById("ai-label");
  const divBanner = doc.getElementById("div-banner");

  fetch("/data/index_banner.json")
    .then((r) => r.json())
    .then((banners) => {
      if (!banners.length) {
        aiLabel.style.display = "none";
        return;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const valid = banners
        .map((b) => ({
          ...b,
          startTime: b.startDatum
            ? new Date(b.startDatum).setHours(0, 0, 0, 0)
            : -Infinity,
          endTime: new Date(b.datum).setHours(0, 0, 0, 0),
        }))
        .filter(
          (b) =>
            today.getTime() >= b.startTime &&
            today.getTime() <= b.endTime
        )
        .sort((a, b) => a.endTime - b.endTime);

      const nextBanner = valid[0];

      if (nextBanner) {
        const cacheBuster = today.toISOString().slice(0, 10); // z.B. "2026-08-06"
        banner.src = `${nextBanner.file}?v=${cacheBuster}`;
        if (nextBanner.ai) {
          aiLabel.style.display = "flex";
        } else {
          aiLabel.style.display = "none";
        }
      } else {
          divBanner.style.display = "none";
      }
    });
})();