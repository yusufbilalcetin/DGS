import { storage } from "../firebase/firebase-init.js";
import { uploadBytes, getDownloadURL, deleteObject, ref as sRef } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import { savePhotoList } from "../firebase/db-photos.js";

export async function uploadPhoto(file, meta) {

    const fileName = `${meta.student}_${meta.subject}_${meta.type}_${Date.now()}.jpg`;
    const fileRef = sRef(storage, "photos/" + fileName);

    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);

    await savePhotoList(meta, { url, fileName, date: Date.now() });

    return url;
}
