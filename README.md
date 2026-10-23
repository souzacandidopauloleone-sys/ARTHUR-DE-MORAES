# Site oficial do atleta de kickboxing

Site estático feito com [Astro](https://astro.build). Não tem banco de dados nem servidor: o resultado
é uma pasta de arquivos HTML que pode ser hospedada de graça.

## Comandos

| Comando           | O que faz                                                        |
| ----------------- | ---------------------------------------------------------------- |
| `npm install`     | Instala as dependências (só na primeira vez)                     |
| `npm run dev`     | Abre o site em http://localhost:4321 com os avisos de "pendente" |
| `npm run build`   | Gera o site final na pasta `dist/`                               |
| `npm run preview` | Mostra o site final gerado, como ficará publicado                |

## Onde atualizar cada coisa

| O quê                                                 | Onde                                                        |
| ----------------------------------------------------- | ----------------------------------------------------------- |
| Nome, categoria, textos, Instagram, contato, domínio  | `src/config/site.ts`                                        |
| Fotos da abertura                                     | `src/assets/abertura/horizontal.jpg` e `vertical.jpg`       |
| Texto alternativo da foto da abertura                 | `src/assets/abertura/descricao.txt`                         |
| Um campeonato novo (ou próximo evento)                | novo arquivo em `src/content/campeonatos/` (copie `_modelo.json`) |
| Uma foto ou vídeo na galeria                          | imagem em `src/assets/galeria/` + arquivo em `src/content/galeria/` |
| Vídeos                                                | `public/videos/` (já comprimidos)                           |
| Logos de patrocinadores autorizados                   | `public/parceiros/` + lista em `src/config/site.ts`         |
| Mídia kit em PDF                                      | `public/` + caminho em `src/config/site.ts`                 |

### Regras de conteúdo

- Campeonatos só aparecem com `"confirmado": true`.
- Fotos da galeria só aparecem com `"aprovado": true`.
- Somente fotos e vídeos de luta, competição e premiação. Nada pessoal.
- Nunca colocar telefone do atleta, endereço, escola ou dados pessoais.
- Enquanto `url` em `site.ts` for o domínio provisório, o site pede ao Google para **não** indexar.

### Resultados aceitos em campeonatos

`ouro` (1º lugar), `prata` (2º), `bronze` (3º), `participacao`, `a-disputar` (evento futuro).
O dourado do site é reservado ao pódio e à ação principal.
