const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require("dotenv");
const connectDB = require('./config/db.js');
const userRoutes = require('./routes/userRoutes.js');

dotenv.config();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/user", userRoutes);

app.listen(port,()=>{
    console.log("Server is listening on port "+port);
});