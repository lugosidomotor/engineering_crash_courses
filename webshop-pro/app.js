const fmt = new Intl.NumberFormat('hu-HU');
const API_BASE = window.WEBSHOP_API_URL || 'http://localhost:8000';
const SHOULD_USE_API = window.WEBSHOP_FORCE_API || window.location.port === '8010' || new URLSearchParams(window.location.search).get('api') === '1';

const tools = [
  ['SQL', 'relacios modell, JOIN, KPI query', 'postgres'],
  ['Python', 'ingest, validacio, CLI pipeline', 'lab-runner'],
  ['pandas', 'kis volumenu lokalis adatmunka', 'lab-runner'],
  ['Docker', 'lokalis fejlesztoi stack', 'docker-compose.yml'],
  ['PostgreSQL', 'relacios source es serving DB', 'postgres'],
  ['MinIO', 'S3-kompatibilis objektumtar', 'minio'],
  ['Parquet', 'oszloporientalt file format', 'lab-runner'],
  ['Delta Lake', 'bronze/silver/gold tranzakciok', 'lab-runner'],
  ['Apache Iceberg', 'open table format osszehasonlitas', 'unity-catalog'],
  ['Apache Hudi', 'upsert-heavy lakehouse alternativa', 'spark-master'],
  ['Spark', 'nagy volumen ETL es feature tabla', 'spark-master'],
  ['Airflow', 'napi webshop_etl DAG', 'airflow'],
  ['dbt', 'staging, marts, tesztek', 'dbt'],
  ['Kafka', 'clickstream eventek', 'kafka'],
  ['Feast', 'customer feature store', 'lab-runner'],
  ['Great Expectations', 'adatminosegi ellenorzes', 'lab-runner'],
  ['Databricks', 'managed lakehouse workflow', 'databricks-local'],
  ['Unity Catalog', 'governance es jogosultsag', 'unity-catalog'],
  ['MLflow', 'churn modell kovetes', 'mlflow'],
  ['FastAPI', 'model serving API', 'api'],
  ['Grafana', 'uzleti es ML monitoring', 'grafana'],
  ['Prometheus', 'metrikagyujtes', 'prometheus'],
  ['OpenAI', 'support RAG valasz', 'api/streamlit'],
  ['ChromaDB', 'vektoros policy kereso', 'chroma'],
  ['Streamlit', 'AI support UI', 'streamlit'],
  ['Kubernetes', 'production deploy mental model', 'kubernetes manifest']
];

const state = {
  catalog: [],
  orders: [],
  events: [],
  apiConnected: false
};

