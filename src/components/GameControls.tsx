
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RotateCcw, Trophy } from "lucide-react";

interface GameControlsProps {
  moves: number;
  time: number;
  score: number;
  onReset: () => void;
  gameOver: boolean;
  className?: string;
}

export default function GameControls({ 
  moves, 
  time, 
  score, 
  onReset, 
  gameOver,
  className
}: GameControlsProps) {
  // Formata o tempo em minutos e segundos
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn("flex flex-col space-y-4", className)}>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-white rounded-lg p-2 shadow">
          <div className="text-sm text-gray-500">Tempo</div>
          <div className="text-lg font-bold">{formatTime(time)}</div>
        </div>
        
        <div className="bg-white rounded-lg p-2 shadow">
          <div className="text-sm text-gray-500">Movimentos</div>
          <div className="text-lg font-bold">{moves}</div>
        </div>
        
        <div className="bg-white rounded-lg p-2 shadow">
          <div className="text-sm text-gray-500">Pontos</div>
          <div className="text-lg font-bold">{score}</div>
        </div>
      </div>

      <Button
        onClick={onReset}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all shadow-md"
      >
        <RotateCcw className="mr-2 h-4 w-4" /> Novo Jogo
      </Button>
      
      {gameOver && (
        <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-3 rounded-lg animate-bounce flex items-center justify-center">
          <Trophy className="mr-2 h-5 w-5" />
          <span className="font-bold">Parabéns! Você venceu!</span>
        </div>
      )}
    </div>
  );
}
