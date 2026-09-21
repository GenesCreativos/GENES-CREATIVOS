(function () {
  'use strict';

  const SHEET_ID = '1fSN5bKFz-tC3AxLItB7uYDhsjNa1qGlo3ekUDpddU-I';
  const SCRIPT_BASE = new URL('.', document.currentScript.src);
  const DEFAULT_LOGO = new URL('logo-genes-creativos.svg', SCRIPT_BASE).href;
  const TABS = ['Configuracion', 'Banners', 'Productos', 'Servicios', 'Paginas', 'Testimonios', 'Redes_y_contacto', 'Cobertura'];
  const state = {};

  const clean = (value) => value == null ? '' : String(value).trim();
  const yes = (value) => clean(value).toLowerCase() === 'sí' || clean(value).toLowerCase() === 'si';
  const esc = (value) => clean(value).replace(/[&<>'"]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const split = (value) => clean(value).split('|').map((item) => item.trim()).filter(Boolean);
  const validImage = (value) => value && !/PEGAR_|EJEMPLO/i.test(value);

  function driveImage(value) {
    const url = clean(value);
    if (!validImage(url)) return '';
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    return match ? `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1600` : url;
  }

  function loadTab(tab, index) {
    return new Promise((resolve, reject) => {
      const callback = `__genesSheet${index}`;
      const script = document.createElement('script');
      const timer = setTimeout(() => { cleanup(); reject(new Error(`Tiempo agotado: ${tab}`)); }, 9000);
      const cleanup = () => { clearTimeout(timer); delete window[callback]; script.remove(); };
      window[callback] = (response) => {
        try {
          if (!response || response.status !== 'ok') throw new Error(`No disponible: ${tab}`);
          const rows = (response.table.rows || []).map((row) => (row.c || []).map((cell) => cell ? (cell.v ?? '') : ''));
          const headerIndex = rows.findIndex((row) => clean(row[0]).toLowerCase() === 'id');
          if (headerIndex < 0) throw new Error(`Encabezados no encontrados: ${tab}`);
          const headers = rows[headerIndex].map(clean);
          const records = rows.slice(headerIndex + 1).filter((row) => clean(row[0])).map((row) => {
            const record = {};
            headers.forEach((header, i) => { if (header) record[header] = row[i] ?? ''; });
            return record;
          });
          cleanup(); resolve(records);
        } catch (error) { cleanup(); reject(error); }
      };
      script.onerror = () => { cleanup(); reject(new Error(`No se pudo cargar: ${tab}`)); };
      const tqx = `out:json;responseHandler:${callback}`;
      script.src = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${encodeURIComponent(tab)}&headers=0&tqx=${encodeURIComponent(tqx)}&t=${Date.now()}`;
      document.head.appendChild(script);
    });
  }

  function configMap() {
    return Object.fromEntries((state.Configuracion || []).filter((r) => yes(r.Activo)).map((r) => [clean(r.Campo), r.Valor]));
  }

  function currentPage() {
    const path = location.pathname.replace(/\/+$/, '');
    if (path.endsWith('/moda')) return 'Moda';
    if (path.endsWith('/digital')) return 'Digital';
    if (path.endsWith('/branding')) return 'Branding';
    if (path.endsWith('/quienes-somos')) return 'Quiénes somos';
    if (path.endsWith('/mision-vision')) return 'Misión y visión';
    return 'Inicio';
  }

  function setBrand(config) {
    const name = clean(config.nombre_marca) || 'Genes Creativos';
    const initial = name.charAt(0).toUpperCase();
    const logo = driveImage(config.logo_url) || DEFAULT_LOGO;
    const showName = config.mostrar_nombre_marca ? yes(config.mostrar_nombre_marca) : false;
    document.querySelectorAll('.brand').forEach((el) => {
      const logoOnDark = Boolean(el.closest('footer')) || !['Branding', 'Quiénes somos'].includes(currentPage());
      el.innerHTML = logo
        ? `<img class="brand-logo${logoOnDark ? ' brand-logo-light' : ''}" src="${esc(logo)}" alt="${esc(config.logo_alt || name)}">${showName ? `<span class="brand-name">${esc(name.toUpperCase())}</span>` : ''}`
        : `<span class="mark">${esc(initial)}</span>${showName ? ` <span class="brand-name">${esc(name.toUpperCase())}</span>` : ''}`;
    });
    if (config.titulo_web) document.title = clean(config.titulo_web);
    const meta = document.querySelector('meta[name="description"]');
    if (meta && config.descripcion_web) meta.content = clean(config.descripcion_web);
    const favicon = driveImage(config.favicon_url || config.logo_url) || DEFAULT_LOGO;
    if (favicon) {
      let link = document.querySelector('link[rel="icon"]');
      if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
      link.href = favicon;
    }
    const root = document.documentElement;
    if (config.color_principal) root.style.setProperty('--lime', clean(config.color_principal));
    if (config.color_secundario) root.style.setProperty('--cyan', clean(config.color_secundario));
    if (config.color_terciario) root.style.setProperty('--violet', clean(config.color_terciario));
  }

  function setFancyTitle(element, title, page) {
    if (!element || !title) return;
    const words = clean(title).split(/\s+/);
    const tailSize = page === 'Digital' || page === 'Branding' ? 2 : 1;
    const cut = Math.max(1, words.length - tailSize);
    const first = words.slice(0, cut).join(' ');
    const last = words.slice(cut).join(' ');
    const tag = page === 'Quiénes somos' ? 'em' : 'span';
    element.innerHTML = `${esc(first)} <${tag}>${esc(last)}</${tag}>`;
  }

  function setBanner() {
    const page = currentPage();
    const row = (state.Banners || []).filter((r) => yes(r.Activo) && clean(r['Página']) === page)
      .sort((a, b) => Number(a.Orden || 0) - Number(b.Orden || 0))[0];
    if (!row) return;
    const roots = {Inicio:'.hero', Moda:'.hero', Digital:'.screen', Branding:'.brand-hero', 'Quiénes somos':'.story-hero'};
    const root = document.querySelector(roots[page]);
    if (!root) return;
    setFancyTitle(root.querySelector('h1'), row['Título'], page);
    const description = root.querySelector(page === 'Inicio' ? '.lead' : 'p');
    if (description && row['Subtítulo']) description.textContent = clean(row['Subtítulo']);
    const button = root.querySelector('.primary');
    if (button) {
      if (row['Texto botón']) button.textContent = clean(row['Texto botón']) + ' ↓';
      if (row['Enlace botón']) button.href = clean(row['Enlace botón']);
    }
    const image = driveImage(row['Imagen URL']);
    if (image) {
      const bg = root.querySelector('.hero-bg');
      if (bg) bg.style.backgroundImage = `url("${image.replace(/"/g, '%22')}")`;
      else root.style.backgroundImage = `linear-gradient(rgba(5,5,7,.35),rgba(5,5,7,.35)),url("${image.replace(/"/g, '%22')}")`;
    }
  }

  function pageText(page, section, field) {
    const row = (state.Paginas || []).find((r) => yes(r.Activo) && clean(r['Página']) === page && clean(r['Sección']) === section && clean(r.Campo).toLowerCase() === field.toLowerCase());
    return row ? clean(row.Texto) : '';
  }

  function setPageTexts() {
    const page = currentPage();
    if (page === 'Inicio') {
      const title = pageText('Inicio', 'Cobertura', 'titulo');
      const description = pageText('Inicio', 'Cobertura', 'descripcion');
      const final = pageText('Inicio', 'CTA final', 'titulo');
      if (title) document.querySelector('.coverage h2').textContent = title;
      if (description) document.querySelector('.coverage p').textContent = description;
      if (final) setFancyTitle(document.querySelector('.final h2'), final, 'Inicio');
    }
    if (page === 'Quiénes somos') {
      const title = pageText(page, 'Hero', 'titulo');
      const description = pageText(page, 'Hero', 'descripcion');
      if (title) setFancyTitle(document.querySelector('.story-hero h1'), title, page);
      if (description) document.querySelector('.story-hero p').textContent = description;
    }
    if (page === 'Misión y visión') {
      const mission = pageText(page, 'Misión', 'texto');
      const vision = pageText(page, 'Visión', 'texto');
      const panels = document.querySelectorAll('.purpose .panel p');
      if (mission && panels[0]) panels[0].textContent = mission;
      if (vision && panels[1]) panels[1].textContent = vision;
    }
  }

  function anchorFor(value) {
    const text = clean(value).toLowerCase();
    if (/camis|camisa/.test(text)) return 'camisetas';
    if (/hood|buzo/.test(text)) return 'hoodies';
    if (/jean|pantal/.test(text)) return 'pantalones';
    if (/chaquet/.test(text)) return 'chaquetas';
    if (/gorra/.test(text)) return 'gorras';
    return clean(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-');
  }

  function renderProducts(config) {
    const container = document.querySelector('.products');
    if (!container || currentPage() !== 'Moda') return;
    const products = (state.Productos || []).filter((r) => yes(r.Activo)).sort((a,b) => Number(a.Orden || 0) - Number(b.Orden || 0));
    if (!products.length) return;
    container.innerHTML = products.map((r, index) => {
      const sizes = split(r['Tallas (separadas por |)']);
      const materials = split(r['Materiales (separados por |)']);
      const colors = split(r['Colores (separados por |)']);
      const customization = split(r['Personalización']);
      const image = driveImage(r['Imagen URL']);
      return `<article class="product reveal in" id="${esc(anchorFor(r['Categoría'] || r.Nombre))}" data-code="${String(index + 1).padStart(2,'0')}" data-product="${esc(r.Nombre)}" data-message="${esc(r['Mensaje WhatsApp'])}">
        ${image ? `<img class="product-photo" src="${esc(image)}" alt="${esc(r.Nombre)}" loading="lazy">` : '<span class="icon">◇</span>'}
        <div><h3>${esc(r['Categoría'] || r.Nombre)}</h3><p>${esc(r['Descripción corta'])}</p><div class="materials">${materials.map((v) => `<span class="material">${esc(v)}</span>`).join('')}</div><p class="custom">Personalización: ${esc(customization.join(', '))}.</p>
        <div class="order"><div class="control"><label>Talla</label><select class="size">${sizes.map((v,i) => `<option${i === Math.min(2,sizes.length-1) ? ' selected' : ''}>${esc(v)}</option>`).join('')}</select></div><div class="control"><label>Cantidad</label><input class="qty" type="number" min="${Number(r['Cantidad mínima']) || 1}" value="${Number(r['Cantidad mínima']) || 1}"></div><div class="control"><label>Material</label><select class="fabric">${materials.map((v) => `<option>${esc(v)}</option>`).join('')}</select></div><div class="control"><label>Color</label><select class="color">${colors.map((v) => `<option>${esc(v)}</option>`).join('')}</select></div><button class="wa-order" type="button">Pedir por WhatsApp →</button></div></div></article>`;
    }).join('');
    container.querySelectorAll('.wa-order').forEach((button) => button.addEventListener('click', () => {
      const product = button.closest('.product');
      const message = `${product.dataset.message || 'Hola Genes Creativos, quiero cotizar este pedido.'}\n\nPrenda: ${product.dataset.product}\nTalla: ${product.querySelector('.size').value}\nMaterial: ${product.querySelector('.fabric').value}\nColor: ${product.querySelector('.color').value}\nCantidad: ${product.querySelector('.qty').value}\n\n¿Me pueden confirmar precio y tiempo de entrega?`;
      window.open(`https://wa.me/${clean(config.whatsapp) || '573202417339'}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
    }));
  }

  function renderServices(config) {
    if (currentPage() !== 'Digital') return;
    const container = document.querySelector('.services');
    if (!container) return;
    const rows = (state.Servicios || []).filter((r) => yes(r.Activo) && clean(r['Área']) === 'Digital').sort((a,b) => Number(a.Orden || 0) - Number(b.Orden || 0));
    if (!rows.length) return;
    container.innerHTML = rows.map((r, index) => `<article class="service reveal in"><b>${String(index + 1).padStart(2,'0')}</b><div><h2>${esc(r.Servicio)}</h2><p>${esc(r['Descripción'])}</p></div><a href="https://wa.me/${esc(config.whatsapp || '573202417339')}?text=${encodeURIComponent(clean(r['Mensaje WhatsApp']))}" target="_blank" rel="noopener">${esc(r['Texto botón'] || 'Cotizar')} ↗</a></article>`).join('');
  }

  function setCoverage() {
    const map = document.querySelector('.map');
    if (!map || currentPage() !== 'Inicio') return;
    map.querySelectorAll('.city').forEach((node) => node.remove());
    const rows = (state.Cobertura || []).filter((r) => yes(r.Activo)).sort((a,b) => Number(a['Orden ruta'] || 0) - Number(b['Orden ruta'] || 0));
    rows.forEach((r, index) => {
      const city = document.createElement('span');
      city.className = 'city'; city.dataset.name = clean(r.Ciudad);
      city.style.left = `${Number(r['Posición X']) || 50}%`; city.style.top = `${Number(r['Posición Y']) || 50}%`;
      city.style.animationDelay = `${index * .35}s`; map.appendChild(city);
    });
  }

  function renderTestimonials() {
    const container = document.querySelector('#sheet-testimonials');
    if (!container) return;
    const rows = (state.Testimonios || []).filter((r) => yes(r.Activo));
    const section = container.closest('.testimonials');
    if (!rows.length) { if (section) section.hidden = true; return; }
    if (section) section.hidden = false;
    container.innerHTML = rows.map((r) => `<article class="quote reveal in"><div class="stars">${'★'.repeat(Math.max(1,Math.min(5,Number(r['Calificación 1-5']) || 5)))}</div><p>“${esc(r.Testimonio)}”</p><strong>${esc(r.Nombre)}</strong><small>${esc([r['Empresa o rol'],r.Ciudad].filter(Boolean).join(' · '))}</small></article>`).join('');
  }

  function setContacts(config) {
    const rows = (state.Redes_y_contacto || []).filter((r) => yes(r.Activo));
    const whatsapp = clean((rows.find((r) => clean(r.Tipo) === 'WhatsApp') || {})['URL o dato']) || clean(config.whatsapp) || '573202417339';
    document.querySelectorAll('a[href*="wa.me"]').forEach((link) => {
      const current = new URL(link.href);
      const text = current.searchParams.get('text') || clean(config.mensaje_general_whatsapp) || 'Hola Genes Creativos, quiero información.';
      link.href = `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`;
    });
    const footer = document.querySelector('footer .foot');
    if (footer && !footer.querySelector('.sheet-social')) {
      const links = rows.filter((r) => ['Instagram','Facebook','TikTok','Behance','LinkedIn','Correo'].includes(clean(r.Tipo)));
      if (links.length) {
        const nav = document.createElement('div'); nav.className = 'sheet-social';
        nav.innerHTML = links.map((r) => {
          const type = clean(r.Tipo); const raw = clean(r['URL o dato']);
          const href = type === 'Correo' ? `mailto:${raw}` : raw;
          return `<a href="${esc(href)}"${type === 'Correo' ? '' : ' target="_blank" rel="noopener"'}>${esc(r['Nombre visible'] || type)}</a>`;
        }).join('');
        footer.appendChild(nav);
      }
    }
  }

  function setStats(config) {
    document.querySelectorAll('[data-stat]').forEach((element) => {
      const key = element.dataset.stat; const target = parseInt(String(config[key] || '0').replace(/\D/g,''),10) || 0;
      if (!target) return;
      let start = 0; const duration = 1500; const started = performance.now();
      const frame = (now) => { const progress = Math.min(1,(now-started)/duration); const value = Math.round(target*(1-Math.pow(1-progress,3))); element.textContent = `${value.toLocaleString('es-CO')}${key === 'clientes_satisfechos' || key === 'ciudades_cubiertas' ? '+' : ''}`; if (progress < 1) requestAnimationFrame(frame); };
      requestAnimationFrame(frame);
    });
    const quality = document.querySelector('[data-quality]');
    if (quality && config.calidad_colombiana) quality.textContent = clean(config.calidad_colombiana);
  }

  function ensureHomeSections() {
    if (currentPage() !== 'Inicio') return;
    const hero = document.querySelector('.hero');
    if (hero && !document.querySelector('.sheet-stats')) {
      hero.insertAdjacentHTML('afterend', `<section class="sheet-stats"><div class="wrap sheet-stats-grid reveal in"><div class="sheet-stat"><strong data-stat="clientes_satisfechos">1.000+</strong><span>clientes satisfechos</span></div><div class="sheet-stat"><strong data-stat="ciudades_cubiertas">20+</strong><span>ciudades con cobertura</span></div><div class="sheet-stat"><strong data-quality>100%</strong><span>creatividad colombiana</span></div></div></section>`);
    }
    const final = document.querySelector('.final');
    if (final && !document.querySelector('.testimonials')) {
      final.insertAdjacentHTML('beforebegin', `<section class="testimonials" hidden><div class="wrap"><span class="tag" style="color:#6b48e8">Clientes reales</span><h2>Lo que dicen de nuestro trabajo.</h2><div class="quotes" id="sheet-testimonials"></div></div></section>`);
    }
  }

  function addRuntimeStyles() {
    const style = document.createElement('style');
    style.textContent = `.brand-logo{width:128px;height:58px;object-fit:contain;display:block}.brand-name{white-space:nowrap}.product-photo{width:100%;height:240px;object-fit:cover;border-radius:18px;margin-bottom:18px;background:#ededeb}.sheet-social{display:flex;flex-wrap:wrap;gap:14px;font-size:.82rem}.sheet-social a:hover{color:var(--lime,#b7ff3c)}.sheet-stats{padding:28px 0 65px;background:#050507}.sheet-stats-grid{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid var(--line);border-radius:26px;overflow:hidden}.sheet-stat{padding:34px;border-right:1px solid var(--line);background:linear-gradient(145deg,rgba(183,255,60,.08),transparent)}.sheet-stat:last-child{border:0}.sheet-stat strong{display:block;font:700 clamp(2.8rem,6vw,5rem)/1 "Space Grotesk";letter-spacing:-.06em;color:var(--lime)}.sheet-stat span{color:var(--muted)}.testimonials{padding:110px 0;background:#f2f0ea;color:#09090c}.testimonials h2{font:700 clamp(2.8rem,6vw,5.5rem)/.9 "Space Grotesk";letter-spacing:-.06em;margin:16px 0 45px}.quotes{display:grid;grid-template-columns:repeat(3,1fr);gap:15px}.quote{min-height:300px;padding:30px;border:1px solid #d4d2ca;border-radius:24px;background:#fff;display:flex;flex-direction:column}.quote .stars{color:#6b48e8;letter-spacing:.16em}.quote p{font-size:1.08rem;line-height:1.65;flex:1}.quote small{color:#666}.final h2 span{color:var(--lime)}@media(max-width:850px){.quotes,.sheet-stats-grid{grid-template-columns:1fr}.sheet-stat{border-right:0;border-bottom:1px solid var(--line)}}@media(max-width:520px){.brand-logo{width:102px;height:48px}.product-photo{height:200px}}`;
    style.textContent += `.brand-logo-light{filter:invert(1)}`;
    document.head.appendChild(style);
  }

  addRuntimeStyles();
  setBrand({nombre_marca:'Genes Creativos'});

  Promise.allSettled(TABS.map(loadTab)).then((results) => {
    results.forEach((result, index) => { if (result.status === 'fulfilled') state[TABS[index]] = result.value; });
    if (!Object.keys(state).length) return;
    window.GenesSheetData = state;
    const config = configMap();
    ensureHomeSections(); setBrand(config); setBanner(); setPageTexts(); renderProducts(config); renderServices(config); setCoverage(); renderTestimonials(); setContacts(config); setStats(config);
    document.documentElement.dataset.sheetConnected = 'true';
  });
})();
