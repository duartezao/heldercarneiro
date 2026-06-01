/**
 * Ryu — main.js
 * Smooth scroll (Lenis) + animações de scroll (GSAP / ScrollTrigger) + UI handlers.
 *
 * Reveals:    .reveal | [data-anim="fade-up|fade|fade-down|fade-left|fade-right|scale-in"]
 * Stagger:    [data-stagger]   → anima os filhos diretos com stagger
 * Parallax:   [data-parallax="8"]  (% do movimento, 4–14 fica natural)
 * Counter:    [data-counter="120" data-counter-suffix="+"]
 *
 * API global:
 *   window.RyuAnim.refresh()        → reanaliza o DOM (após injetar conteúdo)
 *   window.RyuAnim.animate(root)    → corre os reveals dentro de root
 *   window.RyuAnim.lenis            → instância Lenis (ou null)
 */

let siteLenis = null;

const RyuAnim = {
  lenis: null,
  refresh() {
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    if (siteLenis && typeof siteLenis.resize === 'function') siteLenis.resize();
  },
  animate(_root) {
    /* substituído após initScrollSystem() */
  },
};
window.RyuAnim = RyuAnim;

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* ------------------------------------------------------------------ *
 *  Smooth Scroll (Lenis)                                             *
 * ------------------------------------------------------------------ */
function initLenis(gsap, ScrollTrigger) {
  if (typeof window.Lenis !== 'function') return null;
  const reduced = prefersReducedMotion();

  const lenis = new window.Lenis({
    lerp: reduced ? 0.2 : 0.1,
    duration: reduced ? 0.6 : 1.15,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.2,
    syncTouch: false,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });

  lenis.on('scroll', () => ScrollTrigger.update());
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  document.documentElement.classList.add('lenis-active');
  siteLenis = lenis;
  RyuAnim.lenis = lenis;
  return lenis;
}

/* ------------------------------------------------------------------ *
 *  Hero / parallax dos heroes principais                             *
 * ------------------------------------------------------------------ */
function setupHeroIntro(gsap) {
  /* Hero: vídeo em contain — sem parallax que cortava o enquadramento */

  document.querySelectorAll('.about-hero, .contact-hero').forEach((hero) => {
    const img = hero.querySelector('img');
    if (!img) return;
    gsap.fromTo(
      img,
      { scale: 1.08 },
      {
        scale: 1,
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.1,
        },
      }
    );
  });
}

/* ------------------------------------------------------------------ *
 *  Reveals — .reveal e [data-anim]                                   *
 * ------------------------------------------------------------------ */
const ANIM_PRESETS = {
  'fade-up':    { from: { autoAlpha: 0, y: 50 } },
  'fade-down':  { from: { autoAlpha: 0, y: -50 } },
  'fade-left':  { from: { autoAlpha: 0, x: -60 } },
  'fade-right': { from: { autoAlpha: 0, x: 60 } },
  'scale-in':   { from: { autoAlpha: 0, scale: 0.92 } },
  'fade':       { from: { autoAlpha: 0 } },
};

function getElementPreset(el) {
  const variant = el.dataset.anim || 'fade-up';
  return ANIM_PRESETS[variant] || ANIM_PRESETS['fade-up'];
}

