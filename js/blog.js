function blogEscapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function blogCardHTML(post, imgBasePath, linkBasePath) {
  return `
    <a class="blog-card" href="${linkBasePath}blog-post.html?post=${encodeURIComponent(post.id)}">
      <div class="blog-card__media">
        <img src="${imgBasePath}${post.imagem}" alt="${blogEscapeHtml(post.titulo)}">
      </div>
      <div class="blog-card__body">
        <span class="blog-card__date">${blogEscapeHtml(post.data)}</span>
        <h3 class="blog-card__title">${blogEscapeHtml(post.titulo)}</h3>
        <p class="blog-card__excerpt">${blogEscapeHtml(post.resumo)}</p>
      </div>
    </a>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  if (typeof BLOG_DATA === "undefined") return;
  const posts = BLOG_DATA.filter((p) => p.ativo);

  const homeList = document.getElementById("blogList");
  if (homeList) {
    const imgBasePath = homeList.dataset.imgBase || "img/";
    const linkBasePath = homeList.dataset.linkBase || "pages/";
    homeList.innerHTML = posts.slice(0, 3).map((p) => blogCardHTML(p, imgBasePath, linkBasePath)).join("");
  }

  const fullList = document.getElementById("blogFullList");
  if (fullList) {
    const imgBasePath = fullList.dataset.imgBase || "../img/";
    const linkBasePath = fullList.dataset.linkBase || "";
    fullList.innerHTML = posts.map((p) => blogCardHTML(p, imgBasePath, linkBasePath)).join("");
  }

  const postContainer = document.getElementById("blogPost");
  if (postContainer) {
    const imgBasePath = postContainer.dataset.imgBase || "../img/";
    const params = new URLSearchParams(window.location.search);
    const postId = params.get("post");
    const post = posts.find((p) => p.id === postId);

    if (!post) {
      postContainer.innerHTML = `
        <div class="blog-post__not-found">
          <h1>Post não encontrado</h1>
          <p>Esse post não existe ou foi removido.</p>
          <a href="blog.html" class="btn btn-primary">Voltar para o blog</a>
        </div>
      `;
      return;
    }

    document.title = `${post.titulo} | Blog Hi-Com`;

    const paragraphs = post.descricao
      .split("\n\n")
      .map((p) => `<p>${blogEscapeHtml(p)}</p>`)
      .join("");

    postContainer.innerHTML = `
      <article class="blog-feed">
        <div class="blog-feed__media">
          <img src="${imgBasePath}${post.imagem}" alt="${blogEscapeHtml(post.titulo)}">
        </div>
        <div class="blog-feed__body">
          <span class="blog-feed__date">${blogEscapeHtml(post.data)}</span>
          <h1 class="blog-feed__title">${blogEscapeHtml(post.titulo)}</h1>
          <div class="blog-feed__desc">${paragraphs}</div>
          <a href="blog.html" class="blog-feed__back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Voltar para o blog
          </a>
        </div>
      </article>
    `;
  }
});
