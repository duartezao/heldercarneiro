/**
 * Navbar, footer e FAQ — Hélder Carneiro
 * URLs: /, /company/, /projetos/, /contactos/, /projeto/?id=…
 */

/** Símbolo HC inline — evita 404 se o asset separado não estiver deployado */
const BRAND_SYMBOL_SVG = `<svg class="brand-logo brand-logo--nav" xmlns="http://www.w3.org/2000/svg" viewBox="281 189 342 364" fill="none" aria-hidden="true" shape-rendering="geometricPrecision"><g transform="translate(0,897) scale(0.1,-0.1)" fill="#DCDF0E" stroke="none"><path d="M2870 5260 l0 -1760 1180 0 1180 0 0 590 0 590 -269 0 -268 0 -5 -360 c-2 -198 -6 -361 -9 -362 -2 -2 -289 -2 -636 0 l-633 3 0 1304 0 1305 640 0 640 0 0 -360 0 -360 270 0 270 0 0 585 0 585 -1180 0 -1180 0 0 -1760z"/><path d="M5600 6285 l0 -735 -630 0 -630 0 0 350 0 350 -262 -2 -263 -3 -3 -977 -2 -978 265 0 265 0 2 348 3 347 625 0 625 0 3 -742 2 -743 285 0 285 0 0 1760 0 1760 -285 0 -285 0 0 -735z"/></g></svg>`;

const LINKEDIN_URL = 'https://www.linkedin.com/in/h%C3%A9lder-carneiro-677984a4';
const INSTAGRAM_URL = 'https://www.instagram.com/hc_contract_solutions/';
const LINKEDIN_ICON_SVG = `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`;
const INSTAGRAM_ICON_SVG = `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>`;

function resolveNavSelection() {
  const pathname = window.location.pathname || '/';
  const parts = pathname.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
  const segment = parts[0] ? parts[0].toLowerCase() : '';

  if (segment === 'projetos') return 'projetos';
  if (segment === 'projeto') return 'projeto-detail';
  if (segment === 'company') return 'company';
  if (segment === 'contactos') return 'contactos';

  return null;
}

