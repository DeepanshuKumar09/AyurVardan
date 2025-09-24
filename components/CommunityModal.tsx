import React, { useState } from 'react';
import type { CommunityPost } from '../types';
import { XIcon } from './icons/XIcon';
import { SendIcon } from './icons/SendIcon';
import { CommentIcon } from './icons/CommentIcon';

interface CommunityModalProps {
    posts: CommunityPost[];
    onAddPost: (content: string) => void;
    onAddComment: (postId: number, content: string) => void;
    onClose: () => void;
}

const CommunityModal: React.FC<CommunityModalProps> = ({ posts, onAddPost, onAddComment, onClose }) => {
    const [newPostContent, setNewPostContent] = useState('');
    const [newComment, setNewComment] = useState<Record<number, string>>({});

    const handlePostSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPostContent.trim()) {
            onAddPost(newPostContent.trim());
            setNewPostContent('');
        }
    };

     const handleCommentSubmit = (e: React.FormEvent, postId: number) => {
        e.preventDefault();
        const content = newComment[postId];
        if (content && content.trim()) {
            onAddComment(postId, content.trim());
            setNewComment(prev => ({ ...prev, [postId]: '' }));
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-100 rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-fade-in">
                <header className="p-4 border-b flex justify-between items-center bg-white rounded-t-2xl">
                    <h2 className="text-xl font-bold text-slate-800">Community Hub</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200"><XIcon className="w-6 h-6"/></button>
                </header>
                
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                    {/* New Post Form */}
                    <form onSubmit={handlePostSubmit} className="bg-white p-4 rounded-xl shadow-sm">
                        <textarea
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            placeholder="Share your thoughts or ask a question..."
                            className="w-full h-24 p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#386641]"
                        />
                        <div className="text-right mt-2">
                            <button type="submit" className="px-5 py-2 bg-[#386641] text-white font-semibold rounded-lg hover:bg-[#2c5134] transition-colors">Post</button>
                        </div>
                    </form>

                    {/* Posts Feed */}
                    {posts.map(post => (
                        <div key={post.id} className="bg-white p-4 rounded-xl shadow-sm">
                            <div className="flex items-start gap-3">
                                <img src={post.authorImageUrl} alt={post.author} className="h-10 w-10 rounded-full"/>
                                <div>
                                    <p className="font-bold">{post.author} <span className="text-xs text-slate-500 font-normal ml-2">{post.timestamp}</span></p>
                                    <p className="mt-1 text-slate-700">{post.content}</p>
                                </div>
                            </div>
                            <div className="mt-3 pl-12">
                                <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                                    <CommentIcon className="h-4 w-4" />
                                    <span>{post.comments.length} Comments</span>
                                </div>
                                {/* Comments */}
                                <div className="space-y-3">
                                    {post.comments.map(comment => (
                                        <div key={comment.id} className="flex items-start gap-2 text-sm">
                                            <img src={comment.authorImageUrl} alt={comment.author} className="h-8 w-8 rounded-full"/>
                                            <div className="bg-slate-100 p-2 rounded-lg flex-1">
                                                <p><span className="font-bold">{comment.author}</span> <span className="text-xs text-slate-500 ml-1">{comment.timestamp}</span></p>
                                                <p className="text-slate-600">{comment.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {/* Add Comment Form */}
                                <form onSubmit={(e) => handleCommentSubmit(e, post.id)} className="mt-3 flex items-center gap-2">
                                     <input
                                        type="text"
                                        value={newComment[post.id] || ''}
                                        onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                                        placeholder="Write a comment..."
                                        className="w-full bg-slate-100 rounded-full px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#6A994E]"
                                    />
                                    <button type="submit" className="p-2 bg-[#E9F5DB] text-[#386641] rounded-full hover:bg-[#dbecc6] transition-colors">
                                        <SendIcon className="h-4 w-4" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CommunityModal;
