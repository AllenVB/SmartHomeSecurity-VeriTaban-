/* S-Home v15.0 PREMIUM — Full App Logic with LocalStorage */

// =============================================
// 1. STORAGE KATMANI
// =============================================
const STORAGE_KEYS = {
    db: 'shome_db',
    profile: 'shome_profile',
    deviceStates: 'shome_device_states',
    securityState: 'shome_security_state',
    energyData: 'shome_energy_data',
};

// Default DB verisi
const DEFAULT_DB = {
    users: [
        { id: 1, name: 'Thomas', surname: 'Anderson', status: 'Aktif', email: 'thomas@shome.com' },
        { id: 2, name: 'Neo', surname: 'One', status: 'Pasif', email: 'neo@matrix.com' },
        { id: 3, name: 'Trinity', surname: 'Moss', status: 'Aktif', email: 'trinity@shome.com' }
    ],
    houses: [
        { id: 101, address: 'İzmir, Karşıyaka No:5', ownerId: 1, type: 'Villa' },
        { id: 102, address: 'İstanbul, Beşiktaş No:9', ownerId: 3, type: 'Daire' }
    ],
    devices: [
        { id: 501, name: 'Ana Kamera', type: 'Kamera', roomId: 10, status: 'ON' },
        { id: 502, name: 'Mutfak Sensör', type: 'Sensör', roomId: 11, status: 'ON' },
        { id: 503, name: 'Bahçe Işık', type: 'Lamba', roomId: 12, status: 'OFF' },
        { id: 504, name: 'Klima', type: 'Klima', roomId: 10, status: 'OFF' }
    ],
    events: [
        { id: 9001, date: '2025-11-20 14:02', event: 'Hareket Algılandı', source: 'CAM-03' },
        { id: 9002, date: '2025-11-20 12:30', event: 'Login Başarılı', source: 'WebClient' },
        { id: 9003, date: '2025-11-20 09:00', event: 'Sistem Başlatıldı', source: 'Otomatik' }
    ]
};

const DEFAULT_PROFILE = { name: 'Thomas', surname: 'Anderson', role: 'Sistem Yöneticisi', email: 'thomas@shome.com', phone: '+90 555 123 4567' };
const DEFAULT_DEVICE_STATES = { d1: true, d2: true, d3: false, d4: false, d5: true, d6: false, d7: false };
const DEFAULT_SECURITY_STATE = { alarmActive: true, armMode: 'Ev Modu' };
const DEFAULT_ENERGY = [12, 14, 11, 15, 13, 18, 16];

function loadDB() {
    const saved = localStorage.getItem(STORAGE_KEYS.db);
    return saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(DEFAULT_DB));
}
function saveDB() { localStorage.setItem(STORAGE_KEYS.db, JSON.stringify(db)); }

function loadProfile() {
    const saved = localStorage.getItem(STORAGE_KEYS.profile);
    return saved ? JSON.parse(saved) : { ...DEFAULT_PROFILE };
}
function saveProfile(data) { localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(data)); }

function loadDeviceStates() {
    const saved = localStorage.getItem(STORAGE_KEYS.deviceStates);
    return saved ? JSON.parse(saved) : { ...DEFAULT_DEVICE_STATES };
}
function saveDeviceStates() { localStorage.setItem(STORAGE_KEYS.deviceStates, JSON.stringify(deviceStates)); }

function loadSecurityState() {
    const saved = localStorage.getItem(STORAGE_KEYS.securityState);
    return saved ? JSON.parse(saved) : { ...DEFAULT_SECURITY_STATE };
}
function saveSecurityState() { localStorage.setItem(STORAGE_KEYS.securityState, JSON.stringify(securityState)); }

function loadEnergyData() {
    const saved = localStorage.getItem(STORAGE_KEYS.energyData);
    return saved ? JSON.parse(saved) : [...DEFAULT_ENERGY];
}
function saveEnergyData() { localStorage.setItem(STORAGE_KEYS.energyData, JSON.stringify(energyData)); }

