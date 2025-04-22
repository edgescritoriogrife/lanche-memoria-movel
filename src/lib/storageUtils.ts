
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

// Limite máximo de caracteres para uma imagem base64 (aproximadamente 100KB)
const MAX_IMAGE_SIZE = 100000;

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
    // Otimiza as imagens antes de salvar
    const optimizedImages = images.map(img => {
      if (img.length > MAX_IMAGE_SIZE && img.startsWith('data:image')) {
        return compressImage(img);
      }
      return img;
    });
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(optimizedImages));
  } catch (error) {
    console.error('Erro ao salvar imagens:', error);
    
    // Se falhar, tenta salvar menos imagens ou imagens menores
    try {
      // Primeiro tenta apenas com URLs, sem base64
      const urlOnlyImages = images.filter(img => !img.startsWith('data:image') || img.length < 10000);
      if (urlOnlyImages.length >= 2) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(urlOnlyImages));
        return;
      }
      
      // Se ainda não for suficiente, reduz para as últimas 8 imagens
      const reducedImages = images.slice(-8);
      const compressedImages = reducedImages.map(img => 
        img.startsWith('data:image') ? compressImage(img) : img
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(compressedImages));
    } catch (e) {
      console.error('Falha ao salvar imagens reduzidas:', e);
      // Como última tentativa, salva apenas as imagens padrão
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_IMAGES));
    }
  }
}

// Função para adicionar uma nova imagem
export function addImage(imageUrl: string): string[] {
  const currentImages = loadImages();
  
  // Se for uma imagem base64 grande, comprime antes de adicionar
  let processedImageUrl = imageUrl;
  if (imageUrl.length > MAX_IMAGE_SIZE && imageUrl.startsWith('data:image')) {
    processedImageUrl = compressImage(imageUrl);
  }
  
  const newImages = [...currentImages, processedImageUrl];
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
  // Uma implementação básica para reduzir o tamanho do base64
  const maxLength = MAX_IMAGE_SIZE;
  
  if (base64.length <= maxLength) return base64;
  
  // Se a imagem for grande demais, reduz a qualidade cortando parte da string
  // Isso é uma técnica simples; em produção, usaria canvas para redimensionar
  // Mantém o cabeçalho do base64 (ex: 'data:image/jpeg;base64,')
  const header = base64.substring(0, base64.indexOf(',') + 1);
  const imageData = base64.substring(base64.indexOf(',') + 1);
  
  // Reduz a quantidade de dados para economizar espaço
  // Quanto menor o fator, menor a qualidade
  const factor = maxLength / base64.length;
  const reducedData = imageData.substring(0, Math.floor(imageData.length * factor * 0.9));
  
  return header + reducedData;
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
    // Se for uma imagem base64 grande, comprime
    if (imageUrl.length > MAX_IMAGE_SIZE && imageUrl.startsWith('data:image')) {
      imageUrl = compressImage(imageUrl);
    }
    
    localStorage.setItem(FRONT_IMAGE_KEY, imageUrl);
  } catch (error) {
    console.error('Erro ao salvar imagem da frente:', error);
  }
}
