# Como as Vagas e o Blog foram implementados

Este documento explica o padrão usado para as seções de **Vagas** (Trabalhe Conosco) e
**Blog** no site da Hi-Com, para replicar exatamente igual no site da APC Tecnologia.

A ideia central dos dois: **o conteúdo fica separado do HTML**, num arquivo `.js` só com
dados (um array de objetos). Um segundo arquivo `.js` lê esses dados e monta o HTML na
hora que a página carrega. Resultado: pra adicionar uma vaga ou um post novo, você só
edita o arquivo de dados — copia um bloco, cola, troca os textos. Não precisa mexer em
HTML, CSS ou entender como a renderização funciona.

Isso é client-side puro (sem build step, sem framework) — só usa `document.getElementById`
e template strings de JavaScript.

---

## 1. Padrão geral (os dois seguem a mesma receita)

```
js/<nome>-data.js   → array de objetos com o conteúdo (o que você edita)
js/<nome>.js        → lê o array e gera o HTML dentro de containers vazios
```

No HTML, em vez de escrever os cards na mão, você deixa uma `<div>` vazia com um `id`:

```html
<div class="blog-grid" id="blogList" data-img-base="img/"></div>
```

O script de renderização procura esse `id` com `document.getElementById(...)` e, se
encontrar, preenche o `innerHTML` com os cards montados a partir do array de dados.
Se o `id` não existir naquela página, o script simplesmente não faz nada — por isso o
mesmo `js/blog.js`, por exemplo, funciona tanto na home quanto na página de listagem
quanto na página de post individual: cada uma só tem o container que lhe interessa.

**Detalhe importante que já causou um bug (e por isso está documentado aqui):**
como a home (`index.html`) fica na raiz do projeto e as páginas internas ficam em
`pages/`, os caminhos relativos de imagem e de link mudam dependendo de onde o
container está. A solução foi colocar esses caminhos como `data-*` attributes no
próprio container, com um valor padrão (fallback) no JS:

```html
<!-- na home (raiz) -->
<div id="blogList" data-img-base="img/"></div>

<!-- numa página dentro de pages/ -->
<div id="blogFullList" data-img-base="../img/"></div>
```

```js
const imgBasePath = homeList.dataset.imgBase || "img/";
```

Sempre que for reaproveitar esse padrão em uma página nova, confira esse detalhe —
foi exatamente isso que quebrou os links dos cards de blog na home na primeira versão
(o link do card usava um caminho fixo, sem considerar que a home está em outro nível
de pasta que as páginas internas).

---

## 2. Vagas (Trabalhe Conosco)

### Arquivos
- `js/jobs-data.js` — os dados
- `js/jobs.js` — a renderização + filtro de busca
- `css/jobs.css` — estilos dos cards e do formulário de filtro
- `pages/trabalhe-conosco.html` — única página que usa isso

### Formato de cada vaga (`js/jobs-data.js`)

```js
const JOBS_DATA = [
  {
    id: "tecnico",                 // identificador único, vira parte da URL de candidatura
    titulo: "Técnico",
    local: "Maranhão/MA",
    tipo: "Full Time",             // "Freelance" | "Full Time" | "Internship" | "Part Time" | "Temporary"
    remota: false,
    dataPublicacao: "2026-07-23",  // AAAA-MM-DD, usado só pra calcular "publicado há X dias"
    resumo: "Texto curto que aparece fechado, antes de clicar.",
    responsabilidades: ["Item 1.", "Item 2."],
    requisitos: ["Item 1.", "Item 2."],
    beneficios: ["Item 1.", "Item 2."],
    ativa: true,                   // false = fica oculta sem precisar apagar
  },
];
```

### O que `js/jobs.js` faz

1. **`jobRelativeDate(dateStr)`** — pega `dataPublicacao` e calcula automaticamente
   "Publicado hoje" / "Publicado há 3 dias" / "Publicado há 2 meses" etc. Você nunca
   atualiza isso manualmente.

2. **`jobCardHTML(job)`** — monta o card como um `<article>` com um `<button>` que expande
   (mostra Responsabilidades/Requisitos/Benefícios) e um link "Enviar currículo para esta
   vaga" que aponta para:
   ```
   candidatura.html?vaga=<título codificado>&local=<local codificado>
   ```
   Essa página de candidatura lê esses parâmetros da URL (`URLSearchParams`) e preenche um
   campo "Vaga" (somente leitura) automaticamente — assim um único formulário de candidatura
   serve pra qualquer vaga, sem precisar de uma página por vaga.

3. **`attachJobCardHandlers(container)`** — liga o clique do botão de cada card pra
   expandir/recolher (`aria-expanded` + `hidden` no painel de detalhes).

4. **`filterJobs(jobs, filters)`** — filtro client-side por palavra-chave (no título/resumo),
   localização, "somente remoto" e tipo de vínculo (checkboxes). Roda 100% no navegador,
   sem backend.

5. No final, o script escuta o formulário de busca (`id="jobsFilterForm"`) e re-renderiza
   a lista filtrada a cada busca, mostrando uma mensagem (`id="jobsEmpty"`) quando não há
   resultado.

### HTML necessário na página

