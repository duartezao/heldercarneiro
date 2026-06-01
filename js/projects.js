document.addEventListener('DOMContentLoaded', async () => {
  const projectsGrid = document.getElementById('projects-grid');
  if (!projectsGrid) return;

  try {
    const response = await fetch('/data/projects.json');
    if (!response.ok) throw new Error('Could not fetch projects');
    let projects = await response.json();

    if (window.ExhibitionsData && window.ExhibitionsData.getSortedAll) {
      projects = window.ExhibitionsData.getSortedAll(projects);
    } else {
      projects = [...projects].sort(
        (a, b) => (parseInt(b.year, 10) || 0) - (parseInt(a.year, 10) || 0)
      );
    }

    const typeLabel =
      window.ExhibitionsData && window.ExhibitionsData.typeLabel
        ? window.ExhibitionsData.typeLabel.bind(window.ExhibitionsData)
        : () => 'Exibição';

    let html = '';
    projects.forEach((project) => {
      const img = project.cardImage || project.images?.hero || '';
      const metaParts = [typeLabel(project.type), project.date].filter(Boolean);
      html += `
        <div class="reveal">
          <a href="/projeto/?id=${encodeURIComponent(project.id)}" class="project-card group block relative rounded-3xl overflow-hidden bg-[var(--bg-card)]" style="aspect-ratio: 5 / 4;" aria-label="${project.title}">
            <img src="${img}" alt="${project.title}" class="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105" />
            <div class="project-card__shade pointer-events-none absolute inset-0" aria-hidden="true"></div>
            <span class="project-card__arrow absolute right-5 inline-flex w-11 h-11 rounded-full backdrop-blur text-white items-center justify-center transition-transform duration-300 group-hover:scale-110" style="top: 1.25rem; background: rgba(0,0,0,0.45);">
              <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
            </span>
            <div class="project-card__body absolute text-white" style="left: 1.5rem; right: 1.5rem; bottom: 1.5rem;">
              ${metaParts.length ? `<p class="text-[11px] font-medium tracking-wide text-white/65 mb-2">${metaParts.join(' · ')}</p>` : ''}
              <h3 class="project-card__title text-2xl md:text-3xl font-semibold mb-2" style="line-height: 1.15;">${project.title}</h3>
              <p class="project-card__short text-sm max-w-md text-white/85" style="line-height: 1.45;">${project.shortDescription}</p>
            </div>
          </a>
        </div>
      `;
    });

    projectsGrid.innerHTML = html;

    const tryRefresh = () => {
      if (window.RyuAnim && typeof window.RyuAnim.refresh === 'function') {
        window.RyuAnim.refresh();
        return true;
      }
      return false;
    };

    if (!tryRefresh()) {
      const start = Date.now();
      const id = setInterval(() => {
        if (tryRefresh() || Date.now() - start > 3000) clearInterval(id);
      }, 60);
    }
  } catch (err) {
    console.error(err);
    projectsGrid.innerHTML = '<p class="text-red-500">Erro ao carregar projetos.</p>';
  }
});
