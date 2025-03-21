import { Task } from "./Task.js";  // Import Task class

class Todos {
  #tasks = [];
  #backend_url = '';

  // Constructor takes the backend URL as a parameter
  constructor(url) {
    this.#backend_url = url;
  }

  // Method to fetch tasks from the backend
  getTasks = () => {
    return new Promise(async (resolve, reject) => {
      fetch(this.#backend_url)
        .then((response) => response.json()) // Parse the JSON response
        .then((json) => {
          this.#readJson(json);  // Call private method to read JSON data
          resolve(this.#tasks);   // Resolve promise with tasks
        })
        .catch((error) => {
          reject(error); // Reject promise with error if fetch fails
        });
    });
  };

  // Private method to process the JSON response and populate tasks array
  #readJson = (tasksAsJson) => {
    tasksAsJson.forEach((node) => {
      const task = new Task(node.id, node.description);  // Create Task objects
      this.#tasks.push(task);  // Add task to tasks array
    });
  };
}

export { Todos };  // Export the Todos class to be used in other files
