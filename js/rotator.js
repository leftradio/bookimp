(function() {
  const slider = document.querySelector('.hero-shot-slider');
  if (!slider) return;

  const imageCandidates = [
    'assets/screenshot-1.png',
    'assets/screenshot-2.png',
    'assets/screenshot-3.png',
    'assets/about-screenshot-1.png',
    'assets/about-screenshot-2.png',
    'assets/about-screenshot-3.png',

    // Android screenshots: add these files to assets/ and they will be
    // included in the same rotator automatically.
    // 'assets/android-screenshot-1.png',
    // 'assets/android-screenshot-2.png',
    // 'assets/android-screenshot-3.png'
  ];

  const imgEls = Array.from(slider.querySelectorAll('.hero-shot-img'));
  if (imgEls.length < 2) return;

  function loadImage(src) {
    return new Promise((resolve) => {
      const i = new Image();
      i.onload = () => resolve(src);
      i.onerror = () => resolve(null);
      i.src = src;
    });
  }

  Promise.all(imageCandidates.map(loadImage)).then((loaded) => {
    const images = loaded.filter(Boolean);
    if (images.length < 2) return;

    imgEls[0].src = images[0];
    imgEls[1].src = images[1];
    imgEls[0].classList.add('is-visible');
    imgEls[1].classList.remove('is-visible');

    let idx = 0;
    let showingFirst = true;

    function next() {
      idx = (idx + 1) % images.length;

      const current = showingFirst ? imgEls[0] : imgEls[1];
      const nextImg  = showingFirst ? imgEls[1] : imgEls[0];

      nextImg.src = images[idx];

      current.classList.remove('is-visible');
      nextImg.classList.add('is-visible');

      showingFirst = !showingFirst;
    }

    setInterval(next, 3500);
  });
})();
