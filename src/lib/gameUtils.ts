
import { useEffect, useState } from "react";

export interface CardItem {
  id: number;
  imageUrl: string;
  flipped: boolean;
  matched: boolean;
}

// Função para embaralhar um array
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Função para criar pares de cards a partir das URLs de imagens
export function createCardPairs(images: string[]): CardItem[] {
  let id = 0;
  const cards: CardItem[] = [];
  
  // Cria dois cards para cada imagem (para formar pares)
  images.forEach(imageUrl => {
    for (let i = 0; i < 2; i++) {
      cards.push({
        id: id++,
        imageUrl,
        flipped: false,
        matched: false
      });
    }
  });
  
  // Retorna os cards embaralhados
  return shuffleArray(cards);
}

// Hook para salvar e carregar dados do jogo
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

// Hook para controlar o tempo de jogo
export function useTimer(isRunning: boolean): [number, () => void] {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: number | null = null;
    
    if (isRunning) {
      interval = window.setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const resetTimer = () => setSeconds(0);
  
  return [seconds, resetTimer];
}

// Função para verificar se o jogo acabou
export function isGameOver(cards: CardItem[]): boolean {
  return cards.every(card => card.matched);
}
