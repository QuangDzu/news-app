"use strict";

import { storageGetItem } from "./storage.js";

window.addEventListener("load", function () {
  const currentUser = storageGetItem("currentUser");
  if (currentUser) {
    document.getElementById("login-modal").style.display = "none";
    document.getElementById("main-content").style.display = "block";
    document.getElementById("welcome-message").textContent =
      "Welcome" + " " + currentUser.firstName + " " + currentUser.lastName;

    // Xử lý đăng xuất
    const btnLogout = document.getElementById("btn-logout");
    btnLogout.addEventListener("click", function () {
      localStorage.removeItem("currentUser");

      // Chuyển về trang đăng nhập hoặc trang chính tùy theo yêu cầu
      window.location.href = "../pages/login.html";
    });
  } else {
    document.getElementById("login-modal").style.display = "block";
    document.getElementById("main-content").style.display = "none";
  }
});