async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Nem sikerult betolteni: ${path}`);
  return response.json();
}

async function loadFromApi(path) {
  const response = await fetch(`${API_BASE}${path}`, { mode: 'cors' });
  if (!response.ok) throw new Error(`API hiba: ${path}`);
  return response.json();
}

function updateApiStatus() {
  const status = document.querySelector('#api-status');
  if (!status) return;
  status.classList.toggle('live', state.apiConnected);
  status.innerHTML = state.apiConnected
    ? '<span></span> compose API live'
    : '<span></span> fixture fallback';
}

function revenueBySku() {
  return state.orders
    .filter(order => order.status === 'paid')
    .reduce((acc, order) => {
      acc[order.sku] = (acc[order.sku] || 0) + order.gross_amount;
      return acc;
    }, {});
}

function renderMetrics() {
  const paidOrders = state.orders.filter(order => order.status === 'paid');
  const revenue = paidOrders.reduce((sum, order) => sum + order.gross_amount, 0);
  const sessions = new Set(state.events.map(event => event.session_id)).size || 1;
  const checkoutEvents = state.events.filter(event => event.event_type === 'checkout_started').length;
  const supportTickets = state.events.filter(event => event.event_type === 'support_question').length;

  document.querySelector('#revenue').textContent = `${fmt.format(revenue)} Ft`;
  document.querySelector('#conversion').textContent = `${Math.round((checkoutEvents / sessions) * 100)}%`;
  document.querySelector('#aov').textContent = `${fmt.format(Math.round(revenue / Math.max(paidOrders.length, 1)))} Ft`;
  document.querySelector('#tickets').textContent = supportTickets;
}

function renderProducts() {
  const revenue = revenueBySku();
  document.querySelector('#product-table').innerHTML = state.catalog.map(product => `
    <tr>
      <td class="sku">${product.sku}</td>
      <td><strong>${product.name}</strong><br><small>${product.brand}</small></td>
      <td>${product.category}</td>
      <td class="stock ${product.stock < 12 ? 'low' : ''}">${product.stock} db</td>
      <td>${fmt.format(revenue[product.sku] || 0)} Ft</td>
      <td>${Math.round(product.margin * 100)}%</td>
    </tr>
  `).join('');
}

function renderEvents() {
  const labels = {
    product_view: 'termek megtekintes',
    add_to_cart: 'kosarba rakas',
    checkout_started: 'checkout indult',
    search: 'kereses',
    support_question: 'support kerdes'
  };
  document.querySelector('#event-feed').innerHTML = state.events.slice(-7).reverse().map(event => `
    <div class="event">
      <strong>${labels[event.event_type] || event.event_type}</strong>
      <span>${event.customer_id} · ${event.sku || 'nincs sku'} · ${new Date(event.ts).toLocaleTimeString('hu-HU')}</span>
    </div>
  `).join('');
}

function renderTools() {
  document.querySelector('#tool-grid').innerHTML = tools.map(([name, role, service]) => `
    <div class="tool">
      <strong>${name}</strong>
      <span>${role}</span>
      <em>${service}</em>
    </div>
  `).join('');
}

async function simulateOrder() {
  if (state.apiConnected) {
    try {
      await fetch(`${API_BASE}/api/simulate-order`, { method: 'POST', mode: 'cors' });
      const [catalog, orders, events] = await Promise.all([
        loadFromApi('/api/catalog'),
        loadFromApi('/api/orders'),
        loadFromApi('/api/events')
      ]);
      state.catalog = catalog;
      state.orders = orders;
      state.events = events;
      renderAll();
      return;
    } catch (error) {
      state.apiConnected = false;
      updateApiStatus();
    }
  }

  const product = state.catalog[Math.floor(Math.random() * state.catalog.length)];
  const order = {
    order_id: `O-${10040 + state.orders.length}`,
    customer_id: `C-${1800 + Math.floor(Math.random() * 400)}`,
    sku: product.sku,
    qty: 1,
    gross_amount: product.price,
    city: 'Budapest',
    channel: 'demo',
    status: 'paid',
    ordered_at: new Date().toISOString()
  };
  state.orders.push(order);
  state.events.push({
    event_id: `E-${9010 + state.events.length}`,
    session_id: `S-${450 + state.events.length}`,
    customer_id: order.customer_id,
    event_type: 'checkout_started',
    sku: product.sku,
    ts: order.ordered_at
  });
  product.stock = Math.max(0, product.stock - 1);
  renderAll();
}

function renderAll() {
  renderMetrics();
  renderProducts();
  renderEvents();
  renderTools();
  updateApiStatus();
}

async function init() {
  let catalog;
  let orders;
  let events;
  try {
    if (!SHOULD_USE_API) throw new Error('static preview uses fixtures');
    const apiData = await Promise.all([
      loadFromApi('/api/catalog'),
      loadFromApi('/api/orders'),
      loadFromApi('/api/events')
    ]);
    [catalog, orders, events] = apiData;
    state.apiConnected = true;
  } catch (error) {
    const fixtureData = await Promise.all([
      loadJson('./fixtures/catalog.json'),
      loadJson('./fixtures/orders.json'),
      loadJson('./fixtures/events.json')
    ]);
    [catalog, orders, events] = fixtureData;
    state.apiConnected = false;
  }
  state.catalog = catalog;
  state.orders = orders;
  state.events = events;
  renderAll();
  document.querySelector('#simulate-order').addEventListener('click', simulateOrder);
}

init().catch(error => {
  document.body.insertAdjacentHTML('afterbegin', `<div style="padding:12px;background:#ff7b72;color:#0d1117">${error.message}</div>`);
});
