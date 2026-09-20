document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    if (link.classList.contains("work-card")) {
      return;
    }

    const id = link.getAttribute("href");
    const target = document.querySelector(id);

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
  });
});

const nav = document.querySelector(".site-nav");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector("#site-nav-menu");

const setNavMenuOpen = (isOpen) => {
  if (!navToggle || !navMenu) return;
  const backdrop = document.querySelector(".site-nav-backdrop");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navMenu.classList.toggle("is-open", isOpen);
  backdrop?.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("is-nav-open", isOpen);
};

if (navToggle) {
  navToggle.addEventListener("click", () => {
    const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
    setNavMenuOpen(!isExpanded);
  });
}

// Close menu when clicking backdrop, close button, or nav links
document.querySelectorAll("[data-nav-close]").forEach((el) => {
  el.addEventListener("click", () => {
    setNavMenuOpen(false);
  });
});

navMenu?.querySelectorAll("nav a, .site-nav-mobile-footer a").forEach((link) => {
  link.addEventListener("click", () => {
    setNavMenuOpen(false);
  });
});

// Close mobile menu if window is resized past mobile breakpoint
window.addEventListener("resize", () => {
  if (window.innerWidth > 768 && navMenu?.classList.contains("is-open")) {
    setNavMenuOpen(false);
  }
});

const updateNav = () => {
  nav.classList.toggle("is-scrolled", window.scrollY > 32);
};

updateNav();
window.addEventListener("scroll", updateNav, { passive: true });

const filterButtons = document.querySelectorAll(".work-filters button");
const workCards = document.querySelectorAll(".work-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");

    workCards.forEach((card) => {
      const tags = card.dataset.tags || "";
      const show = filter === "all" || tags.includes(filter);
      card.classList.toggle("is-hidden", !show);
    });
  });
});

const projectModal = document.querySelector("#project-modal");
const projectDialog = projectModal?.querySelector(".project-modal-dialog");
let lastProjectFocus = null;

const openProjectModal = (project) => {
  if (!projectModal || (project !== "cobble" && project !== "evenout" && project !== "bigbasket" && project !== "nykaa" && project !== "swiggy")) {
    return;
  }

  lastProjectFocus = document.activeElement;
  projectModal.classList.remove("is-closing");

  projectModal.querySelectorAll("[data-project-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.projectPanel !== project;
  });

  const title = projectModal.querySelector(
    `[data-project-panel="${project}"] .project-modal-logo`
  );

  if (title?.id) {
    projectDialog.setAttribute("aria-labelledby", title.id);
  }

  projectModal.hidden = false;
  document.body.classList.add("is-modal-open");
  projectModal.offsetWidth;
  projectModal.classList.add("is-open");
  projectDialog.focus();
};

const closeProjectModal = () => {
  if (!projectModal || projectModal.hidden || projectModal.classList.contains("is-closing")) {
    return;
  }

  const finishClose = () => {
    if (projectModal.hidden) {
      return;
    }

    projectModal.hidden = true;
    projectModal.classList.remove("is-open", "is-closing");
    document.body.classList.remove("is-modal-open");
    lastProjectFocus?.focus();
  };

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) {
    finishClose();
    return;
  }

  projectModal.classList.remove("is-open");
  projectModal.classList.add("is-closing");

  const closeTimer = window.setTimeout(finishClose, 500);

  projectDialog.addEventListener(
    "animationend",
    (event) => {
      if (event.target !== projectDialog) {
        return;
      }

      window.clearTimeout(closeTimer);
      finishClose();
    },
    { once: true }
  );
};

workCards.forEach((card) => {
  card.addEventListener("click", (event) => {
    const project = card.dataset.project;

    if (!project) {
      return;
    }

    event.preventDefault();
    openProjectModal(project);
  });
});

projectModal?.querySelectorAll("[data-modal-close]").forEach((el) => {
  el.addEventListener("click", closeProjectModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setNavMenuOpen(false);
    closeProjectModal();
  }
});
