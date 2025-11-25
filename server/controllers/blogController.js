const BlogPost = require('../models/BlogPost');

// @desc    Get all blog posts
// @route   GET /api/blogs
// @access  Public
const getBlogPosts = async (req, res) => {
    const { keyword } = req.query;

    let query = {};

    if (keyword) {
        query.title = { $regex: keyword, $options: 'i' };
    }

    try {
        const posts = await BlogPost.find(query).populate('author', 'name');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a blog post (Admin only)
// @route   POST /api/blogs
// @access  Private/Admin
const createBlogPost = async (req, res) => {
    const { title, content, tags, image } = req.body;

    try {
        const post = new BlogPost({
            author: req.user._id,
            title,
            content,
            tags,
            image,
        });

        const createdPost = await post.save();
        res.status(201).json(createdPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get blog post by ID
// @route   GET /api/blogs/:id
// @access  Public
const getBlogPostById = async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id).populate('author', 'name');

        if (post) {
            res.json(post);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update blog post (Admin only)
// @route   PUT /api/blogs/:id
// @access  Private/Admin
const updateBlogPost = async (req, res) => {
    const { title, content, tags, image } = req.body;

    try {
        const post = await BlogPost.findById(req.params.id);

        if (post) {
            post.title = title || post.title;
            post.content = content || post.content;
            post.tags = tags || post.tags;
            post.image = image || post.image;

            const updatedPost = await post.save();
            res.json(updatedPost);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete blog post (Admin only)
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
const deleteBlogPost = async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id);

        if (post) {
            await post.deleteOne();
            res.json({ message: 'Post removed' });
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getBlogPosts, createBlogPost, getBlogPostById, updateBlogPost, deleteBlogPost };
