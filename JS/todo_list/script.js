function getTasks() {
  return JSON.parse(localStorage.getItem('tasks')) || [];
}

function saveTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getToday() {
  var now = new Date();
  var y = now.getFullYear();
  var m = String(now.getMonth() + 1).padStart(2, '0');
  var d = String(now.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + d;
}

function formatDate(dateStr) {
  var parts = dateStr.split('-');
  return parts[2] + '/' + parts[1] + '/' + parts[0];
}

function formatTime(timeStr) {
  var parts = timeStr.split(':');
  var hours = parseInt(parts[0]);
  var minutes = parts[1];
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12 || 12;
  return hours + ':' + minutes + ' ' + ampm;
}

function addTask() {
  var taskInput = document.getElementById('taskInput');
  var dateInput = document.getElementById('dateInput');
  var timeInput = document.getElementById('timeInput');

  if (!taskInput.value || !dateInput.value || !timeInput.value) {
    document.getElementById('errorMessage').classList.remove('hidden');
    return;
  }

  document.getElementById('errorMessage').classList.add('hidden');

  var tasks = getTasks();
  tasks.push({
    id: Date.now(),
    text: taskInput.value,
    date: dateInput.value,
    time: timeInput.value
  });
  saveTasks(tasks);

  taskInput.value = '';
  dateInput.value = '';
  timeInput.value = '';

  renderTasks();
}

function deleteTask(id) {
  var tasks = getTasks().filter(function(t) { return t.id !== id; });
  saveTasks(tasks);
  renderTasks();
}

function editTask(id) {
  var tasks = getTasks();
  var task = tasks.find(function(t) { return t.id === id; });
  if (!task) return;

  var newText = prompt('Edit task:', task.text);
  if (newText === null) return;
  if (!newText.trim()) {
    alert('Task cannot be empty.');
    return;
  }

  task.text = newText.trim();
  saveTasks(tasks);
  renderTasks();
}

function closeError() {
  document.getElementById('errorMessage').classList.add('hidden');
}

function renderTasks() {
  var search = document.getElementById('searchInput').value.toLowerCase();
  var tasks = getTasks();
  var today = getToday();
  var container = document.getElementById('taskList');

  if (search) {
    tasks = tasks.filter(function(t) {
      return t.text.toLowerCase().includes(search);
    });
  }

  tasks.sort(function(a, b) {
    if (a.date !== b.date) return a.date > b.date ? 1 : -1;
    return a.time > b.time ? 1 : -1;
  });

  var dueTasks = tasks;

  container.innerHTML = '';

  if (tasks.length === 0) {
    container.innerHTML = '<div class="empty-message">No tasks found.</div>';
    return;
  }

  function renderSection(title, list) {
    if (list.length === 0) return;

    var heading = document.createElement('h2');
    heading.className = 'section-heading';
    heading.textContent = title;
    container.appendChild(heading);

    var grouped = {};
    list.forEach(function(t) {
      if (!grouped[t.date]) grouped[t.date] = [];
      grouped[t.date].push(t);
    });

    Object.keys(grouped).sort().forEach(function(date) {
      var dateHeading = document.createElement('div');
      dateHeading.className = 'date-heading';
      dateHeading.textContent = date === today ? 'Today' : formatDate(date);
      container.appendChild(dateHeading);

      grouped[date].forEach(function(task) {
        var item = document.createElement('div');
        item.className = 'task-item';

        var textSpan = document.createElement('span');
        textSpan.className = 'task-text';
        textSpan.innerHTML = task.text + ' at <strong>' + formatTime(task.time) + '</strong>';

        var buttons = document.createElement('div');
        buttons.className = 'task-buttons';

        var editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.textContent = 'Edit';
        editBtn.onclick = function() { editTask(task.id); };

        var deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = function() { deleteTask(task.id); };

        buttons.appendChild(editBtn);
        buttons.appendChild(deleteBtn);
        item.appendChild(textSpan);
        item.appendChild(buttons);
        container.appendChild(item);
      });
    });
  }

  renderSection('Due Tasks', dueTasks);
}

renderTasks();
