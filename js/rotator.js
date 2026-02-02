(function() {
  const slider = document.querySelector('.hero-shot-slider');
  if (!slider) return;

  const images = [
    'assets/screenshot-1.png',
    'assets/screenshot-2.png',
    'assets/screenshot-3.png'
  ];

  const imgEls = slider.querySelectorAll('.hero-shot-img');
  if (imgEls.length < 2) return;

  // Preload
  images.forEach(src => { const i = new Image(); i.src = src; });

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
})();