```html
<form class="jobs-filters" id="jobsFilterForm">
  <!-- inputs de palavra-chave, localização, checkboxes de tipo -->
</form>

<div class="jobs-list" id="jobsList"></div>
<p class="jobs-empty" id="jobsEmpty" hidden>Nenhuma vaga encontrada com esses filtros.</p>
```

```html
<script src="../js/jobs-data.js"></script>
<script src="../js/jobs.js"></script>
<script src="../js/main.js"></script>
```

---

## 3. Blog

### Arquivos
- `js/blog-data.js` — os dados (posts)
- `js/blog.js` — a renderização (3 destaques na home + listagem completa + post individual)
- `css/blog-feed.css` — estilos do card clicável e da página de post em estilo "feed"
- `css/misc-sections.css` — já tinha os estilos base do `.blog-grid`/`.blog-card` (reaproveitados)
- `index.html` (seção de destaque) + `pages/blog.html` (listagem) + `pages/blog-post.html`
  (post individual)

### Formato de cada post (`js/blog-data.js`)

```js
const BLOG_DATA = [
  {
    id: "dia-do-trabalhador",       // identificador único, vira ?post=... na URL
    titulo: "Feliz Dia do Trabalhador",
    data: "1º de maio",             // já formatado do jeito que deve aparecer (texto livre)
    imagem: "blog/dia-do-trabalhador.jpg",  // caminho dentro de img/
    resumo: "Texto curto pro card da listagem.",
    descricao: "Texto completo da página do post.\n\nUse \\n\\n pra separar parágrafos.",
    ativo: true,
  },
];
```

### O que `js/blog.js` faz

Um único arquivo cobre as **três** telas diferentes, cada uma reconhecida pelo `id` do
container que existe (ou não) naquela página:

| Container (`id`)   | Onde vive              | O que renderiza                                   |
|---------------------|-------------------------|-----------------------------------------------------|
| `blogList`          | `index.html` (home)     | os 3 posts mais recentes, em cards                   |
| `blogFullList`      | `pages/blog.html`       | todos os posts ativos, em cards                      |
| `blogPost`          | `pages/blog-post.html`  | **um** post, em formato "feed" (imagem + texto), lido via `?post=id` na URL |

1. **`blogCardHTML(post, imgBasePath, linkBasePath)`** — monta um card `<a class="blog-card">`
   clicável (o card inteiro é um link, não só o título) apontando para
   `blog-post.html?post=<id>`. Os dois parâmetros de base path resolvem o problema de
   caminho relativo explicado na seção 1.

2. Na home, só renderiza os **3 primeiros** posts ativos (`posts.slice(0, 3)`) e mostra um
   botão "Ver todos os posts" apontando para `pages/blog.html`.

3. Na página de post individual, lê `?post=` da URL com `URLSearchParams`, procura o post
   correspondente em `BLOG_DATA`, e:
   - se não encontrar → mostra uma mensagem "Post não encontrado" com link de volta
   - se encontrar → separa `descricao` em parágrafos (`split("\n\n")`), atualiza
     `document.title` dinamicamente, e monta o layout tipo feed: imagem grande no topo,
     depois data/título/texto, depois um link "Voltar para o blog"

### HTML necessário

**Na home** (dentro da seção de blog):
```html
<div class="blog-grid" id="blogList" data-img-base="img/"></div>
```

**Em `pages/blog.html`** (listagem completa):
```html
<div class="blog-grid" id="blogFullList" data-img-base="../img/"></div>
```

**Em `pages/blog-post.html`** (post individual — o container começa vazio, o JS decide o
que colocar dentro):
```html
<div id="blogPost" data-img-base="../img/"></div>
```

Em todas as três páginas:
```html
<script src="../js/blog-data.js"></script>  <!-- ou "js/blog-data.js" na home -->
<script src="../js/blog.js"></script>
<script src="js/main.js"></script>
```

---

## 4. Passo a passo pra replicar no site da APC Tecnologia

1. Copie `js/jobs-data.js`, `js/jobs.js`, `css/jobs.css` (se tiver vagas) e/ou
   `js/blog-data.js`, `js/blog.js`, `css/blog-feed.css` (se tiver blog) pro projeto novo.
2. Esvazie os arrays de dados e preencha com o conteúdo real da APC Tecnologia (mesmo
   formato de campos).
3. Crie as páginas HTML (`trabalhe-conosco.html`, `candidatura.html` e/ou `blog.html`,
   `blog-post.html`) reaproveitando a estrutura de header/footer que vocês já usam — só
   trocando o `<main>` pelos containers vazios (`id="jobsList"`, `id="blogList"` etc.)
   descritos acima.
4. Confira os `data-img-base` de cada página de acordo com a profundidade da pasta onde
   ela está (raiz = `""` ou `"img/"`; dentro de `pages/` = `"../img/"`).
5. Linke os três scripts (`*-data.js`, o renderizador, e `main.js`) antes do fechamento do
   `</body>`, nessa ordem.
6. Teste clicando em cada card antes de considerar pronto — é o jeito mais rápido de pegar
   um caminho relativo errado (foi assim que achamos o bug da home apontando pro
   `blog-post.html` sem o prefixo `pages/`).
