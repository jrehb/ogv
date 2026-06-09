  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".main-carousel").forEach(function (mainElement) {
      const galleryId = mainElement.dataset.gallery;

      const thumbElement = document.querySelector('.thumbnail-carousel[data-gallery="' + galleryId + '"]');

      if (!thumbElement) {
        return;
      }

      const thumbnails = new Splide(thumbElement, {
        fixedWidth: 100,
        fixedHeight: 60,
        gap: 10,
        rewind: true,
        pagination: false,
        isNavigation: true,
        lazyLoad : 'nearby'
      });

      const main = new Splide(mainElement, {
        type: "loop",
        rewind: true,
        autoplay : true,
        pagination: true,
        lazyLoad : 'nearby'
      });

      main.sync(thumbnails);

      thumbnails.mount();
      main.mount();
    });
  });