// Efeitos de abertura: só aparência. Não conhece a jornada nem o progresso; se este arquivo
// falhar, o guia continua funcionando inteiro.

const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// A manchete "decodifica" como texto sendo gerado: cada letra passa por dígitos aleatórios
// até assentar, da esquerda para a direita. Dígitos porque têm largura parecida na Oswald,
// o que evita a linha dançar de tamanho durante o efeito.
function decodificarManchete() {
  const linhas = document.querySelectorAll(".hero h1 [data-texto]");
  const sorteio = "0123456789";
  linhas.forEach((el, indiceLinha) => {
    const final = el.dataset.texto;
    const inicio = performance.now() + 180 + indiceLinha * 140;
    const duracao = 900;
    function quadro(agora) {
      const t = Math.min(1, Math.max(0, (agora - inicio) / duracao));
      const assentadas = Math.floor(t * final.length);
      el.textContent = [...final]
        .map((c, i) => (i < assentadas || c === " " || c === "." ? c : sorteio[(Math.random() * 10) | 0]))
        .join("");
      if (t < 1) requestAnimationFrame(quadro);
      else el.textContent = final;
    }
    requestAnimationFrame(quadro);
  });
}

// O chip inclina de leve na direção do ponteiro, como uma peça física sobre a mesa.
// Valores vão direto para variáveis CSS num quadro de animação: nada de re-desenhar a página.
function inclinarChip() {
  const palco = document.querySelector(".chip-palco");
  const hero = document.querySelector(".hero");
  if (!palco || !hero || !window.matchMedia("(pointer: fine)").matches) return;
  let pendente = null;
  hero.addEventListener("pointermove", (e) => {
    const caixa = hero.getBoundingClientRect();
    const x = (e.clientX - caixa.left) / caixa.width - 0.5;
    const y = (e.clientY - caixa.top) / caixa.height - 0.5;
    if (pendente) cancelAnimationFrame(pendente);
    pendente = requestAnimationFrame(() => {
      palco.style.setProperty("--ry", `${(x * 10).toFixed(2)}deg`);
      palco.style.setProperty("--rx", `${(-y * 8).toFixed(2)}deg`);
    });
  });
  hero.addEventListener("pointerleave", () => {
    palco.style.setProperty("--ry", "0deg");
    palco.style.setProperty("--rx", "0deg");
  });
}

if (!semMovimento) {
  decodificarManchete();
  inclinarChip();
}
