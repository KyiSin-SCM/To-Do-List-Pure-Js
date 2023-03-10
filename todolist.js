let list = document.querySelector("ul");
let activeTag = document.getElementById("footer");
let tasks = [];
let lists = [];
let activeCount = 0;
let toggleSelectAll = "Select All";

//after reload/refresh, this fun will run
window.onload = loadTasks;
function loadTasks() {
  show();
  footerDiv();
}

function show() {
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.setAttribute("ondblclick", "editTask(this)");
    li.innerHTML = `
      <label class="checkbox"><input type="checkbox" class="checkbox__input" onclick="taskComplete(this)" ${
        task.completed ? "checked" : ""
      }> <span class="checkbox__inner"></span> </label>
      <label class="line ${task.completed ? "completed" : ""}"> ${
      task.task
    } </label>
      <span onclick="deleteTask(this)" class="close"> \u00D7 </span>`;
    list.appendChild(li);
  });
}

//To get the check count
function checkCount() {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  var checks = tasks.filter((task) => task.completed === true);
  return checks.length;
}

//footer tabs
function footerDiv() {
  toggleSelect();
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  if (tasks.length > 0) {
    lists = document.getElementsByTagName("li");
    activeCount = lists.length - checkCount();
    activeTag.innerHTML = `
      <div class="row footer-line">
      <div class="col"><span><span id="item-count"> ${activeCount} </span> items left.</span></div>
      <div class="col"> <button id="select" class="button"> ${toggleSelectAll} </button> </div>
      <div class="col"> <button id="all" class="button activate"> All </button> </div>
      <div class="col"> <button id="active" class="button"> Active </button> </div>
      <div class="col"> <button id="completed" class="button"> Completed </button> </div>
      <div class="col"> <button id="clear" class="button"> Clear completed </button></div>
      </div>`;

    var button = document.getElementsByClassName("button");
    for (var i = 0; i < button.length; i++) {
      button[i].addEventListener("click", function () {
        var current = document.getElementsByClassName("activate");
        current[0].className = current[0].className.replace(" activate", "");
        this.className += " activate";
      });
    }
  }
}

function toggleSelect() {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  if (tasks.length === checkCount()) {
    toggleSelectAll = "Unselect All";
  } else {
    toggleSelectAll = "Select All";
  }
  return toggleSelectAll;
}

// Create a new list item when pressing enter
var input = document.querySelector("input");
input.addEventListener(
  "keydown",
  function (event) {
    if (event.key === "Enter") {
      list.innerHTML = "";
      var inputValue = document.getElementById("myInput").value;
      if (inputValue === "") {
        alert("You must write something!");
        show();
      } else {
        localStorage.setItem(
          "tasks",
          JSON.stringify([
            ...JSON.parse(localStorage.getItem("tasks") || "[]"),
            { task: inputValue, completed: false },
          ])
        );
        show();
      }
      document.getElementById("myInput").value = "";
      footerDiv();
    }
  },
  false
);

function selectAll() {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  var get = document.getElementsByClassName("checkbox__input");
  if (tasks.length != checkCount()) {
    for (var i = 0; i < get.length; i++) {
      get[i].checked = true;
      get[i].parentNode.nextElementSibling.classList.add("completed");
      tasks[i].completed = true;
    }
  } else {
    for (var i = 0; i < get.length; i++) {
      get[i].checked = false;
      get[i].parentNode.nextElementSibling.classList.remove("completed");
      tasks[i].completed = false;
    }
  }
  localStorage.setItem("tasks", JSON.stringify(tasks));

  tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  activeCount = tasks.length - checkCount();
  document.getElementById("item-count").innerHTML = activeCount;
  document.getElementById("select").textContent = toggleSelect();
}

