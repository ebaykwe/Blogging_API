import express from 'express';
import { createBlog, getBlogs, getUserBlogs, getBlogById, updateBlog, deleteBlog } from '../controllers/blogController.js';
import { protect, checkBlogOwner } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getBlogs)  // Public: Get all published blogs
  .post(protect, createBlog);  // Protected: Create a new blog (default to draft)

router.route('/:id')
  .get(getBlogById)  // Public: Get a single blog by ID (must be published)
  .put(protect, checkBlogOwner, updateBlog)  // Protected: Update a blog (if owner)
  .delete(protect, checkBlogOwner, deleteBlog);  // Protected: Delete a blog (if owner)

router.route('/user/:userId')
  .get(protect, getUserBlogs);  // Protected: Get blogs by user, filtered by state (draft or published)

export default router;