// Global state
let db = loadDB();
let profile = loadProfile();
let deviceStates = loadDeviceStates();
let securityState = loadSecurityState();
let energyData = loadEnergyData();

// =============================================
// 2. TOAST BİLDİRİM SİSTEMİ
// =============================================
function showToast(message, type = 'success', duration = 3500) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const icons = { success: 'ph-check-circle', error: 'ph-x-circle', warning: 'ph-warning', info: 'ph-info' };
    const colors = {
        success: 'border-l-green-500 bg-green-500/10 text-green-400',
        error: 'border-l-red-500 bg-red-500/10 text-red-400',
        warning: 'border-l-yellow-500 bg-yellow-500/10 text-yellow-400',
        info: 'border-l-neon-cyan bg-neon-cyan/10 text-neon-cyan'
    };

    const toast = document.createElement('div');
    toast.className = `flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 border-l-4 shadow-xl backdrop-blur-md glass-panel min-w-[280px] ${colors[type]} translate-x-full opacity-0 transition-all duration-300`;
    toast.innerHTML = `<i class="ph-fill ${icons[type]} text-xl flex-shrink-0"></i><span class="text-sm font-medium text-white flex-1">${message}</span><button onclick="this.parentElement.remove()" class="text-gray-500 hover:text-white transition ml-2"><i class="ph-bold ph-x text-xs"></i></button>`;

    container.appendChild(toast);
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            toast.classList.remove('translate-x-full', 'opacity-0');
        });
    });

    setTimeout(() => {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// =============================================
// 3. ONAY MODAL'I
// =============================================
let confirmCallback = null;
function showConfirm(message, onConfirm) {
    confirmCallback = onConfirm;
    document.getElementById('confirm-message').innerText = message;
    document.getElementById('confirm-modal').classList.add('open');
}
function confirmAction() {
    document.getElementById('confirm-modal').classList.remove('open');
    if (confirmCallback) { confirmCallback(); confirmCallback = null; }
}
function cancelConfirm() {
    document.getElementById('confirm-modal').classList.remove('open');
    confirmCallback = null;
}

// =============================================
// 4. SAAT & BAŞLANGIÇ
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    updateClock();
    setInterval(updateClock, 1000);

    // Sıcaklık simülasyonu (her 8 saniyede)
    setInterval(simulateTemperature, 8000);

    const passInput = document.getElementById('passcode');
    if (passInput) {
        passInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') attemptLogin(); });
        passInput.focus();
    }
});

function updateClock() {
    const el = document.getElementById('clock');
    if (el) el.innerText = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    const dateEl = document.getElementById('header-date');
    if (dateEl) dateEl.innerText = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
}

// =============================================
// 5. LOGIN
// =============================================
function attemptLogin() {
    const passInput = document.getElementById('passcode');
    const code = passInput.value;

    if (code === '1234') {
        const loginScreen = document.getElementById('login-screen');
        loginScreen.style.opacity = '0';
        setTimeout(() => {
            loginScreen.style.display = 'none';
            initProfile();
            initDB();
            initChart();
            initSecurityPage();
            initDevicePage();
            initAnalytics();
            switchPage('dashboard');
            showToast('Sisteme başarıyla giriş yapıldı.', 'success');
            addEvent('Login Başarılı', 'WebClient');
        }, 700);
    } else {
        const errorMsg = document.getElementById('login-error');
        errorMsg.classList.remove('hidden');
        passInput.value = '';
        passInput.classList.add('border-red-500');
        setTimeout(() => passInput.classList.remove('border-red-500'), 1000);
    }
}

