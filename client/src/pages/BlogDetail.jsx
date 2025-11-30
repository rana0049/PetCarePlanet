import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaCalendar, FaUser, FaTag } from 'react-icons/fa';

const BlogDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/blogs/${id}`);
                setPost(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
                <div className="text-xl text-neutral-600 font-semibold animate-pulse">Loading article...</div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-2xl text-neutral-500 mb-4">Article not found</p>
                    <Link to="/blogs" className="text-primary-600 hover:underline">
                        ← Back to Blogs
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary-50 pt-2 pb-6">
            {/* Back Button - Full Width */}
            <div className="container mx-auto px-4 mb-2">
                <Link
                    to="/blogs"
                    className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold group text-sm"
                >
                    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    Back to Articles
                </Link>
            </div>

            {/* Article Content - Centered */}
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Article Card */}
                <article className="bg-white rounded-3xl shadow-card border border-secondary-100 overflow-hidden">
                    {/* Header Image (if exists) */}
                    {post.image && (
                        <div className="w-full h-80 bg-secondary-100">
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-5 md:p-6">
                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 mb-2">
                            <div className="flex items-center gap-1.5">
                                <FaUser className="text-primary-500" />
                                <span>By <span className="text-primary-600 font-semibold">{post.author?.name || 'Unknown'}</span></span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <FaCalendar className="text-primary-500" />
                                <span>{new Date(post.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}</span>
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl md:text-3xl font-display font-bold text-neutral-900 mb-2 leading-tight">
                            {post.title}
                        </h1>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-4">
                                {post.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold"
                                    >
                                        <FaTag className="text-xs" />
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Article Content */}
                        <div className="prose prose-base max-w-none">
                            <p className="text-neutral-700 leading-relaxed whitespace-pre-line">
                                {post.content}
                            </p>
                        </div>
                    </div>
                </article>

                {/* Related/More Articles CTA */}
                <div className="mt-5 text-center">
                    <Link
                        to="/blogs"
                        className="inline-block px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                    >
                        Read More Articles
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BlogDetail;
