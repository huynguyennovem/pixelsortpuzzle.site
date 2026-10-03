// Values the site owner still has to supply. Leave a value empty and the page keeps a
// visible highlighted placeholder (or a disabled "Coming soon" badge) instead.
const CONFIG = {
  studioName: "HugeTree",
  supportEmail: "hugetree29@gmail.com",
  googlePlayUrl: "",  // e.g. "https://play.google.com/store/apps/details?id=com.game.pixelsortpuzzle"
  appStoreUrl: "",    // e.g. "https://apps.apple.com/app/id0000000000"
};

(function () {
  "use strict";

  // ---- clean URLs: show /privacy instead of /privacy.html (and / instead of /index.html) ----
  if (/\.html$/.test(location.pathname) && window.history && history.replaceState) {
    const clean = location.pathname.replace(/(^|\/)index\.html$/, "$1").replace(/\.html$/, "");
    history.replaceState(null, "", clean + location.search + location.hash);
  }

  // ---- fill config-driven text / links ----
  document.querySelectorAll("[data-cfg]").forEach((el) => {
    const value = CONFIG[el.dataset.cfg];
    if (value) {
      el.textContent = value;
      el.classList.remove("placeholder");
    }
  });
  document.querySelectorAll("[data-cfg-mail]").forEach((a) => {
    if (CONFIG.supportEmail) a.href = "mailto:" + CONFIG.supportEmail;
    else a.removeAttribute("href");
  });

  const storeUrls = { google: CONFIG.googlePlayUrl, apple: CONFIG.appStoreUrl };
  document.querySelectorAll("[data-store]").forEach((a) => {
    const url = storeUrls[a.dataset.store];
    if (!url) return;
    a.href = url;
    a.rel = "noopener";
    a.removeAttribute("aria-disabled");
    a.querySelector("small").textContent = a.dataset.store === "google" ? "Get it on" : "Download on the";
  });

  document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

  // ---- mobile nav ----
  const nav = document.querySelector(".nav");
  const burger = document.querySelector(".burger");
  if (nav && burger) {
    const setOpen = (open) => {
      nav.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", String(open));
    };
    burger.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
    nav.querySelectorAll(".menu a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
  }

  // ---- screenshot lightbox ----
  const box = document.querySelector(".lightbox");
  if (box) {
    const img = box.querySelector("img");
    const close = box.querySelector(".close");
    let opener = null;
    const hide = () => {
      box.classList.remove("open");
      box.hidden = true;
      document.body.style.overflow = "";
      if (opener) opener.focus();
    };
    document.querySelectorAll("[data-zoom]").forEach((btn) => {
      btn.addEventListener("click", () => {
        opener = btn;
        img.src = btn.dataset.zoom;
        img.alt = btn.querySelector("img").alt;
        box.hidden = false;
        box.classList.add("open");
        document.body.style.overflow = "hidden";
        close.focus();
      });
    });
    close.addEventListener("click", hide);
    box.addEventListener("click", (e) => { if (e.target === box) hide(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && box.classList.contains("open")) hide(); });
  }

  // ---- support form: prepares an email (mailto / Gmail); nothing is sent by the page itself ----
  const form = document.getElementById("support-form");
  if (form && CONFIG.supportEmail) {
    const status = document.getElementById("status");
    const message = document.getElementById("message");
    const count = document.getElementById("count");
    const say = (text) => { status.textContent = text; };
    const compose = () => {
      const f = new FormData(form);
      const name = (f.get("name") || "").toString().trim();
      const device = (f.get("device") || "").toString().trim();
      const lines = [(f.get("message") || "").toString().trim(), "", "--", "Game: Pixel Dunes"];
      if (name) lines.push("Name: " + name);
      if (device) lines.push("Device: " + device);
      return { subject: "[Pixel Dunes] " + f.get("topic"), body: lines.join("\n") };
    };
    const ready = () => {
      if (form.reportValidity()) return compose();
      say("Please write a message first.");
      return null;
    };
    message.addEventListener("input", () => { count.textContent = message.value.length + " / " + message.maxLength; });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const mail = ready();
      if (!mail) return;
      window.location.href = "mailto:" + CONFIG.supportEmail + "?subject=" + encodeURIComponent(mail.subject) + "&body=" + encodeURIComponent(mail.body);
      say("Your email app should open with the message ready. If nothing happens, use \u201COpen in Gmail\u201D or copy the address below.");
    });
    document.getElementById("gmail").addEventListener("click", () => {
      const mail = ready();
      if (!mail) return;
      const url = "https://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(CONFIG.supportEmail) + "&su=" + encodeURIComponent(mail.subject) + "&body=" + encodeURIComponent(mail.body);
      window.open(url, "_blank", "noopener");
      say("Gmail opened in a new tab with the message ready \u2014 press send there.");
    });
    document.getElementById("copy").addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(CONFIG.supportEmail);
        say("Address copied: " + CONFIG.supportEmail);
      } catch (err) {
        say("Copy failed \u2014 the address is " + CONFIG.supportEmail);
      }
    });
  }
})();
