/**
 * SEO helpers — meta tags, Open Graph, Twitter Cards
 */
(function () {
  const SITE_ORIGIN = 'https://www.heldercarneiro.pt';
  const DEFAULT_OG_IMAGE = '/assets/tm/banner-milano.webp';

  function upsertMeta(attr, key, content) {
    if (!content) return;
    let el = document.head.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  }

  function upsertLink(rel, href) {
    if (!href) return;
    let el = document.head.querySelector(`link[rel="${rel}"]`);
    if (!el) {
      el = document.createElement('link');
      el.setAttribute('rel', rel);
      document.head.appendChild(el);
    }
    el.setAttribute('href', href);
  }

  function absoluteUrl(path) {
    if (!path) return SITE_ORIGIN + DEFAULT_OG_IMAGE;
    if (/^https?:\/\//i.test(path)) return path;
    return SITE_ORIGIN + (path.startsWith('/') ? path : '/' + path);
  }

  function setPageMeta({
    title,
    description,
    path = '/',
    image = DEFAULT_OG_IMAGE,
    type = 'website',
  } = {}) {
    if (title) document.title = title;
    if (description) upsertMeta('name', 'description', description);

    const pageUrl = path.startsWith('http') ? path : SITE_ORIGIN + path;
    const imageUrl = absoluteUrl(image);

    upsertLink('canonical', pageUrl);
    upsertMeta('property', 'og:title', title || document.title);
    upsertMeta('property', 'og:description', description || '');
    upsertMeta('property', 'og:url', pageUrl);
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:locale', 'pt_PT');
    upsertMeta('property', 'og:site_name', 'Hélder Carneiro');
    upsertMeta('property', 'og:image', imageUrl);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title || document.title);
    upsertMeta('name', 'twitter:description', description || '');
    upsertMeta('name', 'twitter:image', imageUrl);
  }

  window.HcSeo = {
    SITE_ORIGIN,
    DEFAULT_OG_IMAGE,
    absoluteUrl,
    setPageMeta,
  };
})();
