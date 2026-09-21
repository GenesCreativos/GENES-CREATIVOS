(function loadSheetContent() {
  if (document.querySelector('script[data-genes-sheet]')) return;
  const script = document.createElement('script');
  script.dataset.genesSheet = 'true';
  script.src = new URL('sheet-sync.js', document.currentScript.src).href;
  document.head.appendChild(script);
})();

(function () {
  const style = document.createElement('style');
  style.textContent = `
    .parallax-section{position:relative;isolation:isolate;overflow:hidden}
    .parallax-orb{position:absolute;z-index:-1;width:34vw;height:34vw;min-width:280px;min-height:280px;border-radius:50%;right:-12vw;top:calc(20% + var(--parallax-y,0px));pointer-events:none;opacity:.16;filter:blur(18px);background:radial-gradient(circle at 35% 35%,var(--lime,#b7ff3c),transparent 24%),radial-gradient(circle at 62% 58%,var(--cyan,#36e5ff),transparent 34%);transform:rotate(var(--parallax-rotate,0deg)) scale(var(--parallax-scale,1));transition:opacity .5s ease;will-change:transform,top}
    .parallax-section:nth-of-type(even) .parallax-orb{right:auto;left:-12vw;background:radial-gradient(circle at 38% 35%,var(--violet,#9e6cff),transparent 28%),radial-gradient(circle at 65% 62%,var(--orange,#ff6b2c),transparent 34%)}
    .motion-item{transition:opacity .8s cubic-bezier(.2,.7,.2,1) var(--delay,0ms),transform .8s cubic-bezier(.2,.7,.2,1) var(--delay,0ms)!important}
    .parallax-section:not(.motion-visible) .motion-item{opacity:.18;transform:translate3d(0,42px,0) scale(.975)}
    .parallax-section.motion-visible .motion-item{opacity:1}
    @media(pointer:fine){html,body,a,button,label{cursor:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 36 36'%3E%3Cpath d='M18 3a10 10 0 0 0-6 18c1.7 1.3 2.4 2.7 2.6 4h6.8c.2-1.3.9-2.7 2.6-4A10 10 0 0 0 18 3Z' fill='%23b7ff3c' stroke='%23050507' stroke-width='2'/%3E%3Cpath d='M14.5 28h7M15.5 31h5' stroke='%23f7f7f4' stroke-width='2.2' stroke-linecap='round'/%3E%3Cpath d='M18 0v2M5 7l2 1M31 7l-2 1M2 18h3M31 18h3' stroke='%239e6cff' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E") 18 4,auto}}
    @media(max-width:850px){.parallax-orb{opacity:.11}.parallax-section:not(.motion-visible) .motion-item{transform:translate3d(0,24px,0)}}
    @media(prefers-reduced-motion:reduce){.parallax-orb{display:none}.motion-item{opacity:1!important;transform:none!important}}
  `;
  document.head.appendChild(style);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.title = document.title.replaceAll('Genesis Creativos', 'Genes Creativos');
  document.querySelectorAll('meta[name="description"]').forEach((meta) => {
    meta.content = meta.content.replaceAll('Genesis Creativos', 'Genes Creativos');
  });
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => {
    node.nodeValue = node.nodeValue.replaceAll('GENESIS CREATIVOS', 'GENES CREATIVOS').replaceAll('Genesis Creativos', 'Genes Creativos').replaceAll('Genesis', 'Genes');
  });
  document.querySelectorAll('a[href*="wa.me"]').forEach((link) => {
    link.href = link.href.replaceAll('Genesis%20Creativos', 'Genes%20Creativos');
  });
  const sections = [...document.querySelectorAll('main section')];
  sections.forEach((section, sectionIndex) => {
    section.classList.add('parallax-section');
    section.style.setProperty('--section-index', sectionIndex);
    const layer = document.createElement('span');
    layer.className = 'parallax-orb';
    layer.setAttribute('aria-hidden', 'true');
    section.prepend(layer);
    [...section.querySelectorAll('article, .world, .phase, .panel, .chapter, .value, .map, .head, .portal-head')]
      .forEach((item, itemIndex) => {
        item.classList.add('motion-item');
        item.style.setProperty('--delay', Math.min(itemIndex * 70, 420) + 'ms');
      });
  });
  if (reduce) return;
  const visible = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.target.classList.toggle('motion-visible', entry.isIntersecting));
  }, { threshold: 0.12 });
  sections.forEach((section) => visible.observe(section));
  let ticking = false;
  const move = () => {
    const vh = innerHeight;
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.bottom < -vh * .25 || rect.top > vh * 1.25) return;
      const progress = (vh - rect.top) / (vh + rect.height);
      const centered = progress - .5;
      section.style.setProperty('--parallax-y', (centered * 150).toFixed(2) + 'px');
      section.style.setProperty('--parallax-rotate', (centered * 7).toFixed(2) + 'deg');
      section.style.setProperty('--parallax-scale', (1 + Math.abs(centered) * .035).toFixed(3));
    });
    ticking = false;
  };
  addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(move);
      ticking = true;
    }
  }, { passive: true });
  addEventListener('resize', move, { passive: true });
  move();
})();
