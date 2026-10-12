// Run after editing sites.json: node build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
const base = new URL('./', import.meta.url);
const groups = JSON.parse(readFileSync(new URL('sites.json', base)));
const domains = [...new Set(Object.values(groups).flat())].sort();
const allowed = ['linkedin.com', 'lnkd.in'];
for (const domain of domains) {
  if (!/^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/.test(domain)) throw Error(`Invalid domain: ${domain}`);
  if (allowed.some(a => domain === a || domain.endsWith('.' + a) || a.endsWith('.' + domain))) throw Error(`Protected domain: ${domain}`);
}
writeFileSync(new URL('sites.js', base), `globalThis.BLOCKED_SITES = ${JSON.stringify({groups,domains,allowed},null,2)};\n`);
writeFileSync(new URL('rules.json', base), JSON.stringify([{
  id: 1, priority: 1, action: {type: 'block'},
  condition: {requestDomains: domains, resourceTypes: ['main_frame','sub_frame','stylesheet','script','image','font','object','xmlhttprequest','ping','csp_report','media','websocket','other']}
}], null, 2) + '\n');
console.log(`Built rules for ${domains.length} domains across ${Object.keys(groups).length} groups.`);
