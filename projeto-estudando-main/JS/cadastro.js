/* =========================================================
   cadastro.js — máscaras, ViaCEP e validações do formulário
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-cadastro");
  const campo = (id) => document.getElementById(id);

  /* ---------- máscaras em tempo real ---------- */
  campo("cpf").addEventListener("input", function (e) {
    e.target.value = mascaraCPF(e.target.value);
  });
  campo("cep").addEventListener("input", function (e) {
    e.target.value = mascaraCEP(e.target.value);
  });
  ["fixo", "celular"].forEach(function (id) {
    campo(id).addEventListener("input", function (e) {
      e.target.value = mascaraTelefone(e.target.value);
    });
  });

  /* ---------- busca de endereço pelo CEP ---------- */
  campo("cep").addEventListener("blur", async function () {
    if (campo("cep").value.replace(/\D/g, "").length !== 8) return;
    const carregando = document.getElementById("carregando-cep");
    carregando.classList.remove("oculto");
    try {
      const endereco = await buscarCEP(campo("cep").value);
      campo("rua").value = endereco.rua;
      campo("bairro").value = endereco.bairro;
      campo("cidade").value = endereco.cidade;
      campo("uf").value = endereco.uf;
      mostrarErro("cep", "");
      avisar("Endereço preenchido automaticamente.");
    } catch (erro) {
      mostrarErro("cep", erro.message);
      avisar(erro.message, "erro");
    } finally {
      carregando.classList.add("oculto");
    }
  });

  /* ---------- exibição de erros ---------- */
  function mostrarErro(id, mensagem) {
    const alvo = document.querySelector('[data-erro="' + id + '"]');
    if (alvo) alvo.textContent = mensagem;
    const entrada = campo(id);
    if (entrada) entrada.setAttribute("aria-invalid", mensagem ? "true" : "false");
  }

  /* ---------- validação e envio ---------- */
  form.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const dados = {
      nome: campo("nome").value,
      cpf: campo("cpf").value,
      cep: campo("cep").value,
      rua: campo("rua").value,
      bairro: campo("bairro").value,
      cidade: campo("cidade").value,
      uf: campo("uf").value,
      fixo: campo("fixo").value,
      celular: campo("celular").value,
      email: campo("email").value,
      login: campo("login").value,
      senha: campo("senha").value,
    };

    const erros = {};
    if (!nomeValido(dados.nome)) erros.nome = "Informe entre 15 e 80 caracteres, apenas letras e espaços.";
    if (!validarCPF(dados.cpf)) erros.cpf = "CPF inválido (dígito verificador não confere).";
    if (dados.cep.replace(/\D/g, "").length !== 8) erros.cep = "CEP inválido.";
    if (!dados.rua.trim()) erros.rua = "Preencha o CEP para carregar o endereço.";
    if (!telefoneValido(dados.fixo)) erros.fixo = "Use o formato (+55)XX-XXXXXXXX.";
    if (!telefoneValido(dados.celular)) erros.celular = "Use o formato (+55)XX-XXXXXXXXX.";
    if (!emailValido(dados.email)) erros.email = "E-mail inválido.";
    if (!loginValido(dados.login)) erros.login = "Exatamente 6 caracteres alfabéticos.";
    if (!senhaValida(dados.senha)) erros.senha = "Exatamente 8 caracteres alfabéticos.";
    if (campo("confirmacao").value !== dados.senha) erros.confirmacao = "A confirmação não confere com a senha.";

    ["nome","cpf","cep","rua","fixo","celular","email","login","senha","confirmacao"]
      .forEach(function (id) { mostrarErro(id, erros[id] || ""); });

    if (Object.keys(erros).length) {
      avisar("Revise os campos destacados antes de continuar.", "erro");
      return;
    }

    try {
      salvarUsuario(dados);
      avisar("Cadastro concluído! Faça login para continuar.");
      setTimeout(function () { location.href = rotaPagina("login.html"); }, 800);
    } catch (erro) {
      mostrarErro("login", erro.message);
      avisar(erro.message, "erro");
    }
  });
});
