/** Mapeamento desktop → mobile (media TM Leader Contract, prefixo BANNER-WEB / salone-mobile). */
(function () {
  const MOBILE_MQ = '(max-width: 767px)';

  const MOBILE_BY_DESKTOP = {
    '/assets/tm/banner-outdoor-1.webp': '/assets/tm/banner-outdoor-mobile.webp',
    '/assets/tm/banner-milano.webp': '/assets/tm/banner-milano-mobile.webp',
  };

  function isMobileViewport() {
    return window.matchMedia(MOBILE_MQ).matches;
  }

  function resolveTmImage(desktopSrc) {
    if (!desktopSrc || !isMobileViewport()) return desktopSrc;
    return MOBILE_BY_DESKTOP[desktopSrc] || desktopSrc;
  }

  function bindResponsiveImage(img, desktopSrc) {
    if (!img || !desktopSrc) return;
    const apply = () => {
      const next = resolveTmImage(desktopSrc);
      if (img.src !== new URL(next, window.location.origin).href) img.src = next;
    };
    apply();
    const mq = window.matchMedia(MOBILE_MQ);
    if (mq.addEventListener) mq.addEventListener('change', apply);
    else mq.addListener(apply);
  }

  window.TmResponsive = {
    MOBILE_MQ,
    MOBILE_BY_DESKTOP,
    isMobileViewport,
    resolveTmImage,
    bindResponsiveImage,
  };
})();
