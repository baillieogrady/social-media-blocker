(() => {
  const { domains, allowed } = globalThis.BLOCKED_SITES;
  const within = (host, domain) => host === domain || host.endsWith('.' + domain);
  const normalize = host => host.toLowerCase().replace(/\.+$/, '');
  const isGoogle = host => /^(?:www\.)?google\.(?:com|[a-z]{2}|co\.[a-z]{2}|com\.[a-z]{2})$/.test(normalize(host));
  function blockedURL(raw, base = location.href, depth = 0) {
    if (!raw || depth > 4) return false;
    let url;
    try { url = new URL(raw, base); } catch { return false; }
    if (!['http:', 'https:'].includes(url.protocol)) return false;
    const host = normalize(url.hostname);
    if (allowed.some(domain => within(host, domain))) return false;
    if (domains.some(domain => within(host, domain))) return true;
    // Unwrap Google's outbound links and image-result destinations only.
    if (isGoogle(host) && ['/url', '/imgres'].includes(url.pathname)) {
      return ['q', 'url', 'imgrefurl', 'imgurl'].some(key => blockedURL(url.searchParams.get(key), url.href, depth + 1));
    }
    return false;
  }
  globalThis.BlockedMatching = { blockedURL, isGoogle };
})();
