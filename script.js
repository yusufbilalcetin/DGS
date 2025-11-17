// --- FIREBASE İMPORTLARI ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// --- SENİN KONFİGÜRASYONUN ---
const firebaseConfig = {
  apiKey: "AIzaSyAAYXq0afFZte-km0b324gkQBMnp_ERi-k",
  authDomain: "dgs-takip.firebaseapp.com",
  databaseURL: "https://dgs-takip-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "dgs-takip",
  storageBucket: "dgs-takip.firebasestorage.app",
  messagingSenderId: "236871378128",
  appId: "1:236871378128:web:0181f19847334468c7aad5",
  measurementId: "G-4JF445NMCW"
};

// --- UYGULAMA BAŞLATMA ---
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// --- VERİLER ---
const students = ["Fatih", "Erkan", "Berat", "Yusuf"];
const topics = [
    "Temel Kavramlar", "Sayı Basamakları", "Bölme Bölünebilme",
    "Rasyonel Sayılar", "Basit Eşitsizlikler", "Mutlak Değer",
    "Üslü Sayılar", "Köklü Sayılar", "Çarpanlara Ayırma",
    "Oran Orantı", "Problemler - Sayı", "Problemler - Kesir",
    "Problemler - Yaş", "Problemler - Hareket", "Kümeler",
    "Fonksiyonlar", "Permütasyon Kombinasyon", "Olasılık",
    "Sayısal Mantık", "Geometri"
];

// State
let currentCategory = 'kitap'; 
let currentTopicIndex = 0;
let globalData = {};

// --- SAYFA YÜKLENİNCE ---
document.addEventListener('DOMContentLoaded', () => {
    renderSidebar();
    
    // Firebase Dinleyici
    const dataRef = ref(db, 'progress');
    onValue(dataRef, (snapshot) => {
        globalData = snapshot.val() || {}; 
        
        if(document.getElementById('dashboard-view').style.display !== 'none') {
            renderDashboard();
        } else {
            renderContent();
        }
    });

    showPage('dashboard');
});

// --- FONKSİYONLARI GLOBAL HALE GETİR (Module Olduğu İçin) ---
window.toggleStatus = function(key, checkbox) {
    set(ref(db, 'progress/' + key), checkbox.checked);
};

window.showPage = function(pageId) {
    document.querySelectorAll('.view-container').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.nav-link').forEach(btn => btn.classList.remove('active'));
    const mobileToggle = document.querySelector('.mobile-nav-toggle');

    if (pageId === 'dashboard') {
        document.getElementById('dashboard-view').style.display = 'block';
        document.getElementById('nav-dash').classList.add('active');
        if(mobileToggle) mobileToggle.style.display = 'none';
        renderDashboard();
    } else {
        document.getElementById('checklist-view').style.display = 'flex';
        document.getElementById('nav-list').classList.add('active');
        if(mobileToggle) mobileToggle.style.display = 'block';
        renderContent();
    }
};

window.renderDashboard = function() {
    const grid = document.getElementById('stats-grid');
    grid.innerHTML = '';

    if (Object.keys(globalData).length === 0) {
         grid.innerHTML = '<p style="color:#666; font-size: 0.9rem; padding:20px;">Henüz veri girişi yapılmamış veya yükleniyor...</p>';
    }

    students.forEach(student => {
        let bookCount = 0;
        let bankCount = 0;

        topics.forEach((_, index) => {
            if(globalData[`dgs_dark_kitap_${index}_${student}`] === true) bookCount++;
            if(globalData[`dgs_dark_banka_${index}_${student}`] === true) bankCount++;
        });

        const totalTopics = topics.length;
        const bookPercent = Math.round((bookCount / totalTopics) * 100);
        const bankPercent = Math.round((bankCount / totalTopics) * 100);

        const card = document.createElement('div');
        card.className = 'stat-card';
        card.innerHTML = `
            <div class="stat-header">
                <div class="stat-avatar">${student.charAt(0)}</div>
                <div class="stat-name">${student}</div>
            </div>
            <div class="progress-group">
                <div class="progress-label"><span>📖 Ders Kitabı</span><span>%${bookPercent}</span></div>
                <div class="progress-bg"><div class="progress-fill fill-pink" style="width: ${bookPercent}%"></div></div>
            </div>
            <div class="progress-group">
                <div class="progress-label"><span>📝 Soru Bankası</span><span>%${bankPercent}</span></div>
                <div class="progress-bg"><div class="progress-fill fill-blue" style="width: ${bankPercent}%"></div></div>
            </div>
            <button class="detail-btn" onclick="openDetailModal('${student}')">📋 Detayları İncele</button>
        `;
        grid.appendChild(card);
    });
};

