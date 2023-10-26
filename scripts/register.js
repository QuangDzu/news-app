"use strict";

import { UserEl } from "../models/User.js";
import { storageGetItem, storageSetItem } from "./storage.js";

window.addEventListener("load", function () {
  const KEY = "USER_ARRAY";
  const userArr = storageGetItem(KEY) || [];
  console.log(userArr);
  const registerForm = document.querySelector("#register-form");

  function validate(registerForm) {
    const firstName = registerForm.elements["firstName"].value;
    const lastName = registerForm.elements["lastName"].value;
    const username = registerForm.elements["username"].value;
    const password = registerForm.elements["password"].value;
    const passwordConfirm = registerForm.elements["passwordConfirm"].value;

    if (!firstName || !lastName || !username || !password || !passwordConfirm) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return false;
    }

    if (userArr.find((user) => user.userName === username)) {
      alert("Tên đăng nhập đã tồn tại. Vui lòng chon tên đăng nhập khác.");
      return false;
    }

    if (password !== passwordConfirm) {
      alert("Mật khẩu và xác nhận mật khẩu không khớp.");
      return false;
    }

    if (password.length < 8) {
      alert("Mật khẩu phải có ít nhất 8 ký tự.");
      return false;
    }
    return true;
  }

  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (validate(this)) {
      const firstName = this.elements["firstName"].value;
      const lastName = this.elements["lastName"].value;
      const userName = this.elements["username"].value;
      const password = this.elements["password"].value;

      const newUser = new UserEl(firstName, lastName, userName, password);
      userArr.push(newUser);
      storageSetItem(KEY, userArr);
      alert("Đăng ký thành công!!!");
      window.location.href = "../pages/login.html";
    }
  });
});
