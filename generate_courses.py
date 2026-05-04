#!/usr/bin/env python3
"""Generate all 4 crash course HTML files."""

import json

# ═══════════════════════════════════════════════
# TEMPLATE (compact CSS to keep file size manageable)
# ═══════════════════════════════════════════════

TPL = '''<!DOCTYPE html>
<html lang="hu">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title} — Crash Course</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Inter:wght@300;400;600;700;900&display=swap');
:root{{{vars}}}
*{{margin:0;padding:0;box-sizing:border-box;}}html{{scroll-behavior:smooth;}}
body{{background:var(--bg);color:var(--text);font-family:'Inter',sans-serif;line-height:1.7;}}
#pb{{position:fixed;top:0;left:0;height:3px;z-index:1000;background:linear-gradient(90deg,var(--accent),var(--green));transition:width .4s;width:0%;}}
header{{position:fixed;top:0;left:0;right:0;z-index:900;background:linear-gradient(180deg,rgba(10,10,15,.97),rgba(10,10,15,.9));backdrop-filter:blur(12px);border-bottom:1px solid var(--border);padding:10px 24px;display:flex;align-items:center;justify-content:space-between;}}
header h1{{font-family:'JetBrains Mono',monospace;font-size:1rem;font-weight:700;}}
header h1 a{{color:var(--accent);text-decoration:none;}}
.hl,.hr{{display:flex;align-items:center;gap:16px;}}
.ab,.rb{{padding:6px 14px;border-radius:8px;border:1px solid var(--border);background:var(--bg2);color:var(--text);font-size:.75rem;cursor:pointer;transition:all .2s;}}
.ab:hover{{border-color:var(--accent);background:rgba(0,212,255,.1);}}.rb:hover{{border-color:var(--red);background:rgba(255,68,102,.1);}}
#pt{{font-size:.75rem;color:var(--text-dim);}}
#nav{{position:fixed;top:52px;left:0;width:240px;height:calc(100vh - 52px);overflow-y:auto;background:var(--bg);border-right:1px solid var(--border);padding:12px 0;z-index:800;}}
.ni{{display:block;padding:6px 16px;color:var(--text-dim);text-decoration:none;font-size:.75rem;transition:all .15s;border-left:2px solid transparent;}}
.ni:hover{{color:var(--text);background:var(--bg2);}}.ni.ac{{color:var(--accent);border-left-color:var(--accent);background:var(--bg2);}}
.ni.dn{{color:var(--green);}}.ni.dn::before{{content:'\\2713 ';}}
.nn{{font-family:'JetBrains Mono',monospace;font-size:.65rem;margin-right:6px;color:var(--accent);opacity:.6;}}
#mc{{margin-left:240px;padding:72px 32px 80px;max-width:900px;}}
.s{{margin-bottom:48px;padding:24px;background:var(--bg2);border-radius:16px;border:1px solid var(--border);}}
.sn{{font-family:'JetBrains Mono',monospace;font-size:.7rem;color:var(--accent);opacity:.6;margin-bottom:8px;}}
.s h2{{font-size:1.3rem;font-weight:700;margin-bottom:16px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;}}
.m{{margin-bottom:16px;}}.m p{{margin-bottom:10px;}}.m strong{{color:var(--text);font-weight:600;}}
.m code{{background:var(--bg3);padding:2px 6px;border-radius:4px;font-family:'JetBrains Mono',monospace;font-size:.85rem;color:var(--accent);}}
.m pre{{background:var(--bg-code);padding:14px;border-radius:8px;font-family:'JetBrains Mono',monospace;font-size:.8rem;overflow-x:auto;margin:10px 0;border:1px solid var(--border);}}
.cc{{margin:16px 0;background:var(--bg-code);border:1px solid var(--border);border-radius:10px;overflow:hidden;}}
.ch{{display:flex;align-items:center;justify-content:space-between;padding:8px 14px;background:var(--bg3);border-bottom:1px solid var(--border);}}
.cn{{font-family:'JetBrains Mono',monospace;font-size:.7rem;color:var(--text-dim);}}
.rb2{{padding:4px 12px;border-radius:6px;border:1px solid var(--accent);background:transparent;color:var(--accent);font-size:.7rem;cursor:pointer;font-family:'JetBrains Mono',monospace;transition:all .2s;}}
.rb2:hover{{background:rgba(0,212,255,.1);}}.rb2.run{{border-color:var(--yellow);color:var(--yellow);animation:p 1s infinite;}}
.rb2.ok{{border-color:var(--green);color:var(--green);cursor:default;}}@keyframes p{{0%,100%{{opacity:1}}50%{{opacity:.5}}}}
.cb{{padding:14px;}}.cb pre{{font-family:'JetBrains Mono',monospace;font-size:.8rem;white-space:pre;}}
.cm{{color:#6a9955;}}.st{{color:#ce9178;}}.kw{{color:#569cd6;}}.fn{{color:#dcdcaa;}}.nm{{color:#b5cea8;}}
.oa{{padding:12px 14px;border-top:1px solid var(--border);display:none;}}.oa.v{{display:block;}}
.ol{{font-size:.7rem;color:var(--green);font-weight:600;margin-bottom:6px;font-family:'JetBrains Mono',monospace;}}
.oa pre{{font-family:'JetBrains Mono',monospace;font-size:.78rem;white-space:pre;color:var(--text-dim);}}
table{{width:100%;border-collapse:collapse;margin:12px 0;font-size:.82rem;}}
th{{background:var(--bg3);padding:8px 12px;text-align:left;font-weight:600;border-bottom:2px solid var(--border);color:var(--accent);}}
td{{padding:7px 12px;border-bottom:1px solid var(--border);}}tr:hover td{{background:var(--bg3);}}
.tb{{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;background:var(--bg3);font-size:.7rem;color:var(--text-dim);border:1px solid var(--border);}}
.tb img{{width:14px;height:14px;filter:brightness(0) invert(1) opacity(.7);}}
.co{{padding:16px;border-radius:10px;margin:16px 0;background:rgba(0,212,255,.05);border-left:3px solid var(--accent);}}
.co.sc{{background:rgba(0,255,136,.05);border-left-color:var(--green);}}
.ct{{font-weight:700;margin-bottom:6px;color:var(--accent);}}.co.sc .ct{{color:var(--green);}}
.af{{display:flex;align-items:center;gap:8px;margin:16px 0;flex-wrap:wrap;justify-content:center;}}
.as{{text-align:center;padding:12px;border:1px solid var(--border);border-radius:10px;min-width:100px;}}
.aa{{color:var(--accent);font-size:1.2rem;}}.ad{{font-size:.7rem;color:var(--text-dim);margin-top:4px;}}
@media(max-width:900px){{#nav{{display:none;}}#mc{{margin-left:0;padding:60px 16px 60px;}}}}
</style>
</head>
<body>
<div id="pb"></div>
<header><div class="hl"><h1><a href="../index.html">&lt;/&gt;</a> {title}</h1><span id="pt">0 / {scnt} section</span></div><div class="hr"><button class="ab" onclick="rA()">Run All</button><button class="rb" onclick="rR()">Reset</button></div></header>
<nav id="nav"></nav>
<main id="mc">{sections}
</main>
<script>
const D=new Set;
function bN(){{document.getElementById('nav').innerHTML={nav};}}
function rC(id){{const c=document.getElementById('c-'+id),o=document.getElementById('o-'+id);if(!c||!o)return;const b=c.querySelector('.rb2');if(c.classList.contains('running')||b.classList.contains('ok'))return;c.classList.add('running');b.classList.add('run');b.textContent='\\u23f3 Running...';setTimeout(()=>{{c.classList.remove('running');b.classList.remove('run');b.classList.add('ok');b.textContent='\\u2713 Done';o.classList.add('v');const s=c.closest('.s');if(s){{D.add(s.id);const n=document.getElementById('n-'+s.id);if(n)n.classList.add('dn');}}uP();}},400+Math.random()*800);}}
function uP(){{const t=document.querySelectorAll('.s').length,d=D.size;document.getElementById('pb').style.width=Math.round(d/t*100)+'%';document.getElementById('pt').textContent=d+' / '+t+' section';}}
async function rA(){{for(const c of document.querySelectorAll('.cc')){{const id=c.id.replace('c-',''),b=c.querySelector('.rb2');if(!b.classList.contains('ok')){{rC(id);await new Promise(r=>setTimeout(r,300+Math.random()*200));}}}}}}
function rR(){{D.clear();document.querySelectorAll('.cc').forEach(c=>{{c.classList.remove('running');const id=c.id.replace('c-',''),o=document.getElementById('o-'+id);if(o)o.classList.remove('v');const b=c.querySelector('.rb2');if(b){{b.classList.remove('run','ok');b.textContent='\\u25b6 Run';}}}});document.querySelectorAll('.ni').forEach(n=>n.classList.remove('dn'));uP();}}
function uN(){{let a=null;document.querySelectorAll('.s').forEach(s=>{{if(s.getBoundingClientRect().top<=120)a=s.id;}});document.querySelectorAll('.ni').forEach(n=>n.classList.remove('ac'));if(a){{const n=document.getElementById('n-'+a);if(n){{n.classList.add('ac');n.scrollIntoView({{block:'nearest'}});}}}}}}
document.addEventListener('DOMContentLoaded',()=>{{bN();uP();window.addEventListener('scroll',uN,{{passive:true}});uN();}});
</script>
</body>
</html>'''

