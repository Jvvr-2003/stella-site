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

// Card de projeto compactado por padrão. Clicar na capa dispara uma
// SEQUÊNCIA (nunca as duas coisas ao mesmo tempo, pra não sobrepor):
//   abrir  → Flip cresce a capa até o fim, só então a galeria abre
//   fechar → a galeria recolhe até o fim, só então a capa encolhe (Flip)
document.querySelectorAll('.project-category__grid').forEach((grid) => {
  grid.querySelectorAll('.project-card__cover').forEach((cover) => {
    const card = cover.closest('.project-card');
    const wrap = card.querySelector('.project-card__gallery-wrap');
    const items = card.querySelectorAll('.project-card__gallery-item');

    const flipCover = (expand, onDone) => {
      const state = Flip.getState(grid.querySelectorAll('.project-card__cover'));
      cover.setAttribute('aria-expanded', String(expand));
      Flip.from(state, {
        duration: 0.5,
        ease: 'power2.inOut',
        absolute: true,
        onComplete: onDone,
      });
    };

    const openGallery = () => {
      gsap.set(items, { opacity: 0, y: 16 });
      const targetHeight = wrap.scrollHeight;
      gsap.fromTo(
        wrap,
        { height: 0 },
        {
          height: targetHeight,
          duration: 0.45,
          ease: 'power2.out',
          onComplete: () => { wrap.style.height = 'auto'; },
        }
      );
      gsap.to(items, { opacity: 1, y: 0, duration: 0.4, stagger: 0.04, delay: 0.1, ease: 'power2.out' });
    };

    const closeGallery = (onDone) => {
      gsap.to(items, { opacity: 0, duration: 0.2, ease: 'power1.out' });
      gsap.to(wrap, {
        height: 0,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: onDone,
      });
    };

    cover.addEventListener('click', () => {
      const isOpen = cover.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeGallery(() => flipCover(false));
      } else {
        flipCover(true, openGallery);
      }
    });
  });
});
