import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaPaperPlane } from 'react-icons/fa';

const MessagesSection = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const scrollRef = useRef();

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch conversations
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                // Only set loading on first fetch to avoid flickering on poll
                if (conversations.length === 0) setLoading(true);

                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/messages`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });

                // Prevent unnecessary re-renders (fixes flickering)
                setConversations(prev => {
                    if (JSON.stringify(prev) !== JSON.stringify(data)) {
                        return data;
                    }
                    return prev;
                });
                setError(null);
            } catch (error) {
                console.error(error);
                setError('Failed to load messages.');
            } finally {
                setLoading(false);
            }
        };
        if (user) {
            fetchConversations();
            const interval = setInterval(fetchConversations, 30000); // 30 seconds poll (Reduced rate)
            return () => clearInterval(interval);
        }
    }, [user]);

    // Fetch messages when chat selected
    useEffect(() => {
        if (!selectedChat) return;
        const fetchMessages = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/messages/${selectedChat.partner._id}`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setMessages(prev => {
                    if (JSON.stringify(prev) !== JSON.stringify(data)) {
                        return data;
                    }
                    return prev;
                });
            } catch (error) {
                console.error(error);
            }
        };
        fetchMessages();

        // Polling for messages (30 seconds)
        const interval = setInterval(fetchMessages, 30000);
        return () => clearInterval(interval);
    }, [selectedChat, user]);

    // Scroll ONLY when chat is first opened
    useEffect(() => {
        if (messages.length > 0) {
            scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [selectedChat?._id]); // Only scroll on chat switch

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            console.log('Sending message to:', selectedChat.partner._id);
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/messages`, {
                receiverId: selectedChat.partner._id,
                content: newMessage
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            console.log('Message sent:', data);
            setMessages(prev => [...prev, data]);
            setNewMessage('');

            // Scroll to bottom after sending
            setTimeout(() => {
                scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);

            // Update conversation list last message preview
            setConversations(prev => prev.map(conv =>
                conv.partner._id === selectedChat.partner._id
                    ? { ...conv, lastMessage: data }
                    : conv
            ));
        } catch (error) {
            console.error('Send Error:', error);
            alert(`Failed to send message: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-card border border-secondary-100 overflow-hidden min-h-[500px] flex flex-col md:flex-row h-[600px] mt-8">
            {/* Sidebar List */}
            <div className="w-full md:w-1/3 border-r border-secondary-100 bg-secondary-50 flex flex-col">
                <div className="p-5 border-b border-secondary-200 bg-white">
                    <h2 className="font-display font-bold text-xl text-neutral-900">Messages</h2>
                </div>
                <div className="overflow-y-auto flex-grow">
                    {loading && conversations.length === 0 && (
                        <div className="p-8 text-center text-neutral-500">Loading chats...</div>
                    )}
                    {error && (
                        <div className="p-8 text-center text-red-500">{error}</div>
                    )}
                    {!loading && !error && conversations.length > 0 ? (
                        conversations.map(conv => (
                            <div
                                key={conv.partner?._id}
                                onClick={() => setSelectedChat(conv)}
                                className={`p-4 border-b border-secondary-200 cursor-pointer hover:bg-white transition-colors relative ${selectedChat?.partner?._id === conv.partner?._id ? 'bg-white border-l-4 border-l-primary-600' : 'border-l-4 border-l-transparent'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-12 h-12 bg-secondary-200 rounded-full flex items-center justify-center text-secondary-500 flex-shrink-0">
                                            <FaUser />
                                        </div>
                                        {conv.unreadCount > 0 && (
                                            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm animate-pulse">
                                                {conv.unreadCount}
                                            </div>
                                        )}
                                    </div>
                                    <div className="overflow-hidden flex-grow">
                                        <div className="flex justify-between items-center">
                                            <p className="font-bold text-neutral-900 truncate">{conv.partner?.name || 'Unknown User'}</p>
                                            {conv.unreadCount > 0 && <span className="w-2 h-2 bg-primary-500 rounded-full ml-2"></span>}
                                        </div>
                                        <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'font-bold text-neutral-800' : 'text-neutral-500'}`}>{conv.lastMessage?.content || 'No message'}</p>
                                        <p className="text-[10px] text-neutral-400 mt-1">
                                            {conv.lastMessage?.createdAt ? new Date(conv.lastMessage.createdAt).toLocaleDateString() : ''}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        !loading && !error && (
                            <div className="p-8 text-center text-neutral-500">
                                <p>No messages yet.</p>
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="w-full md:w-2/3 flex flex-col bg-white">
                {selectedChat ? (
                    <>
                        <div className="p-4 border-b border-secondary-100 flex items-center gap-3 bg-white shadow-sm z-10">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                                {selectedChat.partner?.name?.[0]?.toUpperCase() || '?'}
                            </div>
                            <div>
                                <h3 className="font-bold text-neutral-900">{selectedChat.partner?.name || 'Unknown User'}</h3>
                                <p className="text-xs text-neutral-500">{selectedChat.partner?.email || ''}</p>
                            </div>
                        </div>

                        <div className="flex-grow p-4 overflow-y-auto bg-slate-50 space-y-4">
                            {messages.map((msg, idx) => {
                                const isMe = msg.sender?._id === user._id || msg.sender === user._id; // Handle populated vs unpopulated
                                return (
                                    <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[75%] p-3.5 rounded-2xl text-sm shadow-sm ${isMe ? 'bg-primary-600 text-white rounded-br-sm' : 'bg-white border border-secondary-200 text-neutral-800 rounded-bl-sm'}`}>
                                            <p>{msg.content}</p>
                                            <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-primary-200' : 'text-neutral-400'}`}>
                                                {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={scrollRef} />
                        </div>

                        <div className="p-4 bg-white border-t border-secondary-100">
                            <form onSubmit={handleSendMessage} className="flex gap-3">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-grow p-4 bg-secondary-50 border border-secondary-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="p-4 bg-primary-600 disabled:bg-secondary-300 text-white rounded-xl hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    <FaPaperPlane className="text-lg" />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-grow flex flex-col items-center justify-center text-neutral-400 bg-secondary-50/50">
                        <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mb-4 text-secondary-300">
                            <FaPaperPlane className="text-3xl" />
                        </div>
                        <p className="text-lg font-medium">Select a conversation to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessagesSection;