function setupReveals(gsap, ScrollTrigger, root) {
  const scope = root || document;
  const elements = scope.querySelectorAll('.reveal, [data-anim]');
  if (!elements.length) return;

  elements.forEach((el) => {
    if (el.dataset.revealInit === '1') return;
    el.dataset.revealInit = '1';
    const { from } = getElementPreset(el);
    const delay = parseFloat(el.dataset.animDelay) || 0;
    gsap.fromTo(el, from, {
      autoAlpha: 1,
      x: 0,
      y: 0,
      scale: 1,
      duration: 1.05,
      ease: 'power3.out',
      delay,
      overwrite: 'auto',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
  });
}

/* ------------------------------------------------------------------ *
 *  Stagger groups — [data-stagger] anima filhos diretos              *
 * ------------------------------------------------------------------ */
function setupStaggerGroups(gsap) {
  gsap.utils.toArray('[data-stagger]:not(.is-stagger-ready)').forEach((parent) => {
    parent.classList.add('is-stagger-ready');
    const items = parent.children;
    if (!items.length) return;
    gsap.set(items, { autoAlpha: 0, y: 30 });
    gsap.to(items, {
      autoAlpha: 1,
      y: 0,
      duration: 0.95,
      ease: 'power3.out',
      stagger: parseFloat(parent.dataset.staggerStep) || 0.09,
      scrollTrigger: { trigger: parent, start: 'top 88%', once: true },
    });
  });
}

/* ------------------------------------------------------------------ *
 *  Parallax — [data-parallax="amount"]                               *
 * ------------------------------------------------------------------ */
function setupParallax(gsap) {
  gsap.utils.toArray('[data-parallax]:not(.is-parallax-ready)').forEach((el) => {
    el.classList.add('is-parallax-ready');
    const amount = parseFloat(el.dataset.parallax) || 8;
    gsap.fromTo(
      el,
      { yPercent: -amount / 2 },
      {
        yPercent: amount / 2,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement || el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );
  });
}

/* ------------------------------------------------------------------ *
 *  Counters — [data-counter="120" data-counter-suffix="+"]           *
 * ------------------------------------------------------------------ */
function setupCounters(gsap, ScrollTrigger) {
  gsap.utils.toArray('[data-counter]:not(.is-counter-ready)').forEach((el) => {
    el.classList.add('is-counter-ready');
    const target = parseFloat(el.dataset.counter);
    if (Number.isNaN(target)) return;
    const suffix = el.dataset.counterSuffix || '';
    const original = el.textContent;
    ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      once: true,
      onEnter: () => {
        const obj = { v: 0 };
        el.textContent = '0' + suffix;
        gsap.to(obj, {
          v: target,
          duration: 1.8,
          ease: 'power3.out',
          onUpdate: () => {
            el.textContent = Math.round(obj.v) + suffix;
          },
          onComplete: () => {
            el.textContent = original;
          },
        });
      },
    });
  });
}

/* ------------------------------------------------------------------ *
 *  Fallback sem GSAP                                                  *
 * ------------------------------------------------------------------ */
function initIntersectionReveal() {
  if (!prefersReducedMotion()) {
    document.documentElement.style.scrollBehavior = 'smooth';
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in', 'is-revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document
    .querySelectorAll('.reveal, [data-anim], [data-stagger]')
    .forEach((el) => observer.observe(el));
  /* Failsafe sem GSAP: 3s depois mostra tudo. */
  setTimeout(() => {
    document
      .querySelectorAll('.reveal:not(.in), [data-anim]:not(.in), [data-stagger]:not(.in)')
      .forEach((el) => el.classList.add('in', 'is-revealed'));
  }, 3000);
}

/* ------------------------------------------------------------------ *
 *  Boot                                                              *
 * ------------------------------------------------------------------ */
function initScrollSystem() {
  const { gsap, ScrollTrigger } = window;
  if (!gsap || !ScrollTrigger) {
    initIntersectionReveal();
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  initLenis(gsap, ScrollTrigger);
  setupHeroIntro(gsap);
  setupReveals(gsap, ScrollTrigger);
  setupStaggerGroups(gsap);
  setupParallax(gsap);
  setupCounters(gsap, ScrollTrigger);

  /* Failsafe: passados 3s qualquer elemento ainda invisível torna-se
     visível (caso o ScrollTrigger nunca dispare por algum motivo). */
  setTimeout(() => {
    document.querySelectorAll('.reveal, [data-anim], [data-stagger] > *').forEach((el) => {
      const op = parseFloat(getComputedStyle(el).opacity);
      if (op < 0.05) {
        gsap.set(el, { autoAlpha: 1, x: 0, y: 0, scale: 1, clearProps: 'transform' });
      }
    });
    ScrollTrigger.refresh();
  }, 3000);

  RyuAnim.animate = (root) => {
    setupReveals(gsap, ScrollTrigger, root);
    setupStaggerGroups(gsap);
    setupParallax(gsap);
    setupCounters(gsap, ScrollTrigger);
  };

  RyuAnim.refresh = () => {
    RyuAnim.animate(document);
    ScrollTrigger.refresh();
    if (siteLenis && typeof siteLenis.resize === 'function') siteLenis.resize();
  };

  window.addEventListener('ryu:dom-updated', () => RyuAnim.refresh());

  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
    if (siteLenis && typeof siteLenis.resize === 'function') siteLenis.resize();
  });
}

function setupHomeHeroVideo() {
  const video = document.getElementById('home-hero-video');
  if (!video) return;

  video.muted = true;
  video.defaultMuted = true;
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');
  video.loop = true;

  const playHero = () => {
    video.muted = true;
    const p = video.play();
    if (p && typeof p.catch === 'function') {
      p.catch(() => {
        /* poster do atributo video mantém-se visível se autoplay for bloqueado */
      });
    }
  };

  video.addEventListener('loadeddata', playHero);
  video.addEventListener('canplay', playHero);

  if (video.readyState >= 2) playHero();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) video.pause();
    else playHero();
  });
}

