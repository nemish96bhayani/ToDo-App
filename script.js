let isEditing = false;
let currentTodoRow = null;

// Helper function to create a new todo item
function createTodoItem(title, description, status = 'pending') {
    const todoList = document.getElementById('todo-list');
    const newTodo = document.createElement('tr');

    newTodo.innerHTML = `
        <td>${title}</td>
        <td>${description}</td>
        <td class="status-${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</td>
        <td class="actions">
            <button class="btn btn-warning edit-btn"><i class="fas fa-edit"></i></button>
            <button class="btn btn-success complete-btn"><i class="fas fa-check"></i></button>
            <button class="btn btn-danger delete-btn"><i class="fas fa-trash"></i></button>
        </td>
    `;

    newTodo.querySelector('.edit-btn').addEventListener('click', () => editTodoItem(newTodo, title, description));
    newTodo.querySelector('.complete-btn').addEventListener('click', () => completeTodoItem(newTodo));
    newTodo.querySelector('.delete-btn').addEventListener('click', () => deleteTodoItem(newTodo));

    todoList.appendChild(newTodo);
    saveTodos();
}

// Function to add or update a todo item
function addOrUpdateTodo() {
    const titleInput = document.getElementById('todo-title');
    const descriptionInput = document.getElementById('todo-description');
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();

    if (!title || !description) {
        alert("Please enter title and description.");
        return;
    }

    if (isEditing) {
        currentTodoRow.children[0].textContent = title;
        currentTodoRow.children[1].textContent = description;
        isEditing = false;
        currentTodoRow = null;
        document.getElementById('add-todo').innerText = "Add Todo";
    } else {
        createTodoItem(title, description);
    }

    titleInput.value = '';
    descriptionInput.value = '';
}

// Function to edit a todo item
function editTodoItem(todoRow, title, description) {
    const titleInput = document.getElementById('todo-title');
    const descriptionInput = document.getElementById('todo-description');

    titleInput.value = title;
    descriptionInput.value = description;

    isEditing = true;
    currentTodoRow = todoRow;
    document.getElementById('add-todo').innerText = "Update Todo";
}

// Function to mark a todo item as complete
function completeTodoItem(todoRow) {
    const statusCell = todoRow.children[2];
    statusCell.textContent = 'Completed';
    statusCell.className = 'status-completed';
    saveTodos();
}

// Function to delete a todo item
function deleteTodoItem(todoRow) {
    todoRow.remove();
    saveTodos();
}

// Function to delete all todo items
function deleteAllTodos() {
    document.getElementById('todo-list').innerHTML = '';
    saveTodos();
}

// Function to filter todo items by status
function filterTodos() {
    const filterStatus = document.getElementById('filter-status').value;
    const todos = document.querySelectorAll('#todo-list tr');

    todos.forEach(todo => {
        const status = todo.children[2].textContent.toLowerCase();
        todo.style.display = (filterStatus === 'all' || status === filterStatus) ? '' : 'none';
    });
}

// Function to save todos to localStorage
function saveTodos() {
    const todos = Array.from(document.querySelectorAll('#todo-list tr')).map(todoRow => ({
        title: todoRow.children[0].textContent,
        description: todoRow.children[1].textContent,
        status: todoRow.children[2].textContent.toLowerCase()
    }));
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Function to load todos from localStorage
function loadTodos() {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.forEach(todo => createTodoItem(todo.title, todo.description, todo.status));
}

// Theme toggle function
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    body.classList.toggle('light-mode');
    localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
}

// Function to load theme from localStorage
function loadTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    document.body.classList.add(theme + '-mode');
}

// Event listeners
document.getElementById('add-todo').addEventListener('click', addOrUpdateTodo);
document.getElementById('filter-status').addEventListener('change', filterTodos);
document.getElementById('delete-all').addEventListener('click', deleteAllTodos);
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
    loadTheme();
});
