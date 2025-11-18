// --- FIREBASE İMPORTLARI ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// --- FIREBASE KONFİGÜRASYONU ---
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

// --- GLOBAL STATE ---
let globalData = {};
let globalNotes = {};
let globalPhotos = {};
let globalUnderstanding = {};
let currentModalStudent = "";
let currentModalSubject = "matematik";
let currentTab = "progress";

// --- SAYFA YÜKLENİNCE ---
document.addEventListener("DOMContentLoaded", () => {
  // progress
  onValue(ref(db, "progress"), snapshot => {
    globalData = snapshot.val() || {};
    renderDashboard();

    if (document.getElementById("detail-modal").style.display === "flex") {
      if (currentTab === "progress") {
        renderModalTable(currentModalSubject);
      } else if (currentTab === "understanding") {
        renderUnderstandingTable(currentModalSubject);
      }
    }
  });

  // notes
  onValue(ref(db, "notes"), snapshot => {
    globalNotes = snapshot.val() || {};
  });

  // photos (sadece URL’ler)
  onValue(ref(db, "photos"), snapshot => {
    globalPhotos = snapshot.val() || {};
    if (
      document.getElementById("detail-modal").style.display === "flex" &&
      currentTab === "photos"
    ) {
      renderPhotos();
    }
  });

  // understanding
  onValue(ref(db, "understanding"), snapshot => {
    globalUnderstanding = snapshot.val() || {};
    if (
      document.getElementById("detail-modal").style.display === "flex" &&
      currentTab === "understanding"
    ) {
      renderUnderstandingTable(currentModalSubject);
    }
  });
});

// --- DASHBOARD ---
window.renderDashboard = function () {
  const grid = document.getElementById("stats-grid");
  grid.innerHTML = "";

  if (Object.keys(globalData).length === 0 && students.length > 0) {
    grid.innerHTML =
      '<p style="color:#666; font-size:0.9rem; padding:20px;">Henüz veri girişi yapılmamış veya yükleniyor...</p>';
  }

  students.forEach(student => {
    let bookMathCount = 0,
      bankMathCount = 0,
      bookTurkceCount = 0,
      bankTurkceCount = 0;

    dgsTopics.matematik.forEach((_, index) => {
      if (globalData[`dgs_dark_matematik_kitap_${index}_${student}`] === "done")
        bookMathCount++;
      if (
        globalData[`dgs_dark_matematik_banka_${index}_${student}`] === "done"
      )
        bankMathCount++;
    });

    dgsTopics.turkce.forEach((_, index) => {
      if (globalData[`dgs_dark_turkce_kitap_${index}_${student}`] === "done")
        bookTurkceCount++;
      if (
        globalData[`dgs_dark_turkce_banka_${index}_${student}`] === "done"
      )
        bankTurkceCount++;
    });

    const totalMath = dgsTopics.matematik.length;
    const totalTurkce = dgsTopics.turkce.length;

    const bookMathPercent =
      totalMath > 0 ? Math.round((bookMathCount / totalMath) * 100) : 0;
    const bankMathPercent =
      totalMath > 0 ? Math.round((bankMathCount / totalMath) * 100) : 0;
    const bookTurkcePercent =
      totalTurkce > 0 ? Math.round((bookTurkceCount / totalTurkce) * 100) : 0;
    const bankTurkcePercent =
      totalTurkce > 0 ? Math.round((bankTurkceCount / totalTurkce) * 100) : 0;

    const card = document.createElement("div");
    card.className = "stat-card";
    card.onclick = () => openDetailModal(student);
    card.innerHTML = `
      <div class="stat-header">
        <div class="stat-avatar">${student.charAt(0)}</div>
        <div class="stat-name">${student}</div>
      </div>
      <div class="progress-group">
        <div class="progress-label"><span>📘 Matematik (Ders Kitabı)</span><span>%${bookMathPercent}</span></div>
        <div class="progress-bg"><div class="progress-fill fill-pink" style="width:${bookMathPercent}%"></div></div>
      </div>
      <div class="progress-group">
        <div class="progress-label"><span>📝 Matematik (Soru Bankası)</span><span>%${bankMathPercent}</span></div>
        <div class="progress-bg"><div class="progress-fill fill-blue" style="width:${bankMathPercent}%"></div></div>
      </div>
      <div class="progress-group">
        <div class="progress-label"><span>📗 Türkçe (Ders Kitabı)</span><span>%${bookTurkcePercent}</span></div>
        <div class="progress-bg"><div class="progress-fill fill-green" style="width:${bookTurkcePercent}%"></div></div>
      </div>
      <div class="progress-group">
        <div class="progress-label"><span>✏️ Türkçe (Soru Bankası)</span><span>%${bankTurkcePercent}</span></div>
        <div class="progress-bg"><div class="progress-fill fill-orange" style="width:${bankTurkcePercent}%"></div></div>
      </div>
      <button class="detail-btn">📋 Detayları Görüntüle ve Düzenle</button>
    `;
    grid.appendChild(card);
  });
};

