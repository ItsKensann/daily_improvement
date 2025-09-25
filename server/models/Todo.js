const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title: {
        ttpe: String,
        required: [true, 'Todo title is required'],
        trim: true, // trim white space from both ends of string
        maxLength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxLength: [500, 'Description cannot exceed 500 characters']
    },
    completed: {
        type: Boolean,
        default: false
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    dueDate: {
        type: Data
    },
    // will need userID for authentication with login feature 
}, {
    timestamps: true
});

// create collection called 'todos'
module.exports = mongoose.model('Todo', todoSchema);