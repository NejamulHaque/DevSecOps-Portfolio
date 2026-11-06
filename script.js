const $ = (selector) => document.querySelector(selector);
const body = document.body;
const themeToggle = $("#themeToggle");
const menuToggle = $("#menuToggle");
const nav = $("#primaryNav");
const progress = $("#scrollProgress");
const form = $("#contactForm");
const formStatus = $("#formStatus");
const scannerInput = $("#secretInput");
const scannerOutput = $("#scannerOutput");

if (localStorage.getItem("portfolio-theme") === "light") body.classList.add("light");
themeToggle?.addEventListener("click", () => {
  body.classList.toggle("light");
  localStorage.setItem("portfolio-theme", body.classList.contains("light") ? "light" : "dark");
});
menuToggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
}));

const sectionLinks = [...document.querySelectorAll("nav a[href^='#']")];
const sections = sectionLinks.map((link) => document.querySelector(link.hash)).filter(Boolean);
const updateScrollState = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  const current = sections.reduce((active, section) => window.scrollY + 140 >= section.offsetTop ? section : active, sections[0]);
  sectionLinks.forEach((link) => link.classList.toggle("active", link.hash === `#${current?.id}`));
};
window.addEventListener("scroll", updateScrollState, { passive: true });
updateScrollState();

const initializeLab = (card) => {
  const output = card.querySelector("output");
  if (!output || card.dataset.initialized) return;
  card.dataset.initialized = "true";
  if (output.id === "telemetryOutput") output.textContent = "Sample event: SSH burst detected · simulated";
  if (output.id === "honeypotOutput") output.textContent = "Sample event: decoy login observed · simulated";
};
if ("IntersectionObserver" in window) {
  const labObserver = new IntersectionObserver((entries, observer) => entries.forEach((entry) => {
    if (entry.isIntersecting) { initializeLab(entry.target); observer.unobserve(entry.target); }
  }), { rootMargin: "160px" });
  document.querySelectorAll("[data-lab]").forEach((card) => labObserver.observe(card));
} else document.querySelectorAll("[data-lab]").forEach(initializeLab);

const shannonEntropy = (value) => {
  if (!value) return 0;
  const counts = [...value].reduce((map, character) => map.set(character, (map.get(character) || 0) + 1), new Map());
  return [...counts.values()].reduce((entropy, count) => {
    const probability = count / value.length;
    return entropy - probability * Math.log2(probability);
  }, 0);
};
const scanSecrets = () => {
  const source = scannerInput?.value || "";
  const findings = [];
  const patterns = [
    { name: "AWS access key", regex: /\bAKIA[0-9A-Z]{16}\b/ },
    { name: "PEM private key", regex: /-----BEGIN [A-Z ]+PRIVATE KEY-----/ },
    { name: "Unsafe permission", regex: /\bchmod\s+777\b/ },
    { name: "Generic secret assignment", regex: /\b(?:password|secret|token|api[_-]?key)\s*=\s*\S+/i }
  ];
  patterns.forEach((pattern) => { if (pattern.regex.test(source)) findings.push(pattern.name); });
  const entropyCandidates = source.split(/\s+/)
    .map((token) => token.split("=").pop().replace(/[^A-Za-z0-9+/=_-]/g, ""))
    .filter((token) => token.length >= 8);
  const highEntropy = entropyCandidates.filter((token) => token.length >= 20 && shannonEntropy(token) >= 4.2);
  if (highEntropy.length) findings.push(`High-entropy token (${shannonEntropy(highEntropy[0]).toFixed(2)} bits/char)`);
  const entropyValue = entropyCandidates.length ? Math.max(...entropyCandidates.map(shannonEntropy)).toFixed(2) : "0.00";
  scannerOutput.innerHTML = "";
  const badge = document.createElement("span");
  badge.className = `result-badge ${findings.length ? "suspicious" : "clean"}`;
  badge.textContent = findings.length ? "Suspicious" : "Clean";
  const detail = document.createElement("span");
  detail.textContent = findings.length ? `${findings.join(" · ")} · Shannon entropy: ${entropyValue} bits/char` : `No matched pattern · Shannon entropy: ${entropyValue} bits/char`;
  scannerOutput.append(badge, detail);
};
$("#scanSecrets")?.addEventListener("click", scanSecrets);
$("#loadSafeSample")?.addEventListener("click", () => {
  scannerInput.value = "SERVICE_NAME=example\nLOG_LEVEL=info\nCOMMIT_MESSAGE=update-documentation";
  scannerOutput.innerHTML = '<span class="result-badge clean">Clean</span><span>Safe sample loaded. Ready to scan locally.</span>';
});

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const honeypot = form.elements.namedItem("_gotcha");
  if (honeypot?.value) return;
  const button = form.querySelector("button");
  button.disabled = true;
  formStatus.textContent = "Sending…";
  try {
    const response = await fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("Form submission failed");
    form.reset();
    formStatus.textContent = "Message sent. Thank you.";
  } catch (error) {
    formStatus.textContent = "Unable to send right now. Please use the email link.";
  } finally {
    button.disabled = false;
  }
});

document.querySelector("#year").textContent = new Date().getFullYear();
