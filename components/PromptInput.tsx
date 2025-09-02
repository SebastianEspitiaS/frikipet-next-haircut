import React from 'react';

interface PromptInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const PromptInput: React.FC<PromptInputProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-semibold text-purple-800 mb-4 text-center md:text-left">2. Describe el Corte</h2>
      <textarea
        value={value}
        onChange={onChange}
        placeholder="Ej: 'Dale a mi golden retriever un corte de osito de peluche', 'haz que mi gato parezca un león', o 'cresta morada'..."
        className="w-full flex-grow bg-purple-100 rounded-2xl p-4 text-purple-900 placeholder-purple-400/70 outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 shadow-[inset_6px_6px_12px_#d3cce3,inset_-6px_-6px_12px_#ffffff] min-h-[16rem] sm:min-h-[20rem] resize-none"
      />
    </div>
  );
};