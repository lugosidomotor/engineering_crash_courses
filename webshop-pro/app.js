/* ============================================================
   WebShop Pro — app.js
   Teljesen interaktív dummy webshop frontend
   ============================================================ */

const fmt = new Intl.NumberFormat('hu-HU');
const API_BASE = window.WEBSHOP_API_URL || 'http://localhost:8000';
const SHOULD_USE_API = window.WEBSHOP_FORCE_API || window.location.port === '8010' || new URLSearchParams(window.location.search).get('api') === '1';

/* ---- Tool grid adatok ---- */
const tools = [
  ['SQL', 'relációs modell, JOIN, KPI query', 'postgres'],
  ['Python', 'ingest, validáció, CLI pipeline', 'lab-runner'],
  ['pandas', 'kis volumenű lokális adatmunka', 'lab-runner'],
  ['Docker', 'lokális fejlesztői stack', 'docker-compose.yml'],
  ['PostgreSQL', 'relációs source és serving DB', 'postgres'],
  ['MinIO', 'S3-kompatibilis objektumtár', 'minio'],
  ['Parquet', 'oszloporientált file format', 'lab-runner'],
  ['Delta Lake', 'bronze/silver/gold tranzakciók', 'lab-runner'],
  ['Apache Iceberg', 'open table format összehasonlítás', 'unity-catalog'],
  ['Apache Hudi', 'upsert-heavy lakehouse alternatíva', 'spark-master'],
  ['Spark', 'nagy volumen ETL és feature tábla', 'spark-master'],
  ['Airflow', 'napi webshop_etl DAG', 'airflow'],
  ['dbt', 'staging, marts, tesztek', 'dbt'],
  ['Kafka', 'clickstream eventek', 'kafka'],
  ['Feast', 'customer feature store', 'lab-runner'],
  ['Great Expectations', 'adatminőségi ellenőrzés', 'lab-runner'],
  ['Databricks', 'managed lakehouse workflow', 'databricks-local'],
  ['Unity Catalog', 'governance és jogosultság', 'unity-catalog'],
  ['MLflow', 'churn modell követés', 'mlflow'],
  ['FastAPI', 'model serving API', 'api'],
  ['Grafana', 'üzleti és ML monitoring', 'grafana'],
  ['Prometheus', 'metrikagyűjtés', 'prometheus'],
  ['OpenAI', 'support RAG válasz', 'api/streamlit'],
  ['ChromaDB', 'vektoros policy kereső', 'chroma'],
  ['Streamlit', 'AI support UI', 'streamlit'],
  ['Kubernetes', 'production deploy mental model', 'kubernetes manifest']
];

/* ---- Véletlenszerű adatgeneráláshoz ---- */
const CUSTOMERS = [
  'Nagy Gábor', 'Kovács Éva', 'Tóth Péter', 'Szabó Anna', 'Varga István',
  'Horváth Katalin', 'Kiss Tamás', 'Molnár Judit', 'Farkas László', 'Papp Mária',
  'Lakatos Ferenc', 'Szűcs Ildikó', 'Balogh Zoltán', 'Németh Csilla', 'Fehér Gábor',
  'Vörös Erika', 'Budai Attila', 'Pintér Réka', 'Székely Balázs', 'Márton Adrienn',
  'Bogdán Árpád', 'Oláh Melinda', 'Pál Zsolt', 'Simon Tímea', 'Rácz Norbert'
];
const CITIES = ['Budapest', 'Debrecen', 'Szeged', 'Miskolc', 'Pécs', 'Győr', 'Nyíregyháza', 'Kecskemét', 'Székesfehérvár', 'Szolnok'];
const CHANNELS = ['web', 'mobil', 'email', 'partner', 'demo', 'social'];
const EVENT_TYPES = ['product_view', 'add_to_cart', 'checkout_started', 'search', 'support_question'];
const PRODUCT_EMOJIS = ['💻', '🖥️', '⌨️', '🖱️', '🎧', '📱', '🖨️', '📷', '🔌', '🔋', '🎮', '🖥️', '💾', '🎤', '🔊', '⌚'];

/* ---- Alkalmazás állapot ---- */
const state = {
  catalog: [],
  orders: [],
  events: [],
  cart: [],          // [{product, qty}]
  activeView: 'shop',
  apiConnected: false,
  autoOrderTimer: null,
  refreshTimer: null
};

/* ============================================================
   API / Fixture segédfüggvények
   ============================================================ */

