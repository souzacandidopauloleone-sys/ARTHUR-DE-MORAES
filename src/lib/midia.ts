import type { ImageMetadata } from 'astro';

/**
 * Fotos da abertura: coloque em src/assets/abertura/ com estes nomes
 * (qualquer extensão jpg, jpeg, png ou webp):
 *   horizontal.jpg  → computador e tablets
 *   vertical.jpg    → celulares (opcional; se faltar, usa a horizontal)
 * E o texto alternativo em src/assets/abertura/descricao.txt.
 */
const fotos = import.meta.glob<{ default: ImageMetadata }>('../assets/abertura/*.{jpg,jpeg,png,webp}', {
  eager: true,
});
const textos = import.meta.glob<string>('../assets/abertura/descricao.txt', {
  eager: true,
  query: '?raw',
  import: 'default',
});

const buscar = (nome: string) =>
  Object.entries(fotos).find(([caminho]) => caminho.split('/').pop()!.startsWith(`${nome}.`))?.[1].default;

export const abertura = {
  horizontal: buscar('horizontal'),
  vertical: buscar('vertical') ?? buscar('horizontal'),
  alt: Object.values(textos)[0]?.trim() ?? '',
};
