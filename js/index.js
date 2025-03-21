// Constant holding the backend URL
const BACKEND_ROOT_URL = 'http://localhost:3001';

// Import Todos class from class folder
import { Todos } from './class/Todos.js';

// Create an instance of Todos class
const todos = new Todos(BACKEND_ROOT_URL);

// The <ul> element where tasks will be rendered
const list = document.querySelector('ul');
// The input field for adding tasks
const input = document.querySelector('input');

// Disable the input field by default
input.disabled = true;

// Function to render tasks in the list
const renderTask = (task) => {
  const li = document.createElement('li');
  li.setAttribute('class', 'list-group-item');
  li.innerHTML = `${task.getText()} <button class="btn btn-danger btn-sm float-right deleteBtn">Delete</button>`;
  list.appendChild(li);

  const deleteBtn = li.querySelector('.deleteBtn');
  deleteBtn.addEventListener('click', async () => {
    await deleteTask(task.getId());  // Delete task from the backend
    li.remove();  // Remove the task from the frontend list
  });
};

// Fetch existing tasks from the backend using Todos class
const getTasks = () => {
  todos.getTasks().then((tasks) => {  // Fetch tasks using the Todos class
    tasks.forEach(task => renderTask(task));  // Loop through each task and render it
    input.disabled = false;  // Enable the input field after data is retrieved
  })
  .catch((error) => {
    alert("Error retrieving tasks: " + error.message);  // Handle errors
  });
};

// Add new task to the backend and render it
const addTask = async (taskDescription) => {
  try {
    await todos.addTask(taskDescription);  // Add new task using the Todos class
    await getTasks();  // Fetch and render tasks after adding a new one
  } catch (error) {
    console.error('Failed to add task:', error);
  }
};

// Delete task from the backend using Todos class
const deleteTask = async (taskId) => {
  try {
    await todos.deleteTask(taskId);  // Delete task using the Todos class
  } catch (error) {
    console.error('Failed to delete task:', error);
  }
};

// Event listener for adding tasks
input.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {  // Check if Enter key was pressed
    event.preventDefault();  // Prevent form submission or default Enter behavior
    const task = input.value.trim();  // Get the task description from input
    if (task !== '') {
      todos.addTask(task).then((task) => {  // Call addTask method from Todos class
        renderTask(task);  // Render the new task on the UI
        input.value = '';  // Clear the input field
        input.focus();  // Set focus back to the input field for easy adding of new task
      }).catch((error) => {
        console.error("Error adding task: ", error);
      });
    }
  }
});

// Fetch and render tasks when the page loads
getTasks();
