
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import ImageUpload from "@/components/ImageUpload";
import { loadImages, saveImages, addImage } from "@/lib/storageUtils";
import { X } from "lucide-react";

export default function Admin() {
  const [images, setImages] = useState<string[]>([]);
  
  useEffect(() => {
    // Carrega as imagens salvas quando o componente é montado
    setImages(loadImages());
  }, []);
  
  const handleAddImage = (imageUrl: string) => {
    // Adiciona a nova imagem
    const updatedImages = addImage(imageUrl);
    setImages(updatedImages);
    toast.success("Imagem adicionada com sucesso!");
  };
  
  const handleRemoveImage = (imageUrl: string) => {
    // Remove a imagem selecionada
    const updatedImages = images.filter(url => url !== imageUrl);
    saveImages(updatedImages);
    setImages(updatedImages);
    toast.success("Imagem removida com sucesso!");
  };

  return (
    <div className="container max-w-4xl mx-auto p-4 min-h-screen">
      <header className="mb-8 text-center">
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" size="sm">
              ← Voltar ao Jogo
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Painel de Administração
        </h1>
        <p className="text-gray-600">
          Gerencie as imagens do jogo da memória da lanchonete.
        </p>
      </header>

      <Tabs defaultValue="images" className="space-y-6">
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
          <TabsTrigger value="images">Imagens Atuais</TabsTrigger>
          <TabsTrigger value="add">Adicionar Nova</TabsTrigger>
        </TabsList>

        <TabsContent value="images">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4 text-center">
                Imagens Atuais ({images.length})
              </h2>
              
              {images.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  Nenhuma imagem encontrada. Adicione algumas imagens!
                </p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                        <img 
                          src={imageUrl} 
                          alt={`Produto ${index + 1}`} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=Erro+de+Imagem";
                          }}
                        />
                      </div>
                      <button 
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveImage(imageUrl)}
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="text-center text-sm text-gray-500 mt-6">
                <p>As imagens são automaticamente salvas no seu navegador.</p>
                <p>Para o jogo funcionar melhor, mantenha entre 6 e 12 imagens.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="add">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4 text-center">
                Adicionar Nova Imagem
              </h2>
              <ImageUpload onUpload={handleAddImage} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
