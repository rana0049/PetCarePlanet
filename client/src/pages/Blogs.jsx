import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Blogs = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/blogs`);
                setPosts(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchPosts();
    }, []);

    return (
        <div className="min-h-screen bg-secondary-50 py-8">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-display font-bold text-neutral-900 mb-4">Pet Care Tips & Articles</h1>
                    <p className="text-lg text-neutral-600">Expert advice for your furry friends</p>
                </div>

                {posts.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-secondary-200">
                        <p className="text-neutral-500 text-lg">No articles found yet. Check back soon!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <div key={post._id} className="bg-white p-6 rounded-3xl shadow-card hover:shadow-card-hover transition-all border border-secondary-100 flex flex-col h-full">
                                <div className="mb-4">
                                    <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 text-xs font-bold rounded-full mb-2">
                                        Article
                                    </span>
                                    <h2 className="text-xl font-display font-bold text-neutral-900 mb-2 line-clamp-2">{post.title}</h2>
                                    <p className="text-sm text-neutral-400 mb-4">
                                        By <span className="text-primary-600 font-medium">{post.author?.name || 'Unknown'}</span> • {new Date(post.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <p className="text-neutral-600 mb-6 flex-grow line-clamp-3 leading-relaxed">
                                    {post.content.substring(0, 150)}...
                                </p>
                                <Link
                                    to={`/blogs/${post._id}`}
                                    className="block w-full py-3 border-2 border-primary-100 text-primary-700 font-bold rounded-xl hover:bg-primary-50 transition-colors text-center"
                                >
                                    Read Article
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blogs;
