import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="py-6 text-center">
      <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
        Frikipet Next Haircut
      </h1>
      <p className="text-purple-700/80 mt-2 text-lg">Visualiza el Próximo Look de tu Mascota</p>
    </header>
  );
};