function taskComplete(event) {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  tasks.forEach((task) => {
    if (task.task === event.parentNode.nextElementSibling.innerText) {
      task.completed = !task.completed;
    }
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  if (event.checked === true) {
    event.parentNode.nextElementSibling.classList.add("completed");
  } else {
    event.parentNode.nextElementSibling.classList.remove("completed");
  }
  activeCount = tasks.length - checkCount();
  document.getElementById("item-count").innerHTML = activeCount;
  document.getElementById("select").textContent = toggleSelect();
}

// edit the task and update local storage
function editTask(event) {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  var val = event.innerHTML;
  var update = "";
  var input = document.createElement("input");
  input.className = "task";
  var oldValue = event.querySelector(".line").innerText;
  input.value = oldValue;
  input.onblur = function () {
    event.innerHTML = val;
    update = this.value;
    if (update === "") {
      alert("Task is empty!");
      event.querySelector(".line").innerText = oldValue;
    } else {
      event.querySelector(".line").innerText = update;
      // update task
      tasks.forEach((task) => {
        if (task.task === oldValue) {
          task.task = update;
        }
      });
      // update local storage
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  };

  input.onkeydown = function (ev) {
    if (ev.key === "Enter") {
      event.innerHTML = val;
      update = this.value;
      if (update === "") {
        alert("Task is empty!");
        event.querySelector(".line").innerText = oldValue;
      } else {
        event.querySelector(".line").innerText = update;
        // update task
        tasks.forEach((task) => {
          if (task.task === oldValue) {
            task.task = update;
          }
          // update local storage
          localStorage.setItem("tasks", JSON.stringify(tasks));
        });
      }
    } else if (ev.key === "Escape") {
      input.blur();
      event.querySelector(".line").innerText = oldValue;
    }
  };
  event.querySelector(".line").innerHTML = "";
  event.appendChild(input);
  input.focus();
}

// Click on a close button to hide the current list item
function deleteTask(event) {
  if (window.confirm("Sure to delete this task?")) {
    let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
    var oldValue = event.parentNode.children[1].innerText;
    tasks.forEach((task) => {
      if (task.task === oldValue) {
        tasks.splice(tasks.indexOf(task), 1);
      }
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    event.parentElement.remove();
    if (tasks.length === 0) {
      activeTag.innerHTML = "";
    } else {
      activeCount = lists.length - checkCount();
      document.getElementById("item-count").innerHTML = activeCount;
    }
  }
}

//footer button events
var footer = document.querySelector("footer");
footer.addEventListener("click", function (event) {
  const list = document.querySelector("ul");
  list.innerHTML = "";
  if (event.target.id === "select") {
    show();
    selectAll();
    //document.getElementById("select").value = toggleSelect();
  }

  if (event.target.id === "all") {
    show();
  }

  if (event.target.id === "active") {
    let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
    var unchecks = tasks.filter((task) => task.completed === false);
    unchecks.forEach((task) => {
      if (task.completed === false) {
        const li = document.createElement("li");
        li.setAttribute("ondblclick", "editTask(this)");
        li.innerHTML = `
        <label class="checkbox"><input type="checkbox" class="checkbox__input" onclick="taskComplete(this)"> <span class="checkbox__inner"></span> </label>
        <span class="line"> ${task.task} </span>
        <span onclick="deleteTask(this)" class="close"> \u00D7 </span>`;
        list.appendChild(li);
      }
    });
  }
  if (event.target.id === "completed") {
    let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
    var checks = tasks.filter((task) => task.completed === true);
    checks.forEach((task) => {
      if (task.completed === true) {
        const li = document.createElement("li");
        li.setAttribute("ondblclick", "editTask(this)");
        li.innerHTML = `
        <label class="checkbox"><input type="checkbox" class="checkbox__input" onclick="taskComplete(this)" checked> <span class="checkbox__inner"></span> </label>
        <span class="line completed"> ${task.task} </span>
        <span onclick="deleteTask(this)" class="close"> \u00D7 </span>`;
        list.appendChild(li);
      }
    });
  }

  if (event.target.id === "clear") {
    if (window.confirm("Sure to delete completed tasks?")) {
      let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
      var checks = tasks.filter((task) => task.completed === true);
      checks.forEach((task) => {
        tasks.splice(tasks.indexOf(task), 1);
      });
      localStorage.setItem("tasks", JSON.stringify(tasks));

      tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
      if (tasks.length === 0) {
        document.getElementById("footer").innerHTML = "";
      } else {
        tasks.forEach((task) => {
          if (task.completed === false) {
            const li = document.createElement("li");
            li.setAttribute("dblclick", "editTask(this)");
            li.innerHTML = `
          <label class="checkbox"><input type="checkbox" class="checkbox__input" onclick="taskComplete(this)" ${
            task.completed ? "checked" : ""
          }> <span class="checkbox__inner"></span> </label>
          <span class="line ${task.completed ? "completed" : ""}"> 
          ${task.task} </span>
          <span onclick="deleteTask(this)" class="close"> \u00D7 </span>`;
            list.appendChild(li);
          }
        });
      }
    } else {
      show();
    }
  }
});
