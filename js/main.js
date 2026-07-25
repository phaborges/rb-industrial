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

  /* ---------- Gallery drag-to-scroll (desktop mouse) ---------- */
  const galleryScroll = document.getElementById('galleryGrid');
  let isDown = false, dragStartX = 0, dragScrollLeft = 0, dragMoved = false;
  galleryScroll.addEventListener('mousedown', (e) => {
    isDown = true; dragMoved = false;
    galleryScroll.classList.add('dragging');
    dragStartX = e.pageX - galleryScroll.offsetLeft;
    dragScrollLeft = galleryScroll.scrollLeft;
  });
  ['mouseleave', 'mouseup'].forEach(evt => galleryScroll.addEventListener(evt, () => {
    isDown = false;
    galleryScroll.classList.remove('dragging');
  }));
  galleryScroll.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - galleryScroll.offsetLeft;
    const walk = (x - dragStartX) * 1.4;
    if (Math.abs(walk) > 5) dragMoved = true;
    galleryScroll.scrollLeft = dragScrollLeft - walk;
  });

  /* ---------- Gallery filter ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      galleryItems.forEach(item => {
        const match = filter === 'all' || item.getAttribute('data-cat') === filter;
        item.classList.toggle('hide', !match);
      });
    });
  });

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCap = document.getElementById('lbCap');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  const galleryList = Array.from(galleryItems);
  let currentIndex = 0;

  const visibleItems = () => galleryList.filter(i => !i.classList.contains('hide'));

  const openLightbox = (item) => {
    const list = visibleItems();
    currentIndex = list.indexOf(item);
    updateLightbox(list);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const updateLightbox = (list) => {
    const item = list[currentIndex];
    const img = item.querySelector('img');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    const title = item.querySelector('.title')?.textContent || '';
    const tag = item.querySelector('.tag')?.textContent || '';
    lbCap.textContent = tag ? `${tag} — ${title}` : title;
  };
  galleryItems.forEach(item => item.addEventListener('click', (e) => {
    if (dragMoved) { e.preventDefault(); e.stopPropagation(); return; }
    openLightbox(item);
  }));
  lbClose.addEventListener('click', () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  });
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lbClose.click(); });
  lbPrev.addEventListener('click', () => {
    const list = visibleItems();
    currentIndex = (currentIndex - 1 + list.length) % list.length;
    updateLightbox(list);
  });
  lbNext.addEventListener('click', () => {
    const list = visibleItems();
    currentIndex = (currentIndex + 1) % list.length;
    updateLightbox(list);
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