async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Nem sikerült betölteni: ${path}`);
  return response.json();
}

async function loadFromApi(path) {
  const response = await fetch(`${API_BASE}${path}`, { mode: 'cors' });
  if (!response.ok) throw new Error(`API hiba: ${path}`);
  return response.json();
}

async function postToApi(path, body) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!response.ok) throw new Error(`API POST hiba: ${path}`);
  return response.json();
}

/* ============================================================
   Toast értesítések
   ============================================================ */

function showToast(message, type = 'info', duration = 3200) {
  const container = document.querySelector('#toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toast-out .3s ease-in forwards';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ============================================================
   Nézetváltás (tab-ok)
   ============================================================ */

function switchView(viewName) {
  state.activeView = viewName;
  document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));

  const section = document.querySelector(`#view-${viewName}`);
  if (section) section.classList.add('active');

  const tab = document.querySelector(`.nav-tab[data-view="${viewName}"]`);
  if (tab) tab.classList.add('active');

  renderActiveView();
}

function renderActiveView() {
  switch (state.activeView) {
    case 'shop': renderShop(); break;
    case 'admin': renderAdmin(); break;
    case 'dashboard': renderDashboard(); break;
  }
}

/* ============================================================
   Kosár logika
   ============================================================ */

function openCart() {
  document.querySelector('#cart-overlay').classList.add('open');
  document.querySelector('#cart-sidebar').classList.add('open');
  renderCart();
}

function closeCart() {
  document.querySelector('#cart-overlay').classList.remove('open');
  document.querySelector('#cart-sidebar').classList.remove('open');
}

function addToCart(product) {
  const existing = state.cart.find(item => item.product.sku === product.sku);
  if (existing) {
    existing.qty++;
  } else {
    state.cart.push({ product, qty: 1 });
  }
  updateCartBadge();
  showToast(`${product.name} a kosárba került!`, 'success', 2000);
  // Termék nézet frissítés (készlet mutató)
  if (state.activeView === 'shop') renderShop();
}

function removeFromCart(sku) {
  state.cart = state.cart.filter(item => item.product.sku !== sku);
  updateCartBadge();
  renderCart();
  if (state.activeView === 'shop') renderShop();
}

function changeQty(sku, delta) {
  const item = state.cart.find(i => i.product.sku === sku);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  updateCartBadge();
  renderCart();
}

function updateCartBadge() {
  const count = state.cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.querySelector('#cart-count');
  badge.textContent = count || '';
}

function getCartTotal() {
  return state.cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
}

function renderCart() {
  const body = document.querySelector('#cart-body');
  const footer = document.querySelector('#cart-footer');

  if (state.cart.length === 0) {
    body.innerHTML = '<div class="cart-empty">🛒 A kosár üres</div>';
    footer.innerHTML = '';
    return;
  }

  body.innerHTML = state.cart.map(item => {
    const p = item.product;
    const emojiIdx = state.catalog.indexOf(p) % PRODUCT_EMOJIS.length;
    const emoji = PRODUCT_EMOJIS[Math.abs(emojiIdx)] || '📦';
    return `
      <div class="cart-item">
        <div class="cart-item-img">${emoji}</div>
        <div class="cart-item-info">
          <strong>${p.name}</strong>
          <small>${p.brand} · ${fmt.format(p.price)} Ft / db</small>
        </div>
        <div class="cart-item-qty">
          <button onclick="changeQty('${p.sku}', -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty('${p.sku}', 1)">+</button>
        </div>
        <div class="cart-item-price">${fmt.format(p.price * item.qty)} Ft</div>
        <button onclick="removeFromCart('${p.sku}')" style="background:none;border:none;color:var(--red);cursor:pointer;font-size:1rem;padding:4px" title="Eltávolítás">✕</button>
      </div>
    `;
  }).join('');

  footer.innerHTML = `
    <div class="cart-total">
      <span>Összesen:</span>
      <span class="amount">${fmt.format(getCartTotal())} Ft</span>
    </div>
    <button class="button primary" onclick="checkout()" style="width:100%;text-align:center;font-size:1rem">
      💳 Vásárlás
    </button>
  `;
}

