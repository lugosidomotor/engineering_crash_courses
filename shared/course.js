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
    if (txt) txt.textContent = done + ' / ' + totalSections + ' szekció kész';
  }

  // ── Mark section complete (works for any section, even without code) ──
  function markSectionComplete(sectionId, persist) {
    if (!sectionId) return;
    var section = document.getElementById(sectionId);
    if (!section) return;
    if (completedSections.has(sectionId)) return;
    completedSections.add(sectionId);
    section.classList.add('completed');
    var navItem = document.getElementById('nav-' + sectionId);
    if (navItem) navItem.classList.add('completed');
    var btn = section.querySelector('.section-complete-btn');
    if (btn) {
      btn.classList.add('done');
      btn.innerHTML = '✓ Kész';
    }
    if (persist !== false) {
      try {
        localStorage.setItem('ecc:' + COURSE_SLUG + ':completed', JSON.stringify(Array.from(completedSections)));
      } catch(e) {}
    }
    updateProgress();
  }
  function unmarkSectionComplete(sectionId) {
    if (!sectionId) return;
    var section = document.getElementById(sectionId);
    if (!section) return;
    completedSections.delete(sectionId);
    section.classList.remove('completed');
    var navItem = document.getElementById('nav-' + sectionId);
    if (navItem) navItem.classList.remove('completed');
    var btn = section.querySelector('.section-complete-btn');
    if (btn) {
      btn.classList.remove('done');
      btn.innerHTML = '○ Jelöld késznek';
    }
    try {
      localStorage.setItem('ecc:' + COURSE_SLUG + ':completed', JSON.stringify(Array.from(completedSections)));
    } catch(e) {}
    updateProgress();
  }
  window.markSectionComplete = markSectionComplete;

  // Add "mark complete" button to every section
  function addSectionCompleteButtons() {
    document.querySelectorAll('.section[id]').forEach(function(section) {
      if (section.id === 'further-learning-section') return;
      if (section.querySelector('.section-complete-btn')) return;
      var btn = document.createElement('button');
      btn.className = 'section-complete-btn';
      btn.type = 'button';
      var isDone = completedSections.has(section.id);
      btn.innerHTML = isDone ? '✓ Kész' : '○ Jelöld késznek';
      if (isDone) btn.classList.add('done');
      btn.addEventListener('click', function() {
        if (completedSections.has(section.id)) {
          unmarkSectionComplete(section.id);
        } else {
          markSectionComplete(section.id);
        }
      });
      section.appendChild(btn);
    });
  }

  // Auto-mark section as visited when it stays >3s with >40% in viewport
  function setupAutoMarkOnView() {
    if (!('IntersectionObserver' in window)) return;
    var timers = {};
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        var id = entry.target.id;
        if (!id || id === 'further-learning-section') return;
        if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
          if (!timers[id] && !completedSections.has(id)) {
            timers[id] = setTimeout(function() {
              // Only auto-mark if still visible
              var rect = entry.target.getBoundingClientRect();
              var visible = rect.top < window.innerHeight * 0.7 && rect.bottom > window.innerHeight * 0.2;
              if (visible) markSectionComplete(id);
              delete timers[id];
            }, 4000);
          }
        } else {
          if (timers[id]) { clearTimeout(timers[id]); delete timers[id]; }
        }
      });
    }, { threshold: [0.4, 0.6] });
    document.querySelectorAll('.section[id]').forEach(function(s) {
      if (s.id !== 'further-learning-section') observer.observe(s);
    });
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
    document.querySelectorAll('.section-complete-btn').forEach(function(b) { b.classList.remove('done'); b.innerHTML = '○ Jelöld késznek'; });
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

  // ── Injected "Course intro" panel at the top (tagline + prerequisites) ──
  function injectCourseIntro() {
    var main = document.getElementById('main-content');
    if (!main) return;
    var details = (window.COURSE_DETAILS || {})[COURSE_SLUG];
    if (!details) return;
    if (document.getElementById('course-intro-panel')) return;

    function escape(s){ return (s||'').replace(/[&<>"']/g, function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];}); }

    var html = '<div id="course-intro-panel" class="course-intro-panel">';
    if (details.tagline) {
      html += '<div class="cip-tagline">' + escape(details.tagline) + '</div>';
    }

    // Notebook download CTA (always try — file may or may not exist; link is per-slug)
    var nbName = (COURSE_SLUG === 'delta-table-crash-course')
      ? 'data_engineering_crash_course.ipynb'
      : 'notebook.ipynb';
    html += '<div class="cip-actions">';
    html += '<a class="cip-action cip-action-primary" href="./' + nbName + '" download><span>📓</span> Jupyter notebook letöltése</a>';
    html += '<a class="cip-action" href="https://github.com/lugosidomotor/engineering_crash_courses/blob/main/' + COURSE_SLUG + '/' + nbName + '" target="_blank" rel="noopener"><span>🐙</span> GitHub-on</a>';
    html += '</div>';

    var caseStudy = window.WEBSHOP_CASE_STUDY || null;
    var project = caseStudy && caseStudy.courses ? caseStudy.courses[COURSE_SLUG] : null;
    if (project) {
      html += '<div class="cip-project-panel">';
      html += '<div class="cip-project-copy">';
      html += '<div class="cip-block-title">🛒 WebShop Pro projektkapcsolat</div>';
      html += '<p>' + escape(project.role) + '</p>';
      html += '<dl>';
      html += '<dt>Ebben a kurzusban készül</dt><dd>' + escape(project.artifact) + '</dd>';
      html += '<dt>Miért hasznos a mindennapokban?</dt><dd>' + escape(project.dailyUse) + '</dd>';
      html += '</dl>';
      html += '<div class="cip-project-tools">' + (project.tools || []).map(function(t){ return '<span>' + escape(t) + '</span>'; }).join('') + '</div>';
      if (project.labServices && project.labServices.length) {
        html += '<div class="cip-lab-services"><strong>Local Docker Lab service-ek:</strong>' + project.labServices.map(function(s){ return '<span>' + escape(s) + '</span>'; }).join('') + '</div>';
      }
      if (caseStudy.lab && caseStudy.lab.command) {
        html += '<div class="cip-lab-command"><code>' + escape(caseStudy.lab.command) + '</code></div>';
      }
      html += '<div class="cip-actions cip-project-actions">';
      html += '<a class="cip-action cip-action-primary" href="../webshop-pro/" target="_blank" rel="noopener">WebShop Pro demo megnyitása</a>';
      html += '<a class="cip-action" href="../webshop-lab/" target="_blank" rel="noopener">Local Docker Lab</a>';
      html += '</div>';
      html += '</div>';
      html += '<div class="cip-project-shot"><img src="../assets/images/webshop-pro-dashboard.png" alt="WebShop Pro demo dashboard screenshot"></div>';
      html += '</div>';
    }

    if (details.prerequisites && details.prerequisites.length) {
      html += '<div class="cip-block"><div class="cip-block-title">🎯 Előfeltételek</div><ul class="cip-block-list">';
      details.prerequisites.forEach(function(p){ html += '<li>' + escape(p) + '</li>'; });
      html += '</ul></div>';
    }
    if (details.outcomes && details.outcomes.length) {
      html += '<div class="cip-block"><div class="cip-block-title">✅ Mit fogsz tudni a végén</div><ul class="cip-block-list">';
      details.outcomes.slice(0, 5).forEach(function(o){ html += '<li>' + escape(o) + '</li>'; });
      if (details.outcomes.length > 5) {
        html += '<li class="cip-more">… és még ' + (details.outcomes.length - 5) + ' dolog</li>';
      }
      html += '</ul></div>';
    }

    // Diagram (only if defined in courses-detail.js)
    if (details.diagram && details.diagram.svg) {
      html += '<div class="cip-diagram">';
      html += '<div class="cip-block-title">📊 ' + escape(details.diagram.title || 'Áttekintő diagram') + '</div>';
      html += '<div class="cip-diagram-svg">' + details.diagram.svg + '</div>';
      html += '</div>';
    }

    html += '</div>';

    main.insertAdjacentHTML('afterbegin', html);
  }

  // ── Injected "Further learning" section ──
  // Reads from window.COURSE_DETAILS (loaded separately from assets/courses-detail.js if present).
  function injectFurtherLearning() {
    var main = document.getElementById('main-content');
    if (!main) return;
    var details = (window.COURSE_DETAILS || {})[COURSE_SLUG];
    if (!details) return;
    if (document.getElementById('further-learning-section')) return;

    var rTypeLabels = {book:'Könyv',doc:'Docs',tutorial:'Tutorial',tool:'Tool',article:'Cikk',video:'Videó'};

    function escape(s){ return (s||'').replace(/[&<>"']/g, function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];}); }

    var html = '<div class="section layer-intro" id="further-learning-section" style="margin-top:80px">';
    html += '<div class="section-number">További</div>';
    html += '<h2>📚 További tanulás és következő lépések</h2>';

    var caseStudy = window.WEBSHOP_CASE_STUDY || null;
    var project = caseStudy && caseStudy.courses ? caseStudy.courses[COURSE_SLUG] : null;
    if (project) {
      html += '<div class="fl-project-recap">';
      html += '<strong>WebShop Pro-ban ezt a réteget építetted hozzá:</strong>';
      html += '<p>' + escape(project.artifact) + '</p>';
      if (project.labServices && project.labServices.length) {
        html += '<div class="fl-lab-services">' + project.labServices.map(function(s){ return '<span>' + escape(s) + '</span>'; }).join('') + '</div>';
      }
      html += '<a href="../webshop-pro/" target="_blank" rel="noopener">Demo megnyitása →</a>';
      html += '<a href="../webshop-lab/" target="_blank" rel="noopener">Local Docker Lab →</a>';
      html += '</div>';
    }

    if (details.tagline) {
      html += '<div class="md-cell" style="padding:14px 18px;background:rgba(179,102,255,.06);border-left:3px solid var(--purple);border-radius:8px;margin-bottom:20px;font-style:italic;color:var(--text)"><p style="margin:0">' + escape(details.tagline) + '</p></div>';
    }

    if (details.outcomes && details.outcomes.length) {
      html += '<h3>✅ Amit most már tudsz</h3><ul class="fl-list">';
      details.outcomes.forEach(function(o) { html += '<li>' + escape(o) + '</li>'; });
      html += '</ul>';
    }

    if (details.keyTopics && details.keyTopics.length) {
      html += '<h3>🎯 Kulcstémák áttekintése</h3>';
      html += '<div class="fl-topics">';
      details.keyTopics.forEach(function(t) {
        html += '<div class="fl-topic"><strong>' + escape(t.title) + '</strong><span>' + escape(t.desc) + '</span></div>';
      });
      html += '</div>';
    }

    if (details.resources && details.resources.length) {
      html += '<h3>🔗 Ajánlott források</h3><div class="fl-links">';
      details.resources.forEach(function(r) {
        html += '<a class="fl-link" href="' + escape(r.url) + '" target="_blank" rel="noopener">';
        html += '<span class="fl-link-type">' + (rTypeLabels[r.type] || escape(r.type)) + '</span>';
        html += '<span class="fl-link-title">' + escape(r.title) + '</span></a>';
      });
      html += '</div>';
    }

    if (details.videos && details.videos.length) {
      html += '<h3>▶️ Videó ajánló</h3><div class="fl-links">';
      details.videos.forEach(function(v) {
        html += '<a class="fl-link" href="' + escape(v.url) + '" target="_blank" rel="noopener">';
        html += '<span class="fl-link-type">Videó</span>';
        html += '<span class="fl-link-title">' + escape(v.title) + ' <span style="color:var(--text-dim)">· ' + escape(v.channel) + '</span></span></a>';
      });
      html += '</div>';
    }

    if (details.related && details.related.length) {
      html += '<h3>🔄 Kapcsolódó kurzusok</h3><div class="fl-related">';
      details.related.forEach(function(slug) {
        var label = slug.replace(/-/g,' ').replace(/\b\w/g, function(c){return c.toUpperCase();});
        html += '<a class="fl-related-chip" href="../' + slug + '/">' + label + ' →</a>';
      });
      html += '</div>';
    }

    html += '<div class="fl-back"><a href="../index.html" class="fl-back-btn">← Vissza az összes kurzushoz</a></div>';
    html += '</div>';

    main.insertAdjacentHTML('beforeend', html);
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
    injectCourseIntro();
    injectFurtherLearning();
    addSectionCompleteButtons();
    setupAutoMarkOnView();
  });

  // ── Keyboard shortcuts ──
  document.addEventListener('keydown', function(e) {
    if (e.key === 'r' && e.ctrlKey && e.shiftKey) { e.preventDefault(); window.runAll(); }
  });
})();
