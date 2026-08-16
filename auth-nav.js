// 로그인 상태에 따라 상단 메뉴의 로그인 항목을 갱신
import { auth, getInactivityRemainingMs } from "./firebase-init.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const el = document.getElementById("navAuth");
if (el) {
  let countdownTimer;
  function fmt(ms){
    const totalSec = Math.max(0, Math.ceil(ms / 1000));
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return m + ":" + String(s).padStart(2, "0");
  }
  onAuthStateChanged(auth, function (user) {
    clearInterval(countdownTimer);
    if (user) {
      el.innerHTML = '<a href="member.html">마이페이지</a> <span class="auth-countdown" id="authCountdown"></span>';
      const span = document.getElementById("authCountdown");
      function tick(){ span.textContent = "(" + fmt(getInactivityRemainingMs()) + ")"; }
      tick();
      countdownTimer = setInterval(tick, 1000);
    } else {
      el.innerHTML = '<a href="login.html">로그인</a>';
    }
    el.style.visibility = "visible";
  });
}
