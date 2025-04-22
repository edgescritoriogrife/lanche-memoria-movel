
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ImagePlus, X } from "lucide-react";
import { fileToBase64 } from "@/lib/storageUtils";
import { toast } from "@/components/ui/sonner";

interface ImageUploadProps {
  onUpload: (imageUrl: string) => void;
}

export default function ImageUpload({ onUpload }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFiles(Array.from(e.target.files));
      // Limpa o valor para permitir seleção do mesmo arquivo novamente em seguida, se desejar.
      e.target.value = "";
    }
  };

  const processFiles = async (files: File[]) => {
    setErrorMessage(null);
    setIsUploading(true);

    const previews: string[] = [];
    for (const file of files) {
      // Só processa imagens.
      if (!file.type.match('image.*')) {
        setErrorMessage('Por favor, selecione apenas arquivos de imagem.');
        continue;
      }
      // Limite do tamanho.
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Alguma imagem está muito grande. Tamanho máximo: 5MB.');
        continue;
      }
      try {
        const base64Image = await fileToBase64(file);
        previews.push(base64Image);
      } catch (error) {
        setErrorMessage('Erro ao processar algum arquivo. Tente novamente.');
      }
    }
    setPreviewImages(previews);
    setIsUploading(false);
  };

  const handleSubmit = () => {
    if (previewImages.length > 0) {
      try {
        previewImages.forEach(image => onUpload(image));
        setPreviewImages([]);
        setErrorMessage(null);
      } catch (error) {
        toast.error('Erro ao adicionar imagem. O armazenamento pode estar cheio.');
        setErrorMessage('Não foi possível salvar a imagem. Tente uma menor ou remova imagens existentes.');
      }
    }
  };

  const handleCancel = () => {
    setPreviewImages([]);
    setErrorMessage(null);
  };

  return (
    <div className="space-y-4">
      {previewImages.length === 0 ? (
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
            Arraste uma ou várias imagens ou clique para selecionar
          </p>
          <p className="text-center text-gray-400 text-sm">
            PNG, JPG ou WEBP (max. 5MB cada)
          </p>
          <Input
            id="fileInput"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />
        </Card>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {previewImages.map((img, idx) => (
              <div
                key={idx}
                className="aspect-square w-full max-w-xs mx-auto relative rounded-lg overflow-hidden border border-gray-200"
              >
                <img
                  src={img}
                  alt={`Preview ${idx}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            <button
              onClick={handleCancel}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
              style={{ right: "1rem", top: "1rem", zIndex: 20 }}
              title="Remover seleção"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <div className="flex space-x-2 justify-center">
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={isUploading}>
              Adicionar ao Jogo
            </Button>
          </div>
        </div>
      )}

      {errorMessage && (
        <p className="text-red-500 text-sm text-center">{errorMessage}</p>
      )}

      <div className="text-center text-sm text-gray-500 mt-4">
        <p>Dica: Para melhor desempenho, use imagens menores que 1MB.</p>
        <p>Clique ou arraste várias imagens para adicionar todas de uma vez.</p>
      </div>
    </div>
  );
}
