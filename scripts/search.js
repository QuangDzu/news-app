"use strict";

import { storageGetItem } from "./storage.js";

window.addEventListener("load", async function () {
  const currentUser = storageGetItem("currentUser");
  const apiKey = "5a0e7e85a963495db1b60652d97e3087";
  const newsContainer = document.querySelector("#news-container");
  const queryInput = document.querySelector("#input-query");
  const searchBtn = document.querySelector("#btn-submit");

  let totalResults = 0; // Tổng số mục
  let currentPage = 1; // Trang hiện tại
  const pageSize = currentUser?.pageSize || 5; // Số lượng bài viết trên mỗi trang

  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get("category");
  const category = categoryParam || currentUser?.category || "General";

  if (currentUser) {
    try {
      const newsData = await fetchNews(apiKey, category, currentPage, pageSize);
      displayNews(newsData);
    } catch (error) {
      console.log("Error fetching news:", error);
    }
  }

  searchBtn.addEventListener("click", async function () {
    const query = queryInput.value.trim();
    console.log(query);
    if (query === "") {
      alert("Please enter a search query.");
      return;
    }
    try {
      const newsData = await fetchNews(apiKey, query, currentPage, pageSize);
      if (newsData.length === 0) {
        alert("No results found for the query.");
      } else {
        displayNews(newsData);
      }
    } catch (e) {
      console.log("Error fetching news:", e);
    }
    const previousPageButton = document.getElementById("btn-prev");
    const nextPageButton = document.getElementById("btn-next");
    const currentPageSpan = document.getElementById("page-num");

    currentPageSpan.textContent = `Page ${currentPage}`;

    previousPageButton.addEventListener("click", async function () {
      if (currentPage > 1) {
        currentPage--;
        currentPageSpan.textContent = `Page ${currentPage}`;
        const newsData = await fetchNews(apiKey, query, currentPage, pageSize);
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
        currentPageSpan.textContent = `Page ${currentPage}`;
        const newsData = await fetchNews(apiKey, query, currentPage, pageSize);
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

  async function fetchNews(apiKey, query, page, pageSize) {
    const apiUrl = `https://newsapi.org/v2/everything?apiKey=${apiKey}&q=${query}&page=${page}&pageSize=${pageSize}`;

    try {
      const response = await fetch(apiUrl);
      console.log(response);
      const data = await response.json();

      if (data.status === "ok") {
        totalResults = data.totalResults;
        console.log(pageSize);
        console.log(totalResults);
        return data.articles;
      } else {
        throw new Error("API request failed");
      }
    } catch (error) {
      throw new Error(`Failed to fetch ${error}`);
    }
  }

  function newsItem(img, description, title, url) {
    const template = `
    <div class="card flex-row flex-wrap">
    <div class="card mb-3">
      <div class="row no-gutters">
        <div class="col-md-4" style="height:291px;">
          <img
            src="${
              img === null || img === "" || img === undefined
                ? "https://stp.thanhhoa.gov.vn/Theme/Images/no-image.png"
                : img
            }"
            class="card-img"
            alt="${description}"
            style="width:100%; height:100%;"
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

  function displayNews(newsData) {
    while (newsContainer.firstChild) {
      newsContainer.removeChild(newsContainer.firstChild);
    }

    newsData.forEach((article) => {
      newsItem(
        article.urlToImage,
        article.description,
        article.title,
        article.url
      );
    });
  }
});
