const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Todo Model
const Todo = mongoose.model('Todo', new mongoose.Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
}));

// Routes
app.post('/todos', async (req, res) => {
    if (!req.body.title) {
        return res.status(400).send({ error: 'Title is required' });
    }

    const todo = new Todo({
        title: req.body.title,
        completed: req.body.completed || false
    });

    try {
        const savedTodo = await todo.save();
        res.status(201).send(savedTodo);
    } catch (err) {
        res.status(400).send(err);
    }
});

app.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.send(todos);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Add more routes for GET by id, PUT, DELETE etc.

module.exports = app;