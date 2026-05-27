// Elementos del DOM
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const progressBar = document.getElementById('progressBar');
const completedCountEl = document.getElementById('completedCount');
const totalCountEl = document.getElementById('totalCount');
const todoFooter = document.getElementById('todoFooter');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');

// Cargar tareas al iniciar
document.addEventListener('DOMContentLoaded', () => {
    getTasks();
    updateUI();
});

// Event Listeners
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});
taskList.addEventListener('click', handleTaskAction);
clearCompletedBtn.addEventListener('click', clearCompleted);

// Funciones
function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === "") {
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    // Guardar en LocalStorage
    saveLocalTask(task);

    // Crear la tarea en la interfaz
    createTaskElement(task);

    // Limpiar input y actualizar UI
    taskInput.value = "";
    updateUI();
}

function createTaskElement(task) {
    const li = document.createElement('li');
    li.classList.add('task-item');
    li.dataset.id = task.id;
    if (task.completed) {
        li.classList.add('completed');
    }

    li.innerHTML = `
        <div class="task-content">
            <i data-lucide="${task.completed ? 'check-circle' : 'circle'}"></i>
            <span>${task.text}</span>
        </div>
        <button class="delete-btn" title="Eliminar tarea">
            <i data-lucide="trash-2"></i>
        </button>
    `;

    taskList.appendChild(li);
    lucide.createIcons();
}

function handleTaskAction(e) {
    const target = e.target;
    const taskItem = target.closest('.task-item');
    
    if (!taskItem) return;

    const id = parseInt(taskItem.dataset.id);

    // Acción: Borrar
    if (target.closest('.delete-btn')) {
        taskItem.style.transform = "translateX(10px)";
        taskItem.style.opacity = "0";
        setTimeout(() => {
            removeLocalTask(id);
            taskItem.remove();
            updateUI();
        }, 200);
        return;
    }

    // Acción: Completar (al hacer clic en el contenido)
    if (target.closest('.task-content')) {
        const isCompleted = taskItem.classList.toggle('completed');
        updateLocalTaskStatus(id);
        
        // Actualizar icono: Buscamos el elemento de icono (i o svg) y lo reemplazamos
        const iconContainer = taskItem.querySelector('.task-content');
        const currentIcon = iconContainer.querySelector('i, svg');
        const newIconName = isCompleted ? 'check-circle' : 'circle';
        
        if (currentIcon) {
            currentIcon.outerHTML = `<i data-lucide="${newIconName}"></i>`;
            lucide.createIcons();
        }
        
        updateUI();
    }
}

function clearCompleted() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(t => !t.completed);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    // Recargar lista
    getTasks();
    updateUI();
}

function updateUI() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    // Actualizar contadores
    totalCountEl.innerText = total;
    completedCountEl.innerText = completed;

    // Actualizar barra de progreso
    progressBar.style.width = `${percentage}%`;

    // Mostrar/ocultar estado vacío
    if (total === 0) {
        emptyState.style.display = "block";
        taskList.style.display = "none";
        todoFooter.style.display = "none";
    } else {
        emptyState.style.display = "none";
        taskList.style.display = "block";
        todoFooter.style.display = completed > 0 ? "flex" : "none";
    }
}

// Persistencia en LocalStorage
function saveLocalTask(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    taskList.innerHTML = "";
    tasks.forEach(task => {
        createTaskElement(task);
    });
}

function removeLocalTask(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(t => t.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateLocalTaskStatus(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.map(t => {
        if (t.id === id) {
            t.completed = !t.completed;
        }
        return t;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
