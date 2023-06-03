'use strict';

// Seleccionar elementos

const form = document.forms[0];
const taskInput = form.task;

// crear funcion y variable de fecha

function date() {
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
const msg = ' ► Creada el: ';
let fecha = msg + date();

//Conectar al Select

function ShowSelected() {
  let combo = document.querySelector('#prio');
  let selected = combo.options[combo.selectedIndex].value;
  if (selected === 'normal') {
    return 'normal';
  } else {
    return 'importante';
  }
}

function elegirPrioridad() {
  if (ShowSelected() === 'normal') {
    return '';
  } else {
    return ' 🔴';
  }
}
const prioridad = elegirPrioridad();

//Conectar a los botones

const addButton = document.querySelector('#add');
const cleanButton = document.querySelector('#clean');
const emptyButton = document.querySelector('#delete');

//Donde añadire la lista de tareas en el DOM

const taskUl = document.querySelector('ul');

// Array donde almacenare las tareas
let taskArr = [];

// localStorage
const savedTasks = localStorage.getItem('tasks');

// Asigno las tareas al array parseandolas (conviertiendo el string a array)
if (savedTasks) {
  taskArr = JSON.parse(savedTasks);
}

function updateList() {
  //Selecciono el ul vacio
  taskUl.innerHTML = '';

  // Actualizo el localStorage
  saveTasks();

  // string de mis li
  let htmlString = '';

  // Recorro las tareas y tomo los datos de las tareas
  for (let i = 0; i < taskArr.length; i++) {
    const { text, done } = taskArr[i];

    //Creo mi li
    const liString = `<li ${done ? 'class="done"' : ''}>
        <input type="checkbox" data-index="${i}" ${done ? 'checked' : ''}>
        <p>${text}</p>        
      </li>`;

    htmlString += liString;
  }

  //Añado el string total al innerHTML del ul
  taskUl.innerHTML = htmlString;
}

// LLamamos a la función
updateList();

// Guardar las tareas en el localStorage
function saveTasks() {
  //Conviert el array en un string JSON
  const tasksJSON = JSON.stringify(taskArr);
  //Guardo el string en el localStorage
  localStorage.setItem('tasks', tasksJSON);
}

// Agrego las tareas
function addTask() {
  //Si el texto del input es menos que 3 no se agrega
  if (taskInput.value.length <= 3) {
    alert('El texto tiene que tener al menos tres caracteres');
  } else {
    const text = taskInput.value + fecha + elegirPrioridad();

    if (text.length >= 3) {
      //Añado el objeto creado al array
      taskArr.unshift({
        text,
        done: false,
      });
      //Limpiamos el input para modificar el objeto taskInput)
      taskInput.value = '';

      //Actualizamos la li del DOM
      updateList();
    }
  }
}

// funcion paar checkbox
function toggleTaskDone(e) {
  if (e.target.matches('input')) {
    const checkbox = e.target;
    const { index } = checkbox.dataset;
    const task = taskArr[index];
    task.done = !task.done;

    updateList();
  }
}

// Función para limpiar (eliminar las tareas hechas)
function clean() {
  const filteredArr = taskArr.filter((task) => !task.done);
  taskArr = filteredArr;

  updateList();
}

//Función para borrar
function delet() {
  const code = prompt('Cuanto es 2+8:');
  if (code === '10') {
    taskArr = [];

    updateList();
  }
}

// Añado las funciones a los botones
addButton.addEventListener('click', addTask);
cleanButton.addEventListener('click', clean);
emptyButton.addEventListener('click', delet);

//Funcion de marcar/desmarcar de la lista

taskUl.addEventListener('click', toggleTaskDone);
