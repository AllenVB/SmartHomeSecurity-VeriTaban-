/* S-Home v12.1 (FIXED) - App Logic */

// --- SAYFA YÜKLENDİĞİNDE ÇALIŞACAKLAR ---
document.addEventListener('DOMContentLoaded', () => {
    // Saat Başlat
    setInterval(() => {
        const el = document.getElementById('clock');
        if (el) el.innerText = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    }, 1000);

    // Enter tuşu ile giriş desteği
    const passInput = document.getElementById('passcode');
    if (passInput) {
        passInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') attemptLogin();
        });
        passInput.focus(); // Sayfa açılınca inputa odaklan
    }
});

// --- 1. LOGIN SİSTEMİ ---
function attemptLogin() {
    const passInput = document.getElementById('passcode');
    const code = passInput.value;

    if (code === '1234') {
        const loginScreen = document.getElementById('login-screen');
        const appContainer = document.getElementById('app-container');

        // Giriş Ekranını Gizle
        loginScreen.style.opacity = '0';

        setTimeout(() => {
            loginScreen.style.display = 'none';

            // Uygulamayı Aktif Et
            appContainer.classList.remove('opacity-0', 'blur-md', 'pointer-events-none');
            appContainer.classList.add('animate-fade-in');

            // Sistemleri Başlat
            initDB();
            initChart();
        }, 700);
    } else {
        const errorMsg = document.getElementById('login-error');
        errorMsg.classList.remove('hidden');
        passInput.value = '';
        passInput.classList.add('border-red-500');
        setTimeout(() => passInput.classList.remove('border-red-500'), 1000);
    }
}

// --- 2. NAVİGASYON ---
function switchPage(id) {
    // Tüm sayfaları gizle
    document.querySelectorAll('.page-content').forEach(el => el.classList.remove('active'));
    // Seçileni göster
    const target = document.getElementById(id);
    if (target) target.classList.add('active');

    // Mobilde menüyü kapat
    if (window.innerWidth < 768) {
        const sb = document.getElementById('sidebar');
        if (!sb.classList.contains('-translate-x-full')) toggleSidebar();
    }

    // Buton Stillerini Güncelle
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.className = 'nav-btn w-full flex items-center gap-4 p-4 rounded-2xl text-gray-400 hover:bg-white/5 transition-all border-l-4 border-transparent cursor-pointer';
        const i = btn.querySelector('i');
        if (i) i.className = i.className.replace('text-neon-cyan', '');
    });

    const activeBtn = document.getElementById('nav-' + id);
    if (activeBtn) {
        activeBtn.className = 'nav-btn w-full flex items-center gap-4 p-4 rounded-2xl transition-all bg-gradient-to-r from-neon-cyan/10 to-transparent border-l-4 border-neon-cyan text-neon-cyan cursor-pointer';
    }
}

function toggleSidebar() {
    const sb = document.getElementById('sidebar');
    sb.classList.toggle('-translate-x-full');
}

function toggleNotifications(e) {
    e.stopPropagation();
    document.getElementById('notification-panel').classList.toggle('hidden');
}

function closeNotificationsOutside(e) {
    const p = document.getElementById('notification-panel');
    if (p && !p.classList.contains('hidden')) p.classList.add('hidden');
}

// --- 3. PROFIL (DİNAMİK) ---
function saveDynamicProfile(btn) {
    const name = document.getElementById('p-name').value;
    const surname = document.getElementById('p-surname').value;
    const role = document.getElementById('p-role').value;

    document.getElementById('sidebar-name').innerText = `${name} ${surname[0]}.`;
    document.getElementById('sidebar-role').innerText = role;
    document.getElementById('profile-name-display').innerText = `${name} ${surname}`;
    document.getElementById('profile-role-display').innerText = role;

    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="ph-bold ph-check"></i> Kaydedildi!';
    btn.classList.add('bg-green-500', 'text-white');
    btn.classList.remove('bg-neon-cyan', 'text-black');
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove('bg-green-500', 'text-white');
        btn.classList.add('bg-neon-cyan', 'text-black');
    }, 2000);
}

// --- 4. KAMERA MODALLARI ---
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
}

// --- 5. DB CRUD SİSTEMİ ---
const schemas = {
    users: { id: 'ID', name: 'Ad', surname: 'Soyad', status: 'Durum', email: 'E-Posta' },
    houses: { id: 'ID', address: 'Adres', ownerId: 'Sahip ID', type: 'Konut Tipi' },
    devices: { id: 'ID', name: 'Cihaz Adı', type: 'Tür', roomId: 'Oda ID', status: 'Durum' },
    events: { id: 'Log ID', date: 'Tarih', event: 'Olay', source: 'Kaynak' }
};

const db = {
    users: [{ id: 1, name: 'Thomas', surname: 'Anderson', status: 'Aktif', email: 'thomas@shome.com' }, { id: 2, name: 'Neo', surname: 'One', status: 'Pasif', email: 'neo@matrix.com' }, { id: 3, name: 'Trinity', surname: 'Moss', status: 'Aktif', email: 'trinity@shome.com' }],
    houses: [{ id: 101, address: 'İzmir, Karşıyaka No:5', ownerId: 1, type: 'Villa' }, { id: 102, address: 'İstanbul, Beşiktaş No:9', ownerId: 3, type: 'Daire' }],
    devices: [{ id: 501, name: 'Ana Kamera', type: 'Kamera', roomId: 10, status: 'ON' }, { id: 502, name: 'Mutfak Sensör', type: 'Sensör', roomId: 11, status: 'ON' }, { id: 503, name: 'Bahçe Işık', type: 'Lamba', roomId: 12, status: 'OFF' }, { id: 504, name: 'Klima', type: 'Klima', roomId: 10, status: 'OFF' }],
    events: [{ id: 9001, date: '2025-11-20 14:02', event: 'Hareket Algılandı', source: 'CAM-03' }, { id: 9002, date: '2025-11-20 12:30', event: 'Login Başarılı', source: 'WebClient' }]
};

