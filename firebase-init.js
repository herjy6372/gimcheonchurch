// Firebase 초기화 (모듈형 CDN SDK)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, setPersistence, browserSessionPersistence, signOut }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

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
export const storage = getStorage(app);

// 로그인 상태를 브라우저 탭(세션)에만 저장 — 창(탭)을 닫으면 자동 로그아웃됨
setPersistence(auth, browserSessionPersistence);

// 60분 이상 아무 조작이 없으면 자동 로그아웃
export const INACTIVITY_LIMIT_MS = 60 * 60 * 1000;
let lastActivity = Date.now();
let inactivityTimer;
function resetInactivityClock(){
  lastActivity = Date.now();
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(function(){
    if(auth.currentUser) signOut(auth);
  }, INACTIVITY_LIMIT_MS);
}
["mousemove","mousedown","keydown","scroll","touchstart"].forEach(function(evt){
  document.addEventListener(evt, resetInactivityClock, { passive: true });
});
resetInactivityClock();

// 마이페이지 옆 자동 로그아웃 카운트다운 표시용
export function getInactivityRemainingMs(){
  return Math.max(0, INACTIVITY_LIMIT_MS - (Date.now() - lastActivity));
}
