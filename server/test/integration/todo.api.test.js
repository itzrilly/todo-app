const request = require('supertest');
const app = require('../../app');
const Todo = require('../../models/todo.model');

describe('Todo API Integration Tests', () => {
    beforeEach(async () => {
        await Todo.deleteMany({});
    });

    it('should complete the full CRUD cycle', async () => {
        // Create
        const createResponse = await request(app)
            .post('/todos')
            .send({ title: 'Integration Test Todo' })
            .expect(201);

        const todoId = createResponse.body._id;

        // Read
        const getResponse = await request(app)
            .get(`/todos/${todoId}`)
            .expect(200);

        expect(getResponse.body.title).toBe('Integration Test Todo');

        // Update
        await request(app)
            .put(`/todos/${todoId}`)
            .send({ completed: true })
            .expect(200);

        // Verify update
        const updatedResponse = await request(app)
            .get(`/todos/${todoId}`)
            .expect(200);

        expect(updatedResponse.body.completed).toBe(true);

        // Delete
        await request(app)
            .delete(`/todos/${todoId}`)
            .expect(204);

        // Verify deletion
        await request(app)
            .get(`/todos/${todoId}`)
            .expect(404);
    });
});