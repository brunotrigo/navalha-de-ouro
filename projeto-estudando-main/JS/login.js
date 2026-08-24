/* =========================================================
   login.js — autenticação com dados do localStorage
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-login");
  const erro = document.getElementById("erro-login");

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    erro.textContent = "";
    try {
      const usuario = autenticar(
        document.getElementById("login").value,
        document.getElementById("senha").value
      );
      avisar("Bem-vindo de volta, " + usuario.nome.split(" ")[0] + "!");
      setTimeout(function () { location.href = rotaPagina("painel.html"); }, 600);
    } catch (e) {
      erro.textContent = e.message;
      avisar(e.message, "erro");
    }
  });
});
