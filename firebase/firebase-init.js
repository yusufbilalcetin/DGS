import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAAYXq0afFZte-km0b324gkQBMnp_ERi-k",
  authDomain: "dgs-takip.firebaseapp.com",
  databaseURL: "https://dgs-takip-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "dgs-takip",
  storageBucket: "dgs-takip.appspot.com",
  messagingSenderId: "236871378128",
  appId: "1:236871378128:web:0181f19847334468c7aad5"
};

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const storage = getStorage(app);
