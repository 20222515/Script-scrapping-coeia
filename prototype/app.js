// ─── Auth ───────────────────────────────────────────────────────────────────
const USERS = [
    { email: 'admin@minsait.com',  password: 'admin123',  entity: 'minsait', name: 'Ana García' },
    { email: 'user@banbif.com',    password: 'banbif123', entity: 'banbif',  name: 'Carlos Ramos' },
    { email: 'user@agora.com',     password: 'agora123',  entity: 'agora',   name: 'María López' }
];

let currentUser   = null;
let currentClient = 'banbif';
let currentPage   = 'dashboard';
let currentContext = 'general';

// ─── Render helpers ─────────────────────────────────────────────────────────
function stars(n) {
    return '★'.repeat(n) + '☆'.repeat(5 - n);
}

function renderMetrics(data) {
    const icons = {
        Health: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,
        Rating: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
        Reseñas: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>`,
        Menciones: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>`
    };
    const iconKey = Object.keys(icons).find(k => data.label.includes(k)) || 'Health';
    return icons[iconKey];
}

function renderMetricsGrid(data) {
    const container = document.getElementById('metrics-grid');
    if (!container) return;
    container.innerHTML = data.metrics.map(m => {
        const iconSvg = renderMetrics(m);
        return `
        <div class="metric-card animate-in">
            <div class="metric-icon">${iconSvg}</div>
            <div class="metric-label">
                ${m.label}
                <div class="tooltip-icon">?
                    <div class="tooltip-text">${m.tooltip || 'Métrica de impacto.'}</div>
                </div>
            </div>
            <div class="metric-value">${m.value}</div>
            <div class="metric-delta delta-${m.type}">${m.type === 'positive' ? '▲' : '▼'} ${m.delta}</div>
        </div>`;
    }).join('');
}

function renderHealthChart(data) {
    const container = document.getElementById('health-chart');
    if (!container) return;
    const width  = container.clientWidth || 580;
    const height = 200;
    const pad    = { top: 18, right: 20, bottom: 28, left: 34 };
    const iw = width - pad.left - pad.right;
    const ih = height - pad.top - pad.bottom;
    const xStep = data.chartData.length > 1 ? iw / (data.chartData.length - 1) : iw;

    let grid = '';
    [100, 75, 50, 25].forEach((val, i) => {
        const y = pad.top + (ih / 3) * i;
        grid += `<line x1="${pad.left}" y1="${y}" x2="${width - pad.right}" y2="${y}" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
                 <text x="${pad.left - 6}" y="${y + 4}" text-anchor="end" class="chart-label">${val}</text>`;
    });

    const milestoneIdx = data.chartData.findIndex(d => d.pre !== null && d.post !== null);
    const mx = milestoneIdx >= 0 ? pad.left + milestoneIdx * xStep : null;
    const milestoneLine = currentContext === 'hito' && mx !== null ? `<line x1="${mx}" y1="${pad.top}" x2="${mx}" y2="${height - pad.bottom}" stroke="var(--accent)" stroke-width="1.5" stroke-dasharray="5,3"/>` : '';

    const toXY = (d, i, key) => {
        if (d[key] === null) return null;
        return `${pad.left + i * xStep},${pad.top + ih - (d[key] / 100) * ih}`;
    };

    const prePoints  = data.chartData.map((d, i) => toXY(d, i, 'pre')).filter(Boolean).join(' ');
    const postPoints = data.chartData.map((d, i) => toXY(d, i, 'post')).filter(Boolean).join(' ');
    const labels = data.chartData.map((d, i) =>
        `<text x="${pad.left + i * xStep}" y="${height - 6}" text-anchor="middle" class="chart-label">${d.week}</text>`
    ).join('');

    const preFill = currentContext === 'general' ? 'var(--accent)' : 'rgba(255,255,255,0.3)';
    
    container.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}">
        ${grid}${labels}${milestoneLine}
        <polyline points="${prePoints}"  fill="none" stroke="${preFill}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <polyline points="${postPoints}" fill="none" stroke="var(--accent)"          stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
}

