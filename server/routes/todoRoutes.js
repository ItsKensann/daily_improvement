const express = require('express');
const {
    getTodos,
    createTodo,
    getTodo,
    updateTodo,
    deleteTodo
} = require('../middleware/todoController');

const router = express.Router();

// handles base path
router.route('/')
    .get(getTodos)
    .post(createTodo);
// handles paths with an ID "/api/todos/:id"
router.route('/:id')
    .get(getTodo)
    .put(updateTodo)
    .delete(deleteTodo)

module.exports = router;