// --- MODAL AÇ/KAPA ---
window.openDetailModal = function (studentName) {
  const modal = document.getElementById("detail-modal");
  const modalTitle = document.getElementById("modal-student-name");

  currentModalStudent = studentName;
  currentModalSubject = "matematik";
  currentTab = "progress";

  modalTitle.textContent = `${studentName} - Detaylar`;

  renderSubjectSelector("matematik");
  switchTab("progress");

  modal.style.display = "flex";
};

window.closeModal = function () {
  document.getElementById("detail-modal").style.display = "none";
};

// --- DERS SEÇİMİ ---
window.renderSubjectSelector = function (defaultSubject) {
  const container = document.getElementById("subject-selector-container");
  currentModalSubject = defaultSubject;

  const labels = {
    matematik: { text: "Matematik", icon: "🧠" },
    turkce: { text: "Türkçe", icon: "🗣️" }
  };

  const current = labels[defaultSubject];
  const extraClass = defaultSubject === "turkce" ? "subject-turkce" : "";

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

window.changeModalSubject = function (subject) {
  currentModalSubject = subject;
  renderSubjectSelector(subject);

  if (currentTab === "progress") {
    renderModalTable(subject);
  } else if (currentTab === "notes") {
    loadNotes(subject);
  } else if (currentTab === "photos") {
    renderPhotos();
  } else if (currentTab === "understanding") {
    renderUnderstandingTable(subject);
  }

  const wrapper = document.getElementById("wrapper-subject");
  if (wrapper) wrapper.classList.remove("open");
};

// --- SEKME DEĞİŞTİRME ---
window.switchTab = function (tabName) {
  currentTab = tabName;

  document.querySelectorAll(".tab-content").forEach(tab => {
    tab.classList.remove("active");
  });

  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  document.getElementById(`tab-${tabName}`).classList.add("active");
  document.querySelector(`[data-tab="${tabName}"]`).classList.add("active");

  if (tabName === "progress") {
    renderModalTable(currentModalSubject);
  } else if (tabName === "notes") {
    loadNotes(currentModalSubject);
  } else if (tabName === "photos") {
    renderPhotos();
  } else if (tabName === "understanding") {
    renderUnderstandingTable(currentModalSubject);
  }
};

// --- İLERLEME TABLOSU ---
function renderModalTable(subject) {
  const tbody = document.getElementById("modal-table-body");
  tbody.innerHTML = "";

  const topics = dgsTopics[subject];

  topics.forEach((topic, index) => {
    const bookKey = `dgs_dark_${subject}_kitap_${index}_${currentModalStudent}`;
    const bankKey = `dgs_dark_${subject}_banka_${index}_${currentModalStudent}`;

    const bookVal = globalData[bookKey] || "todo";
    const bankVal = globalData[bankKey] || "todo";

    tbody.innerHTML += `
      <tr>
        <td>${topic}</td>
        <td class="center">
          <div class="status-select-wrapper">
            ${createDropdown(bookKey, bookVal, "status")}
          </div>
        </td>
        <td class="center">
          <div class="status-select-wrapper">
            ${createDropdown(bankKey, bankVal, "status")}
          </div>
        </td>
      </tr>
    `;
  });
}

// --- ANLAMA DURUMU TABLOSU ---
function renderUnderstandingTable(subject) {
  const tbody = document.getElementById("understanding-table-body");
  tbody.innerHTML = "";

  const topics = dgsTopics[subject];

  topics.forEach((topic, index) => {
    const key = `understanding_${subject}_${index}_${currentModalStudent}`;
    const val = globalUnderstanding[key] || "none";

    tbody.innerHTML += `
      <tr>
        <td>${topic}</td>
        <td class="center">
          <div class="status-select-wrapper">
            ${createDropdown(key, val, "understanding")}
          </div>
        </td>
      </tr>
    `;
  });
}

// --- DROPDOWN OLUŞTURUCU ---
function createDropdown(key, currentValue, type) {
  let labels;

  if (type === "status") {
    labels = {
      todo: { text: "Yapılmadı", icon: "🔴", class: "status-todo" },
      doing: { text: "Yapılıyor", icon: "🟡", class: "status-doing" },
      done: { text: "Yapıldı", icon: "🟢", class: "status-done" }
    };
  } else {
    labels = {
      none: { text: "Anlamadım", icon: "❌", class: "understanding-none" },
      partial: { text: "Kısmi Anladım", icon: "⚠️", class: "understanding-partial" },
      full: { text: "Tam Anladım", icon: "✅", class: "understanding-full" }
    };
  }

  const current = labels[currentValue] || labels[Object.keys(labels)[0]];

  const optionsHTML = Object.keys(labels)
    .map(val => {
      const lbl = labels[val];
      return `
        <div class="custom-option" onclick="selectOption('${key}','${val}','${type}')">
          <span class="option-icon">${lbl.icon}</span> ${lbl.text}
        </div>
      `;
    })
    .join("");

  return `
    <div class="custom-select-wrapper" id="wrapper-${key}">
      <div class="custom-select-trigger ${current.class}" onclick="toggleCustomSelect('${key}')">
        <span>${current.icon} ${current.text}</span>
        <span class="arrow">▼</span>
      </div>
      <div class="custom-options">
        ${optionsHTML}
      </div>
    </div>
  `;
}

window.toggleCustomSelect = function (key) {
  document.querySelectorAll(".custom-select-wrapper.open").forEach(el => {
    if (el.id !== `wrapper-${key}`) el.classList.remove("open");
  });

  const wrapper = document.getElementById(`wrapper-${key}`);
  if (wrapper) wrapper.classList.toggle("open");
};

window.selectOption = function (key, value, type) {
  const dbPath = type === "status" ? "progress" : "understanding";
  set(ref(db, `${dbPath}/${key}`), value);

  const wrapper = document.getElementById(`wrapper-${key}`);
  if (wrapper) {
    wrapper.classList.remove("open");

    const trigger = wrapper.querySelector(".custom-select-trigger");
    const labels =
      type === "status"
        ? {
            todo: { text: "Yapılmadı", icon: "🔴", class: "status-todo" },
            doing: { text: "Yapılıyor", icon: "🟡", class: "status-doing" },
            done: { text: "Yapıldı", icon: "🟢", class: "status-done" }
          }
        : {
            none: { text: "Anlamadım", icon: "❌", class: "understanding-none" },
            partial: {
              text: "Kısmi Anladım",
              icon: "⚠️",
              class: "understanding-partial"
            },
            full: { text: "Tam Anladım", icon: "✅", class: "understanding-full" }
          };

    const selected = labels[value];
    trigger.className = `custom-select-trigger ${selected.class}`;
    trigger.innerHTML = `<span>${selected.icon} ${selected.text}</span> <span class="arrow">▼</span>`;
  }
};

// Dışarı tıklayınca dropdown kapansın
window.addEventListener("click", e => {
  const select = e.target.closest(".custom-select-wrapper");
  if (!select) {
    document
      .querySelectorAll(".custom-select-wrapper.open")
      .forEach(el => el.classList.remove("open"));
  }
});

// --- NOTLAR ---
window.loadNotes = function (subject) {
  const textarea = document.getElementById("general-notes");
  const iconSpan = document.getElementById("notes-subject-icon");
  const nameSpan = document.getElementById("notes-subject-name");

  if (subject === "matematik") {
    iconSpan.textContent = "🧮";
    nameSpan.textContent = "Matematik";
  } else {
    iconSpan.textContent = "📖";
    nameSpan.textContent = "Türkçe";
  }

  const key = `notes_${subject}_${currentModalStudent}`;
  textarea.value = globalNotes[key] || "";
};

window.saveNotes = function () {
  const textarea = document.getElementById("general-notes");
  const key = `notes_${currentModalSubject}_${currentModalStudent}`;

  set(ref(db, `notes/${key}`), textarea.value)
    .then(() => alert("✅ Notlar kaydedildi!"))
    .catch(err => alert("❌ Hata: " + err.message));
};

// --------------------------------------------------
// FOTOĞRAF YÜKLEME / LİSTELEME / SİLME
// --------------------------------------------------

// Cloudflare Worker endpoint
const UPLOAD_URL =
  "https://dgs-photo-upload.yusufbilalctn.workers.dev/upload";

// Yükleme barı
function showUploadProgress(show) {
  let progressDiv = document.getElementById("upload-progress");
  if (!progressDiv) {
    progressDiv = document.createElement("div");
    progressDiv.id = "upload-progress";
    progressDiv.className = "upload-progress";
    progressDiv.innerHTML = "⏳ Fotoğraf yükleniyor...";
    const container = document.querySelector(".photos-container");
    if (container) container.prepend(progressDiv);
  }

  if (show) progressDiv.classList.add("active");
  else progressDiv.classList.remove("active");
}

// FOTOĞRAF YÜKLE (Cloudflare Worker + GitHub URL)
window.handleFileUpload = async function (type, input) {
  const file = input.files[0];
  if (!file) return;

  // Tür kontrolü
  if (!file.type.startsWith("image/")) {
    alert("❌ Lütfen sadece resim dosyası seçin!");
    input.value = "";
    return;
  }

  // Boyut kontrolü (8MB)
  if (file.size > 8 * 1024 * 1024) {
    alert("❌ Dosya boyutu 8MB'dan küçük olmalıdır!");
    input.value = "";
    return;
  }

  try {
    showUploadProgress(true);

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(UPLOAD_URL, {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Worker error:", text);
      alert("❌ Yükleme hatası (worker): " + response.status);
      showUploadProgress(false);
      input.value = "";
      return;
    }

    const result = await response.json();
    if (!result.url) {
      console.error("Invalid worker response:", result);
      alert("❌ Yükleme hatası: Geçersiz yanıt");
      showUploadProgress(false);
      input.value = "";
      return;
    }

    const photoUrl = result.url;

    const key = `photos_${currentModalSubject}_${type}_${currentModalStudent}`;
    const currentPhotos = globalPhotos[key] || [];

    currentPhotos.push({
      url: photoUrl,
      uploadDate: new Date().toISOString()
    });

    await set(ref(db, `photos/${key}`), currentPhotos);

    alert("✅ Fotoğraf başarıyla yüklendi!");
    input.value = "";
    showUploadProgress(false);
    renderPhotos();
  } catch (err) {
    console.error("Upload error:", err);
    alert("❌ Yükleme sırasında hata oluştu.");
    showUploadProgress(false);
    input.value = "";
  }
};

// FOTOĞRAFLARI LİSTELE
function renderPhotos() {
  const kitapContainer = document.getElementById("photos-kitap");
  const bankaContainer = document.getElementById("photos-banka");

  const kitapKey = `photos_${currentModalSubject}_kitap_${currentModalStudent}`;
  const bankaKey = `photos_${currentModalSubject}_banka_${currentModalStudent}`;

  const kitapPhotos = globalPhotos[kitapKey] || [];
  const bankaPhotos = globalPhotos[bankaKey] || [];

  // Ders kitabı
  if (kitapPhotos.length === 0) {
    kitapContainer.innerHTML =
      '<div class="photo-empty">📁 Henüz fotoğraf yok.</div>';
  } else {
    kitapContainer.innerHTML = kitapPhotos
      .map(
        (photo, i) => `
      <div class="photo-item">
        <img src="${photo.url}" alt="Fotoğraf ${i + 1}" loading="lazy">
        <button class="photo-delete" onclick="removePhoto('kitap', ${i})">🗑️</button>
      </div>
    `
      )
      .join("");
  }

  // Soru bankası
  if (bankaPhotos.length === 0) {
    bankaContainer.innerHTML =
      '<div class="photo-empty">📁 Henüz fotoğraf yok.</div>';
  } else {
    bankaContainer.innerHTML = bankaPhotos
      .map(
        (photo, i) => `
      <div class="photo-item">
        <img src="${photo.url}" alt="Fotoğraf ${i + 1}" loading="lazy">
        <button class="photo-delete" onclick="removePhoto('banka', ${i})">🗑️</button>
      </div>
    `
      )
      .join("");
  }
}

// FOTOĞRAF SİL (sadece DB’den – URL GitHub’da kalır)
window.removePhoto = async function (type, index) {
  if (!confirm("Bu fotoğrafı silmek istediğinize emin misiniz?")) return;

  const key = `photos_${currentModalSubject}_${type}_${currentModalStudent}`;
  const currentPhotos = globalPhotos[key] || [];

  try {
    currentPhotos.splice(index, 1);
    await set(ref(db, `photos/${key}`), currentPhotos);

    alert("🗑️ Fotoğraf silindi!");
    renderPhotos();
  } catch (err) {
    console.error("Silme hatası:", err);
    alert("❌ Silme sırasında hata oluştu.");
  }
};
