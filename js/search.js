/* Static in-browser search over the precomputed index in search/.
   No server, no keys: shards are plain JSON fetched once on first query.
   Scoring is deliberately simple and inspectable — exact symbol/name matches
   dominate, then prefixes, then substrings, then path/heading/body hits.
   Deep links: site hits -> hash routes (with @heading anchors when the heading
   is the better match); code/CAD/fork hits -> GitHub blob URLs (+#L<line>). */
(function () {
  'use strict';

  let loaded = null;   // Promise once loading starts
  const items = [];    // unified searchable entries

  function slugify(text) {
    return (text.toLowerCase().replace(/[^\w\s-]/g, '').trim()
      .replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '')) || 'section';
  }
  function tokens(s) {
    return String(s)
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean);
  }
  function ghUrl(repo, branch, path, line) {
    const p = path.split('/').map(encodeURIComponent).join('/');
    return `https://github.com/${repo}/blob/${branch}/${p}` + (line ? `#L${line}` : '');
  }

  function addItem(it) {
    it.ltitle = it.title.toLowerCase();
    it.ttoks = tokens(it.title);
    it.haystack = [it.path || '', (it.headings || []).join(' '), it.extra || '', it.body || '']
      .join(' ').toLowerCase();
    items.push(it);
  }

  async function loadAll() {
    const manifest = await fetch('search/manifest.json').then((r) => {
      if (!r.ok) throw new Error('search index missing — run tools/build_search_index.py');
      return r.json();
    });
    const shards = await Promise.all(manifest.shards.map((s) =>
      fetch(s.file).then((r) => {
        if (!r.ok) throw new Error(`${s.file}: HTTP ${r.status}`);
        return r.json();
      })));
    for (const shard of shards) {
      if (shard.kind === 'site') {
        for (const e of shard.entries) {
          addItem({ kind: 'page', title: e.t, where: e.w, href: e.r, route: e.r,
                    headings: e.h, body: e.x, extra: e.extra || '', snippet: e.x });
        }
      } else if (shard.kind === 'cad') {
        for (const [stem, path, ext] of shard.parts) {
          addItem({ kind: 'cad', title: stem, where: `CAD (.${ext})`, path,
                    href: ghUrl(shard.repo, shard.branch, path),
                    snippet: path });
        }
      } else if (shard.kind === 'code') {
        const short = shard.repo.split('/')[1];
        for (const [label, path, line, kind] of shard.symbols) {
          addItem({ kind, title: label, where: short, path,
                    href: ghUrl(shard.repo, shard.branch, path, kind === 'file' ? 0 : line),
                    snippet: path + (line && kind !== 'file' ? `:L${line}` : '') });
        }
      } else if (shard.kind === 'forks') {
        for (const [repo, path, branch] of shard.files) {
          addItem({ kind: 'fork', title: path, where: repo, path: `${repo}/${path}`,
                    href: ghUrl(`${shard.org}/${repo}`, branch, path),
                    snippet: `${repo}/${path}` });
        }
      }
    }
    return items.length;
  }

  const KIND_BOOST = { page: 8, class: 8, cad: 4, fn: 2, file: 0, fork: -5 };

  function scoreItem(it, terms) {
    let score = 0;
    let matched = 0;
    for (const t of terms) {
      let s = 0;
      if (it.ltitle === t) s = 120;
      else if (it.ttoks.includes(t)) s = 50;
      else if (it.ltitle.startsWith(t)) s = 34;
      else if (it.ttoks.some((k) => k.startsWith(t))) s = 26;
      else if (it.ltitle.includes(t)) s = 18;
      if (it.haystack.includes(t)) s += s ? 6 : 10;
      if (s) matched += 1;
      score += s;
    }
    if (matched < terms.length) return 0;          // AND semantics
    const joined = terms.join(' ');
    if (it.ltitle === joined) score += 80;         // exact multi-word title
    else if (it.ltitle.includes(joined)) score += 25;
    return score + (KIND_BOOST[it.kind] || 0);
  }

  function bestHeadingAnchor(it, terms) {
    if (it.kind !== 'page' || !it.headings) return it.href;
    const titleHit = terms.some((t) => it.ltitle.includes(t) || it.ttoks.some((k) => k.startsWith(t)));
    if (titleHit) return it.href;
    for (const h of it.headings) {
      const hl = h.toLowerCase();
      if (terms.every((t) => hl.includes(t))) return `${it.route}@${slugify(h)}`;
    }
    return it.href;
  }

  async function query(q) {
    if (!loaded) loaded = loadAll();
    await loaded;
    const terms = tokens(q).slice(0, 8);
    if (!terms.length) return { total: items.length, results: [] };
    const scored = [];
    for (const it of items) {
      const s = scoreItem(it, terms);
      if (s > 0) scored.push([s, it]);
    }
    scored.sort((a, b) => b[0] - a[0] || a[1].title.localeCompare(b[1].title));
    return {
      total: items.length,
      results: scored.slice(0, 40).map(([s, it]) => ({
        score: s, kind: it.kind, title: it.title, where: it.where,
        href: bestHeadingAnchor(it, terms), snippet: it.snippet || '',
      })),
    };
  }

  window.HCSearch = { query };
}());
