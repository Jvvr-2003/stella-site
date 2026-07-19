gsap.registerPlugin(ScrollTrigger, Flip);

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

// Card de projeto compactado por padrão; clicar na capa faz o card
// crescer (Flip anima a transição de tamanho/posição de todas as capas
// da mesma categoria, já que elas reorganizam ao redor da que abriu) e
// abre a galeria (acordeão em CSS via aria-expanded). As imagens da
// galeria entram com um leve fade + stagger depois que o espaço abre.
document.querySelectorAll('.project-category__grid').forEach((grid) => {
  grid.querySelectorAll('.project-card__cover').forEach((cover) => {
    cover.addEventListener('click', () => {
      const card = cover.closest('.project-card');
      const isOpen = cover.getAttribute('aria-expanded') === 'true';

      const state = Flip.getState(grid.querySelectorAll('.project-card__cover'));

      cover.setAttribute('aria-expanded', String(!isOpen));

      Flip.from(state, {
        duration: 0.6,
        ease: 'power2.inOut',
        absolute: true,
      });

      if (!isOpen) {
        const items = card.querySelectorAll('.project-card__gallery-item');
        gsap.fromTo(
          items,
          { opacity: 0, y: 16, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.04,
            delay: 0.3,
            ease: 'power2.out',
          }
        );
      }
    });
  });
});
