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
    return new Promise(async (resolve, reject) => {
      fetch(this.#backend_url)
        .then((response) => response.json())
        .then((json) => {
          this.#readJson(json);  // Call private method to read JSON
          resolve(this.#tasks);  // Return the tasks array
        })
        .catch((error) => reject(error));
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
}

export { Todos };
