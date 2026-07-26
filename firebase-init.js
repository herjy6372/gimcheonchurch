// Firebase 초기화 (모듈형 CDN SDK)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 웹 앱 설정값 (공개돼도 안전 — 보안은 로그인 방법 설정 + Firestore 보안 규칙으로 보호)
const firebaseConfig = {
  apiKey: "AIzaSyDedXoaUqVcBXG_RpRhDVfKMr0HFs3eUiU",
  authDomain: "gimcheonchurch-1077d.firebaseapp.com",
  projectId: "gimcheonchurch-1077d",
  storageBucket: "gimcheonchurch-1077d.firebasestorage.app",
  messagingSenderId: "148809461075",
  appId: "1:148809461075:web:9ac4a9e1f36b6dc46145a6",
  measurementId: "G-5M6CJRSH5V"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
