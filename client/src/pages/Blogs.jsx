import { useEffect, useState } from 'react';
import axios from 'axios';

const Blogs = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/blogs');
                setPosts(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchPosts();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Pet Care Tips & Articles</h1>
            {posts.length === 0 ? (
                <p>No articles found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {posts.map((post) => (
                        <div key={post._id} className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
                            <p className="text-sm text-gray-500 mb-4">By {post.author.name} | {new Date(post.createdAt).toLocaleDateString()}</p>
                            <p className="text-gray-700 mb-4">{post.content.substring(0, 150)}...</p>
                            <button className="text-primary font-semibold hover:underline">Read More</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Blogs;