let currentTable = 'users';
let editMode = false;
let editId = null;

function initDB() { updateStats(); changeTable(); }

function changeTable() {
    const selector = document.getElementById('table-selector');
    if (selector) {
        currentTable = selector.value;
        clearForm();
        renderFormInputs();
        renderTableData();
    }
}

function updateStats() {
    if (document.getElementById('stat-users')) {
        document.getElementById('stat-users').innerText = db.users.length;
        document.getElementById('stat-houses').innerText = db.houses.length;
        document.getElementById('stat-devices').innerText = db.devices.length;
        document.getElementById('stat-events').innerText = db.events.length;
    }
}

function renderFormInputs() {
    const container = document.getElementById('dynamic-form');
    if (!container) return;
    container.innerHTML = '';
    Object.keys(schemas[currentTable]).forEach(key => {
        if (key === 'id') return;
        container.innerHTML += `
            <div class="space-y-1">
                <label class="text-xs text-gray-400 uppercase font-bold ml-1">${schemas[currentTable][key]}</label>
                <input type="text" id="input-${key}" class="db-input" placeholder="${schemas[currentTable][key]} giriniz...">
            </div>`;
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
    if (data.length === 0) {
        document.getElementById('empty-state').classList.remove('hidden');
        return;
    } else {
        document.getElementById('empty-state').classList.add('hidden');
    }

    data.forEach(row => {
        let tr = `<tr class="border-b border-white/5 hover:bg-white/5 transition">`;
        Object.keys(schemas[currentTable]).forEach(k => tr += `<td>${row[k]}</td>`);
        tr += `
            <td class="text-right flex justify-end gap-2 py-3">
                <button onclick="editRow(${row.id})" class="w-8 h-8 rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white transition flex items-center justify-center cursor-pointer"><i class="ph-bold ph-pencil-simple"></i></button>
                <button onclick="deleteRow(${row.id})" class="w-8 h-8 rounded bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition flex items-center justify-center cursor-pointer"><i class="ph-bold ph-trash"></i></button>
            </td></tr>`;
        tbody.innerHTML += tr;
    });
}

function saveData() {
    const keys = Object.keys(schemas[currentTable]).filter(k => k !== 'id');
    let newObj = {};
    let isEmpty = false;

    keys.forEach(k => {
        const val = document.getElementById(`input-${k}`).value;
        if (!val) isEmpty = true;
        newObj[k] = val;
    });

    if (isEmpty) { alert("Lütfen tüm alanları doldurun!"); return; }

    if (editMode) {
        const idx = db[currentTable].findIndex(x => x.id === editId);
        newObj.id = editId;
        db[currentTable][idx] = newObj;
    } else {
        const newId = db[currentTable].length > 0 ? Math.max(...db[currentTable].map(o => o.id)) + 1 : 1;
        newObj.id = newId;
        db[currentTable].push(newObj);
    }

    clearForm();
    renderTableData();
    updateStats();
}

function deleteRow(id) {
    if (confirm("Silmek istediğinize emin misiniz?")) {
        db[currentTable] = db[currentTable].filter(x => x.id !== id);
        renderTableData();
        updateStats();
        if (editMode && editId === id) clearForm();
    }
}

function editRow(id) {
    const item = db[currentTable].find(x => x.id === id);
    Object.keys(schemas[currentTable]).forEach(k => {
        if (k !== 'id') document.getElementById(`input-${k}`).value = item[k];
    });
    editMode = true;
    editId = id;
    document.getElementById('form-title').innerText = `Kayıt Düzenleniyor (ID: ${id})`;
    document.getElementById('form-mode-badge').innerText = "UPDATE MODE";
    document.getElementById('form-mode-badge').className = "text-[10px] bg-neon-purple text-white px-2 py-1 rounded";
    const btn = document.getElementById('save-btn');
    btn.innerText = "Güncelle";
    btn.className = "px-6 py-2 bg-neon-purple hover:bg-purple-400 text-white rounded-lg text-sm font-bold transition shadow-[0_0_10px_rgba(189,0,255,0.4)] cursor-pointer";
}

function clearForm() {
    document.querySelectorAll('.db-input').forEach(i => i.value = '');
    editMode = false;
    editId = null;
    document.getElementById('form-title').innerText = "Yeni Kayıt Ekle";
    document.getElementById('form-mode-badge').innerText = "INSERT MODE";
    document.getElementById('form-mode-badge').className = "text-[10px] bg-neon-cyan text-black px-2 py-1 rounded";
    const btn = document.getElementById('save-btn');
    btn.innerText = "Ekle";
    btn.className = "px-6 py-2 bg-neon-cyan hover:bg-cyan-400 text-black rounded-lg text-sm font-bold transition shadow-[0_0_10px_rgba(0,210,255,0.4)] cursor-pointer";
}

// --- 6. GRAFİK ---
function initChart() {
    const ctx = document.getElementById('energyChart');
    if (!ctx) return;

    const context = ctx.getContext('2d');
    const gradient = context.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(0, 210, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(0, 210, 255, 0)');

    new Chart(context, {
        type: 'line',
        data: {
            labels: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
            datasets: [{
                label: 'kWh',
                data: [12, 14, 11, 15, 13, 18, 16],
                borderColor: '#00D2FF',
                backgroundColor: gradient,
                borderWidth: 4,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { x: { display: false }, y: { display: false } }
        }
    });
}