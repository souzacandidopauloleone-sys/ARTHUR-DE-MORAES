/**
 * CONFIGURAÇÃO CENTRAL DO SITE
 *
 * Este é o único lugar para atualizar nome, links e contatos.
 * Campos vazios ("") aparecem no site como "pendente" e somem dos metadados.
 * Preencha somente com informações confirmadas e autorizadas pelo responsável.
 */

export const site = {
  /** Endereço final do site. Trocar quando o domínio for definido (Etapa 5). */
  url: 'https://dominio-pendente.com.br',

  atleta: {
    /** Nome oficial, como deve aparecer em destaque. PENDENTE. */
    nome: '',
    /** Nome curto para o menu (ex.: sobrenome). PENDENTE. */
    nomeCurto: '',
    modalidade: 'Kickboxing',
    /** Ex.: "Juvenil · até 45 kg". PENDENTE. */
    categoria: '',
    /** Cidade e estado de representação (nunca endereço). PENDENTE. */
    cidade: '',
    /** Uma ou duas frases de apresentação esportiva. PENDENTE. */
    apresentacao: '',
    /** Academia e treinador, somente após autorização deles. PENDENTE. */
    academia: '',
    treinador: '',
  },

  /** Textos da página "Sobre". Cada item é um parágrafo. PENDENTES. */
  historia: {
    resumo: '',
    inicio: [] as string[],
    evolucao: [] as string[],
    objetivos: [] as string[],
  },

  patrocinio: {
    /** O que a marca parceira recebe, conforme combinado pelo responsável. PENDENTE. */
    contrapartidas: [] as string[],
    /**
     * Somente marcas que AUTORIZARAM aparecer no site.
     * Logo em public/parceiros/, ex.: { nome: 'Marca', logo: '/parceiros/marca.svg', url: 'https://...' }
     */
    parceiros: [] as { nome: string; logo: string; url?: string }[],
  },

  instagram: {
    usuario: '@moraes.kbx',
    url: 'https://www.instagram.com/moraes.kbx/',
  },

  /** Contato comercial do RESPONSÁVEL. Nunca o telefone do atleta. */
  contato: {
    nomeResponsavel: '',
    email: '',
    /** Somente dígitos com DDI e DDD, ex.: "5511999999999". */
    whatsapp: '',
    mensagemWhatsapp:
      'Olá! Represento uma empresa e tenho interesse em conversar sobre patrocínio ao atleta.',
  },

  /** Mídia kit em PDF: colocar em public/ e informar o caminho, ex.: "/midia-kit.pdf". */
  midiaKit: '',
} as const;

export const nomeExibicao = site.atleta.nome || 'Nome do atleta';
export const pendente = (valor: string) => valor.trim() === '';

export const whatsappLink = () =>
  site.contato.whatsapp
    ? `https://wa.me/${site.contato.whatsapp}?text=${encodeURIComponent(site.contato.mensagemWhatsapp)}`
    : '';

export const navegacao = [
  { href: '/sobre/', rotulo: 'Sobre' },
  { href: '/conquistas/', rotulo: 'Conquistas' },
  { href: '/campeonatos/', rotulo: 'Campeonatos' },
  { href: '/galeria/', rotulo: 'Galeria' },
  { href: '/patrocinio/', rotulo: 'Patrocínio' },
  { href: '/contato/', rotulo: 'Contato' },
];
