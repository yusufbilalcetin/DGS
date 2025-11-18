import { ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { db } from "./firebase-init.js";

export function listenProgress(callback) {
    const dataRef = ref(db, "progress");
    onValue(dataRef, snap => callback(snap.val() || {}));
}

export function updateProgress(key, value) {
    return set(ref(db, `progress/${key}`), value);
}
