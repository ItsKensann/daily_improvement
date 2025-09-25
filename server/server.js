const express = require("express");
const cors = require("cors");
require("dotenv").config();

// import database connection
const connectDB = require('./config/database');

// import routes
const todoRoutes = require('./routes/todoRoutes')

const app = express();
const PORT = process.env.PORT || 5050;

// connect to mongodb
connectDB();

// middleware
app.use(cors());
app.use(express.json());

// use routes
app.use('/api/todos', todoRoutes);

// TEST route to make sure that server is working
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is working! '});
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