window.openDetailModal = function(studentName) {
    const modal = document.getElementById('detail-modal');
    const modalTitle = document.getElementById('modal-student-name');
    const tbody = document.getElementById('modal-table-body');

    modalTitle.textContent = `${studentName} - Karne`;
    tbody.innerHTML = '';

    topics.forEach((topic, index) => {
        const isBookDone = globalData[`dgs_dark_kitap_${index}_${studentName}`] === true;
        const isBankDone = globalData[`dgs_dark_banka_${index}_${studentName}`] === true;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${topic}</td>
            <td class="center"><span class="status-icon ${isBookDone ? 'done' : 'pending'}">${isBookDone ? '✅' : '●'}</span></td>
            <td class="center"><span class="status-icon ${isBankDone ? 'done' : 'pending'}">${isBankDone ? '✅' : '●'}</span></td>
        `;
        tbody.appendChild(row);
    });
    modal.style.display = 'flex';
};

window.closeModal = function() {
    document.getElementById('detail-modal').style.display = 'none';
};

window.switchTab = function(category) {
    currentCategory = category;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    if(category === 'kitap') {
        document.querySelector("button[onclick=\"switchTab('kitap')\"]").classList.add('active');
        document.getElementById('current-category-badge').textContent = "Ders Kitabı";
        document.getElementById('current-category-badge').style.color = "#FF4D6D"; 
    } else {
        document.querySelector("button[onclick=\"switchTab('banka')\"]").classList.add('active');
        document.getElementById('current-category-badge').textContent = "Soru Bankası";
        document.getElementById('current-category-badge').style.color = "#3B82F6";
    }
    renderContent();
};

window.renderSidebar = function() {
    const list = document.getElementById('topic-list');
    list.innerHTML = '';
    topics.forEach((topic, index) => {
        const li = document.createElement('li');
        li.textContent = topic;
        if (index === currentTopicIndex) li.classList.add('active');
        li.onclick = () => {
            currentTopicIndex = index;
            renderSidebar();
            renderContent();
            if(window.innerWidth <= 992) toggleSidebar();
        };
        list.appendChild(li);
    });
};

window.renderContent = function() {
    const studentList = document.getElementById('student-list');
    document.getElementById('current-topic-title').textContent = topics[currentTopicIndex];
    studentList.innerHTML = '';

    students.forEach(student => {
        const storageKey = `dgs_dark_${currentCategory}_${currentTopicIndex}_${student}`;
        const isDone = globalData[storageKey] === true;

        const card = document.createElement('div');
        card.className = 'student-card';
        card.innerHTML = `
            <div class="avatar">${student.charAt(0)}</div>
            <div class="s-name">${student}</div>
            <label class="status-toggle">
                <div class="switch">
                    <input type="checkbox" ${isDone ? 'checked' : ''} onchange="toggleStatus('${storageKey}', this)">
                    <span class="slider"></span>
                </div>
            </label>
        `;
        studentList.appendChild(card);
    });
};

window.toggleSidebar = function() {
    document.getElementById('sidebar').classList.toggle('active');
    document.getElementById('overlay').classList.toggle('active');
};