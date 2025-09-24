import React from 'react';
import type { Product } from '../types';
import { XIcon } from './icons/XIcon';
import { TrashIcon } from './icons/TrashIcon';

interface CartModalProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems: Product[];
    onRemoveItem: (productId: number) => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, cartItems, onRemoveItem }) => {
    if (!isOpen) return null;

    const total = cartItems.reduce((sum, item) => sum + item.price, 0);

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 transition-opacity" 
            aria-modal="true" 
            role="dialog"
            onClick={onClose}
        >
            <div 
                className="bg-slate-50 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col animate-fade-in"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="p-4 border-b flex justify-between items-center flex-shrink-0">
                    <h2 className="text-xl font-bold text-slate-800">Your Cart ({cartItems.length})</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 transition-colors" aria-label="Close">
                        <XIcon className="w-6 h-6 text-slate-600" />
                    </button>
                </header>

                <main className="flex-grow overflow-y-auto p-4">
                    {cartItems.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-slate-500">Your cart is empty.</p>
                        </div>
                    ) : (
                        <ul className="space-y-3">
                            {cartItems.map((item, index) => (
                                <li key={`${item.id}-${index}`} className="flex items-center gap-4 bg-white p-3 rounded-lg shadow-sm">
                                    <img src={item.imageUrl} alt={item.name} className="h-16 w-16 rounded-md object-cover" />
                                    <div className="flex-grow">
                                        <p className="font-bold text-slate-800">{item.name}</p>
                                        <p className="text-sm text-slate-500">₹{item.price.toLocaleString()}</p>
                                    </div>
                                    <button onClick={() => onRemoveItem(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-full" aria-label={`Remove ${item.name}`}>
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </main>

                {cartItems.length > 0 && (
                    <footer className="p-4 border-t flex-shrink-0 bg-white/50 rounded-b-2xl space-y-3">
                        <div className="flex justify-between items-center font-bold text-lg">
                            <span className="text-slate-600">Total:</span>
                            <span className="text-slate-800">₹{total.toLocaleString()}</span>
                        </div>
                        <button
                            onClick={() => alert('Proceeding to checkout!')}
                            className="w-full py-3 bg-[#386641] text-white font-bold rounded-lg hover:bg-[#2c5134] transition-colors"
                        >
                            Buy Now
                        </button>
                    </footer>
                )}
            </div>
        </div>
    );
};

export default CartModal;