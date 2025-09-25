const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5050;

// middleware
app.use(cors());
app.use(express.json());

// mongodb connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB Atlast connected!"))
    .catch(err => console.log("MongoDB connection error: ", err));

// TEST route to make sure that server is working
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is working! '});
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})