function renderSentimentChart(data) {
    const container = document.getElementById('sentiment-chart');
    if (!container) return;
    const { positive, negative, neutral } = data.sentiment;
    const r = 50, c = 2 * Math.PI * r;
    const posDash = (positive / 100) * c;
    const negDash = (negative / 100) * c;
    const neuDash = (neutral  / 100) * c;

    container.innerHTML = `
    <div class="donut-container">
        <svg class="donut-svg" viewBox="-65 -65 130 130">
            <circle r="${r}" cx="0" cy="0" fill="transparent" stroke="var(--neutral)"  stroke-width="14" stroke-dasharray="${neuDash} ${c}" stroke-dashoffset="${-(posDash + negDash)}"/>
            <circle r="${r}" cx="0" cy="0" fill="transparent" stroke="var(--negative)" stroke-width="14" stroke-dasharray="${negDash} ${c}" stroke-dashoffset="${-posDash}"/>
            <circle r="${r}" cx="0" cy="0" fill="transparent" stroke="var(--positive)" stroke-width="14" stroke-dasharray="${posDash} ${c}" stroke-dashoffset="0"/>
        </svg>
        <div class="donut-stats">
            <div class="donut-stat">
                <div class="donut-stat-dot" style="background:var(--positive)"></div>
                <div class="donut-stat-label">Positivo</div>
                <div class="donut-stat-value">${positive}%</div>
            </div>
            <div class="donut-stat">
                <div class="donut-stat-dot" style="background:var(--negative)"></div>
                <div class="donut-stat-label">Negativo</div>
                <div class="donut-stat-value">${negative}%</div>
            </div>
            <div class="donut-stat">
                <div class="donut-stat-dot" style="background:var(--neutral)"></div>
                <div class="donut-stat-label">Neutro</div>
                <div class="donut-stat-value">${neutral}%</div>
            </div>
        </div>
    </div>`;
}

function renderTopics(data) {
    const container = document.getElementById('negative-topics');
    if (!container) return;
    const maxPct = Math.max(...data.topics.map(t => t.pct));
    container.innerHTML = `<div class="topics-list">` + data.topics.map(t => `
        <div class="topic-item">
            <div class="topic-rank">${t.rank}</div>
            <div class="topic-name">${t.name}</div>
            <div class="topic-bar-bg">
                <div class="topic-bar-fill" style="background:var(--negative); width:0" data-width="${(t.pct / maxPct * 100).toFixed(0)}%"></div>
            </div>
            <div class="topic-pct">${t.pct}%</div>
            <div class="topic-count">${t.count} res.</div>
        </div>`).join('') + `</div>`;
    setTimeout(() => {
        document.querySelectorAll('.topic-bar-fill').forEach(el => {
            el.style.width = el.getAttribute('data-width');
        });
    }, 80);
}

