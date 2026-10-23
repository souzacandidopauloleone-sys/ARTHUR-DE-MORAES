import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Cada campeonato é um arquivo .json em src/content/campeonatos/.
 * Arquivos que começam com "_" são modelos e não aparecem no site.
 */
const campeonatos = defineCollection({
  loader: glob({ pattern: '[^_]*.json', base: './src/content/campeonatos' }),
  schema: ({ image }) =>
    z.object({
      evento: z.string(),
      /** Data no formato AAAA-MM-DD (ou AAAA-MM-01 se o dia não for confirmado). */
      data: z.coerce.date(),
      cidade: z.string().optional(),
      /** Ex.: "K1", "Low kick", "Full contact", "Point fighting". */
      modalidade: z.string().optional(),
      /** Ex.: "Juvenil · até 45 kg". */
      categoria: z.string().optional(),
      resultado: z.enum(['ouro', 'prata', 'bronze', 'participacao', 'a-disputar']),
      /** Título oficial conquistado, se houver. Ex.: "Campeão estadual". */
      titulo: z.string().optional(),
      foto: image().optional(),
      fotoAlt: z.string().optional(),
      /** Só aparece no site quando o responsável confirmar o resultado. */
      confirmado: z.boolean(),
    }),
});

/**
 * Cada foto ou vídeo da galeria é um arquivo .json em src/content/galeria/,
 * com a imagem em src/assets/galeria/. Somente conteúdo de luta, competição ou premiação.
 */
const galeria = defineCollection({
  loader: glob({ pattern: '[^_]*.json', base: './src/content/galeria' }),
  schema: ({ image }) =>
    z.object({
      tipo: z.enum(['foto', 'video']),
      imagem: image(),
      /** Vídeo otimizado em public/videos/, ex.: "/videos/final-2025.mp4". */
      video: z.string().optional(),
      alt: z.string(),
      legenda: z.string(),
      evento: z.string().optional(),
      data: z.coerce.date().optional(),
      /** Créditos do fotógrafo, quando houver. */
      credito: z.string().optional(),
      destaque: z.boolean().default(false),
      /** Precisa ser true para aparecer: aprovação do responsável. */
      aprovado: z.boolean(),
    }),
});

export const collections = { campeonatos, galeria };
