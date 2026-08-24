# Navalha de Ouro — versão HTML + CSS + JS puros

Versão do projeto sem frameworks, feita para estudo. Basta abrir `HTML/index.html` no navegador
(ou servir a pasta com `python3 -m http.server`).

## Estrutura

```
navalha-de-ouro-html/
├── HTML/               Todas as páginas HTML
├── CSS/                base.css e um CSS para cada página
├── JS/                 JavaScript compartilhado e específico
└── Imagens/            Imagens do site
```

Cada tipo de arquivo fica em sua própria pasta: `HTML/`, `CSS/` e `JS/`.

## Regras implementadas

- Nome: 15 a 80 caracteres, apenas letras e espaços
- CPF: máscara `000.000.000-00` e validação de dígitos verificadores
- CEP: máscara `00000-000` e preenchimento automático via API ViaCEP
- Telefones: máscara `(+55)XX-XXXXXXXX`
- Login: exatamente 6 letras · Senha: exatamente 8 letras + confirmação
- Persistência de usuários, sessão e respostas em `localStorage`
- Acessibilidade: aumento/redução de fonte e tema de alto contraste (salvos no navegador)

> Observação: por ser um projeto de estudo, as senhas ficam em texto puro no `localStorage`.
> Em produção a autenticação deve ficar no servidor.
