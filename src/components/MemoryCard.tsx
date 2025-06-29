
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { CardItem } from "@/lib/gameUtils";

interface MemoryCardProps {
  card: CardItem;
  onClick: (card: CardItem) => void;
  disabled: boolean;
  frontImage?: string;
}

export default function MemoryCard({ card, onClick, disabled, frontImage }: MemoryCardProps) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Efeito para animação quando o card é virado ou encontra um par
  useEffect(() => {
    if (card.flipped) {
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setIsFlipping(false);
      }, 300); // Duração da animação
      return () => clearTimeout(timer);
    }
  }, [card.flipped]);

  const handleClick = () => {
    if (!disabled && !card.flipped && !card.matched) {
      onClick(card);
    }
  };

  // URL de fallback para quando a imagem não carregar
  const fallbackImageUrl = `https://placehold.co/400x400?text=${encodeURIComponent(card.id)}`;

  return (
    <div
      className={cn(
        "aspect-square relative cursor-pointer transition-all duration-300 transform",
        isFlipping && "scale-[1.05]",
        card.matched && "opacity-80"
      )}
      onClick={handleClick}
    >
      <div
        className={cn(
          "w-full h-full transition-all duration-300 transform-gpu preserve-3d relative",
          (card.flipped || card.matched) ? "rotate-y-180" : ""
        )}
      >
        {/* Frente do card (costas viradas para cima) */}
        <div className="absolute w-full h-full backface-hidden rounded-lg shadow-md flex items-center justify-center border-2 border-white overflow-hidden bg-black">
          {frontImage ? (
            <img 
              src={frontImage} 
              alt="Frente do card" 
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error("Erro ao carregar imagem da frente:", frontImage);
                (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=?";
              }}
            />
          ) : (
            <div className="bg-gradient-to-br from-orange-500 to-yellow-400 w-full h-full flex items-center justify-center">
              <div className="text-white text-3xl font-bold">?</div>
            </div>
          )}
        </div>
        
        {/* Verso do card (imagem virada para cima) */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-lg shadow-md overflow-hidden border-2 border-white bg-white">
          {imageError ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 text-sm text-center p-2">
              Erro de Imagem
            </div>
          ) : (
            <img 
              src={card.imageUrl || fallbackImageUrl} 
              alt="Item da lanchonete" 
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error("Erro ao carregar imagem do card:", card.imageUrl);
                setImageError(true);
                (e.target as HTMLImageElement).src = fallbackImageUrl;
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