function setupProductsCarousel(products) {
  const track = document.getElementById('products-carousel-track');
  const viewport = document.getElementById('products-carousel-viewport');
  const prevBtn = document.getElementById('products-carousel-prev');
  const nextBtn = document.getElementById('products-carousel-next');
  const counter = document.getElementById('products-carousel-counter');
  const progressBar = document.getElementById('products-carousel-progress');
  if (!track || !viewport || !products.length) return;

  track.innerHTML = products
    .map(
      (p, i) => `
    <article class="products-carousel__slide${i === 0 ? ' is-active' : ''}" data-index="${i}">
      <a
        href="${p.url}"
        class="home-product-card"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="${p.name} — ver no site TM Leader Contract"
      >
        <div class="home-product-card__img">
          <img src="${p.image}" alt="${p.name}" loading="lazy" width="400" height="500" />
        </div>
        <div class="home-product-card__meta">
          <p class="home-product-card__name">${p.name}</p>
          <p class="home-product-card__cat">${p.category}</p>
          <span class="home-product-card__cta">
            Ver no site TM
            <svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
          </span>
        </div>
      </a>
    </article>
  `
    )
    .join('');

  const slides = Array.from(track.querySelectorAll('.products-carousel__slide'));
  let index = 0;
  let timer = null;
  let dragStartX = 0;
  let didDrag = false;
  let suppressClick = false;

  function slideMetrics() {
    const slide = slides[0];
    if (!slide) return { slideW: 0, gap: 0 };
    const gap = parseFloat(getComputedStyle(track).gap) || 20;
    return { slideW: slide.offsetWidth, gap };
  }

  function offsetFor(i) {
    const { slideW, gap } = slideMetrics();
    return -i * (slideW + gap);
  }

  function updateUI() {
    track.style.transform = `translateX(${offsetFor(index)}px)`;
    slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
    const total = String(products.length).padStart(2, '0');
    const current = String(index + 1).padStart(2, '0');
    if (counter) counter.textContent = `${current} / ${total}`;
    if (progressBar) {
      progressBar.style.width = `${((index + 1) / products.length) * 100}%`;
    }
  }

  function goTo(next, userTriggered) {
    const clamped = ((next % products.length) + products.length) % products.length;
    if (clamped === index) return;
    index = clamped;
    updateUI();
    if (userTriggered) restartAutoplay();
  }

  function next() {
    goTo(index + 1, false);
  }

  function prev() {
    goTo(index - 1, false);
  }

  function restartAutoplay() {
    if (timer) clearInterval(timer);
    if (!prefersReducedMotion()) timer = setInterval(next, 6000);
  }

  prevBtn?.addEventListener('click', () => prev());
  nextBtn?.addEventListener('click', () => next());

  viewport.addEventListener(
    'pointerdown',
    (e) => {
      if (e.button !== 0) return;
      didDrag = false;
      dragStartX = e.clientX;
    },
    { passive: true }
  );
  viewport.addEventListener(
    'pointermove',
    (e) => {
      if (Math.abs(e.clientX - dragStartX) > 10) didDrag = true;
    },
    { passive: true }
  );
  viewport.addEventListener('pointerup', (e) => {
    const dx = e.clientX - dragStartX;
    if (Math.abs(dx) > 48) {
      suppressClick = true;
      if (dx < 0) next();
      else prev();
      restartAutoplay();
    }
    didDrag = false;
  });
  track.addEventListener(
    'click',
    (e) => {
      if (!suppressClick) return;
      e.preventDefault();
      suppressClick = false;
    },
    true
  );
  viewport.addEventListener('pointercancel', () => {
    didDrag = false;
    suppressClick = false;
  });

  window.addEventListener('resize', () => updateUI());
  updateUI();
  restartAutoplay();

  if (window.RyuAnim && typeof window.RyuAnim.refresh === 'function') {
    window.RyuAnim.refresh();
  }
}

