(function () {
  const slider = document.getElementById('hero-slider');
  const mobileAnchor = document.getElementById('mobile-slider-anchor');
  if (!slider || !mobileAnchor) return;

  const originalParent = slider.parentElement;
  const mq = window.matchMedia('(max-width: 1024px)');

  function move() {
    if (mq.matches) {
      if (slider.parentElement !== mobileAnchor) mobileAnchor.appendChild(slider);
    } else {
      if (slider.parentElement !== originalParent) originalParent.appendChild(slider);
    }
  }

  move();
  mq.addEventListener ? mq.addEventListener('change', move) : mq.addListener(move);
})();
