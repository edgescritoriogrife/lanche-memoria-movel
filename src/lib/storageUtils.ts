
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

// Chave para armazenamento local das imagens
const STORAGE_KEY = 'memory-game-images';

// Função para carregar imagens do armazenamento local
export function loadImages(): string[] {
  if (typeof window === 'undefined') {
    return DEFAULT_IMAGES;
  }
  
  try {
    const savedImages = localStorage.getItem(STORAGE_KEY);
    if (savedImages) {
      return JSON.parse(savedImages);
    }
  } catch (error) {
    console.error('Erro ao carregar imagens:', error);
  }
  
  // Se não houver imagens salvas ou ocorrer um erro, usa as imagens padrão
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
