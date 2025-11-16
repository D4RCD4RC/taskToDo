'use strict';

/* ==========================================================================
   Selección de elementos del DOM
   ========================================================================== */

const form = document.forms[0];
const taskInput = form.task;

const addButton = document.querySelector('#add');
const cleanButton = document.querySelector('#clean');
const emptyButton = document.querySelector('#delete');
const prioritySelect = document.querySelector('#prio');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  addTask();
});


const taskUl = document.querySelector('ul');

/* ==========================================================================
   Utilidades de Fecha y Prioridad
   ========================================================================== */

/**
 * Devuelve la fecha actual formateada como DD/MM/YYYY
 */
const getFormattedDate = () => {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

/**
 * Devuelve la prioridad seleccionada
 * (normal o importante)
 */
const getPriority = () => {
  return prioritySelect.value === 'importante' ? ' 🔴' : '';
};

/**
 * Devuelve el texto final que se guardará como tarea
 */
const buildTaskText = () => {
  return `${taskInput.value} ► Creada el: ${getFormattedDate()}${getPriority()}`;
};

/* ==========================================================================
   LocalStorage
   ========================================================================== */

// Cargar tareas almacenadas
let taskArr = JSON.parse(localStorage.getItem('tasks')) || [];

/**
 * Guarda el array de tareas en localStorage
 */
const saveTasks = () => {
  localStorage.setItem('tasks', JSON.stringify(taskArr));
};

/* ==========================================================================
   Renderizado del DOM
   ========================================================================== */

/**
 * Renderiza la lista completa en el DOM
 */
const updateList = () => {
  taskUl.innerHTML = '';

  saveTasks();

  const html = taskArr
    .map(
      ({ text, done }, index) => `
      <li class="${done ? 'done' : ''}">
        <input type="checkbox" data-index="${index}" ${done ? 'checked' : ''}>
        <p>${text}</p>
      </li>
    `
    )
    .join('');

  taskUl.innerHTML = html;
};

// Render inicial
updateList();

/* ==========================================================================
   Acciones de la aplicación (CRUD)
   ========================================================================== */

/**
 * Añade una tarea nueva
 */
const addTask = () => {
  if (taskInput.value.trim().length < 3) {
    return alert('El texto debe tener al menos 3 caracteres');
  }

  taskArr.unshift({
    text: buildTaskText(),
    done: false,
  });

  taskInput.value = '';
  updateList();
};

/**
 * Alterna entre completada / no completada
 */
const toggleTaskDone = (e) => {
  if (!e.target.matches('input')) return;

  const index = Number(e.target.dataset.index);
  taskArr[index].done = !taskArr[index].done;

  updateList();
};

/**
 * Elimina únicamente las tareas que estén marcadas como completadas
 */
const cleanCompleted = () => {
  taskArr = taskArr.filter((task) => !task.done);
  updateList();
};

/**
 * Borra todas las tareas si el usuario acierta un pequeño código
 */
const deleteAll = () => {
  const answer = prompt('¿Cuánto es 2 + 8?');
  if (answer === '10') {
    taskArr = [];
    updateList();
  }
};

// Crear contenedor del toggle
const themeToggleContainer = document.createElement('div');
themeToggleContainer.classList.add('theme-toggle');

// Crear input checkbox
const toggleInput = document.createElement('input');
toggleInput.type = 'checkbox';
toggleInput.id = 'toggleTheme';

// Crear label
const toggleLabel = document.createElement('label');
toggleLabel.classList.add('toggleSwitch');
toggleLabel.setAttribute('for', 'toggleTheme');

// Crear íconos sol/luna
const sunIcon = document.createElement('span');
sunIcon.classList.add('icon','sun');
sunIcon.textContent = '☀️';

const moonIcon = document.createElement('span');
moonIcon.classList.add('icon','moon');
moonIcon.textContent = '🌙';

// Insertar íconos en label
toggleLabel.appendChild(sunIcon);
toggleLabel.appendChild(moonIcon);

// Insertar input y label en el contenedor
themeToggleContainer.appendChild(toggleInput);
themeToggleContainer.appendChild(toggleLabel);

// Insertar toggle en body (puedes cambiar a header si quieres)
document.body.appendChild(themeToggleContainer);

// Evento para cambiar tema
toggleInput.addEventListener('change', () => {
  document.body.classList.toggle('dark');

  if(document.body.classList.contains('dark')){
    localStorage.setItem('theme','dark');
  } else {
    localStorage.setItem('theme','light');
  }
});

// Recuperar tema al cargar página
window.addEventListener('DOMContentLoaded', () => {
  if(localStorage.getItem('theme') === 'dark'){
    document.body.classList.add('dark');
    toggleInput.checked = true;
  }
});
/* ==========================================================================
   Eventos
   ========================================================================== */

addButton.addEventListener('click', addTask);
cleanButton.addEventListener('click', cleanCompleted);
emptyButton.addEventListener('click', deleteAll);
taskUl.addEventListener('click', toggleTaskDone);
