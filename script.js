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

// "View More" — open the project PDF in a new tab
document.querySelectorAll(".project-modal-more[data-pdf]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const pdf = link.dataset.pdf;
    if (pdf) {
      window.open(pdf, "_blank", "noopener,noreferrer");
    }
  });
});

/* ============================================================
   MICROINTERACTIONS — Guard: skip if prefers-reduced-motion
   ============================================================ */
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouchDevice = window.matchMedia("(hover: none)").matches;

/* ============================================================
   MICROINTERACTION 1 — Custom cursor with lag
   ============================================================ */
if (!isTouchDevice && !prefersReducedMotion) {
  const cursorDot  = document.querySelector(".mi-cursor-dot");
  const cursorRing = document.querySelector(".mi-cursor-ring");

  let mouseX = -100, mouseY = -100;
  let ringX  = -100, ringY  = -100;
  let rafId;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursorDot) {
      cursorDot.style.left = mouseX + "px";
      cursorDot.style.top  = mouseY + "px";
    }
  });

  const lerpRing = () => {
    ringX += (mouseX - ringX) * 0.14;
    ringY += (mouseY - ringY) * 0.14;
    if (cursorRing) {
      cursorRing.style.left = ringX + "px";
      cursorRing.style.top  = ringY + "px";
    }
    rafId = requestAnimationFrame(lerpRing);
  };
  lerpRing();

  // Hover state on interactive elements
  const interactables = document.querySelectorAll(
    "a, button, .work-card, .process-track li, .contact-pill, .hero-name-letter"
  );
  interactables.forEach((el) => {
    el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
    el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
  });

  // Click state
  document.addEventListener("mousedown", () => document.body.classList.add("cursor-click"));
  document.addEventListener("mouseup",   () => document.body.classList.remove("cursor-click"));
}

/* ============================================================
   MICROINTERACTION 2 — Scroll progress bar
   ============================================================ */
const progressBar = document.querySelector(".mi-progress");
if (progressBar) {
  const updateProgress = () => {
    const scrollTop    = window.scrollY;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const pct          = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + "%";
  };
  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
}

/* ============================================================
   MICROINTERACTION 3 — Scroll reveal (IntersectionObserver)
   ============================================================ */
const revealEls = document.querySelectorAll(".mi-reveal");
if (revealEls.length) {
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => revealObs.observe(el));
}

/* ============================================================
   MICROINTERACTION 4 — About-meta col stagger reveal
   ============================================================ */
const aboutCols = document.querySelectorAll(".about-meta-col");
if (aboutCols.length) {
  const metaObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          metaObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
  );
  aboutCols.forEach((col) => metaObs.observe(col));
}

/* ============================================================
   MICROINTERACTION 5 — Work card ripple on click
   ============================================================ */
if (!prefersReducedMotion) {
  document.querySelectorAll(".work-card").forEach((card) => {
    card.addEventListener("mousedown", (e) => {
      const rect   = card.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height);
      const x      = e.clientX - rect.left - size / 2;
      const y      = e.clientY - rect.top  - size / 2;

      const ripple = document.createElement("span");
      ripple.className = "mi-ripple";
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
      card.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    });
  });
}

/* ============================================================
   MICROINTERACTION 6 — Email copy-to-clipboard with toast
   ============================================================ */
const mailLink  = document.getElementById("contact-mail-link");
const toast     = document.getElementById("mi-toast");
let toastTimer;

if (mailLink && toast) {
  mailLink.addEventListener("click", (e) => {
    // Only intercept if clipboard API is available; otherwise allow normal mailto
    if (!navigator.clipboard) return;

    e.preventDefault();
    const email = "yashviparekh1009@gmail.com";

    navigator.clipboard.writeText(email).then(() => {
      clearTimeout(toastTimer);
      toast.classList.add("is-visible");
      toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2800);
    }).catch(() => {
      // Fallback: open mailto
      window.location.href = "mailto:" + email;
    });
  });
}

/* ============================================================
   MICROINTERACTION 7 — Hero name letters: add accessible text
   The visible text is via aria-hidden spans; keep accessible h1
   ============================================================ */
// The hero name letters are aria-hidden so they don't affect a11y.
// The h1 still reads correctly via its text content for AT.
// (No extra JS needed — CSS handles the hover.)

/* ============================================================
   MICROINTERACTION 8 — Typewriter cursor: remove after 3s
   so it doesn't distract after page load
   ============================================================ */
const taglineCursor = document.querySelector(".hero-tagline-cursor");
if (taglineCursor && !prefersReducedMotion) {
  setTimeout(() => {
    taglineCursor.style.transition = "opacity 0.6s ease";
    taglineCursor.style.opacity    = "0";
  }, 4200);
}

/* ============================================================
   MICROINTERACTION 9 — Process track item: bounce on hover
   (CSS handles, but we add a click sound effect via vibrate)
   ============================================================ */
