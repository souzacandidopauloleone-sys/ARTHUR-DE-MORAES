import { getCollection, type CollectionEntry } from 'astro:content';

export type Campeonato = CollectionEntry<'campeonatos'>;

export const rotuloResultado = {
  ouro: '1º lugar',
  prata: '2º lugar',
  bronze: '3º lugar',
  participacao: 'Participação',
  'a-disputar': 'A disputar',
} as const;

export const podio = (c: Campeonato) => ['ouro', 'prata', 'bronze'].includes(c.data.resultado);

/** Somente campeonatos confirmados pelo responsável, do mais recente ao mais antigo. */
export async function campeonatosConfirmados() {
  const todos = await getCollection('campeonatos', (c) => c.data.confirmado);
  return todos.sort((a, b) => b.data.data.getTime() - a.data.data.getTime());
}

export async function separarCampeonatos() {
  const todos = await campeonatosConfirmados();
  const futuros = todos.filter((c) => c.data.resultado === 'a-disputar').reverse();
  const realizados = todos.filter((c) => c.data.resultado !== 'a-disputar');
  return { futuros, realizados, conquistas: realizados.filter(podio) };
}

export const formatarData = (data: Date) =>
  new Intl.DateTimeFormat('pt-BR', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(data);
