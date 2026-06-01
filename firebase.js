// firebase.js — ELLECTRA Internship Firebase v9 Modular SDK

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// ── Firebase Config ──────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyA47Gvwpduwr-8swRqHgZLeC5XYzLz248g",
  authDomain: "internship-ellectra.firebaseapp.com",
  projectId: "internship-ellectra",
  storageBucket: "internship-ellectra.firebasestorage.app",
  messagingSenderId: "1055612355617",
  appId: "1:1055612355617:web:e77c71332580fe07ba0f60"
};

// ── Initialize ───────────────────────────────────────────────────────────────
const app      = initializeApp(firebaseConfig);
const auth     = getAuth(app);
const db       = getFirestore(app);
const storage  = getStorage(app);
const provider = new GoogleAuthProvider();

// ── Auth Helpers ─────────────────────────────────────────────────────────────
export const signInWithGoogle = () => signInWithPopup(auth, provider);

export const signInAdmin = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const logOut = () => signOut(auth);

export const onAuthChange = (cb) => onAuthStateChanged(auth, cb);

export { auth };

// ── Firestore Helpers ─────────────────────────────────────────────────────────
export const registrationsCol = () => collection(db, "registrations");

export const addRegistration = (data) =>
  addDoc(collection(db, "registrations"), {
    ...data,
    status: "pending",
    createdAt: serverTimestamp()
  });

export const getAllRegistrations = async () => {
  const q   = query(collection(db, "registrations"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const listenRegistrations = (cb) => {
  const q = query(collection(db, "registrations"), orderBy("createdAt", "desc"));
  return onSnapshot(q, snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
};

export const updateRegistrationStatus = (id, status) =>
  updateDoc(doc(db, "registrations", id), { status });

export { db };

// ── Storage Helpers ───────────────────────────────────────────────────────────
export const uploadPaymentScreenshot = async (file, userId) => {
  const storageRef = ref(storage, `payments/${userId}_${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

export { storage };
