// ── Engineering Crash Courses - Shared JS ──
(function() {
  const CFG = window.COURSE_CONFIG || {};
  const COURSE_SLUG = CFG.slug || 'unknown';
  const tocData = CFG.toc || [];
  
  const completedSections = new Set();
  const allCellIds = [];
  let runAllRunning = false;

  // ── Restore from localStorage ──
  try {
    const saved = JSON.parse(localStorage.getItem('ecc:' + COURSE_SLUG + ':completed') || '[]');
    saved.forEach(id => completedSections.add(id));
  } catch(e) {}

  // ── Build TOC Nav ──
  const nav = document.getElementById('side-nav');
  if (nav && tocData.length) {
    nav.innerHTML = tocData.map(item => 
      '<a class="nav-item" href="#' + item.id + '" data-section="' + item.id + '" id="nav-' + item.id + '">' +
      '<span class="nav-num">' + item.num + '</span> ' + item.label + '</a>'
    ).join('');
  }

  // ── Progress ──
  function updateProgress() {
    const totalSections = Math.max(tocData.length, document.querySelectorAll('.section[id]').length);
    const done = completedSections.size;
    const pct = totalSections > 0 ? Math.round((done / totalSections) * 100) : 0;
    const bar = document.getElementById('progress-bar');
    if (bar) bar.style.width = pct + '%';
    const txt = document.getElementById('progress-text');
    if (txt) txt.textContent = done + ' / ' + totalSections + ' section completed';
  }

  // ── Run Cell (with animation) ──
  window.runCell = function(cellId) {
    const cell = document.getElementById('cell-' + cellId);
    if (!cell) return;
    const output = document.getElementById('out-' + cellId);
    if (!output) return;
    const btn = cell.querySelector('.run-btn');

    if (cell.classList.contains('running') || (btn && btn.classList.contains('done-btn'))) return;

    if (!allCellIds.includes(cellId)) allCellIds.push(cellId);

    // Start running
    cell.classList.add('running');
    if (btn) {
      btn.classList.add('running-btn');
      btn.textContent = '⏳ Running...';
    }

    // Simulate execution
    const delay = 400 + Math.random() * 800;
    setTimeout(function() {
      cell.classList.remove('running');
      cell.classList.add('has-output');
      if (btn) {
        btn.classList.remove('running-btn');
        btn.classList.add('done-btn');
        btn.textContent = '✓ Done';
      }
      output.classList.add('visible');

      // Mark section completed
      var section = cell.closest('.section');
      if (section) {
        completedSections.add(section.id);
        try {
          localStorage.setItem('ecc:' + COURSE_SLUG + ':completed', JSON.stringify(Array.from(completedSections)));
        } catch(e) {}
        var navItem = document.getElementById('nav-' + section.id);
        if (navItem) navItem.classList.add('completed');
      }
      updateProgress();
    }, delay);
  };

  // ── Run All ──
  window.runAll = async function() {
    if (runAllRunning) return;
    runAllRunning = true;
    var cells = document.querySelectorAll('.code-cell');
    for (var i = 0; i < cells.length; i++) {
      var cell = cells[i];
      var id = cell.id.replace('cell-', '');
      var btn = cell.querySelector('.run-btn');
      if (!btn || !btn.classList.contains('done-btn')) {
        window.runCell(id);
        await new Promise(function(r) { setTimeout(r, 300 + Math.random() * 200); });
      }
    }
    runAllRunning = false;
  };

  // ── Reset ──
  window.resetAll = function() {
    completedSections.clear();
    localStorage.removeItem('ecc:' + COURSE_SLUG + ':completed');
    document.querySelectorAll('.code-cell').forEach(function(cell) {
      cell.classList.remove('running', 'has-output');
      var id = cell.id.replace('cell-', '');
      var output = document.getElementById('out-' + id);
      if (output) output.classList.remove('visible');
      var btn = cell.querySelector('.run-btn');
      if (btn) {
        btn.classList.remove('running-btn', 'done-btn');
        btn.textContent = '▶ Run';
      }
    });
    document.querySelectorAll('.nav-item').forEach(function(n) { n.classList.remove('completed', 'active'); });
    document.querySelectorAll('.section.completed').forEach(function(s) { s.classList.remove('completed'); });
    updateProgress();
  };

  // ── Scroll spy ──
  function updateActiveNav() {
    var sections = document.querySelectorAll('.section[id]');
    var activeId = null;
    sections.forEach(function(s) {
      var rect = s.getBoundingClientRect();
      if (rect.top <= 120) activeId = s.id;
    });
    document.querySelectorAll('.nav-item').forEach(function(n) { n.classList.remove('active'); });
    if (activeId) {
      var navItem = document.getElementById('nav-' + activeId);
      if (navItem) {
        navItem.classList.add('active');
        navItem.scrollIntoView({block: 'nearest', behavior: 'smooth'});
      }
    }
  }

  // ── Restore state on load ──
  function restoreProgress() {
    completedSections.forEach(function(sectionId) {
      var section = document.getElementById(sectionId);
      if (section) {
        var navItem = document.getElementById('nav-' + sectionId);
        if (navItem) navItem.classList.add('completed');
        section.querySelectorAll('.code-cell').forEach(function(cell) {
          var id = cell.id.replace('cell-', '');
          var btn = cell.querySelector('.run-btn');
          var output = document.getElementById('out-' + id);
          cell.classList.add('has-output');
          if (btn) { btn.classList.add('done-btn'); btn.textContent = '✓ Done'; }
          if (output) output.classList.add('visible');
        });
      }
    });
    updateProgress();
  }

  // ── Init ──
  document.addEventListener('DOMContentLoaded', function() {
    updateProgress();
    document.querySelectorAll('.code-cell').forEach(function(cell) {
      allCellIds.push(cell.id.replace('cell-', ''));
    });
    window.addEventListener('scroll', updateActiveNav, {passive: true});
    updateActiveNav();
    restoreProgress();
  });

  // ── Keyboard shortcuts ──
  document.addEventListener('keydown', function(e) {
    if (e.key === 'r' && e.ctrlKey && e.shiftKey) { e.preventDefault(); window.runAll(); }
  });
})();
