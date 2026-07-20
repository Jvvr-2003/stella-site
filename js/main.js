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
//
// Exceção: cards ".project-card--gallery-toggle" (Carrossel/Stories em
// Social Media) não têm capa separada do conteúdo — ao abrir, a capa
// só some (CSS) em vez de crescer, e quem fecha de volta é a primeira
// imagem da própria galeria, não a capa (que já não é clicável).
document.querySelectorAll('.project-category__grid').forEach((grid) => {
  grid.querySelectorAll('.project-card').forEach((card) => {
    const cover = card.querySelector('.project-card__cover');
    if (!cover) return;
    const category = card.closest('.project-category');
    const wrap = card.querySelector('.project-card__gallery-wrap');
    // Cards estáticos (ex.: Estáticos em Social Media) são só uma
    // imagem, sem galeria pra abrir — a capa ainda cresce ao clicar,
    // só que sem a etapa de abrir/fechar galeria em seguida.
    const items = wrap ? card.querySelectorAll('.project-card__gallery-item') : null;
    const isGalleryToggle = card.classList.contains('project-card--gallery-toggle');
    const closeTrigger = isGalleryToggle ? card.querySelector('.project-card__gallery-item--close') : cover;
    let isAnimating = false;

    const flipCover = (expand, onDone) => {
      // Flipar .project-card E .project-card__cover juntos — não só o
      // card. O card muda de largura (grid-column via :has()) e a capa
      // muda de proporção (aspect-ratio 1:1 → 16:9) ao mesmo tempo, de
      // forma independente. Flipar só o pai faz o Flip tentar "esticar"
      // a capa via transform herdado pra compensar as duas mudanças de
      // uma vez só, e por um instante ela passa por um tamanho errado
      // (larga como antes, mas quadrada) antes de encolher de verdade.
      // Cada elemento precisa da sua própria medição antes/depois.
      if (!expand) {
        category.style.position = 'relative';
        category.style.zIndex = '5';
      }
      const state = Flip.getState(grid.querySelectorAll('.project-card, .project-card__cover'));
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

    const finish = () => {
      isAnimating = false;
      cover.classList.remove('is-animating');
    };

    const open = () => {
      if (isAnimating) return;
      isAnimating = true;
      cover.classList.add('is-animating');
      if (!wrap) {
        // Sem galeria: só cresce a capa.
        flipCover(true, finish);
      } else {
        flipCover(true, () => { openGallery(); finish(); });
      }
    };

    const close = () => {
      if (isAnimating) return;
      isAnimating = true;
      cover.classList.add('is-animating');
      if (!wrap) {
        flipCover(false, finish);
      } else {
        closeGallery(() => flipCover(false, finish));
      }
    };

    cover.addEventListener('click', () => {
      const isOpen = cover.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        // Em cards gallery-toggle a capa some ao abrir (display:none),
        // então esse clique nunca chega a acontecer nesse estado — mas
        // mantém a guarda por segurança/consistência.
        if (!isGalleryToggle) close();
      } else {
        open();
      }
    });

    if (closeTrigger && closeTrigger !== cover) {
      closeTrigger.addEventListener('click', close);
    }
  });
});