async function initFeaturedProducts() {
  const root = document.getElementById('products-carousel');
  if (!root) return;

  try {
    const res = await fetch('/data/featured-products.json');
    if (!res.ok) throw new Error('featured-products');
    const products = await res.json();
    setupProductsCarousel(products);
  } catch (err) {
    console.error(err);
    const track = document.getElementById('products-carousel-track');
    if (track) {
      track.innerHTML =
        '<p class="text-center text-[var(--text-secondary)] py-12">Não foi possível carregar os produtos.</p>';
    }
  }
}

function setupAmbientVideos() {
  const videos = document.querySelectorAll('.tm-ambient-video');
  if (!videos.length) return;

  videos.forEach((video) => {
    const root = video.closest('[data-ambient-video]') || video;
    const posterImg = root.querySelector('img.collection-card__media');

    const showPoster = () => {
      video.classList.add('is-hidden');
      if (posterImg) posterImg.classList.remove('is-hidden');
    };

    const playIfVisible = () => {
      if (prefersReducedMotion()) {
        video.pause();
        showPoster();
        return;
      }
      const p = video.play();
      if (p && typeof p.catch === 'function') {
        p.catch(showPoster);
      }
    };

    video.addEventListener('error', showPoster);
    video.addEventListener('playing', () => {
      if (posterImg) posterImg.classList.add('is-hidden');
      video.classList.remove('is-hidden');
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) playIfVisible();
          else {
            video.pause();
            showPoster();
          }
        });
      },
      { threshold: 0.2 }
    );
    io.observe(root);
  });
}

async function initHomeExhibitions() {
  const destaqueGrid = document.getElementById('home-destaque-grid');
  const exhibitionsSection = document.getElementById('exhibitions-section');
  if (!window.ExhibitionsData) return null;

  try {
    const projects = await window.ExhibitionsData.loadProjects();
    if (destaqueGrid) {
      window.ExhibitionsData.renderHomeDestaque(projects, destaqueGrid);
      if (window.RyuAnim && typeof window.RyuAnim.refresh === 'function') {
        window.RyuAnim.refresh();
      }
    }
    if (exhibitionsSection) {
      return window.ExhibitionsData.getSlider(projects);
    }
  } catch (err) {
    console.error(err);
    if (destaqueGrid) {
      destaqueGrid.innerHTML =
        '<p class="text-[var(--text-secondary)]">Não foi possível carregar as exibições.</p>';
    }
  }
  return null;
}

