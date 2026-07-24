function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function jobRelativeDate(dateStr) {
  if (!dateStr) return "";
  const posted = new Date(dateStr + "T00:00:00");
  if (Number.isNaN(posted.getTime())) return "";

  const diffMs = Date.now() - posted.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Publicado hoje";
  if (diffDays === 1) return "Publicado há 1 dia";
  if (diffDays < 30) return `Publicado há ${diffDays} dias`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return "Publicado há 1 mês";
  if (diffMonths < 12) return `Publicado há ${diffMonths} meses`;
  const diffYears = Math.floor(diffMonths / 12);
  return diffYears === 1 ? "Publicado há 1 ano" : `Publicado há ${diffYears} anos`;
}

function jobCardHTML(job) {
  const detailsId = `job-${job.id}-details`;
  const listItems = (items) => items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const applyUrl = `candidatura.html?vaga=${encodeURIComponent(job.titulo)}&local=${encodeURIComponent(job.local)}`;

  return `
    <article class="job-card">
      <button type="button" class="job-card__summary" aria-expanded="false" aria-controls="${detailsId}">
        <div class="job-card__icon">
          <svg viewBox="0 0 24 24"><path d="M4 21V8a1 1 0 0 1 1-1h6V3.5a1 1 0 0 1 1-1h0a1 1 0 0 1 1 1V7h6a1 1 0 0 1 1 1v13M4 21h16M9 11h.01M9 15h.01M15 11h.01M15 15h.01"/></svg>
        </div>
        <div class="job-card__body">
          <h2 class="job-card__title">${escapeHtml(job.titulo)}</h2>
          <p class="job-card__company">Hi-Com</p>
          <p class="job-card__desc">${escapeHtml(job.resumo)}</p>
        </div>
        <div class="job-card__meta">
          <span class="job-card__location">${escapeHtml(job.local)}</span>
          <span class="job-card__date">${jobRelativeDate(job.dataPublicacao)}</span>
          <svg class="job-card__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
        </div>
      </button>

      <div class="job-card__details" id="${detailsId}" hidden>
        <h3>Responsabilidades</h3>
        <ul>${listItems(job.responsabilidades)}</ul>

        <h3>Requisitos</h3>
        <ul>${listItems(job.requisitos)}</ul>

        <h3>Benefícios</h3>
        <ul>${listItems(job.beneficios)}</ul>

        <a href="${applyUrl}" class="btn btn-primary">
          Enviar currículo para esta vaga
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </a>
      </div>
    </article>
  `;
}

function attachJobCardHandlers(container) {
  container.querySelectorAll(".job-card__summary").forEach((summary) => {
    summary.addEventListener("click", () => {
      const details = document.getElementById(summary.getAttribute("aria-controls"));
      const isOpen = summary.getAttribute("aria-expanded") === "true";
      summary.setAttribute("aria-expanded", String(!isOpen));
      if (details) {
        details.hidden = isOpen;
      }
    });
  });
}

function filterJobs(jobs, filters) {
  const keyword = filters.keyword.trim().toLowerCase();
  const location = filters.location.trim().toLowerCase();

  return jobs.filter((job) => {
    if (!job.ativa) return false;

    if (keyword) {
      const haystack = `${job.titulo} ${job.resumo}`.toLowerCase();
      if (!haystack.includes(keyword)) return false;
    }

    if (location && !job.local.toLowerCase().includes(location)) return false;

    if (filters.remoteOnly && !job.remota) return false;

    if (filters.types.length && !filters.types.includes(job.tipo)) return false;

    return true;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("jobsList");
  const empty = document.getElementById("jobsEmpty");
  const form = document.getElementById("jobsFilterForm");

  if (!list || typeof JOBS_DATA === "undefined") return;

  const render = (jobs) => {
    if (!jobs.length) {
      list.innerHTML = "";
      list.hidden = true;
      if (empty) empty.hidden = false;
      return;
    }
    list.hidden = false;
    if (empty) empty.hidden = true;
    list.innerHTML = jobs.map(jobCardHTML).join("");
    attachJobCardHandlers(list);
  };

  render(JOBS_DATA.filter((job) => job.ativa));

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const types = Array.from(form.querySelectorAll('.jobs-filters__type-list input[type="checkbox"]'))
        .filter((cb) => cb.checked)
        .map((cb) => cb.value);

      render(
        filterJobs(JOBS_DATA, {
          keyword: String(data.get("keyword") || ""),
          location: String(data.get("location") || ""),
          remoteOnly: form.querySelector('input[name="remote"]').checked,
          types,
        })
      );
    });
  }
});
