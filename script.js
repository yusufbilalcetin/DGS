// -----------------------------------------------------------------------------
// 1. FIREBASE IMPORTLARI VE AYARLARI
// -----------------------------------------------------------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAAYXq0afFZte-km0b324gkQBMnp_ERi-k",
  authDomain: "dgs-takip.firebaseapp.com",
  databaseURL: "https://dgs-takip-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "dgs-takip",
  storageBucket: "dgs-takip.appspot.com",
  messagingSenderId: "236871378128",
  appId: "1:236871378128:web:0181f19847334468c7aad5",
  measurementId: "G-4JF445NMCW"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// -----------------------------------------------------------------------------
// 2. SABİTLER VE VERİ YAPISI
// -----------------------------------------------------------------------------
const STUDENTS = ["Fatih", "Erkan", "Berat", "Yusuf"];

const SUBJECT_LABELS = {
  matematik: { text: "Matematik", icon: "🧠" },
  turkce: { text: "Türkçe", icon: "🗣️" }
};

const STATUS_OPTIONS = {
  todo:  { value: "todo",  text: "🔴", icon: "🔴", class: "status-red" },
  doing: { value: "doing", text: "🟠", icon: "🟠", class: "status-orange" },
  done:  { value: "done",  text: "🟢", icon: "🟢", class: "status-green" }
};

// KONU LİSTESİ
const dgsTopics = {
  matematik: [
    { ad: "# ÜNİTE 1: SAYILAR", videoSayisi: 0, videoSuresi: 0 },
    { ad: "Temel Kavramlar", videoSayisi: 3, videoSuresi: 141 },
    { ad: "Tek ve Çift Sayılar", videoSayisi: 2, videoSuresi: 80 },
    { ad: "Pozitif ve Negatif Sayılar", videoSayisi: 1, videoSuresi: 49 },
    { ad: "Ardışık Sayılar", videoSayisi: 4, videoSuresi: 170 },
    { ad: "Sayı Basamakları", videoSayisi: 2, videoSuresi: 90 },
    { ad: "Dört İşlem", videoSayisi: 2, videoSuresi: 67 },
    { ad: "Bölünebilme Kuralları", videoSayisi: 3, videoSuresi: 115 },
    { ad: "Faktöriyel", videoSayisi: 2, videoSuresi: 90 },
    { ad: "Asal Sayılar", videoSayisi: 4, videoSuresi: 145 },
    { ad: "OBEB - OKEK", videoSayisi: 3, videoSuresi: 115 },

    { ad: "# ÜNİTE 2: İŞLEM YETENEĞİ", videoSayisi: 0, videoSuresi: 0 },
    { ad: "Basit Eşitsizlikler", videoSayisi: 4, videoSuresi: 160 },
    { ad: "Mutlak Değer", videoSayisi: 3, videoSuresi: 145 },
    { ad: "Rasyonel Sayılar", videoSayisi: 3, videoSuresi: 185 },
    { ad: "Üslü Sayılar", videoSayisi: 4, videoSuresi: 142 },
    { ad: "Köklü Sayılar", videoSayisi: 4, videoSuresi: 190 },
    { ad: "Çarpanlara Ayırma", videoSayisi: 4, videoSuresi: 190 },
    { ad: "Denklemler", videoSayisi: 2, videoSuresi: 100 },
    { ad: "Oran-Orantı", videoSayisi: 4, videoSuresi: 195 },

    { ad: "# ÜNİTE 3: PROBLEMLER", videoSayisi: 0, videoSuresi: 0 },
    { ad: "Sayı Problemleri", videoSayisi: 9, videoSuresi: 290 },
    { ad: "Kesir Problemleri", videoSayisi: 2, videoSuresi: 65 },
    { ad: "Sınav Tadında Kesirler", videoSayisi: 3, videoSuresi: 155 },
    { ad: "Yaş Problemleri", videoSayisi: 3, videoSuresi: 115 },
    { ad: "Kâr Zarar Problemleri", videoSayisi: 4, videoSayisi: 160 },
    { ad: "Karışım Problemleri", videoSayisi: 2, videoSuresi: 90 },
    { ad: "Hız Problemleri", videoSayisi: 5, videoSuresi: 200 },
    { ad: "İşçi Problemleri", videoSayisi: 2, videoSuresi: 90 },
    { ad: "Grafik Problemleri", videoSayisi: 8, videoSuresi: 300 },

    { ad: "# ÜNİTE 4: SAYISAL YETENEK", videoSayisi: 0, videoSuresi: 0 },
    { ad: "Kümeler", videoSayisi: 4, videoSuresi: 220 },
    { ad: "Permütasyon", videoSayisi: 5, videoSuresi: 190 },
    { ad: "Kombinasyon", videoSayisi: 4, videoSuresi: 140 },
    { ad: "Olasılık", videoSayisi: 4, videoSuresi: 180 },
    { ad: "Fonksiyonlar", videoSayisi: 8, videoSuresi: 270 },
    { ad: "Fonksiyon Dizileri", videoSayisi: 1, videoSuresi: 52 },
    { ad: "İşlem", videoSayisi: 2, videoSuresi: 80 },
    { ad: "Modüler Aritmetik", videoSayisi: 2, videoSuresi: 105 }
  ],

  turkce: [
    { ad: "# SÖZCÜKTE ANLAM", videoSayisi: 0, videoSuresi: 0 },
    { ad: "Sözcükte Anlam", videoSayisi: 4, videoSuresi: 60 },
    { ad: "Gerçek Anlam", videoSayisi: 0, videoSuresi: 0 },
    { ad: "Mecaz Anlam", videoSayisi: 0, videoSuresi: 0 },
    { ad: "Terim Anlam", videoSayisi: 0, videoSuresi: 0 },

    { ad: "# PARAGRAF", videoSayisi: 0, videoSuresi: 0 },
    { ad: "Paragraf", videoSayisi: 5, videoSuresi: 120 },

    { ad: "# MANTIK", videoSayisi: 0, videoSuresi: 0 },
    { ad: "Sözel Mantık", videoSayisi: 0, videoSuresi: 0 }
  ]
};

