/* =========================================================
   layout.js — cabeçalho, rodapé, acessibilidade e avisos
   O cabeçalho/rodapé são injetados por JS para evitar
   repetir o mesmo HTML em todas as páginas.
   ========================================================= */

/* ---------- avisos (substitui bibliotecas de toast) ---------- */
function avisar(mensagem, tipo) {
  let caixa = document.getElementById("avisos");
  if (!caixa) {
    caixa = document.createElement("div");
    caixa.id = "avisos";
    document.body.appendChild(caixa);
  }
  const item = document.createElement("div");
  item.className = "aviso " + (tipo === "erro" ? "aviso--erro" : "aviso--ok");
  item.setAttribute("role", "status");
  item.textContent = mensagem;
  caixa.appendChild(item);
  setTimeout(function () { item.remove(); }, 4000);
}

/* ---------- cabeçalho ---------- */
function rotaPagina(pagina) {
  const emPaginaInterna = location.pathname.split("/").indexOf("HTML") !== -1;
  const destinoInicio = pagina.indexOf("index.html") === 0;

  if (emPaginaInterna) return destinoInicio ? "../../" + pagina : pagina;
  return destinoInicio ? pagina : "projeto-estudando-main/HTML/" + pagina;
}

function montarCabecalho() {
  const alvo = document.getElementById("cabecalho");
  if (!alvo) return;
  const usuario = usuarioLogado();

  const linksCliente = usuario
    ? '<a href="' + rotaPagina("painel.html") + '">Painel</a><a href="' + rotaPagina("feedback.html") + '">Feedback</a>'
    : "";

  const acoes = usuario
    ? '<span class="suave">Olá, <strong>' + usuario.nome.split(" ")[0] + "</strong></span>" +
      '<button class="botao botao--contorno" id="btn-sair" type="button">Sair</button>'
    : '<a class="botao botao--contorno" href="' + rotaPagina("login.html") + '">Entrar</a>' +
      '<a class="botao" href="' + rotaPagina("cadastro.html") + '">Criar conta</a>';

  alvo.className = "cabecalho";
  alvo.innerHTML =
    '<div class="container cabecalho__linha">' +
      '<a class="marca" href="' + rotaPagina("index.html") + '"><span class="marca__icone">✂</span>' +
        '<span class="fonte-display">Navalha <span class="texto-ouro">de Ouro</span></span></a>' +
      '<nav class="menu" id="menu-principal" aria-label="Navegação principal">' +
        '<a href="' + rotaPagina("index.html") + '">Início</a>' +
        '<div class="submenu">' +
          '<button type="button" class="menu__gatilho" aria-haspopup="true" aria-expanded="false">Serviços ▾</button>' +
          '<div class="submenu__lista">' +
            '<a href="' + rotaPagina("index.html#servicos-barbearia") + '">Barbearia</a>' +
            '<a href="' + rotaPagina("index.html#servicos-cabelo") + '">Cabeleireiro</a>' +
            '<a href="' + rotaPagina("index.html#servicos-estetica") + '">Estética &amp; Barba</a>' +
          "</div>" +
        "</div>" +
        '<a href="' + rotaPagina("index.html#equipe") + '">Equipe</a>' +
        '<a href="' + rotaPagina("index.html#contato") + '">Contato</a>' +
        linksCliente +
      "</nav>" +
      '<div class="cabecalho__acoes">' +
        '<div class="acessibilidade" role="toolbar" aria-label="Ferramentas de acessibilidade">' +
          '<button type="button" id="fonte-menos" aria-label="Diminuir fonte">−</button>' +
          "<span>A</span>" +
          '<button type="button" id="fonte-mais" aria-label="Aumentar fonte">+</button>' +
          '<button type="button" id="contraste" aria-label="Alternar contraste">◐</button>' +
        "</div>" +
        acoes +
        '<button type="button" class="botao-menu" id="abrir-menu" aria-label="Abrir menu" aria-expanded="false">☰</button>' +
      "</div>" +
    "</div>";

  const sair = document.getElementById("btn-sair");
  if (sair) {
    sair.addEventListener("click", function () {
      encerrarSessao();
      avisar("Sessão encerrada. Até a próxima!");
      setTimeout(function () { location.href = rotaPagina("index.html"); }, 400);
    });
  }

  document.getElementById("abrir-menu").addEventListener("click", function () {
    const menu = document.getElementById("menu-principal");
    menu.classList.toggle("aberto");
    this.setAttribute("aria-expanded", menu.classList.contains("aberto") ? "true" : "false");
  });

  const gatilhoSubmenu = document.querySelector(".menu__gatilho");
  if (gatilhoSubmenu) {
    gatilhoSubmenu.addEventListener("click", function () {
      const submenu = this.closest(".submenu");
      submenu.classList.toggle("aberto");
      this.setAttribute("aria-expanded", submenu.classList.contains("aberto") ? "true" : "false");
    });
  }

  iniciarAcessibilidade();
}

/* ---------- acessibilidade (fonte + contraste) ---------- */
const ESCALAS = [0.9, 1, 1.15, 1.3];

function iniciarAcessibilidade() {
  let indice = Number(localStorage.getItem("barbearia:escala") || 1);
  let claro = localStorage.getItem("barbearia:tema") === "claro";

  function aplicar() {
    document.documentElement.style.setProperty("--escala-fonte", String(ESCALAS[indice]));
    document.documentElement.classList.toggle("tema-claro", claro);
    localStorage.setItem("barbearia:escala", String(indice));
    localStorage.setItem("barbearia:tema", claro ? "claro" : "escuro");
  }

  document.getElementById("fonte-menos").addEventListener("click", function () {
    indice = Math.max(0, indice - 1); aplicar();
  });
  document.getElementById("fonte-mais").addEventListener("click", function () {
    indice = Math.min(ESCALAS.length - 1, indice + 1); aplicar();
  });
  document.getElementById("contraste").addEventListener("click", function () {
    claro = !claro; aplicar();
  });

  aplicar();
}

/* ---------- proteção de páginas restritas ---------- */
function exigirLogin() {
  const usuario = usuarioLogado();
  if (!usuario) {
    avisar("Faça login para acessar esta área.", "erro");
    setTimeout(function () { location.href = rotaPagina("login.html"); }, 800);
    return null;
  }
  return usuario;
}

document.addEventListener("DOMContentLoaded", function () {
  montarCabecalho();
});
