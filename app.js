const filterBtn = document
  .querySelector(".filter")
  .querySelector("div")
  .querySelectorAll("button");
const taskInput = document.querySelector(".input-section").children[0];
const dateInput = document.querySelector(".input-section").children[1];
const addBtn = document.querySelector(".input-section").children[2];
const editBtn = document.querySelector(".edit-btn");
const tBody = document.querySelector("tbody");
const deleteAllBtn = document.querySelector(".delete-all");
const alertMessage = document.querySelector(".alert");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let todoId = null;

const generateId = () => {
  return Math.ceil(Math.random() * 10000);
};

const setLocalStorage = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

const todoHandler = () => {
  const task = taskInput.value.trim();
  const date = dateInput.value;
  const todo = { id: generateId(), task, date, completed: false };
  if (!taskInput.value) {
    showAlert("warning", "Please enter todo");
    return;
  } else {
    todos.push(todo);
    displayTodos(todos);
    showAlert("success", "Todo added successfuly");
    setLocalStorage();
  }

  taskInput.value = "";
  dateInput.value = "";
};

const displayTodos = (todos) => {
  tBody.innerHTML = "";
  if (!todos.length) {
    tBody.innerHTML = `
        <tr>
        <td colSpan="4">No todos here yet!</td>
        </tr>
        `;
  }
  todos.forEach((todo) => {
    tBody.innerHTML += `
        <tr>
        <td>${todo.task}</td>
        <td>${todo.date ? todo.date : "No Date"}</td>
        <td>${todo.completed ? "Completed" : "Pending"}</td>
        <td>
        <button onclick="editHandler(${todo.id})">Edit</button>
        <button onclick="deleteHandler(${todo.id})">Delete</button>
        <button onclick="toggleHandler(${todo.id})">${
      todo.completed ? "Undo" : "Do"
    }</button>
        </td>
        </tr>
        `;
  });
};

const editHandler = (id) => {
  addBtn.style.display = "none";
  editBtn.style.display = "inline";

  const todo = todos.find((todo) => todo.id === id);
  taskInput.value = todo.task;
  dateInput.value = todo.date;
  todoId = id;
};

const editTodo = () => {
  const todo = todos.find((todo) => todo.id === todoId);
  todo.task = taskInput.value;
  todo.date = dateInput.value;
  taskInput.value = "";
  dateInput.value = "";
  addBtn.style.display = "inline";
  editBtn.style.display = "none";
  displayTodos(todos);
  showAlert("success", "Todo edited successfuly");
  setLocalStorage();
};

const deleteHandler = (id) => {
  todos = todos.filter((todo) => todo.id !== id);
  displayTodos(todos);
  showAlert("success", "Todo deleted successfuly");
  setLocalStorage();
};

const toggleHandler = (id) => {
  const todo = todos.find((todo) => todo.id === id);
  todo.completed = !todo.completed;
  displayTodos(todos);
  setLocalStorage();
};

const deleteAllTodos = () => {
  if (!todos.length) {
    showAlert("warning", "No todos for delete");
  } else {
    todos = [];
    displayTodos(todos);
    showAlert("success", "All Todos deleted successfuly");
    setLocalStorage();
  }
};

const filterHandler = (ev) => {
  const filter = ev.target.innerText.toLowerCase();
  let filtredTodos = null;
  switch (filter) {
    case "all":
      filtredTodos = todos;
      displayTodos(filtredTodos);
      break;
    case "completed":
      filtredTodos = todos.filter((todo) => todo.completed === true);
      displayTodos(filtredTodos);
      break;
    case "pending":
      filtredTodos = todos.filter((todo) => todo.completed === false);
      displayTodos(filtredTodos);
      break;
  }

  filterBtn.forEach((btn) => {
    if (btn.innerText.toLowerCase() === filter) {
      btn.className = "selected";
    } else {
      btn.classList.remove("selected");
    }
  });
};

const showAlert = (type, text) => {
  alertMessage.innerHTML = "";
  const message = document.createElement("p");
  message.innerText = text;
  alertMessage.append(message);
  if (type === "success") {
    message.className = type;
  } else {
    message.className = type;
  }

  setInterval(() => {
    message.style.display = "none";
  }, 2000);
};

addBtn.addEventListener("click", todoHandler);
editBtn.addEventListener("click", editTodo);
window.addEventListener("load", displayTodos(todos));
deleteAllBtn.addEventListener("click", deleteAllTodos);
filterBtn.forEach((btn) => {
  btn.addEventListener("click", filterHandler);
});
