"use strict";

import { Task } from "../models/Task.js";
import { storageGetItem, storageSetItem } from "./storage.js";

window.addEventListener("load", function () {
  const taskList = document.querySelector("#todo-list");

  let taskArr = [];

  const currentUser = storageGetItem("currentUser");
  if (currentUser) {
    storageGetItem("taskArr");
    displayTasks(currentUser.userName);
  }

  function addTasks(taskText, owner) {
    const newTask = new Task(taskText, owner);
    taskArr.push(newTask);
    saveTasksToLocalStorage();
    displayTasks(owner);
  }

  function createTask(task) {
    const taskItem = document.createElement("li");
    taskItem.textContent = task.taskText;

    if (task.isDone === true) {
      taskItem.classList.add("checked");
    }

    const closeBtn = document.createElement("span");
    closeBtn.textContent = "x";
    closeBtn.className = "close";

    closeBtn.addEventListener("click", () => {
      deleteTask(task);
      displayTasks(currentUser.userName);
    });

    taskItem.appendChild(closeBtn);

    taskItem.addEventListener("click", () => {
      toggleTask(task);
      displayTasks(currentUser.userName);
    });
    return taskItem;
  }

  function displayTasks(owner) {
    taskList.innerHTML = "";

    const filteredTasks = taskArr.filter((task) => task.owner === owner);
    filteredTasks.forEach((task) => {
      const taskItem = createTask(task);
      console.log(taskItem);
      taskList.appendChild(taskItem);
    });
  }

  function saveTasksToLocalStorage() {
    storageSetItem("taskArr", taskArr);
  }

  function toggleTask(task) {
    task.isDone = !task.isDone;
    saveTasksToLocalStorage();
  }

  function deleteTask(task) {
    const taskIndex = taskArr.indexOf(task);
    if (taskIndex !== -1) {
      taskArr.splice(taskIndex, 1);
      saveTasksToLocalStorage();
    }
  }

  const addTaskBtn = document.querySelector("#btn-add");
  addTaskBtn.addEventListener("click", () => {
    const taskText = document.querySelector("#input-task").value;
    console.log(taskText);
    if (taskText) {
      addTasks(taskText, currentUser.userName);
      document.querySelector("#input-task").value = "";
    }
  });
  const inputTask = this.document.querySelector("#input-task");
  inputTask.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      console.log(event);
      // Ngăn chặn việc gửi biểu mẫu mặc định khi bấm Enter
      event.preventDefault();
      const taskText = document.querySelector("#input-task").value;
      if (taskText) {
        addTasks(taskText, currentUser.userName);
        document.querySelector("#input-task").value = "";
      }
    }
  });

  if (currentUser) {
    taskArr = storageGetItem("taskArr") || [];
    console.log(taskArr);
    displayTasks(currentUser.userName);
  }
});
