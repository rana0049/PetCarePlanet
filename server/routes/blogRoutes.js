const express = require('express');
const { getBlogPosts, createBlogPost, getBlogPostById, updateBlogPost, deleteBlogPost } = require('../controllers/blogController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(getBlogPosts).post(protect, admin, createBlogPost);
router.route('/:id').get(getBlogPostById).put(protect, admin, updateBlogPost).delete(protect, admin, deleteBlogPost);

module.exports = router;
