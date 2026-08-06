document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById('siteHeader');
  const fabTop = document.getElementById('fabTop');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
    if (fabTop) fabTop.classList.toggle('show', window.scrollY > 500);
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

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCap = document.getElementById('lbCap');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  let flatList = [];
  let currentPos = 0;

  const itemImages = (item) => {
    const raw = item.getAttribute('data-images');
    if (raw) return raw.split('|');
    return [item.querySelector('img').src];
  };

  const buildFlatList = () => {
    const list = [];
    galleryItems.forEach(item => {
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

  galleryItems.forEach(item => item.addEventListener('click', () => {
    flatList = buildFlatList();
    currentPos = flatList.findIndex(e => e.item === item);
    renderLightbox();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }));
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

  /* ---------- Back to top ---------- */
  if (fabTop) fabTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

});
