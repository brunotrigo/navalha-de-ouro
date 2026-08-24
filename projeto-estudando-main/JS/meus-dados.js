/* =========================================================
   meus-dados.js — resumo das respostas do formulário
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  const cliente = exigirLogin();
  if (!cliente) return;

  const alvo = document.getElementById("conteudo-dados");
  const f = lerFeedback();

  if (!f) {
    alvo.innerHTML =
      '<div class="superficie-vidro cartao centro">' +
        "<h1>Nenhuma resposta encontrada</h1>" +
        '<p class="suave">Preencha o formulário de interesse para ver o resumo aqui.</p>' +
        '<a class="botao" style="margin-top:20px" href="' + rotaPagina("feedback.html") + '">Preencher formulário</a>' +
      "</div>";
    return;
  }

  const linhas = [
    ["Cliente", cliente.nome],
    ["Serviço de interesse", f.servico],
    ["Profissional", f.profissional],
    ["Investimento estimado", "R$ " + f.satisfacao * 25],
    ["Frequência", f.frequencia],
    ["Extras", f.extras.length ? f.extras.join(", ") : "Nenhum"],
    ["Contato por WhatsApp", f.contato ? "Autorizado" : "Não autorizado"],
    ["Comentários", f.comentario || "—"],
    ["Enviado em", new Date(f.enviadoEm).toLocaleString("pt-BR")],
  ];

  alvo.innerHTML =
    '<span class="etiqueta-secao">Confirmação</span>' +
    "<h1>Preferências registradas</h1>" +
    '<dl class="superficie-vidro resumo">' +
      linhas.map(function (l) {
        return '<div class="resumo__linha"><dt>' + l[0] + "</dt><dd>" + l[1] + "</dd></div>";
      }).join("") +
    "</dl>" +
    '<div style="display:flex; gap:8px; margin-top:24px">' +
      '<a class="botao botao--contorno" href="' + rotaPagina("feedback.html") + '">Editar respostas</a>' +
      '<a class="botao" href="' + rotaPagina("painel.html") + '">Voltar ao painel</a>' +
    "</div>";
});
