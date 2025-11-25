import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBlog, FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

const BlogManagement = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: '',
        image: ''
    });

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/dashboard');
            return;
        }

        fetchBlogs();
    }, [user, navigate]);

    const fetchBlogs = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/blogs`);
            setBlogs(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const blogData = {
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim())
            };

            if (editingBlog) {
                await axios.put(`${import.meta.env.VITE_API_URL}/blogs/${editingBlog._id}`, blogData, config);
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/blogs`, blogData, config);
            }

            setShowModal(false);
            setEditingBlog(null);
            setFormData({ title: '', content: '', tags: '', image: '' });
            fetchBlogs();
        } catch (error) {
            console.error(error);
            alert('Failed to save blog post');
        }
    };

    const handleEdit = (blog) => {
        setEditingBlog(blog);
        setFormData({
            title: blog.title,
            content: blog.content,
            tags: blog.tags.join(', '),
            image: blog.image || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (blogId) => {
        if (!confirm('Are you sure you want to delete this blog post?')) return;

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`${import.meta.env.VITE_API_URL}/blogs/${blogId}`, config);
            fetchBlogs();
        } catch (error) {
            console.error(error);
            alert('Failed to delete blog post');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
                <div className="text-xl text-neutral-600 font-semibold animate-pulse">Loading blogs...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary-50 py-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-display font-bold text-neutral-900 mb-2">
                            Blog Management
                        </h1>
                        <p className="text-lg text-neutral-600">Create and manage blog posts</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingBlog(null);
                            setFormData({ title: '', content: '', tags: '', image: '' });
                            setShowModal(true);
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                    >
                        <FaPlus /> Create Blog Post
                    </button>
                </div>

                {/* Blogs Grid */}
                {blogs.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-secondary-200">
                        <p className="text-2xl text-neutral-500">No blog posts yet</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {blogs.map((blog) => (
                            <div
                                key={blog._id}
                                className="bg-white p-6 rounded-3xl shadow-card border border-secondary-100 hover:shadow-card-hover transition-all"
                            >
                                <h3 className="text-xl font-bold text-neutral-900 mb-2">{blog.title}</h3>
                                <p className="text-neutral-600 text-sm mb-3 line-clamp-3">{blog.content}</p>
                                {blog.tags && blog.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {blog.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-primary-100 text-primary-700 rounded-lg text-xs font-semibold"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <p className="text-xs text-neutral-500 mb-4">
                                    By {blog.author?.name || 'Unknown'} • {new Date(blog.createdAt).toLocaleDateString()}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(blog)}
                                        className="flex-1 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                                    >
                                        <FaEdit /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(blog._id)}
                                        className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                                    >
                                        <FaTrash /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-secondary-100 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-display font-bold text-neutral-900">
                                {editingBlog ? 'Edit Blog Post' : 'Create Blog Post'}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setEditingBlog(null);
                                }}
                                className="text-neutral-400 hover:text-neutral-600"
                            >
                                <FaTimes size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-neutral-700 font-semibold mb-2">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-secondary-50 border border-secondary-200 text-neutral-800 p-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-neutral-700 font-semibold mb-2">Content</label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full bg-secondary-50 border border-secondary-200 text-neutral-800 p-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all resize-none"
                                    rows="8"
                                    required
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-neutral-700 font-semibold mb-2">Tags (comma-separated)</label>
                                <input
                                    type="text"
                                    value={formData.tags}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                    placeholder="e.g., Dog Care, Training, Health"
                                    className="w-full bg-secondary-50 border border-secondary-200 text-neutral-800 p-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-neutral-700 font-semibold mb-2">Image URL (optional)</label>
                                <input
                                    type="text"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full bg-secondary-50 border border-secondary-200 text-neutral-800 p-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-accent-600 hover:bg-accent-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                            >
                                {editingBlog ? 'Update Post' : 'Create Post'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogManagement;
