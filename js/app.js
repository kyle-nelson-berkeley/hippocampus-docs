/* HippoCampus Robotics docs — hash router + renderers.
   Zero-build: this file, marked.min.js (vendored, MIT), and JSON/Markdown content.
   Slug rule mirrors tools/rst_convert.py slugify() — keep them in sync. */
(function () {
  'use strict';

  const $ = (sel, el) => (el || document).querySelector(sel);
  const content = $('#content');
  const sidebar = $('#sidebar');
  const DATA = {};          // site, setup, projects, tools
  const mdCache = {};       // path -> markdown text

  // ---------- utilities ----------
  function slugify(text) {
    return (text.toLowerCase().replace(/[^\w\s-]/g, '').trim()
      .replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '')) || 'section';
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function el(html) {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content;
  }
  async function fetchJSON(path) {
    const r = await fetch(path);
    if (!r.ok) throw new Error(`${path}: HTTP ${r.status}`);
    return r.json();
  }
  async function fetchMD(path) {
    if (mdCache[path]) return mdCache[path];
    const r = await fetch(path);
    if (!r.ok) throw new Error(`${path}: HTTP ${r.status}`);
    const text = await r.text();
    mdCache[path] = text;
    return text;
  }
  function setTitle(parts) {
    document.title = [...parts, 'HippoCampus Robotics'].filter(Boolean).join(' · ');
  }
  function errorPanel(err) {
    content.innerHTML =
      `<div class="error-panel"><h1>Something broke</h1>
       <p>${esc(err.message || String(err))}</p>
       <p>If you are running locally, serve the site with
       <code>./tools/serve.sh</code> (plain <code>file://</code> cannot fetch content).</p></div>`;
  }

  // ---------- markdown rendering + enhancement ----------
  function renderMarkdown(md) {
    marked.use({ mangle: false, headerIds: false });
    const html = marked.parse(md);
    const frag = el(`<div class="page-body">${html}</div>`);
    const body = frag.firstElementChild;
    enhance(body);
    return body;
  }

  function enhance(root) {
    // heading ids + anchors (h2+; h1 is the page itself)
    const assigned = new Set();
    root.querySelectorAll('h2, h3, h4').forEach((h) => {
      if (!h.id) {
        const base = slugify(h.textContent);
        let id = base;
        for (let n = 2; assigned.has(id); n += 1) id = `${base}-${n}`;
        h.id = id;
      }
      assigned.add(h.id);
      const a = document.createElement('a');
      a.className = 'heading-anchor';
      a.href = location.hash.split('@')[0] + '@' + h.id;
      a.textContent = '#';
      a.setAttribute('aria-label', 'Link to this section');
      h.appendChild(a);
    });
    // tabs
    root.querySelectorAll('.tabs').forEach((tabs) => {
      const panes = Array.from(tabs.children).filter((c) => c.classList.contains('tab'));
      if (!panes.length) return;
      const bar = document.createElement('div');
      bar.className = 'tabbar';
      bar.setAttribute('role', 'tablist');
      panes.forEach((pane, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.setAttribute('role', 'tab');
        btn.textContent = pane.dataset.label || `Tab ${i + 1}`;
        btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        btn.addEventListener('click', () => {
          panes.forEach((p) => p.classList.remove('active'));
          bar.querySelectorAll('button').forEach((b) => b.setAttribute('aria-selected', 'false'));
          pane.classList.add('active');
          btn.setAttribute('aria-selected', 'true');
        });
        bar.appendChild(btn);
        if (i === 0) pane.classList.add('active');
      });
      tabs.prepend(bar);
    });
    // code copy buttons (strip "$ " prompts when copying console blocks)
    root.querySelectorAll('pre').forEach((pre) => {
      const wrap = document.createElement('div');
      wrap.className = 'code-wrap';
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(pre);
      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.type = 'button';
      btn.textContent = 'copy';
      btn.addEventListener('click', () => {
        let text = pre.innerText;
        if (/^\$ /m.test(text)) {
          text = text.split('\n').map((l) => l.replace(/^\$ /, '')).join('\n');
        }
        navigator.clipboard.writeText(text.trimEnd()).then(() => {
          btn.textContent = 'copied';
          setTimeout(() => { btn.textContent = 'copy'; }, 1200);
        });
      });
      wrap.appendChild(btn);
    });
    // tables scroll on small screens
    root.querySelectorAll('table').forEach((t) => {
      const wrap = document.createElement('div');
      wrap.className = 'table-wrap';
      t.parentNode.insertBefore(wrap, t);
      wrap.appendChild(t);
    });
    // external links in new tabs
    root.querySelectorAll('a[href^="http"]').forEach((a) => {
      a.target = '_blank';
      a.rel = 'noopener';
    });
  }

  function scrollToAnchor(anchor) {
    if (!anchor) { window.scrollTo(0, 0); return; }
    const target = document.getElementById(anchor);
    if (target) target.scrollIntoView();
  }

  // ---------- sidebar ----------
  function sidebarSetup(activeId) {
    const parts = DATA.setup.sections.map((sec) => {
      const links = sec.pages.map((p) =>
        `<a href="#/setup/${p.id}" class="${p.id === activeId ? 'active' : ''}">${esc(p.title)}</a>`
      ).join('');
      return `<h3>${esc(sec.title)}</h3>${links}`;
    });
    sidebar.innerHTML = parts.join('');
    const act = sidebar.querySelector('a.active');
    if (act) act.scrollIntoView({ block: 'nearest' });
  }
  function sidebarList(title, items, base, activeId) {
    sidebar.innerHTML = `<h3>${esc(title)}</h3>` + items.map((it) =>
      `<a href="#${base}/${it.id}" class="${it.id === activeId ? 'active' : ''}">${esc(it.name || it.title)}</a>`
    ).join('');
  }

  function navHighlight(section) {
    document.querySelectorAll('.site-nav a').forEach((a) => {
      a.classList.toggle('active', a.dataset.nav === section);
    });
  }

  // ---------- views ----------
  function viewHome() {
    sidebar.innerHTML = '';
    setTitle([]);
    const s = DATA.site;
    content.innerHTML = `
      <div class="page-body" style="max-width:52rem">
        <p class="kicker">${esc(s.kicker)}</p>
        <h1>${esc(s.title)}</h1>
        <p class="lead">${esc(s.lead)}</p>
        <div class="card-grid">
          ${s.home_cards.map((c) => `
            <a class="card" href="${c.href}">
              <h3>${esc(c.title)} <span class="arrow">→</span></h3>
              <p>${esc(c.text)}</p>
            </a>`).join('')}
        </div>
        <p style="margin-top:2.5rem" class="lead">Looking for something specific?
        Use the search box above — it covers setup pages, projects, and tools
        <em>(full code &amp; CAD search lands with the search index build)</em>.</p>
      </div>`;
  }

  async function viewSetupPage(pageId, anchor) {
    const flat = DATA.setup.sections.flatMap((s) => s.pages);
    const page = flat.find((p) => p.id === pageId);
    if (!page) throw new Error(`No setup page “${pageId}”`);
    sidebarSetup(pageId);
    setTitle([page.title, 'Setup']);
    const md = await fetchMD(page.file);
    content.innerHTML = '';
    const body = renderMarkdown(md);
    // prev / next
    const i = flat.indexOf(page);
    const nav = document.createElement('nav');
    nav.className = 'page-nav';
    nav.innerHTML =
      (i > 0 ? `<a href="#/setup/${flat[i - 1].id}">← ${esc(flat[i - 1].title)}</a>` : '<span></span>') +
      (i < flat.length - 1 ? `<a href="#/setup/${flat[i + 1].id}" style="text-align:right">${esc(flat[i + 1].title)} →</a>` : '<span></span>');
    body.appendChild(nav);
    content.appendChild(body);
    scrollToAnchor(anchor);
  }

  function statusBadge(status) {
    return `<span class="badge ${esc(status)}">${esc(status)}</span>`;
  }

  function viewProjects() {
    sidebarList('Projects', DATA.projects.projects, '/projects', null);
    setTitle(['Projects']);
    const cards = DATA.projects.projects.map((p) => `
      <a class="card" href="#/projects/${p.id}">
        <h3>${esc(p.name)} ${statusBadge(p.status)}<span class="arrow">→</span></h3>
        <p>${esc(p.tagline)}</p>
        <div class="chips">${p.repos.slice(0, 5).map((r) => `<span class="chip">${esc(r.name)}</span>`).join('')}
        ${p.repos.length > 5 ? `<span class="chip">+${p.repos.length - 5} more</span>` : ''}</div>
      </a>`).join('');
    content.innerHTML = `
      <div class="page-body" style="max-width:64rem">
        <p class="kicker">The team's work</p>
        <h1>Projects</h1>
        <p class="lead">${esc(DATA.projects.intro)}</p>
        <div class="card-grid">${cards}</div>
        <p class="provenance">Coverage rule: every repository in the
        <a href="https://github.com/HippoCampusRobotics">HippoCampusRobotics org</a> belongs to exactly
        one project above (or is listed with a reason in the exclusions inside
        <code>data/projects.json</code>); <code>tools/check.py</code> enforces this.</p>
      </div>`;
  }

  async function viewProjectDetail(id, anchor) {
    const p = DATA.projects.projects.find((x) => x.id === id);
    if (!p) throw new Error(`No project “${id}”`);
    sidebarList('Projects', DATA.projects.projects, '/projects', id);
    setTitle([p.name, 'Projects']);
    const md = await fetchMD(p.file);
    const repoRows = p.repos.map((r) => `
      <li class="repo-row"><a class="chip" href="${esc(r.url)}">${esc(r.name)}</a>
      <span class="role">${esc(r.role || '')}</span></li>`).join('');
    const hw = (p.hardware || []).map((h) => `<li>${esc(h)}</li>`).join('');
    const docs = (p.links || []).map((l) => `<li><a href="${esc(l.href)}">${esc(l.label)}</a></li>`).join('');
    content.innerHTML = `
      <div style="max-width:64rem">
        <a class="back-link" href="#/projects">← All projects</a>
        <h1 style="margin-top:0.8rem">${esc(p.name)}</h1>
        <p class="lead">${esc(p.tagline)} ${statusBadge(p.status)}</p>
        <div class="detail-grid">
          <aside class="detail-aside"><div class="aside-box">
            <div><h3>Repositories</h3><ul>${repoRows}</ul></div>
            ${hw ? `<div><h3>Hardware</h3><ul>${hw}</ul></div>` : ''}
            ${docs ? `<div><h3>See also</h3><ul>${docs}</ul></div>` : ''}
          </div></aside>
          <div class="detail-main" id="project-md"></div>
        </div>
      </div>`;
    $('#project-md').appendChild(renderMarkdown(md));
    scrollToAnchor(anchor);
  }

  function viewTools() {
    sidebarList('Agent tools', DATA.tools.tools, '/tools', null);
    setTitle(['Agent tools']);
    const cards = DATA.tools.tools.map((t) => `
      <a class="card" href="#/tools/${t.id}">
        <h3>${esc(t.name)} <span class="arrow">→</span></h3>
        <p>${esc(t.tagline)}</p>
        <div class="chips">${(t.chips || []).map((c) => `<span class="chip">${esc(c)}</span>`).join('')}</div>
      </a>`).join('');
    content.innerHTML = `
      <div class="page-body" style="max-width:64rem">
        <p class="kicker">Agents in the lab</p>
        <h1>Agent tools</h1>
        <p class="lead">${esc(DATA.tools.intro)}</p>
        <div class="card-grid">${cards}</div>
      </div>`;
  }

  async function viewToolPage(id, anchor) {
    const t = DATA.tools.tools.find((x) => x.id === id);
    if (!t) throw new Error(`No tool “${id}”`);
    sidebarList('Agent tools', DATA.tools.tools, '/tools', id);
    setTitle([t.name, 'Agent tools']);
    const md = await fetchMD(t.file);
    content.innerHTML = '';
    content.appendChild(el(`<a class="back-link" href="#/tools">← All tools</a>`));
    content.appendChild(renderMarkdown(md));
    scrollToAnchor(anchor);
  }

  async function viewAbout(anchor) {
    sidebar.innerHTML = '';
    setTitle(['About']);
    const md = await fetchMD('content/about.md');
    content.innerHTML = '';
    content.appendChild(renderMarkdown(md));
    scrollToAnchor(anchor);
  }

  function viewSetupIndex() {
    // #/setup routes to the "start" landing page
    return viewSetupPage('start/index', null);
  }

  // ---------- search (phase-1: registries; code+CAD index lands in phase 2) ----------
  function searchCorpus() {
    const items = [];
    DATA.setup.sections.forEach((s) => s.pages.forEach((p) => items.push({
      kind: 'setup', title: p.title, where: `Setup · ${s.title}`,
      href: `#/setup/${p.id}`, text: `${s.title} ${p.old || ''}`,
    })));
    DATA.projects.projects.forEach((p) => {
      items.push({
        kind: 'project', title: p.name, where: 'Project',
        href: `#/projects/${p.id}`, text: `${p.tagline} ${p.repos.map((r) => r.name).join(' ')}`,
      });
      p.repos.forEach((r) => items.push({
        kind: 'repo', title: r.name, where: `Repo · ${p.name}`,
        href: `#/projects/${p.id}`, text: `${r.role || ''} ${r.desc || ''}`,
      }));
    });
    DATA.tools.tools.forEach((t) => items.push({
      kind: 'tool', title: t.name, where: 'Agent tool',
      href: `#/tools/${t.id}`, text: t.tagline,
    }));
    return items;
  }

  function viewSearch(query) {
    sidebar.innerHTML = '';
    setTitle([`Search: ${query}`]);
    const q = query.toLowerCase().trim();
    const terms = q.split(/\s+/).filter(Boolean);
    const scored = [];
    searchCorpus().forEach((item) => {
      const title = item.title.toLowerCase();
      const text = (item.text || '').toLowerCase();
      let score = 0;
      terms.forEach((t) => {
        if (title === t) score += 100;
        else if (title.includes(t)) score += 40;
        if (text.includes(t)) score += 10;
      });
      if (score > 0) scored.push([score, item]);
    });
    scored.sort((a, b) => b[0] - a[0]);
    const rows = scored.slice(0, 30).map(([, it]) => `
      <div class="result">
        <a class="title" href="${it.href}">${esc(it.title)}</a>
        <span class="where">${esc(it.where)}</span>
      </div>`).join('');
    content.innerHTML = `
      <div class="search-results">
        <h1>Search</h1>
        <p class="lead">${scored.length} result${scored.length === 1 ? '' : 's'} for
        “${esc(query)}” across page titles, projects, repos, and tools.</p>
        <div class="adm adm-note"><p class="adm-title">Scope</p>
        <p>This is the phase-1 registry search. Full-text search over every code repo
        and the CAD parts list ships with the precomputed index (phase 2).</p></div>
        ${rows || '<p>No results. Try a shorter or different term.</p>'}
      </div>`;
  }

  // ---------- router ----------
  async function route() {
    const hash = location.hash || '#/';
    const [pathPart, anchor] = hash.slice(1).split('@');
    const [path, queryStr] = pathPart.split('?');
    const seg = path.split('/').filter(Boolean);
    try {
      if (seg.length === 0) { navHighlight(null); viewHome(); }
      else if (seg[0] === 'setup' && seg.length === 1) { navHighlight('setup'); await viewSetupIndex(); }
      else if (seg[0] === 'setup') { navHighlight('setup'); await viewSetupPage(seg.slice(1).join('/'), anchor); }
      else if (seg[0] === 'projects' && seg.length === 1) { navHighlight('projects'); viewProjects(); }
      else if (seg[0] === 'projects') { navHighlight('projects'); await viewProjectDetail(seg[1], anchor); }
      else if (seg[0] === 'tools' && seg.length === 1) { navHighlight('tools'); viewTools(); }
      else if (seg[0] === 'tools') { navHighlight('tools'); await viewToolPage(seg[1], anchor); }
      else if (seg[0] === 'about') { navHighlight('about'); await viewAbout(anchor); }
      else if (seg[0] === 'search') {
        navHighlight(null);
        const q = new URLSearchParams(queryStr || '').get('q') || '';
        viewSearch(q);
      } else { throw new Error(`Unknown page: ${path}`); }
      if (!anchor) window.scrollTo({ top: 0, behavior: 'instant' });
    } catch (err) {
      errorPanel(err);
    }
  }

  // ---------- boot ----------
  function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem('hc-theme'); } catch (e) { /* private mode */ }
    if (saved === 'light') document.documentElement.dataset.theme = 'light';
    $('#theme-toggle').addEventListener('click', () => {
      const light = document.documentElement.dataset.theme === 'light';
      if (light) delete document.documentElement.dataset.theme;
      else document.documentElement.dataset.theme = 'light';
      try { localStorage.setItem('hc-theme', light ? 'dark' : 'light'); } catch (e) { /* ok */ }
    });
  }

  function initSearchBox() {
    const input = $('#search-input');
    $('#search-form').addEventListener('submit', (e) => {
      e.preventDefault();
      if (input.value.trim()) location.hash = `#/search?q=${encodeURIComponent(input.value.trim())}`;
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== input &&
          !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
        e.preventDefault();
        input.focus();
      }
    });
  }

  async function boot() {
    initTheme();
    initSearchBox();
    try {
      const [site, setup, projects, tools] = await Promise.all([
        fetchJSON('data/site.json'), fetchJSON('data/setup.json'),
        fetchJSON('data/projects.json'), fetchJSON('data/tools.json'),
      ]);
      Object.assign(DATA, { site, setup, projects, tools });
    } catch (err) {
      errorPanel(err);
      return;
    }
    window.addEventListener('hashchange', route);
    route();
  }

  boot();
}());
