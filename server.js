// server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
let server = null;
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Database connected');
        if (!server) {
            server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
        }
        return server;
    } catch (error) {
        console.error('Failed to connect to database or start server:', error);
    }
};

const closeServer = () => {
    if (server) {
        server.close(() => {
            console.log('Server closed');
            mongoose.disconnect();
        });
    }
};

export { app, startServer, closeServer };  // Ensure 'app' is also exported if needed by tests
