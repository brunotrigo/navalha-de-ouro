/* =========================================================
   dados.js — camada de dados (localStorage) e validações
   Nenhuma dependência externa: JavaScript puro.
   ========================================================= */

const CHAVE_USUARIOS = "barbearia:usuarios";
const CHAVE_SESSAO = "barbearia:sessao";
const CHAVE_FEEDBACK = "barbearia:feedback";

/* ---------- leitura/escrita genérica ---------- */
function ler(chave, padrao) {
  try {
    const bruto = localStorage.getItem(chave);
    return bruto ? JSON.parse(bruto) : padrao;
  } catch (e) {
    return padrao;
  }
}

function gravar(chave, valor) {
  localStorage.setItem(chave, JSON.stringify(valor));
}

/* ---------- usuários ---------- */
function listarUsuarios() {
  return ler(CHAVE_USUARIOS, []);
}

function salvarUsuario(usuario) {
  const usuarios = listarUsuarios();
  const existe = usuarios.some(function (u) {
    return u.login.toLowerCase() === usuario.login.toLowerCase();
  });
  if (existe) throw new Error("Já existe uma conta com este login.");
  usuarios.push(usuario);
  gravar(CHAVE_USUARIOS, usuarios);
}

function autenticar(login, senha) {
  const usuario = listarUsuarios().find(function (u) {
    return u.login.toLowerCase() === login.toLowerCase() && u.senha === senha;
  });
  if (!usuario) throw new Error("Login ou senha inválidos.");
  gravar(CHAVE_SESSAO, usuario.login);
  return usuario;
}

function encerrarSessao() {
  localStorage.removeItem(CHAVE_SESSAO);
}

function usuarioLogado() {
  const login = ler(CHAVE_SESSAO, null);
  if (!login) return null;
  return listarUsuarios().find(function (u) { return u.login === login; }) || null;
}

/* ---------- feedback (formulário de interesse) ---------- */
function salvarFeedback(feedback) {
  const login = ler(CHAVE_SESSAO, null);
  if (!login) return;
  const todos = ler(CHAVE_FEEDBACK, {});
  todos[login] = feedback;
  gravar(CHAVE_FEEDBACK, todos);
}

function lerFeedback() {
  const login = ler(CHAVE_SESSAO, null);
  if (!login) return null;
  return ler(CHAVE_FEEDBACK, {})[login] || null;
}

/* ---------- máscaras ---------- */
function mascaraCPF(v) {
  return v
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
}

function mascaraCEP(v) {
  return v.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");
}

/** Formato exigido pelo projeto: (+55)XX-XXXXXXXX */
function mascaraTelefone(v) {
  const d = v.replace(/\D/g, "").replace(/^55/, "").slice(0, 11);
  if (!d) return "";
  const ddd = d.slice(0, 2);
  const numero = d.slice(2);
  return numero ? "(+55)  " + ddd + "-" + numero : "(+55)  " + ddd;
}

/* ---------- validações ---------- */
function validarCPF(valor) {
  const cpf = valor.replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  function digito(base) {
    let soma = 0;
    for (let i = 0; i < base; i++) soma += Number(cpf[i]) * (base + 1 - i);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  }
  return digito(9) === Number(cpf[9]) && digito(10) === Number(cpf[10]);
}

const telefoneValido = (v) => /^\(\+55\)\d{2}-\d{8,9}$/.test(v);
const nomeValido = (v) => /^[A-Za-zÀ-ÿ\s]{15,80}$/.test(v.trim());
const loginValido = (v) => /^[A-Za-z]{6}$/.test(v);
const senhaValida = (v) => /^[A-Za-z]{8}$/.test(v);
const emailValido = (v) => /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(v);

/* ---------- consulta de CEP (API ViaCEP) ---------- */
async function buscarCEP(cep) {
  const limpo = cep.replace(/\D/g, "");
  if (limpo.length !== 8) throw new Error("CEP deve ter 8 dígitos.");
  const resposta = await fetch("https://viacep.com.br/ws/" + limpo + "/json/");
  const dados = await resposta.json();
  if (dados.erro) throw new Error("CEP não encontrado.");
  return {
    rua: dados.logradouro || "",
    bairro: dados.bairro || "",
    cidade: dados.localidade || "",
    uf: dados.uf || "",
  };
}
