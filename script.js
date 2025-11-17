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

const dgsTopics = {
  matematik: [
    "Temel Kavramlar", "Sayı Basamakları", "Bölme Bölünebilme",
    "Rasyonel Sayılar", "Basit Eşitsizlikler", "Mutlak Değer",
    "Üslü Sayılar", "Köklü Sayılar", "Çarpanlara Ayırma",
    "Oran Orantı", "Sayı Problemleri", "Kesir Problemleri",
    "Yaş Problemleri", "Hareket Problemleri", "Yüzde/Kar/Zarar",
    "Kümeler", "Fonksiyonlar", "Permütasyon Kombinasyon",
    "Olasılık", "Sayısal Mantık", "Geometri"
  ],
  turkce: [
    "Sözcükte Anlam", "Sözcüğün Anlamı", "Gerçek Anlam", "Mecaz Anlam", "Terim Anlam",
    "Soyut – Somut Anlam", "Nitel – Nicel Anlam", "Eş anlamlı Sözcükler",
    "Yakın Anlamlı Sözcükler", "Karşıt Anlamlı Sözcükler", "Eş sesli (Sesteş) Sözcükler",
    "Söz Sanatları", "Deyimler", "Atasözleri", "İkilemeler", "Cümlede Anlam",
    "Cümle Vurgusu", "Yakın Anlamlı Cümleler", "Cümle Analizi",
    "Karşıt Anlamlı (Çelişen) Cümleler", "Kesin Yargı", "Cümle Tamamlama",
    "Cümle Oluşturma", "Anlatım Biçimleri", "Öyküleyici Anlatım", "Betimleyici Anlatım",
    "Açıklayıcı Anlatım", "Tartışmacı Anlatım", "Düşünceyi Geliştirme Yolları",
    "Benzetme", "Tanımlama", "Karşılaştırma", "Örneklendirme",
    "Tanık Gösterme (Alıntı Yapma)", "Sayısal Verilerden Yararlanma", "Paragraf",
    "Paragrafta Konu / Başlık", "Paragrafta Ana Düşünce",
    "Paragrafta Yardımcı Düşünceler", "Paragrafın Yapısı", "Sözel Mantık",
    "Çıkarım Soruları", "Sıralama Soruları", "Yer-Konum Bildiren Sorular",
    "Tablo Yorumlama Soruları"
  ]
};

// State (Durum Değişkenleri)
let globalData = {}; 
let currentModalStudent = ""; 
let currentModalSubject = "matematik"; // Modal içindeki aktif ders

// --- SAYFA YÜKLENİNCE ---
document.addEventListener('DOMContentLoaded', () => {
    const dataRef = ref(db, 'progress');
    onValue(dataRef, (snapshot) => {
        globalData = snapshot.val() || {}; 
        renderDashboard();
        
        // Eğer modal açıksa, tabloyu yenile (Canlı güncelleme için)
        if(document.getElementById('detail-modal').style.display === 'flex') {
            renderModalTable(currentModalSubject);
        }
    });
});