function applyNavbarActiveStates() {
  const sel = resolveNavSelection();
  const desktopKey = sel === 'projeto-detail' ? 'projetos' : sel;

  document.querySelectorAll('[data-nav]').forEach((el) => {
    const key = el.getAttribute('data-nav');
    const active = desktopKey !== null && key === desktopKey;
    if (el.classList.contains('nav-link-desktop')) {
      el.classList.add('text-white', 'opacity-100');
      el.classList.toggle('font-semibold', active);
    }
    if (el.classList.contains('nav-link-mobile')) {
      el.classList.toggle('is-active', active);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const navbarHTML = `
    <nav class="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-[720px] rounded-[35px] nav-glass pl-6 pr-2 py-2 flex items-center justify-between">
      <a href="/" class="brand-logo-link brand-logo-link--nav shrink-0" aria-label="Hélder Carneiro, início">
        ${BRAND_SYMBOL_SVG}
      </a>
      <div class="hidden md:flex items-center gap-8">
        <a data-nav="projetos" href="/projetos/" class="nav-link-desktop text-base font-medium text-white transition-opacity hover:opacity-90">Exibições</a>
        <a data-nav="company" href="https://www.tmleadercontract.com/en/" target="_blank" rel="noopener noreferrer" class="nav-link-desktop text-base font-medium text-white transition-opacity hover:opacity-90">Company</a>
      </div>
      <div class="flex items-center gap-2">
        <a data-nav="contactos" href="/contactos/" class="nav-link-contact-pill hidden md:inline-flex items-center gap-3 rounded-full bg-black text-white pl-6 pr-2 py-2 font-medium transition-transform hover:scale-[1.02] outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent active:outline-none">
          <span>Contactos</span>
          <span class="flex items-center justify-center w-7 h-7 rounded-full bg-white text-black">
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </span>
        </a>
        <button id="menu-btn" class="md:hidden p-2 rounded-full text-white" aria-label="Menu">
          <svg id="menu-icon-open" class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          <svg id="menu-icon-close" class="w-5 h-5 hidden" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
    </nav>
    <div id="mobile-menu" class="ryu-mobile-menu" aria-hidden="true">
      <div class="ryu-mobile-menu__inner">
        <nav class="ryu-mobile-menu__links">
          <a data-nav="projetos" href="/projetos/" class="nav-link-mobile">Exibições</a>
          <a data-nav="company" href="https://www.tmleadercontract.com/en/" target="_blank" rel="noopener noreferrer" class="nav-link-mobile">Company</a>
          <a data-nav="contactos" href="/contactos/" class="nav-link-mobile">Contactos</a>
        </nav>
        <div class="ryu-mobile-menu__meta">
          <p class="ryu-mobile-menu__address">
            Hélder Carneiro · Consultor TM Leader Contract
          </p>
          <p class="ryu-mobile-menu__phone">Paredes · Porto</p>
          <p class="ryu-mobile-menu__copy">© 2026 Hélder Carneiro</p>
        </div>
      </div>
    </div>
  `;

  const footerHTML = `
    <footer class="bg-[#111111] text-white">
      <div class="max-w-[1200px] mx-auto px-6 md:px-10 pt-20 pb-10">
        <div class="grid grid-cols-1 md:grid-cols-[1.5fr_0.75fr_0.75fr] gap-10 md:gap-20">
          <div>
            <a href="/" class="brand-logo-link brand-logo-link--footer mb-5" aria-label="Hélder Carneiro, início">
              <img src="/assets/logo_helder_carneiro.svg" alt="Hélder Carneiro" class="brand-logo brand-logo--footer" width="280" height="80" decoding="async">
              <span class="brand-logo-tagline">TM Leader Contract · Portugal</span>
            </a>
            <p class="text-white/60 max-w-[400px] leading-relaxed mb-8">
              Hélder Carneiro, consultor oficial TM Leader Contract em Portugal. Mobiliário e soluções contract para projetos residenciais, hotelaria e hospitality.
            </p>
          </div>
          <div>
            <p class="text-white/60 text-sm mb-6">Site</p>
            <ul class="space-y-3">
              <li><a href="/projetos/" class="text-white/60 hover:text-white transition-colors">Exibições</a></li>
              <li><a href="https://www.tmleadercontract.com/en/" target="_blank" rel="noopener noreferrer" class="text-white/60 hover:text-white transition-colors">Company</a></li>
              <li><a href="/contactos/" class="text-white/60 hover:text-white transition-colors">Contactos</a></li>
            </ul>
          </div>
          <div>
            <p class="text-white/60 text-sm mb-6">Contactos</p>
            <ul class="space-y-3">
              <li class="text-white/60 leading-relaxed">Paredes<br>Porto, Portugal</li>
              <li><a href="mailto:geral@heldercarneiro.pt" class="text-white/60 hover:text-white transition-colors">geral@heldercarneiro.pt</a></li>
              <li><a href="https://www.tmleadercontract.com" target="_blank" rel="noopener noreferrer" class="text-white/60 hover:text-white transition-colors">tmleadercontract.com</a></li>
              <li class="pt-2">
                <p class="text-white/60 text-sm mb-3">Redes sociais</p>
                <div class="flex gap-3">
                  <a href="${LINKEDIN_URL}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white/70 hover:bg-white hover:text-black transition-colors" aria-label="LinkedIn do Hélder Carneiro">
                    ${LINKEDIN_ICON_SVG}
                  </a>
                  <a href="${INSTAGRAM_URL}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white/70 hover:bg-white hover:text-black transition-colors" aria-label="Instagram HC Contract Solutions">
                    ${INSTAGRAM_ICON_SVG}
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div class="flex flex-col md:flex-row justify-between gap-2 mt-8 text-sm text-white/40">
          <span>© 2026 Hélder Carneiro. Todos os direitos reservados</span>
          <span>Site by Netarte</span>
        </div>
      </div>
    </footer>
  `;

  const faqSectionHTML = `
      <section class="max-w-[1200px] mx-auto px-6 md:px-10 py-14 md:py-20">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-start">
          <div>
            <div class="inline-flex items-center gap-3 mb-8">
              <span class="flex items-center justify-center w-8 h-8 rounded-[12px] bg-[var(--bg-card)]">
                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
              </span>
              <span class="text-base tracking-tight">Perguntas Frequentes</span>
            </div>
            <h2 class="text-4xl md:text-5xl mb-10">Respostas sobre a consultoria TM Leader Contract em Portugal.</h2>
            <div class="rounded-3xl overflow-hidden relative w-[min(100%,280px)] aspect-[3/4] mb-6 bg-[#1a1a1a]">
              <img
                src="/assets/helder-carneiro.webp"
                alt="Hélder Carneiro, consultor TM Leader Contract em Portugal"
                class="absolute inset-0 w-full h-full object-cover"
                style="object-position: center 30%;"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent pointer-events-none"></div>
              <div class="absolute bottom-6 left-6 text-white pointer-events-none">
                <p class="font-semibold text-lg" style="font-family: 'MuseoModerno', sans-serif;">Hélder Carneiro</p>
                <p class="text-white/80 text-sm">Consultor oficial · Portugal</p>
              </div>
            </div>
            <p class="text-[var(--text-secondary)]">Tem um projeto em mente?</p>
            <p class="text-2xl font-medium mb-6">Agende uma reunião connosco.</p>
            <a href="/contactos/" class="inline-flex items-center gap-3 rounded-full font-medium transition-transform hover:scale-[1.02] bg-black text-white px-7 py-3">
              <span>Marcar Reunião</span>
            </a>
          </div>
          <div class="flex flex-col gap-2">
            <div class="bg-[var(--bg-card)] rounded-2xl px-6 py-5 transition-all">
              <button type="button" class="accordion-btn w-full flex items-center justify-between text-left">
                <span class="text-base md:text-lg font-medium">Quem é Hélder Carneiro?</span>
                <svg class="accordion-cross w-5 h-5 shrink-0 hidden" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                <svg class="accordion-plus w-5 h-5 shrink-0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              </button>
              <div class="accordion-content grid transition-all duration-500 ease-out" style="grid-template-rows: 0fr">
                <div class="overflow-hidden">
                  <p class="pt-4 text-[var(--text-secondary)] leading-relaxed">
                    Hélder Carneiro é o consultor oficial da TM Leader Contract em Portugal. Acompanha e ajuda a desenvolver projetos com designers de interiores, arquitetos, lojas e promotores na especificação e comercialização de mobiliário contract.
                  </p>
                </div>
              </div>
            </div>
            <div class="bg-[var(--bg-card)] rounded-2xl px-6 py-5 transition-all">
              <button type="button" class="accordion-btn w-full flex items-center justify-between text-left">
                <span class="text-base md:text-lg font-medium">Que tipo de projetos podem beneficiar destas coleções?</span>
                <svg class="accordion-cross w-5 h-5 shrink-0 hidden" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                <svg class="accordion-plus w-5 h-5 shrink-0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              </button>
              <div class="accordion-content grid transition-all duration-500 ease-out" style="grid-template-rows: 0fr">
                <div class="overflow-hidden">
                  <p class="pt-4 text-[var(--text-secondary)] leading-relaxed">
                    As coleções TM Leader Contract são concebidas para hotelaria, restauração, escritórios, espaços residenciais premium e qualquer projeto contract que exija durabilidade, design e conforto profissional.
                  </p>
                </div>
              </div>
            </div>
            <div class="bg-[var(--bg-card)] rounded-2xl px-6 py-5 transition-all">
              <button type="button" class="accordion-btn w-full flex items-center justify-between text-left">
                <span class="text-base md:text-lg font-medium">Como posso aceder aos catálogos?</span>
                <svg class="accordion-cross w-5 h-5 shrink-0 hidden" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                <svg class="accordion-plus w-5 h-5 shrink-0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              </button>
              <div class="accordion-content grid transition-all duration-500 ease-out" style="grid-template-rows: 0fr">
                <div class="overflow-hidden">
                  <p class="pt-4 text-[var(--text-secondary)] leading-relaxed">
                    Contacte-nos através do formulário ou por email. Teremos todo o gosto em partilhar catálogos PDF, fichas técnicas e informação sobre as coleções disponíveis para o seu projeto.
                  </p>
                </div>
              </div>
            </div>
            <div class="bg-[var(--bg-card)] rounded-2xl px-6 py-5 transition-all">
              <button type="button" class="accordion-btn w-full flex items-center justify-between text-left">
                <span class="text-base md:text-lg font-medium">A Hélder Carneiro acompanha o projeto do início ao fim?</span>
                <svg class="accordion-cross w-5 h-5 shrink-0 hidden" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                <svg class="accordion-plus w-5 h-5 shrink-0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              </button>
              <div class="accordion-content grid transition-all duration-500 ease-out" style="grid-template-rows: 0fr">
                <div class="overflow-hidden">
                  <p class="pt-4 text-[var(--text-secondary)] leading-relaxed">
                    Sim. Com mais de 33 anos de experiência no setor do mobiliário, Hélder Carneiro acompanha profissionais e promotores na seleção de peças, consultoria técnica e apoio à especificação para cada projeto.
                  </p>
                </div>
              </div>
            </div>
            <div class="bg-[var(--bg-card)] rounded-2xl px-6 py-5 transition-all">
              <button type="button" class="accordion-btn w-full flex items-center justify-between text-left">
                <span class="text-base md:text-lg font-medium">Como agendar uma reunião?</span>
                <svg class="accordion-cross w-5 h-5 shrink-0 hidden" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                <svg class="accordion-plus w-5 h-5 shrink-0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              </button>
              <div class="accordion-content grid transition-all duration-500 ease-out" style="grid-template-rows: 0fr">
                <div class="overflow-hidden">
                  <p class="pt-4 text-[var(--text-secondary)] leading-relaxed">
                    Utilize o formulário de contactos ou envie-nos um email. Respondemos em breve para agendar uma reunião presencial ou online, de acordo com a sua disponibilidade.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  `;

  const navContainer = document.getElementById('navbar-container');
  if (navContainer) navContainer.innerHTML = navbarHTML;

  applyNavbarActiveStates();

  const footerContainer = document.getElementById('footer-container');
  if (footerContainer) footerContainer.innerHTML = footerHTML;

  const faqContainer = document.getElementById('faq-container');
  if (faqContainer) faqContainer.innerHTML = faqSectionHTML;

  document.querySelectorAll('a[href*="tmleadercontract.com"]').forEach((link) => {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });

  if (!document.getElementById('whatsapp-float')) {
    const waMessage = encodeURIComponent(
      'Olá Hélder, gostaria de saber mais sobre as soluções TM Leader Contract.'
    );
    const wa = document.createElement('a');
    wa.id = 'whatsapp-float';
    wa.href = 'https://wa.me/351933612177?text=' + waMessage;
    wa.target = '_blank';
    wa.rel = 'noopener noreferrer';
    wa.setAttribute('aria-label', 'Contactar via WhatsApp');
    wa.innerHTML = `
      <svg viewBox="0 0 32 32" width="30" height="30" fill="currentColor" aria-hidden="true">
        <path d="M16.001 3.2C9.064 3.2 3.2 9.063 3.2 16c0 2.257.6 4.46 1.74 6.404L3.2 28.8l6.56-1.715A12.74 12.74 0 0 0 16 28.8c6.937 0 12.8-5.863 12.8-12.8S22.938 3.2 16.001 3.2zm0 23.2a10.36 10.36 0 0 1-5.28-1.444l-.378-.224-3.893 1.018 1.04-3.79-.247-.39A10.32 10.32 0 0 1 5.6 16c0-5.735 4.666-10.4 10.401-10.4 5.734 0 10.399 4.665 10.399 10.4 0 5.734-4.665 10.4-10.399 10.4zm5.7-7.79c-.312-.156-1.846-.91-2.132-1.014-.286-.104-.494-.156-.702.157-.208.312-.806 1.013-.988 1.221-.182.208-.364.234-.676.078-.312-.156-1.318-.486-2.51-1.548-.928-.828-1.554-1.85-1.736-2.162-.182-.312-.02-.48.137-.636.141-.14.312-.364.468-.546.156-.182.208-.312.312-.52.104-.208.052-.39-.026-.546-.078-.156-.702-1.692-.962-2.316-.253-.608-.51-.526-.702-.536l-.598-.01c-.208 0-.546.078-.832.39-.286.312-1.092 1.066-1.092 2.602s1.118 3.018 1.274 3.226c.156.208 2.2 3.36 5.33 4.712.745.322 1.326.514 1.78.658.748.238 1.428.204 1.966.124.6-.09 1.846-.754 2.106-1.482.26-.728.26-1.352.182-1.482-.078-.13-.286-.208-.598-.364z"/>
      </svg>`;
    document.body.appendChild(wa);

    if (!document.getElementById('whatsapp-float-style')) {
      const style = document.createElement('style');
      style.id = 'whatsapp-float-style';
      style.textContent = `
        #whatsapp-float {
          position: fixed;
          right: clamp(1rem, 3vw, 1.75rem);
          bottom: clamp(1rem, 3vw, 1.75rem);
          z-index: 60;
          width: 56px;
          height: 56px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #25d366;
          color: #fff;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        #whatsapp-float:hover {
          transform: scale(1.06);
          box-shadow: 0 8px 22px rgba(0, 0, 0, 0.24);
        }
        #whatsapp-float:active { transform: scale(0.98); }
        @media (prefers-reduced-motion: reduce) {
          #whatsapp-float { transition: none; }
        }
      `;
      document.head.appendChild(style);
    }
  }
});
