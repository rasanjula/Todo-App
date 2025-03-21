// Constant holding the backend URL
const BACKEND_ROOT_URL = 'http://localhost:3001';

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
  li.innerHTML = `${task.description} <button class="btn btn-danger btn-sm float-right deleteBtn">Delete</button>`;
  list.appendChild(li);

  // Add functionality to delete the task when the delete button is clicked
  const deleteBtn = li.querySelector('.deleteBtn');
  deleteBtn.addEventListener('click', async () => {
    await deleteTask(task.id);  // Delete task from the backend
    li.remove();  // Remove the task from the frontend list
  });
};

// Function to fetch existing tasks from the backend
const getTasks = async () => {
  try {
    const response = await fetch(`${BACKEND_ROOT_URL}/task`);
    const json = await response.json();
    
    // Loop through each task and render it
    json.forEach(task => renderTask(task));
    
    // Enable the input field after data is retrieved
    input.disabled = false;
  } catch (error) {
    alert("Error retrieving tasks: " + error.message);
  }
};

// Function to add new task to the backend and render it
const addTask = async (taskDescription) => {
  const response = await fetch(`${BACKEND_ROOT_URL}/new`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ description: taskDescription }),  // Send task description to the backend
  });

  if (response.ok) {
    const newTask = await response.json();  // Get the new task with its ID
    renderTask(newTask);  // Render the new task in the frontend
  } else {
    console.error('Failed to add task');
  }
};

// Function to delete task from the backend
const deleteTask = async (taskId) => {
  const response = await fetch(`${BACKEND_ROOT_URL}/task/${taskId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    console.error('Failed to delete task');
  }
};

const saveTask = async (task) => {  // The function accepts a task parameter
    try {
      const json = JSON.stringify({ description: task });  // Convert task description to JSON format
      const response = await fetch(BACKEND_ROOT_URL + '/new', {  // Send POST request to the backend
        method: 'POST',  // Use POST HTTP method
        headers: {
          'Content-Type': 'application/json',  // Define the request content type as JSON
        },
        body: json  // Send the task description in the request body
      });
  
      return response.json();  // Return the response as JSON (the caller can handle this promise)
    } catch (error) {
      alert("Error saving task " + error.message);  // Handle errors and display an alert
    }
  };

  
  input.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {  // Check if Enter key was pressed
      event.preventDefault();  // Prevent form submission or default Enter behavior
      const task = input.value.trim();  // Get the task description from input
      if (task !== '') {
        saveTask(task).then((json) => {  // Call saveTask and wait for the response
          renderTask(json);  // Render the newly added task in the UI
          input.value = '';  // Clear the input field
        });
      }
    }
  });
  

// Fetch and render tasks when the page loads
getTasks();