// --- DASHBOARD (ANA SAYFA) ---
window.renderDashboard = function() {
    const grid = document.getElementById('stats-grid');
    grid.innerHTML = '';

    if (Object.keys(globalData).length === 0 && students.length > 0) {
         grid.innerHTML = '<p style="color:#666; font-size: 0.9rem; padding:20px;">Henüz veri girişi yapılmamış veya yükleniyor...</p>';
    }

    students.forEach(student => {
        let bookMathCount = 0, bankMathCount = 0, bookTurkceCount = 0, bankTurkceCount = 0;

        // Matematik Hesaplama (Sadece 'done' olanlar sayılır)
        dgsTopics.matematik.forEach((_, index) => {
            if(globalData[`dgs_dark_matematik_kitap_${index}_${student}`] === 'done') bookMathCount++;
            if(globalData[`dgs_dark_matematik_banka_${index}_${student}`] === 'done') bankMathCount++;
        });

        // Türkçe Hesaplama
        dgsTopics.turkce.forEach((_, index) => {
            if(globalData[`dgs_dark_turkce_kitap_${index}_${student}`] === 'done') bookTurkceCount++;
            if(globalData[`dgs_dark_turkce_banka_${index}_${student}`] === 'done') bankTurkceCount++;
        });

        const totalMath = dgsTopics.matematik.length;
        const totalTurkce = dgsTopics.turkce.length;
        
        const bookMathPercent = totalMath > 0 ? Math.round((bookMathCount / totalMath) * 100) : 0;
        const bankMathPercent = totalMath > 0 ? Math.round((bankMathCount / totalMath) * 100) : 0;
        const bookTurkcePercent = totalTurkce > 0 ? Math.round((bookTurkceCount / totalTurkce) * 100) : 0;
        const bankTurkcePercent = totalTurkce > 0 ? Math.round((bankTurkceCount / totalTurkce) * 100) : 0;

        const card = document.createElement('div');
        card.className = 'stat-card';
        card.innerHTML = `
            <div class="stat-header">
                <div class="stat-avatar">${student.charAt(0)}</div>
                <div class="stat-name">${student}</div>
            </div>
            <div class="progress-group">
                <div class="progress-label"><span>📘 Matematik (Ders Kitabı)</span><span>%${bookMathPercent}</span></div>
                <div class="progress-bg"><div class="progress-fill fill-pink" style="width: ${bookMathPercent}%"></div></div>
            </div>
            <div class="progress-group">
                <div class="progress-label"><span>📝 Matematik (Soru Bankası)</span><span>%${bankMathPercent}</span></div>
                <div class="progress-bg"><div class="progress-fill fill-blue" style="width: ${bankMathPercent}%"></div></div>
            </div>
            <div class="progress-group">
                <div class="progress-label"><span>📗 Türkçe (Ders Kitabı)</span><span>%${bookTurkcePercent}</span></div>
                <div class="progress-bg"><div class="progress-fill fill-green" style="width: ${bookTurkcePercent}%"></div></div>
            </div>
            <div class="progress-group">
                <div class="progress-label"><span>✏️ Türkçe (Soru Bankası)</span><span>%${bankTurkcePercent}</span></div>
                <div class="progress-bg"><div class="progress-fill fill-orange" style="width: ${bankTurkcePercent}%"></div></div>
            </div>
            <button class="detail-btn" onclick="openDetailModal('${student}')">📋 Detayları ve Düzenle</button>
        `;
        grid.appendChild(card);
    });
};

// --- MODAL İŞLEMLERİ ---

window.openDetailModal = function(studentName) {
    const modal = document.getElementById('detail-modal');
    const modalTitle = document.getElementById('modal-student-name');
    
    currentModalStudent = studentName; 
    modalTitle.textContent = `${studentName} - Düzenle`;
    
    // Varsayılan olarak Matematik ile aç ve Ders Seçim Menüsünü oluştur
    renderSubjectSelector('matematik');
    renderModalTable('matematik');
    
    modal.style.display = 'flex';
};

// YENİ: Ders Seçim Combobox'ını Oluşturan Fonksiyon
window.renderSubjectSelector = function(defaultSubject) {
    const container = document.getElementById('subject-selector-container');
    currentModalSubject = defaultSubject;

    const labels = {
        'matematik': { text: 'Matematik', icon: '🧠' },
        'turkce': { text: 'Türkçe', icon: '🗣️' }
    };

    const current = labels[defaultSubject];
    const extraClass = defaultSubject === 'turkce' ? 'subject-turkce' : '';

    container.innerHTML = `
        <div class="custom-select-wrapper subject-select-wrapper" id="wrapper-subject">
            <div class="custom-select-trigger ${extraClass}" onclick="toggleCustomSelect('subject')">
                <span>${current.icon} ${current.text}</span>
                <span class="arrow">▼</span>
            </div>
            <div class="custom-options">
                <div class="custom-option" onclick="changeModalSubject('matematik')">
                    <span class="option-icon">🧠</span> Matematik
                </div>
                <div class="custom-option" onclick="changeModalSubject('turkce')">
                    <span class="option-icon">🗣️</span> Türkçe
                </div>
            </div>
        </div>
    `;
};

// YENİ: Ders Değiştirildiğinde Çalışır
window.changeModalSubject = function(subject) {
    currentModalSubject = subject;
    
    // Combobox'ı güncelle (Seçileni göster)
    renderSubjectSelector(subject);
    
    // Tabloyu güncelle
    renderModalTable(subject);
    
    // Menüyü kapat (renderSubjectSelector zaten HTML'i yenilediği için gerek yok ama temizlik için)
    const wrapper = document.getElementById('wrapper-subject');
    if(wrapper) wrapper.classList.remove('open');
};