// =============================================
// 6. NAVİGASYON
// =============================================
function switchPage(id) {
    document.querySelectorAll('.page-content').forEach(el => el.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) target.classList.add('active');

    const titles = {
        dashboard: 'Genel Bakış', cameras: 'Kameralar', security: 'Güvenlik',
        devices: 'Cihazlar', 'db-panel': 'Veritabanı', profile: 'Profil & Ayarlar', analytics: 'Analitik'
    };
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) pageTitle.innerText = titles[id] || id;

    if (window.innerWidth < 768) {
        const sb = document.getElementById('sidebar');
        if (sb && !sb.classList.contains('-translate-x-full')) toggleSidebar();
    }

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.className = 'nav-btn w-full flex items-center gap-4 p-4 rounded-2xl text-gray-400 hover:bg-white/5 transition-all border-l-4 border-transparent cursor-pointer';
    });
    const activeBtn = document.getElementById('nav-' + id);
    if (activeBtn) {
        activeBtn.className = 'nav-btn w-full flex items-center gap-4 p-4 rounded-2xl transition-all bg-gradient-to-r from-neon-cyan/10 to-transparent border-l-4 border-neon-cyan text-neon-cyan cursor-pointer';
    }

    // Analitik sayfası açıldığında güncelle
    if (id === 'analytics') refreshAnalytics();
    // Security sayfasında log yenile
    if (id === 'security') renderSecurityLogs();
}

function toggleSidebar() {
    const sb = document.getElementById('sidebar');
    const ov = document.getElementById('sidebar-overlay');
    sb.classList.toggle('-translate-x-full');
    if (ov) ov.classList.toggle('hidden');
}

function toggleNotifications(e) {
    e.stopPropagation();
    document.getElementById('notification-panel').classList.toggle('hidden');
}

// =============================================
// 7. PROFİL
// =============================================
function initProfile() {
    document.getElementById('p-name').value = profile.name;
    document.getElementById('p-surname').value = profile.surname;
    document.getElementById('p-role').value = profile.role;
    updateProfileDisplay();
}

function updateProfileDisplay() {
    document.getElementById('sidebar-name').innerText = `${profile.name} ${profile.surname[0]}.`;
    document.getElementById('sidebar-role').innerText = profile.role;
    document.getElementById('profile-name-display').innerText = `${profile.name} ${profile.surname}`;
    document.getElementById('profile-role-display').innerText = profile.role;
}

function saveDynamicProfile(btn) {
    profile.name = document.getElementById('p-name').value;
    profile.surname = document.getElementById('p-surname').value;
    profile.role = document.getElementById('p-role').value;

    saveProfile(profile);
    updateProfileDisplay();

    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="ph-bold ph-check"></i> Kaydedildi!';
    btn.classList.add('bg-green-500', 'text-white');
    btn.classList.remove('bg-neon-cyan', 'text-black');
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove('bg-green-500', 'text-white');
        btn.classList.add('bg-neon-cyan', 'text-black');
    }, 2000);
    showToast('Profil bilgileri kaydedildi.', 'success');
}

