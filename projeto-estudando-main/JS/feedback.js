/* =========================================================
   feedback.js — formulário de interesse (área restrita)
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  if (!exigirLogin()) return;

  const investimento = document.getElementById("investimento");
  const valor = document.getElementById("valor-investimento");

  function atualizarValor() {
    valor.textContent = "R$ " + Number(investimento.value) * 25;
  }
  investimento.addEventListener("input", atualizarValor);
  atualizarValor();

  document.getElementById("form-feedback").addEventListener("submit", function (evento) {
    evento.preventDefault();

    const servico = document.getElementById("servico").value;
    if (!servico) {
      document.getElementById("erro-servico").textContent = "Escolha o serviço de maior interesse.";
      avisar("Escolha o serviço de maior interesse.", "erro");
      return;
    }
    document.getElementById("erro-servico").textContent = "";

    const extras = Array.prototype.slice
      .call(document.querySelectorAll('input[name="extras"]:checked'))
      .map(function (c) { return c.value; });

    salvarFeedback({
      servico: servico,
      profissional: document.querySelector('input[name="profissional"]:checked').value,
      satisfacao: Number(investimento.value),
      frequencia: document.querySelector('input[name="frequencia"]:checked').value,
      extras: extras,
      contato: document.getElementById("contato").checked,
      comentario: document.getElementById("comentario").value,
      enviadoEm: new Date().toISOString(),
    });

    avisar("Preferências registradas com sucesso!");
    setTimeout(function () { location.href = rotaPagina("meus-dados.html"); }, 600);
  });
});
