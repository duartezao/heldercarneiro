document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');

  if (!projectId) {
    window.location.href = '/projetos/';
    return;
  }

  try {
    const response = await fetch('/data/projects.json');
    if (!response.ok) throw new Error('Could not fetch projects');
    const projects = await response.json();

    const project = projects.find((p) => p.id === projectId);
    if (!project) {
      window.location.href = '/projetos/';
      return;
    }

    const metaDesc = [project.description, project.descriptionExtra]
      .filter(Boolean)
      .join(' ')
      .slice(0, 160);
    const pageTitle = project.title + ' · Exibição · Hélder Carneiro';
    document.getElementById('page-title').textContent = pageTitle;
    document.getElementById('meta-description').content = metaDesc;

    const projectPath = '/projeto/?id=' + encodeURIComponent(projectId);
    const heroImage = project.images?.hero || project.cardImage || '/assets/tm/banner-milano.webp';

    if (window.HcSeo && window.HcSeo.setPageMeta) {
      window.HcSeo.setPageMeta({
        title: pageTitle,
        description: metaDesc,
        path: projectPath,
        image: heroImage,
        type: 'article',
      });
    }

    const canonicalEl = document.getElementById('canonical-link');
    if (canonicalEl) {
      canonicalEl.setAttribute('href', window.HcSeo ? window.HcSeo.absoluteUrl(projectPath) : projectPath);
    }

    const eventSchema = {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: project.title,
      description: metaDesc,
      image: window.HcSeo ? window.HcSeo.absoluteUrl(heroImage) : heroImage,
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: {
        '@type': 'Place',
        name: project.location || 'Portugal',
      },
      organizer: {
        '@type': 'Organization',
        name: 'TM Leader Contract',
        url: 'https://www.tmleadercontract.com',
      },
    };
    let schemaEl = document.getElementById('project-jsonld');
    if (!schemaEl) {
      schemaEl = document.createElement('script');
      schemaEl.type = 'application/ld+json';
      schemaEl.id = 'project-jsonld';
      document.head.appendChild(schemaEl);
    }
    schemaEl.textContent = JSON.stringify(eventSchema);

    const heroImg = document.getElementById('proj-hero');
    const img1 = document.getElementById('proj-img-1');
    const img2 = document.getElementById('proj-img-2');
    const img3 = document.getElementById('proj-img-3');

    heroImg.src = project.images.hero;
    heroImg.alt = project.title;

    document.getElementById('proj-title').textContent = project.title;

    const eyebrow = document.getElementById('proj-eyebrow');
    if (eyebrow) {
      const parts = [];
      if (project.type) {
        parts.push(
          window.ExhibitionsData && window.ExhibitionsData.typeLabel
            ? window.ExhibitionsData.typeLabel(project.type)
            : project.type
        );
      }
      if (project.date) parts.push(project.date);
      if (parts.length) {
        eyebrow.textContent = parts.join(' · ');
        eyebrow.classList.remove('hidden');
      } else {
        eyebrow.classList.add('hidden');
      }
    }

    const taglineEl = document.getElementById('proj-tagline');
    if (taglineEl) {
      taglineEl.textContent = project.tagline || '';
      taglineEl.style.display = project.tagline ? '' : 'none';
    }

    document.getElementById('proj-location').textContent = project.location;
    document.getElementById('proj-desc').textContent = project.description;
    document.getElementById('proj-year').textContent = project.year;
    document.getElementById('proj-duration').textContent = project.duration;

    const descExtra = document.getElementById('proj-desc-extra');
    if (descExtra) {
      if (project.descriptionExtra) {
        descExtra.textContent = project.descriptionExtra;
        descExtra.classList.remove('hidden');
      } else {
        descExtra.classList.add('hidden');
      }
    }

    const highlightsWrap = document.getElementById('proj-highlights-wrap');
    const highlightsList = document.getElementById('proj-highlights');
    if (highlightsWrap && highlightsList && project.highlights?.length) {
      highlightsList.innerHTML = project.highlights
        .map((item) => `<li>${item}</li>`)
        .join('');
      highlightsWrap.classList.remove('hidden');
    } else if (highlightsWrap) {
      highlightsWrap.classList.add('hidden');
    }

    const materialsWrap = document.getElementById('proj-materials-wrap');
    const materialsList = document.getElementById('proj-materials');
    if (materialsWrap && materialsList && project.materials?.length) {
      materialsList.innerHTML = project.materials.map((m) => `<li>${m}</li>`).join('');
      materialsWrap.classList.remove('hidden');
    } else if (materialsWrap) {
      materialsWrap.classList.add('hidden');
    }

    const captions = project.images.captions || {};
    const setGalleryImage = (imgEl, capEl, key, src, lazy) => {
      imgEl.src = src;
      imgEl.alt = project.title;
      if (lazy) {
        imgEl.loading = 'lazy';
        imgEl.decoding = 'async';
      } else {
        imgEl.removeAttribute('loading');
        imgEl.fetchPriority = 'high';
      }
      const cap = captions[key];
      if (capEl) {
        if (cap) {
          capEl.textContent = cap;
          capEl.classList.remove('hidden');
        } else {
          capEl.classList.add('hidden');
        }
      }
    };

    setGalleryImage(img1, document.getElementById('proj-cap-1'), 'detail1', project.images.detail1, true);
    setGalleryImage(img2, document.getElementById('proj-cap-2'), 'detail2', project.images.detail2, true);
    setGalleryImage(img3, document.getElementById('proj-cap-3'), 'detail3', project.images.detail3, true);

    const catalogLink = document.getElementById('proj-catalog');
    if (catalogLink && project.catalogPdf) {
      catalogLink.href = project.catalogPdf;
      catalogLink.target = '_blank';
      catalogLink.rel = 'noopener noreferrer';
      const label = catalogLink.querySelector('span');
      if (label) {
        label.textContent =
          project.id === 'milano' || project.id === 'outdoor'
            ? 'Ver no site TM'
            : 'Ver catálogo TM';
      }
    }

    const productsWrap = document.getElementById('proj-products-wrap');
    const productsList = document.getElementById('proj-products');
    if (productsWrap && productsList && project.featuredProducts?.length) {
      productsList.innerHTML = project.featuredProducts
        .map((item) => {
          const name = typeof item === 'string' ? item : item.name;
          const note = typeof item === 'object' && item.note ? item.note : null;
          const url = typeof item === 'object' && item.url ? item.url : null;
          const noteHtml = note
            ? `<span class="proj-product-chip__note">${note}</span>`
            : '';
          const inner = `<span class="proj-product-chip__name">${name}</span>${noteHtml}`;
          if (url) {
            return `<li><a href="${url}" target="_blank" rel="noopener noreferrer" class="proj-product-chip">${inner}</a></li>`;
          }
          return `<li><div class="proj-product-chip">${inner}</div></li>`;
        })
        .join('');
      productsWrap.classList.remove('hidden');
    } else if (productsWrap) {
      productsWrap.classList.add('hidden');
    }

    const sorted =
      window.ExhibitionsData && window.ExhibitionsData.getSortedAll
        ? window.ExhibitionsData.getSortedAll(projects)
        : [...projects].sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
    const idx = sorted.findIndex((p) => p.id === projectId);
    const prevProj = idx > 0 ? sorted[idx - 1] : null;
    const nextProj = idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : null;

    const linkPrev = document.getElementById('link-prev');
    const titlePrev = document.getElementById('prev-title');
    if (prevProj) {
      linkPrev.href = '/projeto/?id=' + encodeURIComponent(prevProj.id);
      titlePrev.textContent = prevProj.title;
    } else {
      linkPrev.style.display = 'none';
    }

    const linkNext = document.getElementById('link-next');
    const titleNext = document.getElementById('next-title');
    if (nextProj) {
      linkNext.href = '/projeto/?id=' + encodeURIComponent(nextProj.id);
      titleNext.textContent = nextProj.title;
    } else {
      linkNext.style.display = 'none';
    }

    const scheduleRefresh = () => {
      if (window.RyuAnim && typeof window.RyuAnim.refresh === 'function') {
        window.RyuAnim.refresh();
      }
    };
    [heroImg, img1, img2, img3].forEach((img) => {
      if (img.complete) return;
      img.addEventListener('load', scheduleRefresh, { once: true });
      img.addEventListener('error', scheduleRefresh, { once: true });
    });
    scheduleRefresh();
    window.addEventListener('load', scheduleRefresh);
  } catch (err) {
    console.error(err);
  }
});
