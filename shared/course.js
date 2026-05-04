// ── Engineering Crash Courses - Shared JS ──
(function() {
  var CFG = window.COURSE_CONFIG || {};
  var COURSE_SLUG = CFG.slug || 'unknown';
  var tocData = CFG.toc || [];
  
  var completedSections = new Set();
  var allCellIds = [];
  var runAllRunning = false;

  // ── Restore from localStorage ──
  try {
    var saved = JSON.parse(localStorage.getItem('ecc:' + COURSE_SLUG + ':completed') || '[]');
    saved.forEach(function(id) { completedSections.add(id); });
  } catch(e) {}

  // ── Build TOC Nav ──
  var nav = document.getElementById('side-nav');
  if (nav && tocData.length) {
    nav.innerHTML = tocData.map(function(item) {
      return '<a class="nav-item" href="#' + item.id + '" data-section="' + item.id + '" id="nav-' + item.id + '">' +
        '<span class="nav-num">' + item.num + '</span> ' + item.label + '</a>';
    }).join('');
  }

  // ── Add copy buttons to code cells ──
  document.querySelectorAll('.code-cell').forEach(function(cell) {
    var header = cell.querySelector('.code-header');
    if (!header) return;
    var btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = 'Copy';
    btn.onclick = function() {
      var code = cell.querySelector('.code-body pre');
      if (!code) return;
      var text = code.textContent;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function() {
          btn.textContent = 'Copied!';
          btn.classList.add('copied');
          setTimeout(function() { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
        });
      } else {
        // Fallback
        var ta = document.createElement('textarea');
        ta.value = text; document.body.appendChild(ta);
        ta.select(); document.execCommand('copy');
        document.body.removeChild(ta);
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(function() { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
      }
    };
    header.appendChild(btn);
  });

  // ── Mobile nav toggle ──
  var toggle = document.createElement('button');
  toggle.className = 'nav-toggle';
  toggle.textContent = '☰';
  toggle.onclick = function() {
    if (nav) nav.classList.toggle('open');
  };
  document.body.appendChild(toggle);

  // Close nav on link click (mobile)
  if (nav) {
    nav.addEventListener('click', function(e) {
      if (e.target.closest('.nav-item') && window.innerWidth <= 900) {
        nav.classList.remove('open');
      }
    });
  }

  // ── Quiz handling ──
  document.querySelectorAll('.quiz-box').forEach(function(box) {
    var correctIdx = parseInt(box.dataset.answer) || 0;
    var options = box.querySelectorAll('.quiz-option');
    var feedback = box.querySelector('.quiz-feedback');
    var answered = false;
    
    options.forEach(function(opt, idx) {
      opt.addEventListener('click', function() {
        if (answered) return;
        answered = true;
        if (idx === correctIdx) {
          opt.classList.add('correct');
          if (feedback) { feedback.textContent = '✓ Helyes!'; feedback.style.color = '#00ff88'; }
        } else {
          opt.classList.add('wrong');
          options[correctIdx].classList.add('correct');
          if (feedback) { feedback.textContent = '✗ Nem egészen. A helyes válasz zöld.'; feedback.style.color = '#ff4466'; }
        }
      });
    });
  });

  // ── Progress ──
  function updateProgress() {
    var totalSections = Math.max(tocData.length, document.querySelectorAll('.section[id]').length);
    var done = completedSections.size;
    var pct = totalSections > 0 ? Math.round((done / totalSections) * 100) : 0;
    var bar = document.getElementById('progress-bar');
    if (bar) bar.style.width = pct + '%';
    var txt = document.getElementById('progress-text');
    if (txt) txt.textContent = done + ' / ' + totalSections + ' section completed';
  }

  // ── Run Cell (with animation) ──
  window.runCell = function(cellId) {
    var cell = document.getElementById('cell-' + cellId);
    if (!cell) return;
    var output = document.getElementById('out-' + cellId);
    if (!output) return;
    var btn = cell.querySelector('.run-btn');

    if (cell.classList.contains('running') || (btn && btn.classList.contains('done-btn'))) return;

    if (allCellIds.indexOf(cellId) === -1) allCellIds.push(cellId);

    cell.classList.add('running');
    if (btn) {
      btn.classList.add('running-btn');
      btn.textContent = '⏳ Running...';
    }

    var delay = 400 + Math.random() * 800;
    setTimeout(function() {
      cell.classList.remove('running');
      cell.classList.add('has-output');
      if (btn) {
        btn.classList.remove('running-btn');
        btn.classList.add('done-btn');
        btn.textContent = '✓ Done';
      }
      output.classList.add('visible');

      var section = cell.closest('.section');
      if (section) {
        completedSections.add(section.id);
        section.classList.add('completed');
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
    // Reset quiz
    document.querySelectorAll('.quiz-option').forEach(function(o) {
      o.classList.remove('correct', 'wrong');
    });
    document.querySelectorAll('.quiz-feedback').forEach(function(f) { f.textContent = ''; });
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
        if (navItem.scrollIntoView) navItem.scrollIntoView({block: 'nearest', behavior: 'smooth'});
      }
    }
  }

  // ── Restore state on load ──
  function restoreProgress() {
    completedSections.forEach(function(sectionId) {
      var section = document.getElementById(sectionId);
      if (section) {
        section.classList.add('completed');
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
