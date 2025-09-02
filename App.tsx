import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { PromptInput } from './components/PromptInput';
import { GenerateButton } from './components/GenerateButton';
import { ResultDisplay } from './components/ResultDisplay';
import { Loader } from './components/Loader';
import { Footer } from './components/Footer';
import { editPetImage } from './services/geminiService';
import type { GeneratedOutput } from './types';

const fileToBase64 = (file: File): Promise<{ base64: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const [header, data] = result.split(',');
      const mimeType = header.match(/:(.*?);/)?.[1] || file.type;
      if (!data || !mimeType) {
        reject(new Error("No se pudieron procesar los datos del archivo."));
        return;
      }
      resolve({ base64: data, mimeType });
    };
    reader.onerror = (error) => reject(error);
  });
};


function App() {
  const [originalImages, setOriginalImages] = useState<File[]>([]);
  const [originalImageUrls, setOriginalImageUrls] = useState<string[]>([]);
  const [prompt, setPrompt] = useState<string>('');
  const [generatedOutputs, setGeneratedOutputs] = useState<GeneratedOutput[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      originalImageUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [originalImageUrls]);

  const handleImagesAdded = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setOriginalImages(prev => [...prev, ...newFiles]);

      const newUrls = newFiles.map(file => URL.createObjectURL(file));
      setOriginalImageUrls(prev => [...prev, ...newUrls]);
      
      setGeneratedOutputs(null);
      setError(null);
    }
  };

  const handleImageRemove = (indexToRemove: number) => {
    // Revoke the object URL to free up memory
    const urlToRemove = originalImageUrls[indexToRemove];
    URL.revokeObjectURL(urlToRemove);

    setOriginalImages(prev => prev.filter((_, index) => index !== indexToRemove));
    setOriginalImageUrls(prev => prev.filter((_, index) => index !== indexToRemove));
  };


  const handleGenerateClick = useCallback(async () => {
    if (originalImages.length === 0 || !prompt) {
      setError('Por favor, sube al menos una imagen y proporciona una descripción del corte.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedOutputs(null);

    try {
      const imageProcessPromises = originalImages.map(async (imageFile) => {
        const { base64, mimeType } = await fileToBase64(imageFile);
        return editPetImage(base64, mimeType, prompt);
      });
      
      const results = await Promise.all(imageProcessPromises);

      if (results.some(result => !result.imageUrl)) {
        throw new Error(results.find(r => !r.imageUrl)?.text || "La IA no pudo generar una imagen para una de las poses. Por favor, intenta de nuevo.");
      }
      
      setGeneratedOutputs(results);

    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error desconocido.';
      setError(`La generación falló: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [originalImages, prompt]);
  
  const handleTryAgain = () => {
    originalImageUrls.forEach(url => URL.revokeObjectURL(url));
    setOriginalImages([]);
    setOriginalImageUrls([]);
    setPrompt('');
    setGeneratedOutputs(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 min-h-screen text-slate-800">
      <Header />
      <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-purple-100/50 rounded-3xl shadow-[8px_8px_16px_#c5b8e0,_-8px_-8px_16px_#ffffff] p-6 sm:p-10 transition-all duration-300">
            {!generatedOutputs && !isLoading && (
              <>
                <div className="grid md:grid-cols-2 gap-8 mb-8 items-start">
                  <ImageUploader 
                    onImagesAdded={handleImagesAdded} 
                    onImageRemove={handleImageRemove}
                    imageUrls={originalImageUrls} 
                  />
                  <PromptInput value={prompt} onChange={(e) => setPrompt(e.target.value)} />
                </div>
                <div className="flex justify-center">
                  <GenerateButton onClick={handleGenerateClick} disabled={originalImages.length === 0 || !prompt || isLoading} />
                </div>
              </>
            )}

            {isLoading && <Loader />}
            
            {error && !isLoading && (
              <div className="text-center p-8">
                <p className="text-red-600 font-semibold mb-6">{error}</p>
                 <button 
                  onClick={handleTryAgain}
                  className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl shadow-md hover:bg-purple-700 active:shadow-inner transition-all duration-200"
                >
                  Intentar de Nuevo
                </button>
              </div>
            )}
            
            {generatedOutputs && !isLoading && (
              <ResultDisplay
                originalUrls={originalImageUrls}
                generatedOutputs={generatedOutputs}
                onReset={handleTryAgain}
              />
            )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;