async function checkout() {
  if (state.cart.length === 0) return;

  const cartItems = [...state.cart];
  let successCount = 0;

  for (const item of cartItems) {
    try {
      if (state.apiConnected) {
        await postToApi('/api/simulate-order', {
          sku: item.product.sku,
          qty: item.qty,
          customer_id: `C-${1800 + Math.floor(Math.random() * 400)}`,
          city: CITIES[Math.floor(Math.random() * CITIES.length)],
          channel: CHANNELS[Math.floor(Math.random() * CHANNELS.length)]
        });
      }
      successCount++;
    } catch (e) {
      // Fallback: lokális rendelés
      const order = createLocalOrder(item.product, item.qty);
      state.orders.push(order);
      state.events.push(createLocalEvent(order));
      item.product.stock = Math.max(0, item.product.stock - item.qty);
      successCount++;
    }
  }

  // Készlet csökkentése API esetén is
  if (state.apiConnected) {
    for (const item of cartItems) {
      item.product.stock = Math.max(0, item.product.stock - item.qty);
    }
  }

  state.cart = [];
  updateCartBadge();
  closeCart();

  showToast(`Sikeres vásárlás! ${successCount} tétel leadva.`, 'success', 4000);

  // Frissítés
  await refreshData();
  renderActiveView();
}

/* ============================================================
   Bolt nézet (termékkatalógus)
   ============================================================ */

