const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log("MongoDB connected"+conn.connection.host);
    } catch (error) {
        console.log("Connection error: " + error);
    }
}

module.exports = connectDB;