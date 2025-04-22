
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { CardItem } from "@/lib/gameUtils";

interface MemoryCardProps {
  card: CardItem;
  onClick: (card: CardItem) => void;
  disabled: boolean;
}

export default function MemoryCard({ card, onClick, disabled }: MemoryCardProps) {
  const [isFlipping, setIsFlipping] = useState(false);
  
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
          "w-full h-full transition-all duration-300 transform-gpu relative preserve-3d",
          (card.flipped || card.matched) ? "rotate-y-180" : ""
        )}
      >
        {/* Frente do card (costas viradas para cima) */}
        <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-red-500 to-yellow-500 rounded-lg shadow-md flex items-center justify-center border-2 border-white">
          <div className="text-white text-3xl font-bold">?</div>
        </div>
        
        {/* Verso do card (imagem virada para cima) */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-lg shadow-md overflow-hidden border-2 border-white">
          <img 
            src={card.imageUrl} 
            alt="Item da lanchonete" 
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback para imagem quebrada
              (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=Imagem+Indisponível";
            }}
          />
        </div>
      </div>
    </div>
  );
}
