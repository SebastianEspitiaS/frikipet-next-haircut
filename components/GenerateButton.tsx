import React from 'react';

interface GenerateButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({ onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-10 py-4 text-xl font-bold rounded-2xl transition-all duration-200 ease-in-out
        transform active:scale-95
        focus:outline-none focus:ring-4 focus:ring-purple-300
        ${
          disabled
            ? 'bg-purple-200 text-purple-400 cursor-not-allowed shadow-[6px_6px_12px_#d3cce3,_-6px_-6px_12px_#ffffff]'
            : 'bg-purple-500 text-white shadow-lg hover:bg-purple-600 active:shadow-inner'
        }
      `}
    >
      ¡Estiliza a mi Mascota!
    </button>
  );
};