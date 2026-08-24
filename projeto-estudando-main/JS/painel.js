/* =========================================================
   painel.js — área restrita com dados do cliente
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  const cliente = exigirLogin();
  if (!cliente) return;

  const feedback = lerFeedback();
  const blocoPreferencias = feedback
    ? '<p class="suave">Formulário enviado em ' +
        new Date(feedback.enviadoEm).toLocaleString("pt-BR") + ".</p>" +
      '<a class="botao botao--contorno" style="margin-top:16px" href="' + rotaPagina("meus-dados.html") + '">Ver respostas</a>'
    : '<p class="suave">Você ainda não enviou o formulário de interesse. Leva menos de 1 minuto.</p>' +
      '<a class="botao" style="margin-top:16px" href="' + rotaPagina("feedback.html") + '">Preencher agora</a>';

  document.getElementById("conteudo-painel").innerHTML =
    '<span class="etiqueta-secao">Área do cliente</span>' +
    "<h1>Olá, " + cliente.nome.split(" ")[0] + "</h1>" +
    '<p class="suave">Confira seus dados e mantenha suas preferências atualizadas.</p>' +
    '<div class="grade grade--2">' +
      '<section class="superficie-vidro cartao">' +
        "<h2>Seus dados</h2>" +
        '<ul style="list-style:none; margin-top:16px; display:grid; gap:10px" class="suave">' +
          "<li>✉ " + cliente.email + "</li>" +
          "<li>☎ " + cliente.celular + " · " + cliente.fixo + "</li>" +
          "<li>⌖ " + cliente.rua + ", " + cliente.bairro + " — " +
            cliente.cidade + "/" + cliente.uf + " (" + cliente.cep + ")</li>" +
        "</ul>" +
      "</section>" +
      '<section class="superficie-vidro cartao">' +
        "<h2>Preferências</h2>" + blocoPreferencias +
      "</section>" +
    "</div>";
});
