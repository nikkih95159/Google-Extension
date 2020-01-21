$(document).ready(function() {
    $("#todoForm").toggle();
    $("#todoList").toggle();
    localStorage.setItem("defaultBackground", "static_files/IMG_1000.jpg");
    var currentBackground = localStorage.getItem("currentBackground");
    if (currentBackground == null)
        document.getElementById("background").style.backgroundImage = 'url("' + localStorage.getItem("defaultBackground") + '")';
    else 
        document.getElementById("background").style.backgroundImage = 'url("' + currentBackground + '")';
    
    var username = localStorage.getItem("username");
    if (username == null) {
        document.getElementById("inputName").innerHTML = "<input type='text' id='name' class='inputBox'>";
    }
    else {
        $("#labelInputName").hide();
        outputGreeting();
        if (!localStorage.getItem("standardTime")) {
          localStorage.setItem("standardTime", "true");
        }
    }

});

setInterval(getCurrentTime,1000);

function outputGreeting() {
    var date = getCurrentTime();
    var hour = date.getHours();
    var username = localStorage.getItem("username");

    if (hour >= 6 && hour < 12) {
        document.getElementById("greeting").innerHTML = "<p class='greeting' id='greeting'>Good morning, " + username + "</p>";
    }
    else if (hour >= 12 && hour < 17) {
        document.getElementById("greeting").innerHTML = "<p class='greeting' id='greeting'>Good afternoon, " + username + "</p>";
    }
    else {
        document.getElementById("greeting").innerHTML = "<p class='greeting' id='greeting'>Good evening, " + username + "</p>";
    }
}

function getCurrentTime() {
    var date = new Date();
    var minutes = date.getMinutes();
    minutes = minutes > 9 ? minutes : '0' + minutes; 
    if (localStorage.getItem("standardTime") == "true") {
      document.getElementById("time").innerHTML = date.getHours() + ":" + minutes;
    }
    else {
      var hours = date.getHours();
      if (hours > 12) {
        hours = hours - 12;
      }
      document.getElementById("time").innerHTML = hours + ":" + minutes;
    }
    return date;
}

$("#switchTime").on('click', function() {
  if (localStorage.getItem("standardTime") == "false") {
    // switch to standard
    localStorage.setItem("standardTime", "true");
  } else {
    // switch to military
    localStorage.setItem("standardTime", "false");
  }
});

$('#backgroundUpload').hide();
$('#uploadButton').on('click', function(){
    $('#backgroundUpload').click();
});
$('#backgroundUpload').change(function() {
    var file = this.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
        // $('#background').css('background-image', 'url("' + reader.result + '")');
        document.getElementById("background").style.backgroundImage = 'url("' + reader.result + '")';
        localStorage.setItem("currentBackground", reader.result);
    }
    if (file) {
        reader.readAsDataURL(file);
    } else {

    }
});

$("#inputName").keypress(function(e){
    var key = e.which;
    if (key == 13)
    {
        $('#inputName').hide();
        $('#labelInputName').hide();
        document.getElementById("name").value + "</p>";
        localStorage.setItem("username", document.getElementById("name").value);
        outputGreeting();
    }
});

$("#todoButton").on('click', function() {
    $("#todoForm").toggle();
    $("#todoList").toggle();
});

let todoItems = [];

function addTodo(text) {
  const todo = {
    text,
    checked: false,
    id: Date.now(),
  };

  todoItems.push(todo);
  console.log("todo item: " + todo.id + " with: " + todo.text);
  const list = document.querySelector('.js-todo-list');
  list.insertAdjacentHTML('beforeend', `
    <li class="todo-item" data-key="${todo.id}">
      <input id="${todo.id}"  style="position: relative; top: 5px;" type="checkbox"/>
      <span>${todo.text}</span>
      <button class="delete-todo js-delete-todo">
        <svg><use href="#delete-icon"></use></svg>
      </button>
    </li>
  `);
  // <label for="${todo.id}" class="tick js-tick"></label>
}

function toggleDone(key) {
  const index = todoItems.findIndex(item => item.id === Number(key));
  todoItems[index].checked = !todoItems[index].checked;

  const item = document.querySelector(`[data-key='${key}']`);
  if (todoItems[index].checked) {
    item.classList.add('done');
  } else {
    item.classList.remove('done');
  }
}

function deleteTodo(key) {
  todoItems = todoItems.filter(item => item.id !== Number(key));
  const item = document.querySelector(`[data-key='${key}']`);
  item.remove();
}

const form = document.querySelector('.js-form');
form.addEventListener('submit', event => {
  event.preventDefault();
  // *NULL HERE
  const input = document.querySelector('.js-todo-input');
    console.log("input");
  const text = input.value.trim();
  if (text !== '') {
    addTodo(text);
    input.value = '';
    input.focus();
  }
});

const list = document.querySelector('.js-todo-list');
list.addEventListener('click', event => {
  if (event.target.classList.contains('js-tick')) {
    const itemKey = event.target.parentElement.dataset.key;
    toggleDone(itemKey);
  }

  if (event.target.classList.contains('js-delete-todo')) {
    const itemKey = event.target.parentElement.dataset.key;
    deleteTodo(itemKey);
  }
});