function renderShop() {
  const grid = document.querySelector('#product-grid');
  const label = document.querySelector('#product-count-label');

  if (label) label.textContent = `${state.catalog.length} termék elérhető`;

  grid.innerHTML = state.catalog.map((p, idx) => {
    const emoji = PRODUCT_EMOJIS[idx % PRODUCT_EMOJIS.length];
    const inCart = state.cart.find(i => i.product.sku === p.sku);
    const outOfStock = p.stock <= 0;
    return `
      <div class="product-card">
        <div class="product-img">${emoji}</div>
        <div class="product-body">
          <div class="brand-name">${p.brand}</div>
          <h3 class="product-name">${p.name}</h3>
          <div class="product-meta">
            <span class="product-price">${fmt.format(p.price)} Ft</span>
            <span class="product-stock ${p.stock < 12 ? 'low' : ''}">${p.stock} db készleten</span>
          </div>
          <button class="add-cart-btn" onclick="addToCart(state.catalog[${idx}])"
            ${outOfStock ? 'disabled' : ''}>
            ${outOfStock ? '🚫 Elfogyott' : (inCart ? `🛒 Kosárban (${inCart.qty})` : '🛒 Kosárba')}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

/* ============================================================
   Admin nézet
   ============================================================ */

function renderAdmin() {
  renderAdminStats();
  renderAdminOrders();
  renderAdminStock();
}

function renderAdminStats() {
  const paidOrders = state.orders.filter(o => o.status === 'paid');
  const totalRevenue = paidOrders.reduce((s, o) => s + o.gross_amount, 0);
  const container = document.querySelector('#admin-stats');
  container.innerHTML = `
    <div class="admin-stat">
      <label>Összes bevétel</label>
      <strong>${fmt.format(totalRevenue)} Ft</strong>
    </div>
    <div class="admin-stat">
      <label>Rendelések száma</label>
      <strong>${state.orders.length}</strong>
    </div>
    <div class="admin-stat">
      <label>Fizetett rendelések</label>
      <strong>${paidOrders.length}</strong>
    </div>
  `;
}

function renderAdminOrders() {
  const tbody = document.querySelector('#admin-orders-table');
  const sorted = [...state.orders].sort((a, b) => new Date(b.ordered_at) - new Date(a.ordered_at));
  tbody.innerHTML = sorted.slice(0, 50).map(o => {
    const product = state.catalog.find(p => p.sku === o.sku);
    const statusColor = o.status === 'paid' ? 'var(--green)' : (o.status === 'cancelled' ? 'var(--red)' : 'var(--yellow)');
    return `
      <tr>
        <td class="sku">${o.order_id}</td>
        <td>${o.customer_id}</td>
        <td>${product ? product.name : o.sku}</td>
        <td>${o.qty}</td>
        <td>${fmt.format(o.gross_amount)} Ft</td>
        <td>${o.city}</td>
        <td>${o.channel}</td>
        <td style="color:${statusColor};font-weight:700">${o.status}</td>
        <td style="font-size:.78rem;color:var(--muted)">${new Date(o.ordered_at).toLocaleString('hu-HU')}</td>
      </tr>
    `;
  }).join('');
}

function renderAdminStock() {
  const tbody = document.querySelector('#admin-stock-table');
  tbody.innerHTML = state.catalog.map(p => `
    <tr>
      <td class="sku">${p.sku}</td>
      <td><strong>${p.name}</strong></td>
      <td>${p.brand}</td>
      <td>${p.category}</td>
      <td class="stock ${p.stock < 12 ? 'low' : ''}">${p.stock} db</td>
      <td>${fmt.format(p.price)} Ft</td>
      <td>${Math.round(p.margin * 100)}%</td>
    </tr>
  `).join('');
}

/* ============================================================
   Dashboard nézet
   ============================================================ */

function renderDashboard() {
  renderMetrics();
  renderProductTable();
  renderEventFeed();
}

function renderMetrics() {
  const paidOrders = state.orders.filter(o => o.status === 'paid');
  const revenue = paidOrders.reduce((s, o) => s + o.gross_amount, 0);
  const sessions = new Set(state.events.map(e => e.session_id)).size || 1;
  const checkoutEvents = state.events.filter(e => e.event_type === 'checkout_started').length;

  document.querySelector('#revenue').textContent = `${fmt.format(revenue)} Ft`;
  document.querySelector('#conversion').textContent = `${Math.round((checkoutEvents / sessions) * 100)}%`;
  document.querySelector('#aov').textContent = `${fmt.format(Math.round(revenue / Math.max(paidOrders.length, 1)))} Ft`;
  document.querySelector('#order-count').textContent = state.orders.length;
}

function renderProductTable() {
  const revenue = {};
  state.orders.filter(o => o.status === 'paid').forEach(o => {
    revenue[o.sku] = (revenue[o.sku] || 0) + o.gross_amount;
  });
  document.querySelector('#product-table').innerHTML = state.catalog.map(p => `
    <tr>
      <td class="sku">${p.sku}</td>
      <td><strong>${p.name}</strong><br><small>${p.brand}</small></td>
      <td>${p.category}</td>
      <td class="stock ${p.stock < 12 ? 'low' : ''}">${p.stock} db</td>
      <td>${fmt.format(revenue[p.sku] || 0)} Ft</td>
      <td>${Math.round(p.margin * 100)}%</td>
    </tr>
  `).join('');
}

function renderEventFeed() {
  const labels = {
    product_view: '👀 termék megtekintés',
    add_to_cart: '🛒 kosárba rakás',
    checkout_started: '💳 checkout indult',
    search: '🔍 keresés',
    support_question: '🎧 support kérdés'
  };
  document.querySelector('#event-feed').innerHTML = state.events.slice(-10).reverse().map(e => `
    <div class="event">
      <strong>${labels[e.event_type] || e.event_type}</strong>
      <span>${e.customer_id} · ${e.sku || 'nincs sku'} · ${new Date(e.ts).toLocaleTimeString('hu-HU')}</span>
    </div>
  `).join('');
}

/* ============================================================
   Véletlenszerű rendelés / esemény generálás
   ============================================================ */

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createLocalOrder(product, qty) {
  return {
    order_id: `O-${10040 + state.orders.length}`,
    customer_id: `C-${1800 + Math.floor(Math.random() * 400)}`,
    customer_name: randomPick(CUSTOMERS),
    sku: product.sku,
    qty: qty || randomBetween(1, 3),
    gross_amount: product.price * (qty || randomBetween(1, 3)),
    city: randomPick(CITIES),
    channel: randomPick(CHANNELS),
    status: 'paid',
    ordered_at: new Date().toISOString()
  };
}

function createLocalEvent(order) {
  return {
    event_id: `E-${9010 + state.events.length}`,
    session_id: `S-${450 + state.events.length}`,
    customer_id: order.customer_id,
    event_type: randomPick(EVENT_TYPES),
    sku: order.sku,
    ts: order.ordered_at
  };
}

function createRandomClickstreamEvent() {
  const product = randomPick(state.catalog);
  const customer = `C-${1800 + Math.floor(Math.random() * 400)}`;
  return {
    event_id: `E-${9010 + state.events.length}`,
    session_id: `S-${450 + state.events.length + randomBetween(1, 50)}`,
    customer_id: customer,
    event_type: randomPick(EVENT_TYPES),
    sku: product.sku,
    ts: new Date().toISOString()
  };
}

async function simulateOrder() {
  const product = randomPick(state.catalog);
  if (!product) return;

  if (state.apiConnected) {
    try {
      await postToApi('/api/simulate-order');
      await refreshData();
      renderActiveView();
      showToast('Új rendelés generálva (API)', 'info', 2000);
      return;
    } catch (e) {
      state.apiConnected = false;
      updateApiStatus();
    }
  }

  // Lokális fallback
  const qty = randomBetween(1, 3);
  const order = createLocalOrder(product, qty);
  state.orders.push(order);
  state.events.push(createLocalEvent(order));
  product.stock = Math.max(0, product.stock - qty);

  // Pár extra clickstream esemény is
  for (let i = 0; i < randomBetween(1, 3); i++) {
    state.events.push(createRandomClickstreamEvent());
  }

  renderActiveView();
  showToast(`Rendelés: ${product.name} x${qty}`, 'info', 2500);
}

/* ============================================================
   Automatikus rendelésgenerátor (8-15 másodperc)
   ============================================================ */

function startAutoOrderGeneration() {
  function scheduleNext() {
    const delay = randomBetween(8000, 15000);
    state.autoOrderTimer = setTimeout(async () => {
      await autoGenerateOrder();
      scheduleNext();
    }, delay);
  }
  scheduleNext();
}

async function autoGenerateOrder() {
  const product = randomPick(state.catalog);
  if (!product) return;

  if (state.apiConnected) {
    try {
      await postToApi('/api/simulate-order');
      // Adatok újratöltése API-ból
      try {
        const [catalog, orders, events] = await Promise.all([
          loadFromApi('/api/catalog'),
          loadFromApi('/api/orders'),
          loadFromApi('/api/events')
        ]);
        state.catalog = catalog;
        state.orders = orders;
        state.events = events;
      } catch (e) { /* fallback: keep current state */ }
    } catch (e) {
      // Lokális fallback
      generateLocalAutoOrder(product);
    }
  } else {
    generateLocalAutoOrder(product);
  }

  renderActiveView();
}

function generateLocalAutoOrder(product) {
  const qty = randomBetween(1, 3);
  const customer = randomPick(CUSTOMERS);
  const order = {
    order_id: `O-${10040 + state.orders.length}`,
    customer_id: `C-${1800 + Math.floor(Math.random() * 400)}`,
    customer_name: customer,
    sku: product.sku,
    qty: qty,
    gross_amount: product.price * qty,
    city: randomPick(CITIES),
    channel: randomPick(CHANNELS),
    status: 'paid',
    ordered_at: new Date().toISOString()
  };
  state.orders.push(order);

  // Clickstream események
  const eventTypes = ['product_view', 'add_to_cart', 'checkout_started'];
  for (let i = 0; i < randomBetween(2, 4); i++) {
    state.events.push({
      event_id: `E-${9010 + state.events.length}`,
      session_id: `S-${450 + state.events.length + randomBetween(1, 100)}`,
      customer_id: order.customer_id,
      event_type: randomPick(eventTypes),
      sku: randomPick(state.catalog).sku,
      ts: new Date(Date.now() - randomBetween(0, 30000)).toISOString()
    });
  }

  // Extra random clickstream
  state.events.push(createRandomClickstreamEvent());

  product.stock = Math.max(0, product.stock - qty);
}

/* ============================================================
   Dashboard auto-refresh (5 sec)
   ============================================================ */

function startDashboardRefresh() {
  state.refreshTimer = setInterval(async () => {
    if (state.apiConnected) {
      try {
        const [catalog, orders, events] = await Promise.all([
          loadFromApi('/api/catalog'),
          loadFromApi('/api/orders'),
          loadFromApi('/api/events')
        ]);
        state.catalog = catalog;
        state.orders = orders;
        state.events = events;
      } catch (e) {
        // API elérhetetlenné vált
        state.apiConnected = false;
        updateApiStatus();
      }
    }
    // Frissítsük a dashboard-ot ha az aktív nézet
    if (state.activeView === 'dashboard') {
      renderDashboard();
    }
  }, 5000);
}

/* ============================================================
   Adatfrissítés
   ============================================================ */

async function refreshData() {
  if (state.apiConnected) {
    try {
      const [catalog, orders, events] = await Promise.all([
        loadFromApi('/api/catalog'),
        loadFromApi('/api/orders'),
        loadFromApi('/api/events')
      ]);
      state.catalog = catalog;
      state.orders = orders;
      state.events = events;
    } catch (e) {
      state.apiConnected = false;
      updateApiStatus();
    }
  }
}

function updateApiStatus() {
  const status = document.querySelector('#api-status');
  if (!status) return;
  status.classList.toggle('live', state.apiConnected);
  status.innerHTML = state.apiConnected
    ? '<span></span> compose API live'
    : '<span></span> fixture fallback';
}

/* ============================================================
   Inicializáció
   ============================================================ */

async function init() {
  let catalog, orders, events;

  try {
    if (!SHOULD_USE_API) throw new Error('statikus előnézet — fixture használata');
    const apiData = await Promise.all([
      loadFromApi('/api/catalog'),
      loadFromApi('/api/orders'),
      loadFromApi('/api/events')
    ]);
    [catalog, orders, events] = apiData;
    state.apiConnected = true;
  } catch (error) {
    try {
      const fixtureData = await Promise.all([
        loadJson('./fixtures/catalog.json'),
        loadJson('./fixtures/orders.json'),
        loadJson('./fixtures/events.json')
      ]);
      [catalog, orders, events] = fixtureData;
    } catch (fixtureError) {
      // Ha fixture sincs, generálunk mintaadatot
      catalog = generateSampleCatalog();
      orders = [];
      events = [];
    }
    state.apiConnected = false;
  }

  state.catalog = catalog;
  state.orders = orders;
  state.events = events;

  updateApiStatus();
  renderActiveView();

  // Event listeners
  setupEventListeners();

  // Automatikus rendelésgenerálás indítása
  startAutoOrderGeneration();

  // Dashboard auto-refresh
  startDashboardRefresh();
}

function generateSampleCatalog() {
  return [
    { sku: 'MON-001', name: 'UltraWide 34" Monitor', brand: 'LG', category: 'Monitorok', price: 189990, stock: 24, margin: 0.22 },
    { sku: 'MON-002', name: '4K Pro Display 27"', brand: 'Dell', category: 'Monitorok', price: 154990, stock: 18, margin: 0.20 },
    { sku: 'LAP-001', name: 'ThinkPad X1 Carbon', brand: 'Lenovo', category: 'Laptopok', price: 489990, stock: 8, margin: 0.15 },
    { sku: 'LAP-002', name: 'MacBook Pro 14"', brand: 'Apple', category: 'Laptopok', price: 649990, stock: 5, margin: 0.12 },
    { sku: 'KEY-001', name: 'Mechanikus billentyűzet', brand: 'Logitech', category: 'Perifériák', price: 34990, stock: 42, margin: 0.35 },
    { sku: 'MOU-001', name: 'Ergonomic Mouse MX', brand: 'Logitech', category: 'Perifériák', price: 24990, stock: 36, margin: 0.38 },
    { sku: 'HEAD-001', name: 'Noise Cancelling Headset', brand: 'Sony', category: 'Hang', price: 79990, stock: 15, margin: 0.28 },
    { sku: 'CAM-001', name: 'Webcam 4K Pro', brand: 'Razer', category: 'Perifériák', price: 44990, stock: 22, margin: 0.32 },
    { sku: 'HUB-001', name: 'USB-C Docking Station', brand: 'CalDigit', category: 'Kiegészítők', price: 69990, stock: 11, margin: 0.25 },
    { sku: 'CHAIR-001', name: 'Ergonomikus irodai szék', brand: 'Herman Miller', category: 'Bútor', price: 299990, stock: 3, margin: 0.18 },
    { sku: 'SSD-001', name: 'SSD 2TB NVMe', brand: 'Samsung', category: 'Tárolás', price: 54990, stock: 30, margin: 0.30 },
    { sku: 'RAM-001', name: 'DDR5 32GB Kit', brand: 'Kingston', category: 'Memória', price: 32990, stock: 28, margin: 0.33 }
  ];
}

function setupEventListeners() {
  // Tab navigation
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => switchView(tab.dataset.view));
  });

  // Cart open/close
  document.querySelector('#cart-toggle').addEventListener('click', openCart);
  document.querySelector('#cart-close').addEventListener('click', closeCart);
  document.querySelector('#cart-overlay').addEventListener('click', closeCart);

  // Simulate order button (dashboard)
  const simBtn = document.querySelector('#simulate-order');
  if (simBtn) simBtn.addEventListener('click', simulateOrder);

  // Keyboard: Escape closes cart
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeCart();
  });
}

/* ---- Indítás ---- */
init().catch(error => {
  document.body.insertAdjacentHTML('afterbegin', `<div style="padding:12px;background:#ff7b72;color:#0d1117">${error.message}</div>`);
});
