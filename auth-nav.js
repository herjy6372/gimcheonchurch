// 로그인 상태에 따라 상단 메뉴의 로그인 항목을 갱신
import { auth } from "./firebase-init.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const el = document.getElementById("navAuth");
if (el) {
  onAuthStateChanged(auth, function (user) {
    if (user) {
      el.innerHTML = '<a href="member.html">전용공간</a>';
    } else {
      el.innerHTML = '<a href="login.html">로그인</a>';
    }
    el.style.visibility = "visible";
  });
}
