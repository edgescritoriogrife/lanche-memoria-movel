
import { useState, useEffect } from "react";
import MemoryCard from "./MemoryCard";
import GameControls from "./GameControls";
import { CardItem, createCardPairs, isGameOver, useTimer } from "@/lib/gameUtils";
import { loadImages, getFrontCardImage } from "@/lib/storageUtils";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

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

  // Novo estado para modal e nome do jogador
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    if (cards.length > 0 && isGameOver(cards)) {
      setGameOver(true);
      setShowNameDialog(true);
    }
  }, [cards]);

  useEffect(() => {
    const checkFrontImage = () => {
      const currentFrontImage = getFrontCardImage();
      if (currentFrontImage !== frontCardImage) {
        setFrontCardImage(currentFrontImage);
      }
    };

    checkFrontImage();

    const interval = setInterval(checkFrontImage, 3000);
    return () => clearInterval(interval);
  }, [frontCardImage]);

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
    setPlayerName("");
    setShowNameDialog(false);
  };

  const handleCardClick = (clickedCard: CardItem) => {
    if (flippedCards.length === 2 || clickedCard.flipped || clickedCard.matched || disableCards) {
      return;
    }

    const updatedCards = cards.map(card =>
      card.id === clickedCard.id ? { ...card, flipped: true } : card
    );
    setCards(updatedCards);

    const newFlippedCards = [...flippedCards, clickedCard];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      setDisableCards(true);

      const [firstCard, secondCard] = newFlippedCards;

      if (firstCard.imageUrl === secondCard.imageUrl) {
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

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) {
      toast({ title: "Informe seu nome para salvar no ranking!", variant: "destructive" });
      return;
    }

    setSaving(true);

    // Salva os dados no ranking do Supabase
    const { error } = await supabase.from("ranking").insert({
      player_name: playerName.trim(),
      score,
      moves,
      time_seconds: time
    });

    setSaving(false);

    if (error) {
      toast({ title: "Erro ao salvar ranking!", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Pontuação salva!", description: "Seu resultado foi registrado no ranking." });
    setShowNameDialog(false);
    setTimeout(() => {
      startNewGame();
    }, 1200);
  };

  const gridCols = isMobile ? "grid-cols-3" : "grid-cols-4";

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

      {/* Modal para nome do jogador ao vencer o jogo */}
      <Dialog open={showNameDialog} onOpenChange={open => setShowNameDialog(open)}>
        <DialogContent className="max-w-xs mx-auto">
          <DialogHeader>
            <DialogTitle>Parabéns, você venceu!</DialogTitle>
            <DialogDescription>Informe seu nome para aparecer no ranking.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleNameSubmit} className="space-y-3">
            <Input
              required
              autoFocus
              placeholder="Seu nome"
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              disabled={saving}
              maxLength={40}
            />
            <DialogFooter>
              <Button type="submit" disabled={saving} className="w-full">
                {saving ? "Salvando..." : "Salvar no ranking"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