// -----------------------------------------------------------------------------
// 3. GLOBAL STATE
// -----------------------------------------------------------------------------
let globalData = {};
let currentModalStudent = "";
let currentModalSubject = "matematik";

// -----------------------------------------------------------------------------
// 4. YARDIMCI FONKSİYONLAR
// -----------------------------------------------------------------------------
function formatTime(minutes) {
  if (!minutes) return "0dk";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}s ${mins}dk` : `${mins}dk`;
}

function getStatusOption(value) {
  return STATUS_OPTIONS[value] || STATUS_OPTIONS.todo;
}

// Kitap & Banka Progres hesaplama
function calculateSeparateProgress(subject, type, student) {
  let completed = 0;
  let total = 0;

  dgsTopics[subject].forEach((topic, i) => {
    if (topic.ad.startsWith("#")) return;

    total++;

    const dbKey = `dgs_dark_${subject}_${type}_${i}_${student}`;
    if (globalData[dbKey] === "done") completed++;
  });

  return total === 0 ? 0 : Math.round((completed / total) * 100);
}

// -----------------------------------------------------------------------------
// 5. INIT — SAYFA YÜKLENİNCE
// -----------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  onValue(ref(db, "progress"), snap => {
    globalData = snap.val() || {};
    renderDashboard();

    if (document.getElementById("detail-modal").style.display === "flex") {
      renderModalTable(currentModalSubject);
    }
  });
});

// -----------------------------------------------------------------------------
// 6. DASHBOARD — Avatar Fotoğraflı Kart Render
// -----------------------------------------------------------------------------
window.renderDashboard = function () {
  const grid = document.getElementById("stats-grid");
  grid.innerHTML = "";

  STUDENTS.forEach(student => {
    const matKitap = calculateSeparateProgress("matematik", "kitap", student);
    const matBanka = calculateSeparateProgress("matematik", "banka", student);
    const turkKitap = calculateSeparateProgress("turkce", "kitap", student);
    const turkBanka = calculateSeparateProgress("turkce", "banka", student);

    const card = document.createElement("div");
    card.className = "stat-card";
    card.onclick = () => openDetailModal(student);

    card.innerHTML = `
      <div class="card-header">

        <div class="avatar-box">
            <img src="images/${student.toLowerCase()}.jpg" onerror="this.style.display='none'">
            <span>${student[0]}</span>
        </div>

        <div class="student-info">
           <div class="student-name">${student}</div>
        </div>
      </div>

      <div class="bars-container">
        <div class="bar-row">
          <div class="bar-info">
            <span class="bar-label"><span class="dot dot-blue"></span>Matematik (Ders Kitabı)</span>
            <span class="bar-percent">%${matKitap}</span>
          </div>
          <div class="progress-bg">
            <div class="progress-fill fill-blue" style="width: ${matKitap}%;"></div>
          </div>
        </div>

        <div class="bar-row">
          <div class="bar-info">
            <span class="bar-label"><span class="dot dot-pink"></span>Matematik (Soru Bankası)</span>
            <span class="bar-percent">%${matBanka}</span>
          </div>
          <div class="progress-bg">
            <div class="progress-fill fill-pink" style="width: ${matBanka}%;"></div>
          </div>
        </div>

        <div class="bar-row">
          <div class="bar-info">
            <span class="bar-label"><span class="dot dot-green"></span>Türkçe (Ders Kitabı)</span>
            <span class="bar-percent">%${turkKitap}</span>
          </div>
          <div class="progress-bg">
            <div class="progress-fill fill-green" style="width: ${turkKitap}%;"></div>
          </div>
        </div>

        <div class="bar-row">
          <div class="bar-info">
            <span class="bar-label"><span class="dot dot-orange"></span>Türkçe (Soru Bankası)</span>
            <span class="bar-percent">%${turkBanka}</span>
          </div>
          <div class="progress-bg">
            <div class="progress-fill fill-orange" style="width: ${turkBanka}%;"></div>
          </div>
        </div>
      </div>

      <button class="detail-btn">📄 Detayları Görüntüle ve Düzenle</button>
    `;

    grid.appendChild(card);
  });
};

// -----------------------------------------------------------------------------
// 7. MODAL İŞLEMLERİ
// -----------------------------------------------------------------------------
window.openDetailModal = student => {
  currentModalStudent = student;
  currentModalSubject = "matematik";

  document.getElementById("modal-student-name").textContent = `${student} - Detaylar`;

  renderSubjectSelector("matematik");
  renderModalTable("matematik");

  document.getElementById("detail-modal").style.display = "flex";
};

window.closeModal = () => {
  document.getElementById("detail-modal").style.display = "none";
};

// -----------------------------------------------------------------------------
// 8. DERS SEÇİCİ
// -----------------------------------------------------------------------------
window.renderSubjectSelector = function (subject) {
  currentModalSubject = subject;
  const s = SUBJECT_LABELS[subject];

  document.getElementById("subject-selector-container").innerHTML = `
    <div class="custom-select-wrapper subject-select-wrapper" id="wrapper-subject">
      <div class="custom-select-trigger ${subject === 'turkce' ? 'subject-turkce' : ''}" onclick="toggleCustomSelect('subject')">
        <span>${s.icon} ${s.text}</span><span class="arrow">▼</span>
      </div>
      <div class="custom-options">
        <div class="custom-option" onclick="changeModalSubject('matematik')">🧠 Matematik</div>
        <div class="custom-option" onclick="changeModalSubject('turkce')">🗣️ Türkçe</div>
      </div>
    </div>`;
};

window.changeModalSubject = function (subject) {
  currentModalSubject = subject;
  renderSubjectSelector(subject);
  renderModalTable(subject);
  document.getElementById("wrapper-subject")?.classList.remove("open");
};

// -----------------------------------------------------------------------------
// 9. DROPDOWN
// -----------------------------------------------------------------------------
window.toggleCustomSelect = function (key) {
  document.querySelectorAll(".custom-select-wrapper.open")
    .forEach(el => el.id !== `wrapper-${key}` && el.classList.remove("open"));

  const wrap = document.getElementById(`wrapper-${key}`);
  if (wrap) wrap.classList.toggle("open");
};

window.addEventListener("click", e => {
  if (!e.target.closest(".custom-select-wrapper")) {
    document.querySelectorAll(".custom-select-wrapper.open")
      .forEach(el => el.classList.remove("open"));
  }
});

function createStatusDropdown(key, currentValue) {
  const current = getStatusOption(currentValue);

  const optionsHTML = Object.values(STATUS_OPTIONS)
    .map(o => `
      <div class="custom-option" onclick="selectOption('${key}','${o.value}')">
        ${o.icon}
      </div>`
    ).join("");

  return `
    <div class="custom-select-wrapper" id="wrapper-${key}">
      <div class="custom-select-trigger ${current.class}" onclick="toggleCustomSelect('${key}')">
        <span>${current.icon}</span><span class="arrow">▼</span>
      </div>
      <div class="custom-options">${optionsHTML}</div>
    </div>`;
}

window.selectOption = function (key, value) {
  set(ref(db, `progress/${key}`), value);
  
  globalData[key] = value;

  const wrap = document.getElementById(`wrapper-${key}`);
  if (!wrap) return;

  const selected = getStatusOption(value);
  const trigger = wrap.querySelector(".custom-select-trigger");

  trigger.className = `custom-select-trigger ${selected.class}`;
  trigger.innerHTML = `<span>${selected.icon}</span> <span class="arrow">▼</span>`;

  wrap.classList.remove("open");
};

// -----------------------------------------------------------------------------
// 10. MODAL TABLOSU
// -----------------------------------------------------------------------------
function renderModalTable(subject) {
  const tbody = document.getElementById("modal-table-body");
  tbody.innerHTML = "";

  dgsTopics[subject].forEach((topic, i) => {
    if (topic.ad.startsWith("#")) {
      tbody.innerHTML += `
        <tr class="unit-header">
          <td colspan="5" style="color:var(--accent-pink); font-weight:800; padding-top:15px;">
            ${topic.ad}
          </td>
        </tr>`;
      return;
    }

    const bookKey = `dgs_dark_${subject}_kitap_${i}_${currentModalStudent}`;
    const bankKey = `dgs_dark_${subject}_banka_${i}_${currentModalStudent}`;

    tbody.innerHTML += `
      <tr>
        <td>${topic.ad}</td>
        <td class="center">${createStatusDropdown(bookKey, globalData[bookKey] || "todo")}</td>
        <td class="center">${createStatusDropdown(bankKey, globalData[bankKey] || "todo")}</td>
        <td class="center" style="opacity:0.5;">${topic.videoSayisi}</td>
        <td class="center" style="opacity:0.5;">${formatTime(topic.videoSuresi)}</td>
      </tr>`;
  });
}
