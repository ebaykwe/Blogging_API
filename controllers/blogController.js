import Blog from '../models/Blog.js';
import asyncHandler from 'express-async-handler';
import {calculateReadingTime} from '../utils/calculateReadingTime.js';

const createBlog = asyncHandler(async (req, res) => {
  const { title, description, tags, body } = req.body;
  const readingTime = calculateReadingTime(body);
  const blog = await Blog.create({
    author: req.user._id,
    title,
    description,
    tags,
    body,
    readingTime
  });
  res.status(201).json(blog);
});

const getBlogs = asyncHandler(async (req, res) => {
  const pageSize = 20;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword ? {
    $or: [
      { title: { $regex: req.query.keyword, $options: 'i' } },
      { description: { $regex: req.query.keyword, $options: 'i' } },
      { tags: { $regex: req.query.keyword, $options: 'i' } }
    ]
  } : {};
  const count = await Blog.countDocuments({ ...keyword, state: 'published' });
  const blogs = await Blog.find({ ...keyword, state: 'published' })
    .populate('author', 'firstName lastName')
    .sort({
      readingTime: req.query.sortBy === 'readingTime' ? 1 : -1,
      readCount: req.query.sortBy === 'readCount' ? 1 : -1,
      timestamp: req.query.sortBy === 'timestamp' ? 1 : -1
    })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.json({ blogs, page, pages: Math.ceil(count / pageSize) });
});

const getBlogById = asyncHandler(async (req, res) => {
    const blogId = req.params.id;  // Ensure you're using the correct param name as defined in your route
    const blog = await Blog.findById(blogId);
    if (!blog) {
        res.status(404).json({ message: "Blog not found" });
        return;
    }
    res.status(200).json(blog);
});

const updateBlog = asyncHandler(async (req, res) => {
  const { title, description, tags, body, state } = req.body;
  const blog = await Blog.findById(req.params.id);

  if (blog.author.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('User not authorized');
  }

  if (blog) {
    blog.title = title || blog.title;
    blog.description = description || blog.description;
    blog.tags = tags || blog.tags;
    blog.body = body || blog.body;
    blog.state = state || blog.state;

    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } else {
    res.status(404);
    throw new Error('Blog not found');
  }
});

const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    res.status(404);
    throw new Error('Blog not found');
  }
  if (blog.author.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('User not authorized');
  }
  await Blog.findByIdAndDelete(req.params.id);
  res.json({ message: 'Blog deleted' });
});

const getUserBlogs = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { state } = req.query;
  let query = { author: userId };
  if (state) {
    query.state = state;
  }
  const blogs = await Blog.find(query).populate('author', 'firstName lastName');
  res.json(blogs);
});

export { createBlog, getBlogs, getBlogById, updateBlog, deleteBlog, getUserBlogs };