// =============================================
// 8. KAMERALAR
// =============================================
function openCameraSelector() { document.getElementById('camera-selector-modal').classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

const roomData = {
    'salon': { name: 'Salon', img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200' },
    'kitchen': { name: 'Mutfak', img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200' },
    'garden': { name: 'Bahçe (IR)', img: 'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?q=80&w=1200' },
    'entrance': { name: 'Giriş Kapısı', img: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?q=80&w=1200' }
};

function openRoomDetail(k) {
    const d = roomData[k];
    document.getElementById('modal-room-name').innerText = d.name;
    document.getElementById('main-cam-view').src = d.img;
    document.getElementById('room-detail-modal').classList.add('open');
    addEvent(`Kamera İzlendi: ${d.name}`, 'WebClient');
}

// =============================================
// 9. DB CRUD SİSTEMİ
// =============================================
const schemas = {
    users: { id: 'ID', name: 'Ad', surname: 'Soyad', status: 'Durum', email: 'E-Posta' },
    houses: { id: 'ID', address: 'Adres', ownerId: 'Sahip ID', type: 'Konut Tipi' },
    devices: { id: 'ID', name: 'Cihaz Adı', type: 'Tür', roomId: 'Oda ID', status: 'Durum' },
    events: { id: 'Log ID', date: 'Tarih & Saat', event: 'Olay', source: 'Kaynak' }
};

let currentTable = 'users';
let editMode = false;
let editId = null;

function initDB() { updateStats(); changeTable(); updateRecentEvents(); }

function changeTable() {
    const selector = document.getElementById('table-selector');
    if (selector) { currentTable = selector.value; clearForm(); renderFormInputs(); renderTableData(); }
}

function updateStats() {
    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
    setEl('stat-users', db.users.length);
    setEl('stat-houses', db.houses.length);
    setEl('stat-devices', db.devices.length);
    setEl('stat-events', db.events.length);
}

function renderFormInputs() {
    const container = document.getElementById('dynamic-form');
    if (!container) return;
    container.innerHTML = '';
    Object.keys(schemas[currentTable]).forEach(key => {
        if (key === 'id') return;
        container.innerHTML += `<div class="space-y-1"><label class="text-xs text-gray-400 uppercase font-bold ml-1">${schemas[currentTable][key]}</label><input type="text" id="input-${key}" class="db-input" placeholder="${schemas[currentTable][key]} giriniz..."></div>`;
    });
}

function renderTableData() {
    const tbody = document.getElementById('db-table-body');
    const thead = document.getElementById('db-table-head');
    const data = db[currentTable];
    if (!tbody || !thead) return;

    thead.innerHTML = '';
    Object.values(schemas[currentTable]).forEach(l => thead.innerHTML += `<th>${l}</th>`);
    thead.innerHTML += `<th class="text-right">İŞLEMLER</th>`;

    tbody.innerHTML = '';
    const emptyState = document.getElementById('empty-state');
    if (data.length === 0) { if (emptyState) emptyState.classList.remove('hidden'); return; }
    else { if (emptyState) emptyState.classList.add('hidden'); }

    data.forEach(row => {
        let tr = `<tr class="border-b border-white/5 hover:bg-white/5 transition group">`;
        Object.keys(schemas[currentTable]).forEach(k => {
            const val = row[k];
            let display = val;
            if (k === 'status') display = `<span class="px-2 py-1 rounded text-xs font-bold ${val === 'ON' || val === 'Aktif' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}">${val}</span>`;
            tr += `<td>${display}</td>`;
        });
        tr += `<td class="text-right"><div class="flex justify-end gap-2"><button onclick="editRow(${row.id})" class="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white transition flex items-center justify-center cursor-pointer"><i class="ph-bold ph-pencil-simple"></i></button><button onclick="confirmDeleteRow(${row.id})" class="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition flex items-center justify-center cursor-pointer"><i class="ph-bold ph-trash"></i></button></div></td></tr>`;
        tbody.innerHTML += tr;
    });
}

function saveData() {
    const keys = Object.keys(schemas[currentTable]).filter(k => k !== 'id');
    let newObj = {};
    let isEmpty = false;
    keys.forEach(k => {
        const el = document.getElementById(`input-${k}`);
        const val = el ? el.value.trim() : '';
        if (!val) isEmpty = true;
        newObj[k] = val;
    });

    if (isEmpty) { showToast('Lütfen tüm alanları doldurun!', 'warning'); return; }

    if (editMode) {
        const idx = db[currentTable].findIndex(x => x.id === editId);
        newObj.id = editId;
        db[currentTable][idx] = newObj;
        showToast('Kayıt başarıyla güncellendi.', 'success');
    } else {
        const newId = db[currentTable].length > 0 ? Math.max(...db[currentTable].map(o => o.id)) + 1 : 1;
        newObj.id = newId;
        db[currentTable].push(newObj);
        showToast('Yeni kayıt başarıyla eklendi.', 'success');
    }

    saveDB();
    clearForm();
    renderTableData();
    updateStats();
    updateRecentEvents();
}

function confirmDeleteRow(id) {
    const item = db[currentTable].find(x => x.id === id);
    const label = item ? (item.name || item.address || item.event || `ID: ${id}`) : `ID: ${id}`;
    showConfirm(`"${label}" kaydını silmek istediğinize emin misiniz?`, () => deleteRow(id));
}

function deleteRow(id) {
    db[currentTable] = db[currentTable].filter(x => x.id !== id);
    saveDB();
    renderTableData();
    updateStats();
    if (editMode && editId === id) clearForm();
    showToast('Kayıt silindi.', 'error');
}

function editRow(id) {
    const item = db[currentTable].find(x => x.id === id);
    Object.keys(schemas[currentTable]).forEach(k => {
        if (k !== 'id') { const el = document.getElementById(`input-${k}`); if (el) el.value = item[k]; }
    });
    editMode = true;
    editId = id;
    document.getElementById('form-title').innerText = `Kayıt Düzenleniyor (ID: ${id})`;
    document.getElementById('form-mode-badge').innerText = 'UPDATE MODE';
    document.getElementById('form-mode-badge').className = 'text-[10px] bg-neon-purple text-white px-2 py-1 rounded';
    const btn = document.getElementById('save-btn');
    btn.innerText = 'Güncelle';
    btn.className = 'px-6 py-2 bg-neon-purple hover:bg-purple-400 text-white rounded-lg text-sm font-bold transition shadow-[0_0_10px_rgba(189,0,255,0.4)] cursor-pointer';
}

function clearForm() {
    document.querySelectorAll('.db-input').forEach(i => i.value = '');
    editMode = false; editId = null;
    const title = document.getElementById('form-title'); if (title) title.innerText = 'Yeni Kayıt Ekle';
    const badge = document.getElementById('form-mode-badge'); if (badge) { badge.innerText = 'INSERT MODE'; badge.className = 'text-[10px] bg-neon-cyan text-black px-2 py-1 rounded'; }
    const btn = document.getElementById('save-btn');
    if (btn) { btn.innerText = 'Ekle'; btn.className = 'px-6 py-2 bg-neon-cyan hover:bg-cyan-400 text-black rounded-lg text-sm font-bold transition shadow-[0_0_10px_rgba(0,210,255,0.4)] cursor-pointer'; }
}

// =============================================
// 10. OLAY LOGLAMA
// =============================================
function addEvent(eventName, source) {
    const now = new Date();
    const dateStr = now.toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const newId = db.events.length > 0 ? Math.max(...db.events.map(e => e.id)) + 1 : 1;
    db.events.unshift({ id: newId, date: dateStr, event: eventName, source: source });
    // Log'u max 100 tut
    if (db.events.length > 100) db.events = db.events.slice(0, 100);
    saveDB();
    updateStats();
    updateRecentEvents();
}

function updateRecentEvents() {
    const container = document.getElementById('recent-events');
    if (!container) return;
    const last3 = db.events.slice(0, 3);
    container.innerHTML = '';
    if (last3.length === 0) { container.innerHTML = '<p class="text-gray-500 text-xs text-center py-4">Henüz olay yok</p>'; return; }
    last3.forEach((ev, i) => {
        container.innerHTML += `<div class="flex gap-3 relative pl-3 ${i > 0 ? 'opacity-60' : ''}">
            <div class="absolute left-0 top-2 bottom-0 w-0.5 ${i === 0 ? 'bg-neon-cyan' : 'bg-gray-700'}"></div>
            <span class="text-${i === 0 ? 'neon-cyan' : 'gray-400'} font-mono text-xs mt-1 whitespace-nowrap">${ev.date.slice(-5)}</span>
            <div><p class="font-bold text-sm">${ev.event}</p><p class="text-xs text-gray-400">${ev.source}</p></div>
        </div>`;
    });
}

// =============================================
// 11. GÜVENLİK SAYFASI
// =============================================
function initSecurityPage() {
    updateSecurityUI();
    renderSecurityLogs();
}

function updateSecurityUI() {
    const isActive = securityState.alarmActive;
    const icon = document.getElementById('security-icon');
    const title = document.getElementById('security-title');
    const desc = document.getElementById('security-desc');
    const btn = document.getElementById('security-toggle-btn');
    const statusDot = document.getElementById('security-status-dot');

    if (!icon) return;
    if (isActive) {
        icon.className = 'ph-fill ph-shield-check text-7xl text-green-500 mb-4 relative z-10';
        title.innerText = 'Sistem Güvende';
        desc.innerText = 'Tüm sensörler aktif.';
        btn.innerText = 'Alarmı Devre Dışı Bırak';
        btn.className = 'px-10 py-3 bg-white/5 border border-white/10 rounded-full font-bold hover:bg-red-500 hover:border-red-500 transition relative z-10 cursor-pointer';
        if (statusDot) { statusDot.className = 'w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse'; statusDot.nextSibling && (statusDot.nextSibling.textContent = ' Online'); }
    } else {
        icon.className = 'ph-fill ph-shield-slash text-7xl text-red-500 mb-4 relative z-10';
        title.innerText = 'Alarm Pasif';
        desc.innerText = 'Güvenlik sistemi devre dışı!';
        btn.innerText = 'Alarmı Aktif Et';
        btn.className = 'px-10 py-3 bg-green-500 border border-green-500 rounded-full font-bold hover:bg-green-400 transition relative z-10 cursor-pointer';
    }
}

function toggleAlarm() {
    securityState.alarmActive = !securityState.alarmActive;
    saveSecurityState();
    updateSecurityUI();
    const msg = securityState.alarmActive ? 'Güvenlik Sistemi Aktifleştirildi' : 'Güvenlik Sistemi Devre Dışı Bırakıldı';
    addEvent(msg, 'Kullanıcı');
    showToast(msg, securityState.alarmActive ? 'success' : 'warning');
}

function renderSecurityLogs() {
    const container = document.getElementById('security-log-list');
    if (!container) return;
    const last6 = db.events.slice(0, 6);
    container.innerHTML = '';
    last6.forEach((ev, i) => {
        container.innerHTML += `<div class="flex gap-4 relative pl-2 ${i > 0 ? 'opacity-60' : ''}">
            <div class="absolute left-0 top-2 bottom-0 w-0.5 ${i === 0 ? 'bg-neon-cyan' : 'bg-gray-700'}"></div>
            <span class="${i === 0 ? 'text-neon-cyan' : 'text-gray-400'} font-mono text-xs mt-1 whitespace-nowrap">${ev.date}</span>
            <div><p class="font-bold text-sm">${ev.event}</p><p class="text-xs text-gray-400">${ev.source}</p></div>
        </div>`;
    });
}

// =============================================
// 12. CİHAZ SAYFASI
// =============================================
function initDevicePage() {
    Object.keys(deviceStates).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.checked = deviceStates[id];
    });
}

function toggleDevice(deviceId, deviceName) {
    const el = document.getElementById(deviceId);
    if (!el) return;
    deviceStates[deviceId] = el.checked;
    saveDeviceStates();
    const status = el.checked ? 'Açıldı' : 'Kapatıldı';
    addEvent(`${deviceName} ${status}`, 'Cihaz Paneli');
    showToast(`${deviceName} ${status.toLowerCase()}.`, el.checked ? 'success' : 'info');
}

// =============================================
// 13. SICAKLIK SİMÜLASYONU
// =============================================
let currentTemp = parseInt(localStorage.getItem('shome_temp') || '24');
function simulateTemperature() {
    const delta = (Math.random() > 0.5 ? 1 : -1) * (Math.random() < 0.3 ? 1 : 0);
    currentTemp = Math.min(30, Math.max(18, currentTemp + delta));
    localStorage.setItem('shome_temp', currentTemp);
    const el = document.getElementById('temperature-display');
    if (el) el.innerText = `${currentTemp}°C`;
}

// =============================================
// 14. ENERJİ GRAFİĞİ
// =============================================
let energyChart = null;
function initChart() {
    const ctx = document.getElementById('energyChart');
    if (!ctx) return;

    const context = ctx.getContext('2d');
    const gradient = context.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(0, 210, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(0, 210, 255, 0)');

    energyChart = new Chart(context, {
        type: 'line',
        data: {
            labels: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
            datasets: [{
                label: 'kWh',
                data: energyData,
                borderColor: '#00D2FF',
                backgroundColor: gradient,
                borderWidth: 3,
                tension: 0.4, fill: true,
                pointBackgroundColor: '#00D2FF',
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { x: { display: false }, y: { display: false } }
        }
    });

    const totalEl = document.getElementById('energy-total');
    if (totalEl) totalEl.innerText = energyData.reduce((a, b) => a + b, 0).toFixed(1) + ' kWh';
}

// =============================================
// 15. ANALİTİK SAYFASI
// =============================================
let eventPieChart = null;
let weeklyBarChart = null;

function initAnalytics() {
    // İlk yükleme için grafikleri oluştur
    setTimeout(refreshAnalytics, 100);
}

function refreshAnalytics() {
    // İstatistikler
    const totalDevices = db.devices.filter(d => d.status === 'ON').length;
    const el = (id) => document.getElementById(id);
    if (el('analytics-users')) el('analytics-users').innerText = db.users.filter(u => u.status === 'Aktif').length;
    if (el('analytics-events')) el('analytics-events').innerText = db.events.length;
    if (el('analytics-devices-on')) el('analytics-devices-on').innerText = totalDevices;
    if (el('analytics-security-score')) {
        const score = securityState.alarmActive ? (75 + Math.min(totalDevices * 5, 25)) : 30;
        el('analytics-security-score').innerText = score;
        const bar = el('security-score-bar');
        if (bar) { bar.style.width = score + '%'; bar.className = `h-3 rounded-full transition-all duration-1000 ${score >= 70 ? 'bg-green-500' : score >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`; }
    }

    // Olay Dağılımı Pie Chart
    const eventCounts = {};
    db.events.forEach(e => { const key = e.event.split(' ')[0]; eventCounts[key] = (eventCounts[key] || 0) + 1; });
    const pieCtx = document.getElementById('eventPieChart');
    if (pieCtx) {
        if (eventPieChart) eventPieChart.destroy();
        eventPieChart = new Chart(pieCtx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(eventCounts),
                datasets: [{ data: Object.values(eventCounts), backgroundColor: ['#00D2FF', '#BD00FF', '#00FF94', '#FF007A', '#FF3131', '#FFD700'], borderWidth: 0 }]
            },
            options: {
                responsive: true, maintainAspectRatio: false, cutout: '70%',
                plugins: { legend: { position: 'bottom', labels: { color: '#9ca3af', boxWidth: 12, font: { size: 11 } } } }
            }
        });
    }

    // Haftalık Enerji Bar Chart
    const barCtx = document.getElementById('weeklyBarChart');
    if (barCtx) {
        if (weeklyBarChart) weeklyBarChart.destroy();
        weeklyBarChart = new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
                datasets: [{
                    label: 'kWh', data: energyData,
                    backgroundColor: energyData.map(v => v > 16 ? 'rgba(255,49,49,0.6)' : 'rgba(0,210,255,0.5)'),
                    borderRadius: 8, borderSkipped: false
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af' } },
                    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af' } }
                }
            }
        });
    }
}

// =============================================
// 16. SIKÇA KULLANILAN YARDIMCILAR
// =============================================
document.addEventListener('click', (e) => {
    const panel = document.getElementById('notification-panel');
    if (panel && !panel.classList.contains('hidden') && !e.target.closest('#notification-panel') && !e.target.closest('[onclick="toggleNotifications(event)"]')) {
        panel.classList.add('hidden');
    }
});