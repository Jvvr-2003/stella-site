gsap.registerPlugin(ScrollTrigger);

// Fade-up reveal para todo elemento marcado com data-reveal,
// disparado ao entrar no viewport (padrão observado nos dois sites de referência).
document.querySelectorAll('[data-reveal]').forEach((el, i) => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
      once: true,
    },
  });
});

// Nav e hero entram assim que a página carrega, sem esperar scroll.
gsap.to('.nav[data-reveal]', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.1 });
document.querySelectorAll('.hero [data-reveal]').forEach((el, i) => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 0.9,
    ease: 'power3.out',
    delay: 0.2 + i * 0.12,
  });
});

// Leve parallax nas imagens da seção split, como no webstar.studio.
gsap.utils.toArray('.split__tile').forEach((tile) => {
  gsap.to(tile, {
    yPercent: -6,
    ease: 'none',
    scrollTrigger: {
      trigger: tile,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
});
