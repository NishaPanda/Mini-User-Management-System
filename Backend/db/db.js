const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGODB_URI;
function connectDB() {
    mongoose.connect(MONGO_URI)
        .then(() => {
            console.log("Connected to MongoDB");
        })
        .catch((err) => {
            console.error("Error connecting to MongoDB", err);
        });
}

module.exports = connectDB;