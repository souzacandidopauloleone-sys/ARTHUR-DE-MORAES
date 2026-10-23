/* =========================================================
   SITE OFICIAL — ATLETA DE KICKBOXING
   Comportamentos de todas as páginas.
   O site funciona mesmo se este arquivo não carregar.
   ========================================================= */

/* ---------- CONFIGURAÇÃO ----------
   Endereço oficial do Instagram, usado em todos os botões "Instagram oficial".
   Se mudar, altere aqui E nos links do index.html (Ctrl+H no VS Code)
   trocando o endereço antigo pelo novo. */
const INSTAGRAM = 'https://www.instagram.com/moraes.kbx/';

document.querySelectorAll('[data-instagram]').forEach((link) => {
  link.href = INSTAGRAM;
});

const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Cabeçalho: fundo sólido ao rolar e menu do celular ---------- */
const cabecalho = document.querySelector('.cabecalho');
const botaoMenu = document.querySelector('.abrir-menu');

if (cabecalho) {
  const marcarRolagem = () => cabecalho.classList.toggle('solido', window.scrollY > 40);
  marcarRolagem();
  window.addEventListener('scroll', marcarRolagem, { passive: true });
}

if (cabecalho && botaoMenu) {
  const rotulo = botaoMenu.querySelector('.sr-only');

  const definirMenu = (aberto) => {
    botaoMenu.setAttribute('aria-expanded', String(aberto));
    rotulo.textContent = aberto ? 'Fechar menu' : 'Abrir menu';
    cabecalho.classList.toggle('menu-aberto', aberto);
    document.body.style.overflow = aberto ? 'hidden' : '';
  };

  botaoMenu.addEventListener('click', () => definirMenu(botaoMenu.getAttribute('aria-expanded') !== 'true'));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cabecalho.classList.contains('menu-aberto')) {
      definirMenu(false);
      botaoMenu.focus();
    }
  });

  window.matchMedia('(min-width: 60em)').addEventListener('change', () => definirMenu(false));

  // Página única: ao tocar num item do menu, fecha o menu e rola até a seção
  document.querySelectorAll('.nav a').forEach((link) => link.addEventListener('click', () => definirMenu(false)));
}

/* ---------- Abertura: vídeo de luta em repetição ----------
   Começa em 5 s (pula a vinheta inicial do Instagram). Não toca para quem pediu
   menos movimento nem com economia de dados ligada: aí fica só a imagem de capa. */
const videoAbertura = document.querySelector('.abertura-video');
const INICIO_VIDEO = 5;

if (videoAbertura && !reduzirMovimento && !navigator.connection?.saveData) {
  // Repetição infinita e sem pausa: o próprio navegador emenda o fim no começo (loop),
  // e logo na volta pulamos a vinheta dos primeiros segundos.
  videoAbertura.loop = true;
  videoAbertura.preload = 'auto';
  const tocar = () => videoAbertura.play().catch(() => {});
  videoAbertura.addEventListener('timeupdate', () => {
    if (videoAbertura.currentTime < INICIO_VIDEO) videoAbertura.currentTime = INICIO_VIDEO;
  });
  videoAbertura.addEventListener('loadedmetadata', tocar, { once: true });
  if (videoAbertura.readyState >= 1) tocar();
  // Se o navegador pausar por conta própria (ex.: ao voltar para a aba), retoma
  videoAbertura.addEventListener('pause', () => setTimeout(tocar, 100));
  document.addEventListener('visibilitychange', () => !document.hidden && tocar());
}

/* ---------- Abertura: fotos em sequência (quadro e fundo trocam juntos) ---------- */
const quadros = document.querySelectorAll('.quadro-slide');
const fundos = document.querySelectorAll('.fundo-slide');
const marcas = document.querySelectorAll('.quadro-progresso span');
const DURACAO = 5500;

if (fundos.length > 1 && !reduzirMovimento) {
  let atual = 0;
  let timer;

  const mostrar = (i) => {
    [quadros, fundos].forEach((lista) =>
      lista.forEach((img, n) => {
        img.classList.toggle('ativo', n === i);
        if (n === i) img.loading = 'eager';
      }),
    );
    marcas.forEach((m, n) => {
      m.classList.toggle('feito', n < i);
      m.classList.remove('atual');
      if (n === i) {
        void m.offsetWidth; // reinicia a animação da barra
        m.classList.add('atual');
      }
    });
  };

  const iniciar = () => {
    clearInterval(timer);
    timer = setInterval(() => {
      atual = (atual + 1) % fundos.length;
      mostrar(atual);
    }, DURACAO);
  };

  document.documentElement.style.setProperty('--duracao-slide', `${DURACAO}ms`);
  mostrar(0);
  iniciar();

  // Pausa quando a aba não está visível, para não gastar bateria
  document.addEventListener('visibilitychange', () => (document.hidden ? clearInterval(timer) : iniciar()));
}

/* ---------- Revelação dos elementos marcados com data-revelar ---------- */
const alvos = document.querySelectorAll('[data-revelar]');

if (reduzirMovimento || !('IntersectionObserver' in window)) {
  alvos.forEach((el) => el.classList.add('visivel'));
} else {
  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('visivel');
          observador.unobserve(entrada.target);
        }
      });
    },
    { rootMargin: '0px 0px -10% 0px' },
  );
  alvos.forEach((el) => observador.observe(el));
}

/* ---------- Contadores animados (só números reais escritos no HTML) ---------- */
const numeros = document.querySelectorAll('[data-contar]');

if (!reduzirMovimento && 'IntersectionObserver' in window) {
  const observadorNumeros = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      const el = entrada.target;
      const final = Number(el.textContent);
      const inicio = performance.now();
      const passo = (agora) => {
        const p = Math.min((agora - inicio) / 900, 1);
        el.textContent = String(Math.round(final * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(passo);
      };
      requestAnimationFrame(passo);
      observadorNumeros.unobserve(el);
    });
  });
  numeros.forEach((el) => observadorNumeros.observe(el));
}

/* ---------- Esteira de fotos: duplica a lista para o giro não ter emenda ---------- */
const faixa = document.querySelector('.esteira-faixa');

if (faixa && !reduzirMovimento) {
  [...faixa.children].forEach((item) => {
    const copia = item.cloneNode(true);
    copia.setAttribute('aria-hidden', 'true'); // leitores de tela leem cada foto uma vez só
    copia.querySelectorAll('button').forEach((b) => (b.tabIndex = -1));
    faixa.appendChild(copia);
  });
  // Velocidade constante: cerca de 60 px por segundo, qualquer que seja a quantidade de fotos
  const ajustar = () => faixa.style.setProperty('--duracao-esteira', `${faixa.scrollWidth / 2 / 60}s`);
  ajustar();
  window.addEventListener('load', ajustar);
  faixa.classList.add('girando');
}

/* ---------- Galeria: ampliar foto ---------- */
const visor = document.querySelector('.visor');

if (visor) {
  const imagemVisor = visor.querySelector('img');

  document.querySelectorAll('[data-ampliar]').forEach((botao) => {
    botao.addEventListener('click', () => {
      const foto = botao.querySelector('img');
      imagemVisor.src = botao.dataset.ampliar;
      imagemVisor.alt = foto ? foto.alt : '';
      visor.showModal();
    });
  });

  // Fecha ao clicar fora da foto
  visor.addEventListener('click', (e) => {
    if (e.target === visor) visor.close();
  });
}
