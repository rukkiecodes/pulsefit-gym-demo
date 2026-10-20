// Shared by index.html and classes.html, so every block checks its element first.

// ----- Dark mode (saved in localStorage) -----
const root = document.documentElement;
const themeBtn = document.querySelector("#theme-toggle");

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  if (themeBtn) themeBtn.textContent = theme === "dark" ? "☀️" : "🌙";
}

let savedTheme = null;
try { savedTheme = localStorage.getItem("theme"); } catch (e) { /* storage blocked */ }
applyTheme(savedTheme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("theme", next); } catch (e) { /* ignore */ }
  });
}

// ----- Mobile menu -----
const menuBtn = document.querySelector("#menu-toggle");
const navLinks = document.querySelector("#nav-links");

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
  });
  navLinks.addEventListener("click", (e) => {
    if (e.target.matches("a")) {
      navLinks.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", false);
    }
  });
}

// ----- Pricing toggle (yearly = 20% off, read from data-monthly) -----
const billingSwitch = document.querySelector("#billing-switch");

if (billingSwitch) {
  const prices = document.querySelectorAll("[data-monthly]");
  const periods = document.querySelectorAll(".period");

  billingSwitch.addEventListener("click", () => {
    const yearly = billingSwitch.getAttribute("aria-checked") !== "true";
    billingSwitch.setAttribute("aria-checked", yearly);
    prices.forEach((el) => {
      const monthly = Number(el.dataset.monthly);
      el.textContent = yearly ? Math.round(monthly * 0.8) : monthly;
    });
    periods.forEach((el) => (el.textContent = yearly ? "/mo, billed yearly" : "/mo"));
  });
}

// ----- Join form validation -----
const form = document.querySelector("#join-form");

if (form) {
  const successBox = document.querySelector("#form-success");

  function setError(input, message) {
    const field = input.closest(".field");
    field.classList.toggle("invalid", Boolean(message));
    field.querySelector(".error").textContent = message;
    return !message;
  }

  const checks = {
    name: (el) => setError(el, el.value.trim() ? "" : "Please enter your name."),
    email: (el) =>
      setError(el, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim()) ? "" : "Enter a valid email address."),
    plan: (el) => setError(el, el.value ? "" : "Choose a plan."),
    date: (el) => {
      if (!el.value) return setError(el, "Pick a start date.");
      const today = new Date().toISOString().slice(0, 10);
      return setError(el, el.value < today ? "Start date can't be in the past." : "");
    },
    terms: (el) => setError(el, el.checked ? "" : "You must accept the terms."),
  };

  // Clear an error as soon as the user fixes the field
  form.addEventListener("input", (e) => {
    const check = checks[e.target.name];
    if (check && e.target.closest(".invalid")) check(e.target);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    successBox.classList.remove("show");

    let valid = true;
    for (const name in checks) {
      if (!checks[name](form.elements[name])) valid = false;
    }

    if (valid) {
      successBox.textContent = `Welcome to PulseFit, ${form.elements.name.value.trim()}! Check your inbox.`;
      successBox.classList.add("show");
      form.reset();
    } else {
      form.querySelector(".invalid input, .invalid select").focus();
    }
  });
}

// ----- Class filter -----
const filterBar = document.querySelector(".filters");

if (filterBar) {
  const cells = document.querySelectorAll(".timetable td[data-type]");

  filterBar.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter");
    if (!btn) return;
    filterBar.querySelectorAll(".filter").forEach((b) => {
      b.classList.toggle("active", b === btn);
      b.setAttribute("aria-pressed", b === btn);
    });
    cells.forEach((td) => {
      td.classList.toggle("dim", btn.dataset.filter !== "all" && td.dataset.type !== btn.dataset.filter);
    });
  });
}
