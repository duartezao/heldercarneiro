/**
 * Coleções e agenda — fonte única: /data/projects.json
 * homeDestaque → grelha "Coleções" (coleções + lançamentos)
 * homeSlider → secção "Agenda TM" (feiras e showrooms)
 */
(function () {
  const TYPE_LABELS = {
    feira: 'Feira',
    colecao: 'Coleção',
    lancamentos: 'Novidades',
  };

  const MONTH_PT = {
    jan: 1,
    fev: 2,
    mar: 3,
    abr: 4,
    mai: 5,
    jun: 6,
    jul: 7,
    ago: 8,
    set: 9,
    out: 10,
    nov: 11,
    dez: 12,
  };

  /** Valor maior = mais recente (ano + mês quando existir em `date`). */
  function chronologicalKey(project) {
    const year = parseInt(String(project.year || ''), 10) || 0;
    let month = 0;
    const dateStr = String(project.date || '').toLowerCase();
    const monthMatch = dateStr.match(/\b(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)\b/);
    if (monthMatch) month = MONTH_PT[monthMatch[1]] || 0;
    return year * 100 + month;
  }

  function sortByKey(items, key) {
    return [...items].sort((a, b) => (a[key] ?? 999) - (b[key] ?? 999));
  }

  /** Mais recente primeiro; empate → sortOrder. */
  function sortChronological(items) {
    return [...items].sort((a, b) => {
      const diff = chronologicalKey(b) - chronologicalKey(a);
      if (diff !== 0) return diff;
      return (a.sortOrder ?? 999) - (b.sortOrder ?? 999);
    });
  }

  async function loadProjects() {
    const res = await fetch('/data/projects.json');
    if (!res.ok) throw new Error('projects.json');
    return res.json();
  }

  function getDestaque(projects) {
    return sortByKey(
      projects.filter((p) => p.homeDestaque),
      'homeDestaqueOrder'
    );
  }

  function getSlider(projects) {
    return sortByKey(
      projects.filter((p) => p.homeSlider),
      'homeSliderOrder'
    ).map((p) => ({
      id: p.id,
      name: p.title,
      short: p.shortDescription,
      image: p.cardImage || p.images?.hero || '',
      type: p.type,
    }));
  }

  function getSortedAll(projects) {
    return sortChronological(projects);
  }

  function typeLabel(type) {
    return TYPE_LABELS[type] || 'Exibição';
  }

  function renderHomeDestaque(projects, container) {
    if (!container) return;
    const items = getDestaque(projects);
    if (!items.length) {
      container.innerHTML =
        '<p class="text-[var(--text-secondary)]">Não foi possível carregar as coleções.</p>';
      return;
    }

    container.innerHTML = items
      .map((p) => {
        const wide = p.homeDestaqueWide ? ' collection-card--wide' : '';
        const ratio = p.homeDestaqueWide ? '16/9' : '4/5';
        const titleClass = p.homeDestaqueWide ? 'text-2xl' : 'text-xl';
        const img = p.cardImage || p.images?.hero || '';
        const metaParts = [typeLabel(p.type), p.date].filter(Boolean);
        const metaLine = metaParts.length
          ? `<p class="text-[11px] font-medium tracking-wide text-white/65 mb-1.5">${metaParts.join(' · ')}</p>`
          : '';

        return `
          <a
            href="/projeto/?id=${encodeURIComponent(p.id)}"
            class="collection-card${wide} group relative rounded-3xl overflow-hidden block"
            style="aspect-ratio: ${ratio}"
          >
            <img
              class="collection-card__media"
              src="${img}"
              alt="${p.title}"
              width="800"
              height="1000"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-black/35 pointer-events-none"></div>
            <div class="absolute bottom-6 left-6 right-6 text-white pointer-events-none">
              ${metaLine}
              <h3 class="${titleClass} font-semibold leading-tight">${p.title}</h3>
            </div>
          </a>
        `;
      })
      .join('');
  }

  window.ExhibitionsData = {
    loadProjects,
    getDestaque,
    getSlider,
    getSortedAll,
    sortChronological,
    chronologicalKey,
    typeLabel,
    renderHomeDestaque,
  };
})();
