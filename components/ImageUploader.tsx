import React, { useRef } from 'react';

interface ImageUploaderProps {
  onImagesAdded: (files: FileList | null) => void;
  onImageRemove: (index: number) => void;
  imageUrls: string[];
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesAdded, onImageRemove, imageUrls }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onImagesAdded(event.target.files);
    if(event.target) {
        event.target.value = ''; // Permite volver a seleccionar los mismos archivos
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-2xl font-semibold text-purple-800 mb-4">1. Sube tus Fotos</h2>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
        multiple
      />
      <div
        className="w-full h-64 sm:h-80 bg-purple-100 rounded-2xl p-4 transition-all duration-300 shadow-[inset_6px_6px_12px_#d3cce3,inset_-6px_-6px_12px_#ffffff] overflow-y-auto"
      >
        {imageUrls.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {imageUrls.map((url, index) => (
              <div key={url} className="relative group aspect-square">
                <img src={url} alt={`Vista previa de mascota ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                <button
                  onClick={() => onImageRemove(index)}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                  aria-label={`Quitar imagen ${index + 1}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            <div
              onClick={handleClick}
              className="flex items-center justify-center aspect-square border-2 border-dashed border-purple-300 rounded-lg text-purple-600 cursor-pointer hover:bg-purple-200/50 transition-colors"
              role="button"
              aria-label="Añadir más imágenes"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </div>
        ) : (
          <div onClick={handleClick} className="flex flex-col items-center justify-center h-full border-2 border-dashed border-purple-300 rounded-lg text-purple-600 cursor-pointer hover:bg-purple-200/50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="font-semibold text-center">Haz clic para subir una o más imágenes</p>
            <p className="text-xs mt-1">PNG, JPG, WEBP</p>
          </div>
        )}
      </div>
    </div>
  );
};