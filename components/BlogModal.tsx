import React from 'react';
import type { BlogPost } from '../types';
import { XIcon } from './icons/XIcon';

interface BlogModalProps {
    post: BlogPost;
    onClose: () => void;
}

const BlogModal: React.FC<BlogModalProps> = ({ post, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-fade-in">
                <header className="p-4 flex justify-end items-center border-b flex-shrink-0">
                     <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100"><XIcon className="w-6 h-6"/></button>
                </header>
                <main className="flex-grow overflow-y-auto">
                    <img src={post.imageUrl} alt={post.title} className="w-full h-64 object-cover" />
                    <div className="p-8">
                        <h1 className="text-3xl font-bold text-slate-800">{post.title}</h1>
                        <p className="text-slate-500 mt-2">By {post.author} on {post.date}</p>
                        <div 
                            className="prose mt-6 text-slate-700" 
                            dangerouslySetInnerHTML={{ __html: post.content }} 
                        />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default BlogModal;
