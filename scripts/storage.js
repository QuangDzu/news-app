"use strict";
// API Key: 5a0e7e85a963495db1b60652d97e3087
export function storageSetItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function storageGetItem(key) {
  const storageData = localStorage.getItem(key);

  if (storageData) {
    try {
      return JSON.parse(storageData);
    } catch (error) {
      console.error("Error parsing stored data: ", error);
      return null;
    }
  } else {
    return null;
  }
}
