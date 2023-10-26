"use strict";

import { storageGetItem, storageSetItem } from "./storage.js";

window.addEventListener("load", function () {
  let currentUser = storageGetItem("currentUser");
  const pageSizeInput = document.querySelector("#input-page-size");
  const categoryInput = document.querySelector("#input-category");

  if (currentUser) {
    pageSizeInput.value = currentUser.pageSize || "";
    categoryInput.value = currentUser.category || "General";
  }

  const saveBtn = document.querySelector("#btn-submit");
  saveBtn.addEventListener("click", async function () {
    const pageSize = pageSizeInput.value;
    const category = categoryInput.value;

    // Kiểm tra nếu người dùng đã đăng nhập
    if (currentUser) {
      // Lưu giá trị vào đối tượng User
      currentUser.pageSize = pageSize;
      currentUser.category = category;
      // console.log(userArr);
      // Lưu đối tượng User xuống LocalStorage
      storageSetItem("currentUser", currentUser);

      // Hiển thị thông báo hoặc chuyển về trang News
      alert("Settings saved!"); // Có thể thay đổi thông báo theo ý muốn
      // Chuyển về trang News sau khi lưu cài đặt
      window.location.href = `./news.html?category=${category}`;
    }
  });
});
