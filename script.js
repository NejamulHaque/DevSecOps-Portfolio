const $ = (selector) => document.querySelector(selector);
const body = document.body;
const themeToggle = $("#themeToggle");
const menuToggle = $("#menuToggle");
const nav = $("#primaryNav");
const progress = $("#scrollProgress");
const form = $("#contactForm");
const formStatus = $("#formStatus");

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

const sectionLinks = [...document.querySelectorAll("nav a")];
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
