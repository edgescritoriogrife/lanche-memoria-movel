
// Lista padrão de imagens para o jogo de memória
const DEFAULT_IMAGES = [
  "/img/burger.jpg",
  "/img/pizza.jpg",
  "/img/fries.jpg",
  "/img/soda.jpg",
  "/img/ice-cream.jpg",
  "/img/sandwich.jpg",
  "/img/coffee.jpg",
  "/img/donut.jpg",
];

// Chaves para armazenamento local
const STORAGE_KEY = 'memory-game-images';
const FRONT_IMAGE_KEY = 'memory-game-front-image';
const DEFAULT_FRONT_IMAGE = "/img/card-back.jpg";

// Função para carregar imagens do armazenamento local
export function loadImages(): string[] {
  if (typeof window === 'undefined') {
    return DEFAULT_IMAGES;
  }
  
  try {
    const savedImages = localStorage.getItem(STORAGE_KEY);
    if (savedImages) {
      const parsedImages = JSON.parse(savedImages);
      if (Array.isArray(parsedImages) && parsedImages.length >= 2) {
        return parsedImages;
      }
    }
  } catch (error) {
    console.error('Erro ao carregar imagens:', error);
  }
  
  // Se não houver imagens salvas ou ocorrer um erro, usa as imagens padrão
  console.log("Usando imagens padrão:", DEFAULT_IMAGES);
  saveImages(DEFAULT_IMAGES);
  return DEFAULT_IMAGES;
}

// Função para salvar imagens no armazenamento local
export function saveImages(images: string[]): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
  } catch (error) {
    console.error('Erro ao salvar imagens:', error);
    // Tentar salvar apenas as últimas 8 imagens se ocorrer erro de cota
    if (images.length > 8) {
      const reducedImages = images.slice(-8);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reducedImages));
      } catch (e) {
        console.error('Ainda não foi possível salvar:', e);
      }
    }
  }
}

// Função para adicionar uma nova imagem
export function addImage(imageUrl: string): string[] {
  const currentImages = loadImages();
  const newImages = [...currentImages, imageUrl];
  saveImages(newImages);
  return newImages;
}

// Função para remover uma imagem
export function removeImage(imageUrl: string): string[] {
  const currentImages = loadImages();
  const newImages = currentImages.filter(url => url !== imageUrl);
  saveImages(newImages);
  return newImages;
}

// Função para converter um arquivo em base64
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

// Função para compressão básica de imagens base64
function compressImage(base64: string): string {
  // Uma implementação simples para reduzir o tamanho do base64
  // Na vida real, usaríamos canvas para redimensionar
  const maxLength = 30000;
  if (base64.length <= maxLength) return base64;
  
  // Cortar a string para economizar espaço (isso degradará a qualidade)
  return base64.substring(0, maxLength);
}

// Funções para gerenciar a imagem da frente do card
export function getFrontCardImage(): string {
  if (typeof window === 'undefined') {
    return DEFAULT_FRONT_IMAGE;
  }
  
  try {
    const savedImage = localStorage.getItem(FRONT_IMAGE_KEY);
    if (savedImage) {
      return savedImage;
    }
  } catch (error) {
    console.error('Erro ao carregar imagem da frente:', error);
  }
  
  return DEFAULT_FRONT_IMAGE;
}

export function setFrontCardImage(imageUrl: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.setItem(FRONT_IMAGE_KEY, imageUrl);
  } catch (error) {
    console.error('Erro ao salvar imagem da frente:', error);
  }
}
