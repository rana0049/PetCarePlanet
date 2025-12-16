import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaPaw, FaArrowRight } from 'react-icons/fa';
import PageHero from '../components/PageHero';

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
        <div className="min-h-screen bg-secondary-50">
            {/* Hero Section */}
            <PageHero
                title={
                    <>
                        Pet Care Tips & <br />
                        <span className="text-primary-600">Articles</span>
                    </>
                }
                subtitle="Expert advice, training guides, and health tips for your furry friends."
                image="https://images.unsplash.com/photo-1544568100-847a948585b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80"
            />

            <div className="container mx-auto px-4 py-16">
                {posts.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-secondary-200">
                        <p className="text-neutral-500 text-lg">No articles found yet. Check back soon!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <div key={post._id} className="bg-white rounded-3xl shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 border border-secondary-100 flex flex-col h-full group overflow-hidden">
                                {/* Image Container */}
                                <div className="h-48 overflow-hidden relative">
                                    <img
                                        src={post.image || "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80"}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary-700 text-xs font-bold rounded-full shadow-sm">
                                            Article
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="mb-4">
                                        <h2 className="text-xl font-display font-bold text-neutral-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                                            {post.title}
                                        </h2>
                                        <p className="text-sm text-neutral-400">
                                            By <span className="text-primary-600 font-medium">{post.author?.name || 'Unknown'}</span> • {new Date(post.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <p className="text-neutral-600 mb-6 flex-grow line-clamp-3 leading-relaxed text-sm">
                                        {post.content.substring(0, 150)}...
                                    </p>

                                    <Link
                                        to={`/blogs/${post._id}`}
                                        className="inline-flex items-center justify-center w-full py-3 bg-secondary-50 hover:bg-primary-50 text-primary-700 font-bold rounded-xl transition-colors gap-2 group/btn"
                                    >
                                        Read Article
                                        <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blogs;
