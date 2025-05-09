const Todo = require('../models/todo.model');

class TodoService {
    async createTodo(todoData) {
        const todo = new Todo(todoData);
        return await todo.save();
    }

    async getTodoById(id) {
        return await Todo.findById(id);
    }

    // More service methods
}

module.exports = { TodoService };