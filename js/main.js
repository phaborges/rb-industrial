document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
    fabTop.classList.toggle('show', window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile nav ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const closeMenu = () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
    header.classList.remove('menu-open');
    document.body.style.overflow = '';
  };
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
    header.classList.toggle('menu-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  /* ---------- Active link on scroll ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navA = document.querySelectorAll('.nav-links a[href^="#"]');
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navA.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => spy.observe(s));

  /* ---------- Reveal on scroll ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ---------- Counters ---------- */
  const counters = document.querySelectorAll('.counter');
  const runCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1600;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  /* ---------- Lightbox ---------- */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCap = document.getElementById('lbCap');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  const galleryList = Array.from(galleryItems);
  let flatList = [];
  let currentPos = 0;

  const itemImages = (item) => {
    const raw = item.getAttribute('data-images');
    if (raw) return raw.split('|');
    return [item.querySelector('img').src];
  };

  const buildFlatList = () => {
    const list = [];
    galleryList.forEach(item => {
      const imgs = itemImages(item);
      imgs.forEach((src, i) => list.push({ src, item, subIndex: i, subTotal: imgs.length }));
    });
    return list;
  };

  const renderLightbox = () => {
    const entry = flatList[currentPos];
    const title = entry.item.querySelector('.title')?.textContent || '';
    const tag = entry.item.querySelector('.tag')?.textContent || '';
    lbImg.src = entry.src;
    lbImg.alt = title;
    let cap = tag ? `${tag} — ${title}` : title;
    if (entry.subTotal > 1) cap += ` · foto ${entry.subIndex + 1}/${entry.subTotal}`;
    lbCap.textContent = cap;
  };

  const openLightbox = (item) => {
    flatList = buildFlatList();
    currentPos = flatList.findIndex(e => e.item === item);
    renderLightbox();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  galleryItems.forEach(item => item.addEventListener('click', () => openLightbox(item)));
  lbClose.addEventListener('click', () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  });
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lbClose.click(); });
  lbPrev.addEventListener('click', () => {
    currentPos = (currentPos - 1 + flatList.length) % flatList.length;
    renderLightbox();
  });
  lbNext.addEventListener('click', () => {
    currentPos = (currentPos + 1) % flatList.length;
    renderLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') lbClose.click();
    if (e.key === 'ArrowLeft') lbPrev.click();
    if (e.key === 'ArrowRight') lbNext.click();
  });

  /* ---------- Contact form -> WhatsApp ---------- */
  const form = document.getElementById('quoteForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('fName').value.trim();
    const company = document.getElementById('fCompany').value.trim();
    const phone = document.getElementById('fPhone').value.trim();
    const service = document.getElementById('fService').value;
    const msg = document.getElementById('fMsg').value.trim();

    let text = `Olá! Meu nome é ${name}`;
    if (company) text += ` (${company})`;
    text += `. Tenho interesse em: ${service}. `;
    text += `Telefone para contato: ${phone}. `;
    text += `Mensagem: ${msg}`;

    const url = `https://wa.me/5531993286902?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  });

  /* ---------- Back to top ---------- */
  const fabTop = document.getElementById('fabTop');
  fabTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

});
