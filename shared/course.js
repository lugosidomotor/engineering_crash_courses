// ── Engineering Crash Courses - Shared JS ──
(function() {
  // Config is set in the page: window.COURSE_CONFIG = { slug, toc }
  const CFG = window.COURSE_CONFIG || {};
  const COURSE_SLUG = CFG.slug || 'unknown';
  const tocData = CFG.toc || [];
  
  const completedSections = new Set();
  const allCellIds = [];

  // ── Restore ──
  try {
    const saved = JSON.parse(localStorage.getItem('ecc:' + COURSE_SLUG + ':completed') || '[]');
    saved.forEach(id => completedSections.add(id));
  } catch(e) {}

  // ── TOC Nav ──
  const nav = document.getElementById('side-nav');
  if (nav && tocData.length) {
    nav.innerHTML = tocData.map(item => 
      '<a class="nav-item" href="#' + item.id + '">' +
      '<span class="nav-num">' + item.num + '</span> ' + item.label + '</a>'
    ).join('');
  }

  // ── Progress ──
  function updateProgress() {
    const pct = Math.round((completedSections.size / tocData.length) * 100);
    const bar = document.getElementById('progress-bar');
    if (bar) bar.style.width = pct + '%';
    const txt = document.getElementById('progress-text');
    if (txt) txt.textContent = completedSections.size + ' / ' + tocData.length + ' section completed';
    document.querySelectorAll('.nav-item').forEach((a, i) => {
      if (i < tocData.length && completedSections.has(tocData[i].id))
        a.classList.add('done');
    });
  }
  updateProgress();

  // ── Run Cell ──
  window.runCell = function(id) {
    const out = document.getElementById('out-' + id);
    const cell = document.getElementById('cell-' + id);
    if (!out) return;
    
    if (!allCellIds.includes(id)) allCellIds.push(id);
    
    // If already has content, mark as run
    const pre = out.querySelector('pre');
    if (pre && pre.textContent.trim()) {
      out.classList.add('visible');
      if (cell) cell.classList.add('ran');
    }

    // Mark section completed
    if (cell) {
      const section = cell.closest('.section');
      if (section) {
        completedSections.add(section.id);
        section.classList.add('completed');
        localStorage.setItem('ecc:' + COURSE_SLUG + ':completed', JSON.stringify([...completedSections]));
      }
    }
    updateProgress();
  };

  // ── Run All ──
  window.runAll = function() {
    document.querySelectorAll('.code-cell').forEach(cell => {
      const id = cell.id.replace('cell-', '');
      runCell(id);
    });
  };

  // ── Reset ──
  window.resetAll = function() {
    completedSections.clear();
    localStorage.removeItem('ecc:' + COURSE_SLUG + ':completed');
    document.querySelectorAll('.code-cell.ran').forEach(c => c.classList.remove('ran'));
    document.querySelectorAll('.output-area.visible').forEach(o => o.classList.remove('visible'));
    document.querySelectorAll('.section.completed').forEach(s => s.classList.remove('completed'));
    updateProgress();
  };

  // ── Restore state on load ──
  completedSections.forEach(sid => {
    const section = document.getElementById(sid);
    if (section) {
      section.classList.add('completed');
      section.querySelectorAll('.code-cell').forEach(c => {
        c.classList.add('ran');
        const id = c.id.replace('cell-', '');
        const out = document.getElementById('out-' + id);
        if (out) out.classList.add('visible');
      });
    }
  });

  // ── Keyboard shortcuts ──
  document.addEventListener('keydown', e => {
    if (e.key === 'r' && e.ctrlKey && e.shiftKey) { e.preventDefault(); window.runAll(); }
  });
})();
