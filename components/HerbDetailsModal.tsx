import React from 'react';
import type { Herb } from '../types';
import { XIcon } from './icons/XIcon';

interface HerbDetailsModalProps {
    herb: Herb;
    onClose: () => void;
}

const HerbDetailsModal: React.FC<HerbDetailsModalProps> = ({ herb, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-50 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col animate-fade-in">
                <header className="p-4 flex justify-between items-center border-b flex-shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">{herb.name}</h2>
                        <p className="text-sm text-slate-500 italic">{herb.botanicalName}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200"><XIcon className="w-6 h-6"/></button>
                </header>
                <main className="flex-grow overflow-y-auto">
                    <img src={herb.imageUrl} alt={herb.name} className="w-full h-56 object-cover" />
                    <div className="p-6 space-y-6">
                        <div>
                            <h3 className="text-lg font-bold mb-2 text-[#386641]">Description</h3>
                            <p className="text-slate-600">{herb.description}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-2 text-[#386641]">Key Benefits</h3>
                            <ul className="list-disc list-inside space-y-1 text-slate-600">
                                {herb.benefits.map((benefit, i) => <li key={i}>{benefit}</li>)}
                            </ul>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <h3 className="text-lg font-bold mb-2 text-[#386641]">{herb.recipe.title}</h3>
                            <div>
                                <h4 className="font-semibold text-slate-700 mb-1">Ingredients:</h4>
                                <ul className="list-disc list-inside text-sm space-y-1 text-slate-600">
                                    {herb.recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                                </ul>
                            </div>
                            <div className="mt-4">
                                <h4 className="font-semibold text-slate-700 mb-1">Instructions:</h4>
                                <ol className="list-decimal list-inside text-sm space-y-1.5 text-slate-600">
                                    {herb.recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
                                </ol>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default HerbDetailsModal;
