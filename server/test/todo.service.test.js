const { TodoService } = require('../services/todo.service');
const mongoose = require('mongoose');

describe('TodoService', () => {
    let todoService;

    beforeAll(async () => {
        // Setup in-memory DB
        const mongoServer = new MongoMemoryServer();
        const mongoUri = await mongoServer.getUri();
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        todoService = new TodoService();
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    it('should create and retrieve a todo', async () => {
        const todo = await todoService.createTodo({
            title: 'Test Todo',
            completed: false
        });

        const retrieved = await todoService.getTodoById(todo._id);
        expect(retrieved.title).toBe('Test Todo');
    });

    // More unit tests for service methods
});