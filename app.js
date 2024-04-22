import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import { protect, checkBlogOwner } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);

// Catch-All Route
app.all('*', (req, res) => {
  res.status(404).json({ message: "Not found" });
});

// Error Handling Middleware
app.use(protect);
app.use(checkBlogOwner);

export default app;
