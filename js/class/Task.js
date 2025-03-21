class Task {
    // Private properties
    #id;
    #text;
  
    constructor(id, text) {
      this.#id = id;
      this.#text = text;
    }
  
    // Getter for the id property
    getId() {
      return this.#id;
    }
  
    // Getter for the text property
    getText() {
      return this.#text;
    }
  }
  
  // Export the Task class for use in other files
  export { Task };
  