VARS = '--bg:#0a0a0f;--bg2:#111118;--bg3:#1a1a25;--bg-code:#0d1117;--cyan:#00d4ff;--green:#00ff88;--orange:#ff8800;--purple:#b366ff;--yellow:#ffd700;--red:#ff4466;--text:#e0e0e8;--text-dim:#888899;--border:#2a2a3a;--accent:{accent};'

def build(title, accent, toc, sections):
    nav_items = []
    for sid, num, label in toc:
        nav_items.append(f'<a href="#{sid}" class="ni" id="n-{sid}"><span class="nn">{num}</span>{label}</a>')
    nav_str = "'" + "\\n".join(nav_items) + "'"
    return TPL.format(title=title, accent=accent, scnt=len(toc), vars=VARS.format(accent=accent), sections='\n'.join(sections), nav=nav_str)

# Shortcuts
def S(id_, num, title, content):
    return f'<div class="s" id="{id_}"><div class="sn">Section {num}</div><h2>{title}</h2>{content}</div>'
def M(text):
    return f'<div class="m">{text}</div>'
def C(id_, code, output):
    return f'<div class="cc" id="c-{id_}"><div class="ch"><span class="cn">[{id_}]</span><button class="rb2" onclick="rC(\'{id_}\')">&#9654; Run</button></div><div class="cb"><pre>{code}</pre></div><div class="oa" id="o-{id_}"><div class="ol">Output:</div>{output}</div></div>'
def T(headers, rows):
    h = '</th><th>'.join(headers)
    html = f'<table><tr><th>{h}</th></tr>'
    for r in rows:
        html += '<tr><td>' + '</td><td>'.join(str(c) for c in r) + '</td></tr>'
    return html + '</table>'
def CO(title, text, sc=False):
    return f'<div class="co{" sc" if sc else ""}"><div class="ct">{title}</div>{text}</div>'
def F(steps):
    html = '<div class="af">'
    for i,(l,d) in enumerate(steps):
        html += f'<div class="as"><strong>{l}</strong><div class="ad">{d}</div></div>'
        if i<len(steps)-1: html += '<div class="aa">→</div>'
    return html + '</div>'
def B(name, logo):
    return f'<span class="tb"><img src="assets/logos/{logo}">{name}</span>'

print("Template and helpers ready.")
print(f"Template size: {len(TPL)} chars")
