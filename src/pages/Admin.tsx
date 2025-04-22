import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import ImageUpload from "@/components/ImageUpload";
import { 
  loadImages, 
  saveImages, 
  addImage, 
  getFrontCardImage,
  setFrontCardImage 
} from "@/lib/storageUtils";
import { X, ImagePlus, FileImage, AlertTriangle } from "lucide-react";

interface AdminProps {
  user?: { email?: string };
}

export default function Admin({ user }: AdminProps) {
  const [images, setImages] = useState<string[]>([]);
  const [frontCardImage, setFrontCardImageState] = useState<string>(getFrontCardImage());
  const [storageInfo, setStorageInfo] = useState({ used: 0, total: 0, percentage: 0 });
  
  useEffect(() => {
    // Carrega as imagens salvas quando o componente é montado
    setImages(loadImages());
    checkStorageUsage();
  }, []);
  
  useEffect(() => {
    if (user?.email !== "ivangualbertodeoliveirajunior@gmail.com") {
      window.location.href = "/auth";
    }
  }, [user]);
  
  // Verifica o uso do localStorage
  const checkStorageUsage = () => {
    try {
      let totalSize = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key) || '';
          totalSize += key.length + value.length;
        }
      }
      
      // Tamanho aproximado em bytes (2 bytes por caractere em UTF-16)
      const usedBytes = totalSize * 2;
      // Limite aproximado do localStorage (5MB na maioria dos navegadores)
      const totalBytes = 5 * 1024 * 1024;
      const percentage = Math.min(Math.round((usedBytes / totalBytes) * 100), 100);
      
      setStorageInfo({
        used: Math.round(usedBytes / 1024),
        total: Math.round(totalBytes / 1024),
        percentage
      });
    } catch (error) {
      console.error("Erro ao calcular uso de armazenamento:", error);
    }
  };
  
  const handleAddImage = (imageUrl: string) => {
    try {
      // Verifica se já estamos perto do limite
      if (storageInfo.percentage > 80) {
        toast.warning("Armazenamento quase cheio! Pode ser necessário remover algumas imagens.");
      }
      
      // Adiciona a nova imagem
      const updatedImages = addImage(imageUrl);
      setImages(updatedImages);
      toast.success("Imagem adicionada com sucesso!");
      checkStorageUsage();
    } catch (error) {
      console.error("Erro ao adicionar imagem:", error);
      toast.error("Erro ao adicionar imagem. Tente uma imagem menor ou remova algumas existentes.");
    }
  };
  
  const handleRemoveImage = (imageUrl: string) => {
    try {
      // Remove a imagem selecionada
      const updatedImages = images.filter(url => url !== imageUrl);
      saveImages(updatedImages);
      setImages(updatedImages);
      toast.success("Imagem removida com sucesso!");
      checkStorageUsage();
    } catch (error) {
      console.error("Erro ao remover imagem:", error);
      toast.error("Erro ao remover imagem.");
    }
  };
  
  const handleSetFrontCardImage = (imageUrl: string) => {
    try {
      setFrontCardImage(imageUrl);
      setFrontCardImageState(imageUrl);
      toast.success("Imagem da frente do card definida com sucesso!");
      checkStorageUsage();
    } catch (error) {
      console.error("Erro ao definir imagem da frente:", error);
      toast.error("Erro ao definir imagem da frente. Tente uma imagem menor.");
    }
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

      {/* Indicador de uso de armazenamento */}
      <div className="mb-6 px-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-gray-700">Uso de Armazenamento</span>
          <span className={`text-sm ${storageInfo.percentage > 80 ? 'text-orange-600 font-medium' : 'text-gray-600'}`}>
            {storageInfo.used} KB / {storageInfo.total} KB ({storageInfo.percentage}%)
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${
              storageInfo.percentage > 90 ? 'bg-red-500' : 
              storageInfo.percentage > 70 ? 'bg-orange-500' : 'bg-green-500'
            }`} 
            style={{ width: `${storageInfo.percentage}%` }}
          ></div>
        </div>
        {storageInfo.percentage > 80 && (
          <div className="mt-2 flex items-center text-orange-600 text-sm">
            <AlertTriangle className="h-4 w-4 mr-1" />
            <span>Armazenamento quase cheio! Remova algumas imagens para liberar espaço.</span>
          </div>
        )}
      </div>

      <Tabs defaultValue="images" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
          <TabsTrigger value="images">Imagens dos Cards ({images.length})</TabsTrigger>
          <TabsTrigger value="front">Frente do Card</TabsTrigger>
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
                      <div className="absolute top-1 right-1 flex gap-1">
                        <button 
                          className="bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveImage(imageUrl)}
                          title="Remover imagem"
                        >
                          <X className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
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
        
        <TabsContent value="front">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4 text-center">
                Imagem da Frente do Card
              </h2>
              
              <div className="flex flex-col items-center space-y-4">
                <div className="aspect-square w-40 h-40 rounded-lg overflow-hidden border-2 border-dashed border-yellow-500 shadow-md">
                  <img 
                    src={frontCardImage} 
                    alt="Frente do card" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=?";
                    }}
                  />
                </div>
                
                <p className="text-center text-sm max-w-md">
                  Esta imagem será mostrada na frente de todos os cards. 
                  Você pode escolher uma das imagens já adicionadas ou fazer o upload de uma nova.
                </p>
                
                <div className="grid grid-cols-4 gap-2 w-full max-w-md">
                  {images.slice(0, 8).map((imageUrl, index) => (
                    <button 
                      key={index}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        frontCardImage === imageUrl ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => handleSetFrontCardImage(imageUrl)}
                    >
                      <img 
                        src={imageUrl} 
                        alt={`Opção ${index + 1}`}
                        className="w-full h-full object-cover" 
                      />
                    </button>
                  ))}
                </div>
                
                <div className="w-full max-w-md pt-4">
                  <h3 className="font-medium text-gray-700 mb-2">Carregar nova imagem para frente do card:</h3>
                  <ImageUpload onUpload={handleSetFrontCardImage} />
                </div>
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