function renderAlerts(data) {
    const target = document.getElementById('alerts-container') || document.getElementById('alerts-full-container');
    if (!target) return;
    const warnSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="var(--negative)"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>`;
    target.innerHTML = data.alerts.map(a => `
        <div class="alert-item">
            <div class="alert-icon">${warnSvg}</div>
            <div class="alert-content">
                <div class="alert-title">${a.title}</div>
                <div class="alert-desc">${a.desc}</div>
                <div class="alert-time">${a.time}</div>
            </div>
        </div>`).join('');
}

function renderComparison(data) {
    const grid = document.getElementById('comparison-grid');
    const sub  = document.getElementById('comparison-subtitle');
    const pageComp = document.getElementById('page-comparison');
    
    if (currentContext === 'general') {
        if (pageComp) pageComp.style.display = 'none';
        return;
    } else {
        // If we are on comparison page, ensure it's visible. But it's handled by loadPage.
        // If we are on dashboard, this is not the page-comparison element. Wait, dashboard doesn't have comparison grid, page-comparison does.
    }
    
    if (!grid) return;
    if (sub) sub.textContent = `${data.title} — ${data.date}`;
    const { pre, post } = data.comparison;
    grid.innerHTML = `
        <div class="comparison-side">
            <div class="comparison-label pre">Pre-Hito (60d antes)</div>
            <div class="comparison-metric"><span class="comparison-metric-name">Health Score</span><span class="comparison-metric-value" style="color:var(--text-muted)">${pre.score}/100</span></div>
            <div class="comparison-metric"><span class="comparison-metric-name">Rating Promedio</span><span class="comparison-metric-value" style="color:var(--text-muted)">${pre.rating}</span></div>
            <div class="comparison-metric"><span class="comparison-metric-name">Sentimiento Positivo</span><span class="comparison-metric-value" style="color:var(--text-muted)">${pre.positive}</span></div>
            <div class="comparison-metric" style="border:none"><span class="comparison-metric-name">Menciones al Cambio</span><span class="comparison-metric-value" style="color:var(--text-muted)">${pre.mentions}</span></div>
        </div>
        <div class="comparison-divider"></div>
        <div class="comparison-side">
            <div class="comparison-label post">Post-Hito (30d después)</div>
            <div class="comparison-metric"><span class="comparison-metric-name">Health Score</span><span class="comparison-metric-value" style="color:var(--accent)">${post.score}/100</span></div>
            <div class="comparison-metric"><span class="comparison-metric-name">Rating Promedio</span><span class="comparison-metric-value" style="color:var(--accent)">${post.rating}</span></div>
            <div class="comparison-metric"><span class="comparison-metric-name">Sentimiento Positivo</span><span class="comparison-metric-value" style="color:var(--accent)">${post.positive}</span></div>
            <div class="comparison-metric" style="border:none"><span class="comparison-metric-name">Menciones al Cambio</span><span class="comparison-metric-value" style="color:var(--accent)">${post.mentions}</span></div>
        </div>`;
}

function renderReviews(data) {
    const tbody = document.getElementById('reviews-body');
    const dashboardTbody = document.getElementById('dashboard-reviews-body');
    const sentLabels = { positive: 'Positivo', negative: 'Negativo', neutral: 'Neutro' };
    
    const html = data.reviews.map(r => `
        <tr>
            <td><div class="stars" title="${r.rating}/5">${stars(r.rating)}</div></td>
            <td><div class="review-text">${r.text}</div></td>
            <td><span class="badge badge-${r.sentiment}">${sentLabels[r.sentiment]}</span></td>
            <td><span class="badge badge-topic">${r.topic}</span></td>
            <td>${r.mention ? '<span class="mention-badge">Mención</span>' : '<span style="color:var(--text-muted)">—</span>'}</td>
            <td><span style="color:var(--text-muted); font-size:12px">${r.date}</span></td>
            <td style="text-align:center">
                <a href="${r.url || '#'}" target="_blank" style="color:var(--accent); text-decoration:none; font-size:11px; font-weight:600;" title="Ver original">
                    ${r.source || 'App Store'} ↗
                </a>
            </td>
        </tr>`).join('');
        
    if (tbody) tbody.innerHTML = html;
    if (dashboardTbody) dashboardTbody.innerHTML = html;
}

// ─── Load client data ────────────────────────────────────────────────────────
function loadClient(clientId) {
    // ─── Control de Accesos (RBAC) ───
    if (currentUser.entity !== 'minsait' && currentUser.entity !== clientId) {
        console.error(`Acceso denegado: El usuario ${currentUser.email} no tiene permisos para ver datos de ${clientId}`);
        alert('Acceso denegado. No tienes permisos para ver esta información.');
        return;
    }

    currentClient = clientId;
    const data = mockData[clientId][currentContext];

    // Sync admin select
    const sel = document.getElementById('admin-client-select');
    if (sel && sel.value !== clientId) sel.value = clientId;

    // Sync client tabs (admin only)
    document.querySelectorAll('.client-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.client === clientId);
    });
    // Sync context tabs
    document.getElementById('context-hito-tab').textContent = `Hito: ${data.title}`;
    
    // Animate context tabs if changed
    document.querySelectorAll('.context-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.context === currentContext);
    });

    renderMetricsGrid(data);
    renderHealthChart(data);
    renderSentimentChart(data);
    renderTopics(data);
    renderAlerts(data);
    renderComparison(data);
    renderReviews(data);

    // Animate cards
    document.querySelectorAll('.animate-in').forEach(el => {
        el.style.animation = 'none';
        void el.offsetHeight;
        el.style.animation = null;
    });
}

// ─── Page routing ────────────────────────────────────────────────────────────
const ALL_PAGES = ['dashboard', 'reviews', 'comparison', 'reports', 'alerts', 'clients', 'settings'];

function loadPage(page) {
    currentPage = page;

    // Nav highlight
    document.querySelectorAll('.nav-item[data-page]').forEach(item => {
        item.classList.toggle('active', item.dataset.page === page);
    });

    // Show / hide page containers
    ALL_PAGES.forEach(p => {
        const el = document.getElementById(`page-${p}`);
        if (el) el.style.display = p === page ? 'block' : 'none';
    });

    // Refresh data for current client on switch
    if (['dashboard', 'reviews', 'comparison', 'alerts'].includes(page)) {
        loadClient(currentClient);
    }
}

// ─── Auth ────────────────────────────────────────────────────────────────────
function handleLogin(e) {
    e.preventDefault();
    const email    = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const entity   = document.getElementById('login-entity').value;
    const user = USERS.find(u => u.email === email && u.password === password && u.entity === entity);

    if (user) {
        currentUser = user;
        localStorage.setItem('bp_user', JSON.stringify(user));
        document.getElementById('login-error').style.display = 'none';
        launchApp();
    } else {
        document.getElementById('login-error').style.display = 'block';
    }
}

function handleLogout() {
    localStorage.removeItem('bp_user');
    currentUser = null;
    document.getElementById('app-shell').style.display  = 'none';
    document.getElementById('login-screen').style.display = 'flex';
}

function launchApp() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app-shell').style.display  = 'flex';

    // Profile
    document.getElementById('user-name').textContent = currentUser.name;
    document.getElementById('user-role').textContent = currentUser.entity === 'minsait' ? 'Minsait — Admin' : currentUser.entity;
    document.getElementById('user-avatar').textContent = currentUser.name.charAt(0).toUpperCase();

    const adminBar  = document.getElementById('admin-selector-container');
    const clientTabs = document.getElementById('client-tabs');

    if (currentUser.entity === 'minsait') {
        adminBar.style.display  = 'flex';
        if (clientTabs) clientTabs.style.display = 'flex';
        // nav Clientes / Ajustes visible only for admin
        document.getElementById('admin-nav-section').style.display = '';
    } else {
        adminBar.style.display  = 'none';
        if (clientTabs) clientTabs.style.display = 'none';
        document.getElementById('admin-nav-section').style.display = 'none';
        currentClient = currentUser.entity;
    }

    loadPage('dashboard');
}

// ─── Ingest button ───────────────────────────────────────────────────────────
function handleIngest() {
    const btn = document.getElementById('btn-ingest');
    btn.disabled = true;
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg> Procesando…`;
    setTimeout(() => {
        btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Completado`;
        btn.style.background = 'var(--positive)';
        setTimeout(() => {
            btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg> Ejecutar Ingesta`;
            btn.style.background = '';
            btn.disabled = false;
        }, 3000);
    }, 2000);
}

// ─── Init ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Login / register toggle
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('btn-logout').addEventListener('click', handleLogout);
    document.getElementById('btn-ingest').addEventListener('click', handleIngest);

    // Admin client selector
    document.getElementById('admin-client-select').addEventListener('change', e => {
        loadClient(e.target.value);
    });

    // Client tabs
    document.querySelectorAll('.client-tab').forEach(tab => {
        tab.addEventListener('click', () => loadClient(tab.dataset.client));
    });

    // Context tabs
    document.querySelectorAll('.context-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            currentContext = tab.dataset.context;
            loadClient(currentClient);
        });
    });

    // Nav items
    document.querySelectorAll('.nav-item[data-page]').forEach(item => {
        item.addEventListener('click', () => loadPage(item.dataset.page));
    });

    // Resize
    window.addEventListener('resize', () => renderHealthChart(mockData[currentClient]));

    // Auto-login from storage
    const stored = localStorage.getItem('bp_user');
    if (stored) {
        currentUser = JSON.parse(stored);
        launchApp();
    }
});
