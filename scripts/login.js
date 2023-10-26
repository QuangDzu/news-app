"use strict";

import { storageGetItem, storageSetItem } from "./storage.js";

window.addEventListener("load", function () {
  const KEY = "USER_ARRAY";
  const userArr = storageGetItem(KEY) || [];

  const loginForm = document.querySelector("#login-form");

  function validate(loginForm) {
    const username = loginForm.elements["username"].value;
    const password = loginForm.elements["password"].value;

    if (!username || !password) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return false;
    }

    const user = userArr.find(
      (user) => user.userName === username && user.password === password
    );
    if (!user) {
      alert(
        "Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin đăng nhập."
      );
      return false;
    }
    return user;
  }

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const user = validate(this);
    if (user) {
      storageSetItem("currentUser", user);

      alert("Đăng nhập thành công!!!");
      window.location.href = "../index.html"; // Chuyển về trang Home sau khi đăng nhập thành công
    }
  });
});
