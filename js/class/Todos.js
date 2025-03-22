import { Task } from './Task.js';

class Todos {
  #tasks = [];
  #backend_url = '';

  constructor(url) {
    this.#backend_url = url;
  }

  // Private method to add task to tasks array
  #addToArray = (id, text) => {
    const task = new Task(id, text);  // Create a new Task object
    this.#tasks.push(task);  // Add the task to the tasks array
    return task;  // Return the newly added task
  };

// Method to fetch tasks from the backend
getTasks = () => {
  return new Promise((resolve, reject) => {
    fetch(this.#backend_url + '/tasks')  // Corrected to /tasks route (plural)
      .then(response => response.json())
      .then(data => {
        console.log('Tasks received:', data);  // Log the tasks data
        if (Array.isArray(data)) {  // Ensure we get an array
          this.#readJson(data);
          resolve(this.#tasks);
        } else {
          reject("Invalid data format");  // Reject if data is not an array
        }
      })
      .catch(error => {
        console.log("Error retrieving tasks:", error);  // Log any fetch errors
        reject(error);
      });
  });
};


  // Private method to read JSON into the tasks array
  #readJson = (tasksAsJson) => {
    tasksAsJson.forEach((node) => {
      const task = new Task(node.id, node.description);
      this.#tasks.push(task);  // Push each task to the tasks array
    });
  };

  // Public method to add a new task
  addTask = (text) => {
    return new Promise((resolve, reject) => {
      const json = JSON.stringify({ description: text });  // Convert description to JSON

      fetch(this.#backend_url + '/new', {
        method: 'POST',  // Use POST HTTP method
        headers: {
          'Content-Type': 'application/json',  // Send data as JSON
        },
        body: json,  // Send the task description in the request body
      })
        .then((response) => response.json())
        .then((json) => {
          // Add the task to the tasks array after receiving response
          const task = this.#addToArray(json.id, json.description);
          resolve(task);  // Return the added task
        })
        .catch((error) => reject(error));  // Handle any errors
    });
  };

  // Private method to remove task from the tasks array
  #removeFromArray = (id) => {
    const arrayWithoutRemoved = this.#tasks.filter((task) => task.getId() !== id);  // Filter out the task with the given id
    this.#tasks = arrayWithoutRemoved;  // Update the tasks array
  };

  // Public method to remove a task
  removeTask = (id) => {
    return new Promise((resolve, reject) => {
      fetch(this.#backend_url + '/delete/' + id, {
        method: 'DELETE',  // DELETE method
      })
        .then(response => response.json())
        .then(json => {
          resolve(id);  // Return the task ID (which is the same as the ID passed)
        })
        .catch((error) => {
          reject("Error deleting task: " + error);  // Handle errors
        });
    });
  }
}

export { Todos };
