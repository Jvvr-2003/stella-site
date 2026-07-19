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

// Capa do projeto compactada por padrão; clicar nela abre a galeria
// (acordeão em CSS via aria-expanded, ver .project__gallery-wrap).
document.querySelectorAll('.project__cover').forEach((cover) => {
  const hintText = cover.querySelector('.project__cover-hint-text');
  cover.addEventListener('click', () => {
    const isOpen = cover.getAttribute('aria-expanded') === 'true';
    cover.setAttribute('aria-expanded', String(!isOpen));
    if (hintText) hintText.textContent = isOpen ? 'Ver projeto' : 'Fechar';
  });
});
