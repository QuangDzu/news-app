"use strict";
import { storageGetItem } from "./storage.js";

window.addEventListener("load", async function () {
  const currentUser = storageGetItem("currentUser");
  const apiKey = "5a0e7e85a963495db1b60652d97e3087";
  const newsContainer = document.getElementById("news-container");
  let totalResults = 0; // Tổng số mục
  let currentPage = 1; // Trang hiện tại
  const pageSize = currentUser?.pageSize || 5; // Số lượng bài viết trên mỗi trang

  // Kiểm tra xem URL có tham số "category" không
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get("category");
  const category = categoryParam || currentUser?.category || "General"; // Danh mục tin tức

  if (currentUser) {
    try {
      const newsData = await fetchNews(category, apiKey, currentPage, pageSize);
      displayNews(newsData);
    } catch (error) {
      console.log("Error fetching news:", error);
    }
  }

  // Hàm để lấy dữ liệu bài viết từ API
  async function fetchNews(category, apiKey, page, pageSize) {
    const apiUrl = `https://newsapi.org/v2/top-headlines?country=US&category=${category}&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`;
    try {
      const response = await fetch(apiUrl);
      console.log(apiUrl);
      const data = await response.json();
      if (data.status === "ok") {
        totalResults = data.totalResults; // Cập nhật totalResults
        return data.articles;
      } else {
        throw new Error("API request failed");
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      return []; // Trả về một mảng rỗng hoặc xử lý lỗi tương ứng
    }
  }

  function newsItem(img, description, title, url) {
    const template = `
    <div class="card flex-row flex-wrap">
      <div class="card mb-3" style="">
        <div class="row no-gutters">
          <div class="col-md-4">
            <img
              src="${
                img === null || img === "" || img === undefined
                  ? "https://stp.thanhhoa.gov.vn/Theme/Images/no-image.png"
                  : img
              }"
              class="card-img"
              alt="${description}"
              style="width:100%;"
            />
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">
              ${title}
              </h5>
              <p class="card-text">
              ${description}
              </p>
              <a
                href="${url}"
                class="btn btn-primary"
                >View</a
              >
            </div>
          </div>
        </div>
        </div>
        </div>`;
    newsContainer.insertAdjacentHTML("beforeend", template);
  }

  // Hàm để hiển thị dữ liệu bài viết lên trang News
  function displayNews(newsData) {
    // Xóa bất kỳ nội dung cũ nào trong newsContainer
    while (newsContainer.firstChild) {
      newsContainer.removeChild(newsContainer.firstChild);
    }

    // Duyệt qua danh sách bài viết và tạo các phần tử HTML để hiển thị chúng
    newsData.forEach((article) => {
      newsItem(
        article.urlToImage,
        article.description,
        article.title,
        article.url
      );
    });
  }

  const previousPageButton = document.getElementById("btn-prev");
  const nextPageButton = document.getElementById("btn-next");
  const currentPageSpan = document.getElementById("page-num");
  currentPageSpan.textContent = `Page ${currentPage}`;
  if (currentPage <= 1) {
    previousPageButton.style.display = "none";
  }
  previousPageButton.addEventListener("click", async function () {
    if (currentPage > 1) {
      currentPage--;

      currentPageSpan.textContent = `Page ${currentPage}`;
      const newsData = await fetchNews(category, apiKey, currentPage, pageSize);
      displayNews(newsData);
      if (currentPage <= 1) {
        previousPageButton.style.display = "none";
      } else {
        previousPageButton.style.display = "block";
      }
      if (currentPage * pageSize < totalResults) {
        nextPageButton.style.display = "block";
      }
    }
  });
  nextPageButton.addEventListener("click", async function () {
    if (currentPage * pageSize < totalResults) {
      currentPage++;

      console.log(totalResults);
      currentPageSpan.textContent = `Page ${currentPage}`;
      const newsData = await fetchNews(category, apiKey, currentPage, pageSize);
      displayNews(newsData);
      if (currentPage <= 1) {
        previousPageButton.style.display = "none";
      } else {
        previousPageButton.style.display = "block";
      }
      if (currentPage * pageSize >= totalResults) {
        nextPageButton.style.display = "none";
      }
    }
  });
});
