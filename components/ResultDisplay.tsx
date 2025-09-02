import React from 'react';
import type { GeneratedOutput } from '../types';

interface ResultDisplayProps {
  originalUrls: string[];
  generatedOutputs: GeneratedOutput[];
  onReset: () => void;
}

const ImageCard: React.FC<{ title: string, imageUrl: string }> = ({ title, imageUrl }) => (
    <div className="flex flex-col items-center">
        <h3 className="text-xl font-semibold text-purple-800 mb-3">{title}</h3>
        <div className="w-full aspect-square bg-purple-100 rounded-2xl p-3 shadow-[6px_6px_12px_#d3cce3,_-6px_-6px_12px_#ffffff]">
            <img src={imageUrl} alt={title} className="w-full h-full object-contain rounded-lg" />
        </div>
    </div>
);

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ originalUrls, generatedOutputs, onReset }) => {
    const generatedText = generatedOutputs.find(o => o.text)?.text;

    return (
    <div className="animate-fade-in">
        <div className="space-y-10 mb-8">
            {originalUrls.map((originalUrl, index) => {
                const generatedOutput = generatedOutputs[index];
                if (!generatedOutput?.imageUrl) return null;

                return (
                    <div key={index} className="grid md:grid-cols-2 gap-8 p-4 bg-purple-200/30 rounded-2xl">
                        <ImageCard title={`Original (Foto ${index + 1})`} imageUrl={originalUrl} />
                        <ImageCard title={`Con Estilo (Foto ${index + 1})`} imageUrl={generatedOutput.imageUrl} />
                    </div>
                )
            })}
        </div>

        {generatedText && (
            <div className="text-center bg-purple-200/50 p-4 rounded-xl mb-8">
                <p className="text-purple-900">
                    <span className="font-semibold">Nota de la IA:</span> {generatedText}
                </p>
            </div>
        )}
        <div className="text-center">
            <button
                onClick={onReset}
                className="px-8 py-3 bg-purple-50 text-purple-800 font-semibold rounded-xl shadow-[5px_5px_10px_#d3cce3,_-5px_-5px_10px_#ffffff] hover:shadow-[inset_2px_2px_4px_#d3cce3,inset_-2px_-2px_4px_#ffffff] active:shadow-[inset_5px_5px_10px_#d3cce3,inset_-5px_-5px_10px_#ffffff] transition-all duration-200"
            >
                Probar Otro Estilo
            </button>
        </div>
    </div>
  );
};

// Add a simple fade-in animation for the results
const style = document.createElement('style');
style.innerHTML = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
`;
document.head.appendChild(style);