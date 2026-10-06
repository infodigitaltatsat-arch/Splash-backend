const mongoose = require('mongoose');

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI;
    if (typeof mongoUri !== 'string' || !mongoUri.trim()) {
        console.error("Database connection failed: MONGO_URI is missing. Define it in Backend/.env or the backend environment.");
        process.exit(1);
        return;
    }

    try {
        await mongoose.connect(mongoUri);
        console.log("Database connected successfully")
    }
    catch (error) {
        console.error("Database is not connected or connection failed", error.message);
        process.exit(1);
    }
}

module.exports = connectDB;