document.querySelectorAll(".process-track li").forEach((item) => {
  item.addEventListener("click", () => {
    if ("vibrate" in navigator) navigator.vibrate(8);
    item.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(0.88)" },
        { transform: "scale(1.08)" },
        { transform: "scale(1)" },
      ],
      { duration: 340, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" }
    );
  });
});

/* ============================================================
   MICROINTERACTION 10 — Filter button: scale-in active pill
   ============================================================ */
document.querySelectorAll(".work-filters button").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!prefersReducedMotion) {
      btn.animate(
        [
          { transform: "scale(0.92)" },
          { transform: "scale(1.04)" },
          { transform: "scale(1)" },
        ],
        { duration: 300, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" }
      );
    }
  });
});

/* ============================================================
   @firecms/neat — 3D Liquid Sphere Gradient with Scroll Reaction
   ============================================================ */
const gradientCanvas = document.getElementById("gradient");
if (gradientCanvas && window.neat && window.neat.NeatGradient) {
  try {
    const config = {
      colors: [
        { color: '#E66204', enabled: true },
        { color: '#880000', enabled: true },
        { color: '#C05000', enabled: true },
        { color: '#5A2000', enabled: true },
        { color: '#FFF5E0', enabled: true },
        { color: '#FFE4D6', enabled: true },
      ],
      speed: 4.5,
      horizontalPressure: 3,
      verticalPressure: 4,
      waveFrequencyX: 2.5,
      waveFrequencyY: 2.5,
      waveAmplitude: 6,
      secondaryWaveEnabled: false,
      secondaryWaveFrequencyX: 3,
      secondaryWaveFrequencyY: 3,
      secondaryWaveAmplitude: 5,
      secondaryWaveSpeed: 0.6,
      secondaryWaveAngle: 1,
      shadows: 10,
      highlights: 1,
      colorBrightness: 1,
      colorSaturation: 0,
      wireframe: false,
      antialias: false,
      colorBlending: 3,
      backgroundColor: '#FFF5E0',
      backgroundAlpha: 0,
      grainScale: 4,
      grainSparsity: 0,
      grainIntensity: 0,
      grainSpeed: 0.5,
      resolution: 0.9,
      yOffset: 10641.699829101562,
      yOffsetWaveMultiplier: 4,
      yOffsetColorMultiplier: 4,
      yOffsetFlowMultiplier: 10,
      flowDistortionA: 1.2,
      flowDistortionB: 1.8,
      flowScale: 1.5,
      flowEase: 0.25,
      flowEnabled: false,
      enableProceduralTexture: false,
      transparentTextureVoid: false,
      textureMode: 'bitmap',
      bakeEdgeSoftness: 1,
      textureVoidLikelihood: 0.27,
      textureVoidWidthMin: 60,
      textureVoidWidthMax: 420,
      textureBandDensity: 1.2,
      textureColorBlending: 0.06,
      textureSeed: 333,
      textureEase: 0.5,
      proceduralBackgroundColor: '#FFF5E0',
      textureShapeTriangles: 20,
      textureShapeCircles: 15,
      textureShapeBars: 15,
      textureShapeSquiggles: 10,
      domainWarpEnabled: false,
      domainWarpIntensity: 0,
      domainWarpScale: 3,
      vignetteIntensity: 0.25,
      vignetteRadius: 0.35,
      fresnelEnabled: false,
      fresnelPower: 1.3,
      fresnelIntensity: 0,
      fresnelColor: '#ffffff',
      iridescenceEnabled: false,
      iridescenceIntensity: 0.8,
      iridescenceSpeed: 1.5,
      prismEdgeEnabled: false,
      prismEdgeIntensity: 0.5,
      prismEdgeThinness: 3,
      prismEdgeSpread: 1,
      prismEdgeSpeed: 0.5,
      prismEdgeRipple: 1,
      bloomIntensity: 0.1,
      bloomThreshold: 0.1,
      chromaticAberration: 3,
      shapeType: 'sphere',
      shapeRotationX: -2.49,
      shapeRotationY: -0.89,
      shapeRotationZ: 0,
      shapeAutoRotateSpeedX: 1,
      shapeAutoRotateSpeedY: 1.2,
      sphereRadius: 21,
      torusRadius: 15,
      torusTube: 5,
      cylinderRadius: 10,
      cylinderHeight: 40,
      planeBend: 0,
      planeTwist: 0,
      silhouetteFade: 0.55,
      cylinderFade: 0.08,
      ribbonFade: 0.05,
      flatShading: false,
      cameraLock: false,
      cameraX: -22.5,
      cameraY: 0,
      cameraZ: 0,
      cameraRotationX: 0.86,
      cameraRotationY: -0.007,
      cameraRotationZ: 0,
      cameraZoom: 2.6,
    };

    const gradient = new window.neat.NeatGradient({
      ref: gradientCanvas,
      ...config
    });

    // React to scroll
    window.addEventListener("scroll", () => {
      if (gradient) {
        gradient.yOffset = window.scrollY;
      }
    }, { passive: true });
  } catch (err) {
    console.warn("Could not initialize @firecms/neat gradient:", err);
  }
}


