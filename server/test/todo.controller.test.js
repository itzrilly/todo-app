const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('../app');

describe('Todo API', () => {
    let mongoServer;

    beforeAll(async () => {
        mongoServer = new MongoMemoryServer();
        const mongoUri = await mongoServer.getUri();
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    describe('POST /todos', () => {
        it('should create a new todo', async () => {
            const response = await request(app)
                .post('/todos')
                .send({ title: 'Test Todo', completed: false })
                .expect(201);

            expect(response.body.title).toBe('Test Todo');
            expect(response.body.completed).toBe(false);
        });

        it('should return 400 if title is missing', async () => {
            await request(app)
                .post('/todos')
                .send({ completed: false })
                .expect(400);
        });
    });

    describe('GET /todos', () => {
        it('should retrieve all todos', async () => {
            // First create a todo
            await request(app)
                .post('/todos')
                .send({ title: 'Test Todo', completed: false });

            const response = await request(app)
                .get('/todos')
                .expect(200);

            expect(response.body.length).toBe(1);
            expect(response.body[0].title).toBe('Test Todo');
        });
    });

    // More tests for GET /todos/:id, PUT, DELETE etc.
});