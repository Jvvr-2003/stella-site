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
    const category = cover.closest('.project-category');
    const wrap = card.querySelector('.project-card__gallery-wrap');
    const items = card.querySelectorAll('.project-card__gallery-item');
    let isAnimating = false;

    const flipCover = (expand, onDone) => {
      // Flipar o .project-card (não só a capa): é o card que muda de
      // tamanho/posição no grid (grid-column via :has()), e a capa
      // precisa animar junto com ele, não contra uma referência que
      // está se movendo ao mesmo tempo.
      //
      // Ao encolher, o layout já fica pequeno instantaneamente (o que
      // empurra "Email Marketing" etc. pra posição final na hora), mas
      // a capa ainda pinta grande enquanto anima de volta. z-index no
      // card sozinho não resolve — "Email Marketing" é uma categoria
      // irmã de "Books Imobiliários", não do card, então o empilhamento
      // é disputado nesse nível. Sobe o z-index da categoria inteira.
      if (!expand) {
        category.style.position = 'relative';
        category.style.zIndex = '5';
      }
      const state = Flip.getState(grid.querySelectorAll('.project-card'));
      cover.setAttribute('aria-expanded', String(expand));
      Flip.from(state, {
        duration: 0.5,
        ease: 'power2.inOut',
        onComplete: () => {
          if (!expand) {
            category.style.position = '';
            category.style.zIndex = '';
          }
          if (onDone) onDone();
        },
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
      // Ignora cliques repetidos enquanto a sequência de abrir/fechar
      // ainda está rodando — clicar de novo no meio da transição podia
      // sobrepor duas animações e dar a impressão de "crescer de novo".
      if (isAnimating) return;
      isAnimating = true;
      cover.classList.add('is-animating');

      const finish = () => {
        isAnimating = false;
        cover.classList.remove('is-animating');
      };

      const isOpen = cover.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeGallery(() => flipCover(false, finish));
      } else {
        flipCover(true, () => { openGallery(); finish(); });
      }
    });
  });
});
