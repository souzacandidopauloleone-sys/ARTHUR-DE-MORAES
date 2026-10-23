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
   Toca de 5 s a 47,8 s (pula as vinhetas do Instagram no início e no fim). Não toca para quem pediu
   menos movimento nem com economia de dados ligada: aí fica só a imagem de capa. */
const videoAbertura = document.querySelector('.abertura-video');
const INICIO_VIDEO = 5;
const FIM_VIDEO = 47.8; // a vinheta final do Instagram começa por volta dos 48 s

if (videoAbertura && !reduzirMovimento && !navigator.connection?.saveData) {
  // Repetição infinita e sem pausa: o próprio navegador emenda o fim no começo (loop),
  // e logo na volta pulamos a vinheta dos primeiros segundos.
  videoAbertura.loop = true;
  videoAbertura.preload = 'auto';
  const tocar = () => videoAbertura.play().catch(() => {});
  videoAbertura.addEventListener('timeupdate', () => {
    const t = videoAbertura.currentTime;
    if (t < INICIO_VIDEO || t >= FIM_VIDEO) videoAbertura.currentTime = INICIO_VIDEO;
  });
  videoAbertura.addEventListener('loadedmetadata', tocar, { once: true });
  if (videoAbertura.readyState >= 1) tocar();
  // Se o navegador pausar por conta própria (ex.: ao voltar para a aba), retoma
  videoAbertura.addEventListener('pause', () => setTimeout(tocar, 100));
  // Reforço do loop: se o vídeo chegar ao fim, volta ao início e continua tocando
  videoAbertura.addEventListener('ended', () => {
    videoAbertura.currentTime = 0;
    tocar();
  });
  document.addEventListener('visibilitychange', () => !document.hidden && tocar());

  // Celular: a tela estreita mostra só uma faixa do vídeo. O enquadramento desliza
  // suavemente atrás do Arthur, como uma câmera acompanhando a luta.
  // Posição horizontal dele no quadro (0 = esquerda, 1 = direita), a cada segundo.
  const POSICAO_ARTHUR = [
    [5, 0.44], [6, 0.59], [7, 0.46], [8, 0.66], [9, 0.73], [10, 0.82], [11, 0.63], [12, 0.62],
    [13, 0.57], [14, 0.3], [15, 0.17], [16, 0.2], [17, 0.69], [18, 0.69], [19, 0.78], [20, 0.76],
    [21, 0.6], [22, 0.46], [23, 0.36], [24, 0.42], [25, 0.79], [26, 0.85], [27, 0.85], [28, 0.92],
    [29, 0.79], [30, 0.58], [31, 0.9], [32, 0.69], [33, 0.4], [34, 0.46], [35, 0.5], [36, 0.5],
    [37, 0.42], [38, 0.69], [39, 0.6], [40, 0.36], [41, 0.27], [42, 0.35], [43, 0.54], [44, 0.77],
    [45, 0.72], [46, 0.69], [47, 0.57], [48, 0.57],
  ];

  const posicaoNoTempo = (t) => {
    const i = POSICAO_ARTHUR.findIndex(([s]) => s > t);
    if (i <= 0) return POSICAO_ARTHUR[i === 0 ? 0 : POSICAO_ARTHUR.length - 1][1];
    const [t0, x0] = POSICAO_ARTHUR[i - 1];
    const [t1, x1] = POSICAO_ARTHUR[i];
    return x0 + ((x1 - x0) * (t - t0)) / (t1 - t0);
  };

  let enquadramento = null;
  const acompanhar = () => {
    const proporcaoTela = videoAbertura.clientWidth / videoAbertura.clientHeight;
    const proporcaoVideo = (videoAbertura.videoWidth || 1018) / (videoAbertura.videoHeight || 576);
    const visivel = proporcaoTela / proporcaoVideo; // fração da largura do vídeo que cabe na tela
    if (visivel < 0.8) {
      const centro = posicaoNoTempo(videoAbertura.currentTime);
      const alvo = Math.min(1, Math.max(0, (centro - visivel / 2) / (1 - visivel)));
      // Aproxima aos poucos do alvo: movimento suave, sem trancos
      enquadramento = enquadramento === null ? alvo : enquadramento + (alvo - enquadramento) * 0.06;
      videoAbertura.style.objectPosition = `${(enquadramento * 100).toFixed(2)}% 45%`;
    } else if (enquadramento !== null) {
      enquadramento = null;
      videoAbertura.style.objectPosition = '';
    }
    requestAnimationFrame(acompanhar);
  };
  requestAnimationFrame(acompanhar);
}

/* ---------- Vídeos contínuos (data-continuo): sem som, sem botões e sem pausa ----------
   data-inicio e data-fim (em segundos) limitam o trecho que se repete. */
document.querySelectorAll('video[data-continuo]').forEach((v) => {
  const inicio = parseFloat(v.dataset.inicio) || 0;
  const fim = parseFloat(v.dataset.fim) || Infinity;
  const tocar = () => v.play().catch(() => {});
  v.muted = true;
  v.addEventListener('volumechange', () => {
    if (!v.muted) v.muted = true;
  });
  v.addEventListener('timeupdate', () => {
    if (v.currentTime < inicio || v.currentTime >= fim) v.currentTime = inicio;
  });
  v.addEventListener('pause', () => setTimeout(tocar, 100));
  v.addEventListener('ended', () => {
    v.currentTime = inicio;
    tocar();
  });
  document.addEventListener('visibilitychange', () => !document.hidden && tocar());
  tocar();
});

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
