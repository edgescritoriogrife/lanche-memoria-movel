
import { useState, useEffect } from "react";
import MemoryCard from "./MemoryCard";
import GameControls from "./GameControls";
import { CardItem, createCardPairs, isGameOver, useTimer } from "@/lib/gameUtils";
import { loadImages, getFrontCardImage } from "@/lib/storageUtils";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface MemoryGameProps {
  className?: string;
}

export default function MemoryGame({ className }: MemoryGameProps) {
  const isMobile = useIsMobile();
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedCards, setFlippedCards] = useState<CardItem[]>([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [time, resetTimer] = useTimer(gameStarted && !gameOver);
  const [disableCards, setDisableCards] = useState(false);
  const [frontCardImage, setFrontCardImage] = useState(getFrontCardImage());

  // Inicializa o jogo
  useEffect(() => {
    startNewGame();
  }, []);

  // Verifica se o jogo acabou
  useEffect(() => {
    if (cards.length > 0 && isGameOver(cards)) {
      setGameOver(true);
    }
  }, [cards]);
  
  // Atualiza a imagem da frente do card quando necessário
  useEffect(() => {
    const checkFrontImage = () => {
      const currentFrontImage = getFrontCardImage();
      if (currentFrontImage !== frontCardImage) {
        setFrontCardImage(currentFrontImage);
      }
    };
    
    // Verifica quando o componente é montado
    checkFrontImage();
    
    // Configura um intervalo para verificar mudanças
    const interval = setInterval(checkFrontImage, 3000);
    return () => clearInterval(interval);
  }, [frontCardImage]);

  // Inicia um novo jogo
  const startNewGame = () => {
    const images = loadImages();
    const newCards = createCardPairs(images);
    
    setCards(newCards);
    setFlippedCards([]);
    setMoves(0);
    setScore(0);
    resetTimer();
    setGameStarted(true);
    setGameOver(false);
    setFrontCardImage(getFrontCardImage());
  };

  // Lógica quando um card é clicado
  const handleCardClick = (clickedCard: CardItem) => {
    if (flippedCards.length === 2 || clickedCard.flipped || clickedCard.matched) {
      return;
    }

    // Vira o card clicado
    const updatedCards = cards.map(card => 
      card.id === clickedCard.id ? { ...card, flipped: true } : card
    );
    setCards(updatedCards);

    // Adiciona o card aos cards virados
    const newFlippedCards = [...flippedCards, clickedCard];
    setFlippedCards(newFlippedCards);

    // Se dois cards foram virados, verifica se são iguais
    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      setDisableCards(true);
      
      const [firstCard, secondCard] = newFlippedCards;
      
      if (firstCard.imageUrl === secondCard.imageUrl) {
        // Par encontrado
        setTimeout(() => {
          setCards(currentCards => 
            currentCards.map(card => 
              card.id === firstCard.id || card.id === secondCard.id
                ? { ...card, matched: true }
                : card
            )
          );
          setScore(score + 10);
          setFlippedCards([]);
          setDisableCards(false);
        }, 500);
      } else {
        // Par não encontrado
        setTimeout(() => {
          setCards(currentCards => 
            currentCards.map(card => 
              card.id === firstCard.id || card.id === secondCard.id
                ? { ...card, flipped: false }
                : card
            )
          );
          setFlippedCards([]);
          setDisableCards(false);
        }, 1000);
      }
    }
  };

  // Determina o número de colunas baseado no dispositivo
  const gridCols = isMobile ? "grid-cols-3" : "grid-cols-4";

  // Se não houver cards suficientes, mostre uma mensagem
  if (cards.length < 4) {
    return (
      <div className="text-center p-6">
        <p className="text-lg mb-4">Não há cards suficientes para jogar.</p>
        <p className="mb-4">Adicione pelo menos 2 imagens no painel de administração.</p>
        <Link to="/admin">
          <Button>
            Ir para Administração
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col space-y-6", className)}>
      <GameControls
        moves={moves}
        time={time}
        score={score}
        onReset={startNewGame}
        gameOver={gameOver}
        className="mb-4"
      />
      
      <div className={cn("grid gap-3 w-full", gridCols)}>
        {cards.map((card) => (
          <MemoryCard
            key={card.id}
            card={card}
            onClick={handleCardClick}
            disabled={disableCards}
            frontImage={frontCardImage}
          />
        ))}
      </div>
    </div>
  );
}

// Componente auxiliar para Link
import { Link } from "react-router-dom";
