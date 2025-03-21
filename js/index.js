// Constant holding the backend URL
const BACKEND_ROOT_URL = 'http://localhost:3001';

// Import Todos class from the class folder
import { Todos } from './class/Todos.js';

// Create an instance of the Todos class
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
  li.setAttribute('data-key', task.getId());  // Adding the data-key attribute for task id

  // Add span and link for task and delete button
  renderSpan(li, task.getText());
  renderLink(li, task.getId());

  list.appendChild(li);
};

// Function to render task description (text) in span
const renderSpan = (li, text) => {
  const span = li.appendChild(document.createElement('span'));
  span.innerHTML = text;
};

// Function to render link for task (Delete button)
const renderLink = (li, id) => {
  const a = li.appendChild(document.createElement('a'));
  a.innerHTML = '<i class="bi bi-trash"></i>';  // Trash icon
  a.setAttribute('style', 'float: right');
  a.setAttribute('data-id', id);  // Set task ID for deletion

  // Add event listener for deleting task
  a.addEventListener('click', (event) => {
    const taskId = event.target.closest('a').getAttribute('data-id');  // Fetch the task ID
    console.log(`Deleting task with ID: ${taskId}`);  // Check if the ID is correct
    todos.removeTask(taskId).then((removed_id) => {
      // Locate the list item using the data-key attribute
      const li_to_remove = document.querySelector(`[data-key='${removed_id}']`);
      if (li_to_remove) {
        li_to_remove.remove();  // Remove the task from the frontend list
      }
    }).catch((error) => {
      alert("Error deleting task: " + error);  // Handle errors
    });
  });
};


// Fetch existing tasks from the backend using Todos class
const getTasks = () => {
  todos.getTasks().then((tasks) => {
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
  if (event.key === 'Enter') {
    event.preventDefault();  // Prevent form submission or default Enter behavior
    const task = input.value.trim();  // Get the task description from input
    if (task !== '') {
      todos.addTask(task).then((task) => {
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
