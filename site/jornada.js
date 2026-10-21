// Regra da jornada: o que está liberado, o que está feito, quanto falta.
// Não toca em DOM nem em armazenamento; recebe e devolve estado puro.

import { PASSOS, PLANOS, MENUS } from "./conteudo.js";

export function estadoInicial() {
  return { plano: null, concluidos: [], idioma: "pt" };
}

export function planoAceitaPlugins(planoId) {
  return PLANOS.some((p) => p.id === planoId && p.aceitaPlugins);
}

export function escolherPlano(estado, planoId) {
  // Trocar de plano refaz a jornada: uma conta Free não pode herdar passos de outra.
  const concluidos = planoAceitaPlugins(planoId) ? ["plano"] : [];
  return { ...estado, plano: planoId, concluidos };
}

export function escolherIdioma(estado, idioma) {
  return idioma in MENUS ? { ...estado, idioma } : estado;
}

export function concluirPasso(estado, passoId) {
  if (!passoLiberado(estado, passoId) || estado.concluidos.includes(passoId)) {
    return estado;
  }
  return { ...estado, concluidos: [...estado.concluidos, passoId] };
}

export function desfazerPasso(estado, passoId) {
  // Desfazer um passo desfaz também os seguintes, que dependiam dele.
  const indice = PASSOS.findIndex((p) => p.id === passoId);
  const mantidos = PASSOS.slice(0, indice).map((p) => p.id);
  return { ...estado, concluidos: estado.concluidos.filter((id) => mantidos.includes(id)) };
}

export function passoLiberado(estado, passoId) {
  const indice = PASSOS.findIndex((p) => p.id === passoId);
  if (indice <= 0) return indice === 0;
  return PASSOS.slice(0, indice).every((p) => estado.concluidos.includes(p.id));
}

export function progresso(estado) {
  const feitos = PASSOS.filter((p) => estado.concluidos.includes(p.id)).length;
  return { feitos, total: PASSOS.length, completo: feitos === PASSOS.length };
}

export function estadoValido(estado) {
  return (
    estado !== null &&
    typeof estado === "object" &&
    (estado.plano === null || PLANOS.some((p) => p.id === estado.plano)) &&
    estado.idioma in MENUS &&
    Array.isArray(estado.concluidos) &&
    estado.concluidos.every((id) => PASSOS.some((p) => p.id === id))
  );
}
