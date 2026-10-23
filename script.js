/* =========================================================
   SITE OFICIAL — ATLETA DE KICKBOXING
   Comportamentos do site. Depois de editar, gere de novo o script.min.js.
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
   O arquivo já vem cortado (sem as vinhetas do Instagram), sem som e com a cor ajustada.
   Não toca para quem pediu menos movimento nem com economia de dados ligada: aí fica só a imagem de capa. */
const videoAbertura = document.querySelector('.abertura-video');

if (videoAbertura && !reduzirMovimento && !navigator.connection?.saveData) {
  // Repetição infinita: o próprio navegador emenda o fim no começo (loop)
  videoAbertura.loop = true;
  videoAbertura.preload = 'auto';
  const tocar = () => videoAbertura.play().catch(() => {});
  videoAbertura.addEventListener('loadedmetadata', tocar, { once: true });
  if (videoAbertura.readyState >= 1) tocar();
  // Ao voltar para a aba, retoma
  document.addEventListener('visibilitychange', () => !document.hidden && tocar());

  // Tela estreita (celular): ela mostra só uma faixa do vídeo. O enquadramento desliza
  // suavemente atrás do Arthur, como uma câmera acompanhando a luta.
  // Posição horizontal dele no quadro (0 = esquerda, 1 = direita), a cada segundo.
  const POSICAO_ARTHUR = [
    [0, 0.44], [1, 0.59], [2, 0.46], [3, 0.66], [4, 0.73], [5, 0.82], [6, 0.63], [7, 0.62],
    [8, 0.57], [9, 0.3], [10, 0.17], [11, 0.2], [12, 0.69], [13, 0.69], [14, 0.78], [15, 0.76],
    [16, 0.6], [17, 0.46], [18, 0.36], [19, 0.42], [20, 0.79], [21, 0.85], [22, 0.85], [23, 0.92],
    [24, 0.79], [25, 0.58], [26, 0.9], [27, 0.69], [28, 0.4], [29, 0.46], [30, 0.5], [31, 0.5],
    [32, 0.42], [33, 0.69], [34, 0.6], [35, 0.36], [36, 0.27], [37, 0.35], [38, 0.54], [39, 0.77],
    [40, 0.72], [41, 0.69], [42, 0.57], [43, 0.57],
  ];

  const posicaoNoTempo = (t) => {
    const i = POSICAO_ARTHUR.findIndex(([s]) => s > t);
    if (i <= 0) return POSICAO_ARTHUR[i === 0 ? 0 : POSICAO_ARTHUR.length - 1][1];
    const [t0, x0] = POSICAO_ARTHUR[i - 1];
    const [t1, x1] = POSICAO_ARTHUR[i];
    return x0 + ((x1 - x0) * (t - t0)) / (t1 - t0);
  };

  let enquadramento = null;
  let visivel = 1; // fração da largura do vídeo que cabe na tela
  let aberturaNaTela = true;
  let rodando = false;

  const quadro = () => {
    if (!rodando) return;
    const centro = posicaoNoTempo(videoAbertura.currentTime);
    const alvo = Math.min(1, Math.max(0, (centro - visivel / 2) / (1 - visivel)));
    // Aproxima aos poucos do alvo: movimento suave, sem trancos
    enquadramento = enquadramento === null ? alvo : enquadramento + (alvo - enquadramento) * 0.06;
    videoAbertura.style.objectPosition = `${(enquadramento * 100).toFixed(2)}% 45%`;
    requestAnimationFrame(quadro);
  };

  // O laço de animação só roda com a abertura na tela e a tela estreita
  const atualizarLaco = () => {
    const deve = aberturaNaTela && visivel < 0.8;
    if (deve && !rodando) {
      rodando = true;
      requestAnimationFrame(quadro);
    } else if (!deve) {
      rodando = false;
    }
  };

  const medir = () => {
    const proporcaoTela = videoAbertura.clientWidth / videoAbertura.clientHeight;
    const proporcaoVideo = (videoAbertura.videoWidth || 1018) / (videoAbertura.videoHeight || 576);
    visivel = proporcaoTela / proporcaoVideo;
    if (visivel >= 0.8 && enquadramento !== null) {
      enquadramento = null;
      videoAbertura.style.objectPosition = '';
    }
    atualizarLaco();
  };

  new ResizeObserver(medir).observe(videoAbertura);
  videoAbertura.addEventListener('loadedmetadata', medir);
  new IntersectionObserver(([entrada]) => {
    aberturaNaTela = entrada.isIntersecting;
    atualizarLaco();
  }).observe(videoAbertura);
}

/* ---------- Vídeos contínuos (data-continuo): sem som, sem botões e sem pausa ----------
   Só carregam e tocam quando aparecem na tela; ao sair, pausam. */
const videosContinuos = document.querySelectorAll('video[data-continuo]');

if (videosContinuos.length) {
  const tocarVideo = (v) => v.play().catch(() => {});
  const naTela = new Set();
  const observadorVideos = new IntersectionObserver((entradas) => {
    entradas.forEach(({ target: v, isIntersecting }) => {
      if (isIntersecting) {
        naTela.add(v);
        tocarVideo(v);
      } else {
        naTela.delete(v);
        v.pause();
      }
    });
  });
  videosContinuos.forEach((v) => {
    v.muted = true;
    observadorVideos.observe(v);
  });
  // Ao voltar para a aba, retoma os que estão na tela
  document.addEventListener('visibilitychange', () => !document.hidden && naTela.forEach(tocarVideo));
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
