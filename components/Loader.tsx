import React from 'react';

const loadingMessages = [
    "Contactando al estilista de mascotas...",
    "Afilando las tijeras virtuales...",
    "Esponjando el pelaje digital...",
    "Perfeccionando el nuevo look...",
    "¡Casi listo para la gran revelación!",
];

export const Loader: React.FC = () => {
    const [message, setMessage] = React.useState(loadingMessages[0]);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setMessage(prevMessage => {
                const currentIndex = loadingMessages.indexOf(prevMessage);
                const nextIndex = (currentIndex + 1) % loadingMessages.length;
                return loadingMessages[nextIndex];
            });
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center p-16 text-center">
             <div className="w-16 h-16 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin mb-6"></div>
            <p className="text-xl font-semibold text-purple-800 transition-opacity duration-500">{message}</p>
        </div>
    );
};