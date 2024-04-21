import express from 'express';
import { createBlog, getBlogs, getUserBlogs, getBlogById, updateBlog, deleteBlog } from '../controllers/blogController.js';
import { protect, checkBlogOwner } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getBlogs)  
  .post(protect, createBlog);  
router.route('/:id')
  .get(getBlogById)  
  .put(protect, checkBlogOwner, updateBlog)  
  .delete(protect, checkBlogOwner, deleteBlog); 

router.route('/user/:userId')
  .get(protect, getUserBlogs);  

export default router;