document.addEventListener('DOMContentLoaded', async () => {
  setupHomeHeroVideo();
  initFeaturedProducts();
  setupAmbientVideos();
  const sliderProjects = await initHomeExhibitions();

  /* ----- Mobile Menu (fullscreen) ----- */
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIconOpen = document.getElementById('menu-icon-open');
  const menuIconClose = document.getElementById('menu-icon-close');

  if (menuBtn && mobileMenu) {
    const setOpen = (open) => {
      mobileMenu.classList.toggle('is-open', open);
      mobileMenu.setAttribute('aria-hidden', open ? 'false' : 'true');
      document.documentElement.classList.toggle('ryu-menu-open', open);
      menuIconOpen?.classList.toggle('hidden', open);
      menuIconClose?.classList.toggle('hidden', !open);
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (window.RyuAnim && window.RyuAnim.lenis) {
        if (open) window.RyuAnim.lenis.stop();
        else window.RyuAnim.lenis.start();
      }
    };

    menuBtn.addEventListener('click', () => {
      setOpen(!mobileMenu.classList.contains('is-open'));
    });
    mobileMenu.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => setOpen(false));
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) setOpen(false);
    });
  }

  /* ----- Scroll system (Lenis + GSAP) ----- */
  initScrollSystem();

  /* ----- Accordion ----- */
  const servicesAccordionRoot = document.getElementById('services-accordion');
  document.querySelectorAll('.accordion-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      const isOpen = content.style.gridTemplateRows === '1fr';
      const iconPlus = btn.querySelector('.accordion-plus');
      const iconCross = btn.querySelector('.accordion-cross');
      const servicesRoot = btn.closest('#services-accordion');

      if (servicesRoot) {
        if (isOpen) {
          content.style.gridTemplateRows = '0fr';
          iconPlus?.classList.remove('hidden');
          iconCross?.classList.add('hidden');
        } else {
          servicesRoot.querySelectorAll('.accordion-content').forEach((c) => {
            c.style.gridTemplateRows = '0fr';
          });
          servicesRoot.querySelectorAll('.accordion-btn').forEach((b) => {
            b.querySelector('.accordion-plus')?.classList.remove('hidden');
            b.querySelector('.accordion-cross')?.classList.add('hidden');
          });
          content.style.gridTemplateRows = '1fr';
          iconPlus?.classList.add('hidden');
          iconCross?.classList.remove('hidden');
        }
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
        return;
      }

      if (isOpen) {
        content.style.gridTemplateRows = '0fr';
        iconPlus?.classList.remove('hidden');
        iconCross?.classList.add('hidden');
      } else {
        content.style.gridTemplateRows = '1fr';
        iconPlus?.classList.add('hidden');
        iconCross?.classList.remove('hidden');
      }
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    });
  });

  if (servicesAccordionRoot) {
    const firstContent = servicesAccordionRoot.querySelector('.accordion-content');
    const firstBtn = servicesAccordionRoot.querySelector('.accordion-btn');
    if (firstContent && firstBtn) {
      firstContent.style.gridTemplateRows = '1fr';
      firstBtn.querySelector('.accordion-plus')?.classList.add('hidden');
      firstBtn.querySelector('.accordion-cross')?.classList.remove('hidden');
    }
  }

  /* ----- Gallery Swap (Serviços — Porquê Escolher-nos) ----- */
  const galleryThumbnails = document.querySelectorAll('.gallery-thumb');
  const galleryMainImage = document.getElementById('gallery-main-image');

  if (galleryThumbnails.length > 0 && galleryMainImage) {
    const setThumbActive = (active) => {
      galleryThumbnails.forEach((t) => {
        const on = t === active;
        t.classList.toggle('gallery-thumb--active', on);
        t.classList.toggle('gallery-thumb--idle', !on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
      });
    };
    galleryThumbnails.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        setThumbActive(thumb);
        const newSrc = thumb.dataset.src;
        if (!newSrc || galleryMainImage.src === newSrc) return;
        galleryMainImage.style.opacity = '0';
        let settled = false;
        const onDone = () => {
          if (settled) return;
          settled = true;
          galleryMainImage.removeEventListener('load', onDone);
          galleryMainImage.removeEventListener('error', onDone);
          requestAnimationFrame(() => {
            galleryMainImage.style.opacity = '1';
          });
        };
        galleryMainImage.addEventListener('load', onDone);
        galleryMainImage.addEventListener('error', onDone);
        galleryMainImage.src = newSrc;
        if (galleryMainImage.complete) onDone();
      });
    });
    setThumbActive(galleryThumbnails[0]);
  }

  /* ----- Exibições Slider (Homepage) — feiras e eventos ----- */
  const projects = sliderProjects || [];

  const projectTotalNum = document.getElementById('project-total-num');
  if (projectTotalNum && projects.length) {
    projectTotalNum.textContent = String(projects.length).padStart(2, '0');
  }

  let currentProjectIndex = 0;
  const projectTitle = document.getElementById('project-title');
  const projectShort = document.getElementById('project-short');
  const projectImage = document.getElementById('project-image');
  const projectLink = document.getElementById('project-link');
  const projectCurrentNum = document.getElementById('project-current-num');
  const progressBar = document.getElementById('progress-bar');
  const prevBtn = document.getElementById('project-prev');
  const nextBtn = document.getElementById('project-next');

  const exhibitionsBg = document.getElementById('exhibitions-bg-image');
  const exhibitionsBgMobile = document.getElementById('exhibitions-bg-source-mobile');
  const resolveImg =
    window.TmResponsive && window.TmResponsive.resolveTmImage
      ? window.TmResponsive.resolveTmImage.bind(window.TmResponsive)
      : (src) => src;

  if (
    projects.length &&
    projectTitle &&
    prevBtn &&
    nextBtn &&
    projectImage &&
    progressBar &&
    projectLink
  ) {
    function updateProject(index) {
      const p = projects[index];
      projectTitle.textContent = p.name;
      projectShort.textContent = p.short;
      projectImage.src = resolveImg(p.image);
      projectImage.style.opacity = '1';
      projectLink.href = `/projeto/?id=${encodeURIComponent(p.id)}`;

      if (exhibitionsBg) exhibitionsBg.src = p.image;
      if (exhibitionsBgMobile) {
        const mobileSrc =
          window.TmResponsive &&
          window.TmResponsive.MOBILE_BY_DESKTOP &&
          window.TmResponsive.MOBILE_BY_DESKTOP[p.image];
        if (mobileSrc) exhibitionsBgMobile.setAttribute('srcset', mobileSrc);
        else exhibitionsBgMobile.removeAttribute('srcset');
      }

      projectCurrentNum.textContent = String(index + 1).padStart(2, '0');
      progressBar.style.width = `${((index + 1) / projects.length) * 100}%`;

      prevBtn.disabled = index === 0;
      prevBtn.style.opacity = index === 0 ? '0.3' : '1';
      nextBtn.disabled = index === projects.length - 1;
      nextBtn.style.opacity = index === projects.length - 1 ? '0.3' : '1';

      const animate = window.gsap && !prefersReducedMotion();
      if (animate) {
        window.gsap.fromTo(
          [projectTitle, projectShort],
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', stagger: 0.05, overwrite: 'auto' }
        );
      }
    }

    prevBtn.addEventListener('click', () => {
      if (currentProjectIndex > 0) {
        currentProjectIndex--;
        updateProject(currentProjectIndex);
      }
    });

    nextBtn.addEventListener('click', () => {
      if (currentProjectIndex < projects.length - 1) {
        currentProjectIndex++;
        updateProject(currentProjectIndex);
      }
    });

    updateProject(0);

    const mq = window.matchMedia('(max-width: 767px)');
    const onViewportChange = () => updateProject(currentProjectIndex);
    if (mq.addEventListener) mq.addEventListener('change', onViewportChange);
    else mq.addListener(onViewportChange);
  }
});
