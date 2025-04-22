
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ImagePlus, X } from "lucide-react";
import { fileToBase64 } from "@/lib/storageUtils";

interface ImageUploadProps {
  onUpload: (imageUrl: string) => void;
}

export default function ImageUpload({ onUpload }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };
  
  const processFile = async (file: File) => {
    // Verifica se o arquivo é uma imagem
    if (!file.type.match('image.*')) {
      setErrorMessage('Por favor, selecione apenas arquivos de imagem.');
      return;
    }
    
    try {
      const base64Image = await fileToBase64(file);
      setPreviewImage(base64Image);
      setErrorMessage(null);
    } catch (error) {
      console.error('Erro ao processar o arquivo:', error);
      setErrorMessage('Erro ao processar o arquivo. Tente novamente.');
    }
  };
  
  const handleSubmit = () => {
    if (previewImage) {
      onUpload(previewImage);
      setPreviewImage(null);
    }
  };
  
  const handleCancel = () => {
    setPreviewImage(null);
    setErrorMessage(null);
  };

  return (
    <div className="space-y-4">
      {!previewImage ? (
        <Card
          className={`border-dashed border-2 ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          } rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('fileInput')?.click()}
        >
          <ImagePlus className="h-12 w-12 text-gray-400 mb-3" />
          <p className="text-center text-gray-500 mb-1">
            Arraste uma imagem ou clique para selecionar
          </p>
          <p className="text-center text-gray-400 text-sm">
            PNG, JPG ou WEBP (max. 5MB)
          </p>
          <Input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </Card>
      ) : (
        <div className="space-y-3">
          <div className="aspect-square w-full max-w-xs mx-auto relative rounded-lg overflow-hidden border border-gray-200">
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <button
              onClick={handleCancel}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <div className="flex space-x-2 justify-center">
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              Adicionar ao Jogo
            </Button>
          </div>
        </div>
      )}
      
      {errorMessage && (
        <p className="text-red-500 text-sm text-center">{errorMessage}</p>
      )}
    </div>
  );
}
