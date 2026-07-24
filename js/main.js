document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      navToggle.classList.toggle("is-active", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("nav-open", isOpen);
    });

    nav.querySelectorAll(".nav-item--dropdown > .nav-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        if (window.innerWidth <= 992) {
          e.preventDefault();
          link.closest(".nav-item--dropdown").classList.toggle("is-open");
        }
      });
    });

    nav.querySelectorAll(".nav-link:not(.nav-item--dropdown > .nav-link)").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        navToggle.classList.remove("is-active");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-open");
      });
    });
  }

  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const header = document.querySelector(".site-header");
  if (header) {
    window.addEventListener("scroll", () => {
      header.classList.toggle("is-scrolled", window.scrollY > 10);
    });
  }

  const complaintForm = document.getElementById("complaintForm");
  if (complaintForm) {
    const status = document.getElementById("complaintFormStatus");
    complaintForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (status) {
        status.textContent = "Envio ainda não está disponível nesta versão do site. Em breve este formulário será conectado.";
        status.classList.add("is-visible");
      }
    });
  }

  const talentBankForm = document.getElementById("talentBankForm");
  if (talentBankForm) {
    const status = document.getElementById("talentBankFormStatus");
    talentBankForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (status) {
        status.textContent = "Envio ainda não está disponível nesta versão do site. Em breve este formulário será conectado.";
        status.classList.add("is-visible");
      }
    });
  }

  const jobsFilterForm = document.getElementById("jobsFilterForm");
  if (jobsFilterForm) {
    jobsFilterForm.addEventListener("submit", (e) => {
      e.preventDefault();
    });
  }
});