// Tabloyu Çiz
function renderModalTable(subject) {
    const tbody = document.getElementById('modal-table-body');
    tbody.innerHTML = ''; 

    const topics = dgsTopics[subject]; 

    topics.forEach((topic, index) => {
        // Anahtarları oluştur
        const bookKey = `dgs_dark_${subject}_kitap_${index}_${currentModalStudent}`;
        const bankKey = `dgs_dark_${subject}_banka_${index}_${currentModalStudent}`;
        
        // Değerleri al
        const bookVal = globalData[bookKey] || 'todo';
        const bankVal = globalData[bankKey] || 'todo';
        
        tbody.innerHTML += `
            <tr>
                <td>${topic}</td> 
                <td class="center">
                    <div class="status-select-wrapper">
                        ${createDropdown(bookKey, bookVal)}
                    </div>
                </td>
                <td class="center">
                    <div class="status-select-wrapper">
                        ${createDropdown(bankKey, bankVal)}
                    </div>
                </td>
            </tr>`;
    });
}

// --- PROFESYONEL DROPDOWN MANTIĞI ---

// Dropdown HTML Oluşturucu
function createDropdown(key, currentValue) {
    const labels = {
        'todo': { text: 'Yapılmadı', icon: '🔴', class: 'status-todo' },
        'doing': { text: 'Yapılıyor', icon: '🟡', class: 'status-doing' },
        'done': { text: 'Yapıldı', icon: '🟢', class: 'status-done' }
    };

    const current = labels[currentValue] || labels['todo'];

    return `
        <div class="custom-select-wrapper" id="wrapper-${key}">
            <div class="custom-select-trigger ${current.class}" onclick="toggleCustomSelect('${key}')">
                <span>${current.icon} ${current.text}</span>
                <span class="arrow">▼</span>
            </div>
            <div class="custom-options">
                <div class="custom-option" onclick="selectOption('${key}', 'todo')">
                    <span class="option-icon">🔴</span> Yapılmadı
                </div>
                <div class="custom-option" onclick="selectOption('${key}', 'doing')">
                    <span class="option-icon">🟡</span> Yapılıyor
                </div>
                <div class="custom-option" onclick="selectOption('${key}', 'done')">
                    <span class="option-icon">🟢</span> Yapıldı
                </div>
            </div>
        </div>
    `;
}

// Menüyü Aç/Kapa
window.toggleCustomSelect = function(key) {
    // Diğer tüm açık menüleri kapat
    document.querySelectorAll('.custom-select-wrapper.open').forEach(el => {
        if (el.id !== `wrapper-${key}`) el.classList.remove('open');
    });

    const wrapper = document.getElementById(`wrapper-${key}`);
    if (wrapper) wrapper.classList.toggle('open');
};

// Seçim Yapıldığında
window.selectOption = function(key, value) {
    // Firebase'e kaydet
    set(ref(db, 'progress/' + key), value);

    const wrapper = document.getElementById(`wrapper-${key}`);
    if(wrapper) {
        wrapper.classList.remove('open');
        
        // UI'ı anlık güncelle (Hız hissi için)
        const trigger = wrapper.querySelector('.custom-select-trigger');
        const labels = {
            'todo': { text: 'Yapılmadı', icon: '🔴', class: 'status-todo' },
            'doing': { text: 'Yapılıyor', icon: '🟡', class: 'status-doing' },
            'done': { text: 'Yapıldı', icon: '🟢', class: 'status-done' }
        };
        const selected = labels[value];
        trigger.className = `custom-select-trigger ${selected.class}`;
        trigger.innerHTML = `<span>${selected.icon} ${selected.text}</span> <span class="arrow">▼</span>`;
    }
};

// Sayfada boş bir yere tıklanırsa menüleri kapat
window.addEventListener('click', function(e) {
    const select = e.target.closest('.custom-select-wrapper');
    if (!select) {
        document.querySelectorAll('.custom-select-wrapper.open').forEach(el => {
            el.classList.remove('open');
        });
    }
});

window.closeModal = function() {
    document.getElementById('detail-modal').style.display = 'none';
};