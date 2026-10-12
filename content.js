(() => {
  const { blockedURL, isGoogle } = globalThis.BlockedMatching;
  const googleSearch = () => isGoogle(location.hostname) && location.pathname === '/search';
  const selector = 'a[href], area[href]';
  function hideResult(link) {
    if (!googleSearch()) return;
    // Hide only the nearest result card; never a whole mixed-results section.
    const card = link.closest('.MjjYud, .g, .Gx5Zad, .SoaBEf, [data-news-cluster-id], .isv-r, [data-docid]');
    if (!card) { link.classList.add('blocked-hidden-result'); return; }
    const headings = [...card.querySelectorAll('a[href]')].filter(a => a.querySelector('h3'));
    if (headings.length && headings.some(a => !blockedURL(a.getAttribute('href')))) {
      link.classList.add('blocked-hidden-result');
      return;
    }
    card.classList.add('blocked-hidden-result');
  }
  function inspect(link) {
    const blocked = blockedURL(link.getAttribute('href'));
    if (blocked) {
      link.classList.add('blocked-social-link');
      hideResult(link);
    } else {
      link.classList.remove('blocked-social-link', 'blocked-hidden-result');
    }
  }
  const pending = new Set();
  let scheduled = false;
  function scan(root) {
    if (root.nodeType !== 1 && root.nodeType !== 9) return;
    if (root.matches?.(selector)) inspect(root);
    root.querySelectorAll(selector).forEach(inspect);
  }
  function schedule(root) {
    pending.add(root);
    if (scheduled) return;
    scheduled = true;
    setTimeout(() => {
      scheduled = false;
      const roots = [...pending];
      pending.clear();
      for (const root of roots) if (root.isConnected) scan(root);
    }, 0);
  }
  new MutationObserver(records => {
    for (const record of records) {
      if (record.type === 'attributes') {
        const card = record.target.closest('.blocked-hidden-result');
        card?.classList.remove('blocked-hidden-result');
        schedule(card || record.target);
      } else for (const node of record.addedNodes) schedule(node);
    }
  }).observe(document, { subtree: true, childList: true, attributes: true, attributeFilter: ['href'] });
  scan(document);
  for (const event of ['click', 'auxclick', 'keydown']) {
    document.addEventListener(event, e => {
      if (event === 'keydown' && e.key !== 'Enter') return;
      const link = e.composedPath().find(node => node.matches?.(selector));
      if (!link || !blockedURL(link.getAttribute('href'))) return;
      e.preventDefault();
      e.stopImmediatePropagation();
    }, true);
  }
})();
