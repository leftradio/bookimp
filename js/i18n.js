/* js/i18n.js
   - Loads short UI strings from: /locales/{lang}.json
   - Loads long-form text from Markdown: /content/{lang}/about.md and /content/{lang}/guide.md
   - Applies JSON strings to elements with [data-i18n="..."]
   - Injects Markdown HTML into #about-md and #guide-md (requires marked; falls back to plain text)
   - Supports RU/EN toggle buttons: .lang-btn[data-lang="en|ru"] with active state .is-active
*/

(function () {
  const supported = ["en", "ru"];

  function get(obj, path) {
    return path
      .split(".")
      .reduce((acc, key) => (acc && acc[key] != null ? acc[key] : null), obj);
  }

  function detectLang() {
    const saved = localStorage.getItem("lang");
    if (saved && supported.includes(saved)) return saved;

    return "en"; // default if nothing saved
  }


  async function loadLocale(lang) {
    const res = await fetch(`locales/${lang}.json`, { cache: "no-cache" });
    if (!res.ok) throw new Error(`Failed to load locales/${lang}.json (${res.status})`);
    return await res.json();
  }

  function applyTranslations(dict) {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = get(dict, key);
      if (val == null) return;
      el.textContent = val;
    });
  }




  async function loadMarkdown(lang, name, targetId) {
    const el = document.getElementById(targetId);
    if (!el) return;

    const res = await fetch(`content/${lang}/${name}.md`, { cache: "no-cache" });
    if (!res.ok) {
      console.warn(`[i18n] Missing content/${lang}/${name}.md (${res.status})`);
      el.textContent = "";
      return;
    }

    const md = await res.text();

    if (window.marked && typeof window.marked.parse === "function") {
      el.innerHTML = window.marked.parse(md);
    } else {
      // Fallback: show plain text if marked isn't available
      console.warn(`[i18n] Missing content/${lang}/${name}.md (${res.status})`);
      el.textContent = md;
    }
  }

  function updateLangUI(lang) {
    document.querySelectorAll(".lang-btn").forEach((b) => {
      b.classList.toggle("is-active", b.getAttribute("data-lang") === lang);
    });
  }

  async function setLang(lang) {
    if (!supported.includes(lang)) lang = "en";

    localStorage.setItem("lang", lang);
    document.documentElement.setAttribute("lang", lang);

    // Short strings
    const dict = await loadLocale(lang);
    applyTranslations(dict);

    // texts Markdown
    await loadMarkdown(lang, "about", "about-md");
    await loadMarkdown(lang, "technical", "technical-md");
    await loadMarkdown(lang, "guide", "guide-md");

    // UI state for language buttons
    updateLangUI(lang);
  }

  window.BookimpI18n = { setLang };

  document.addEventListener("DOMContentLoaded", () => {
    const initial = detectLang();
    setLang(initial).catch(console.error);

    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const lang = btn.getAttribute("data-lang");
        setLang(lang).catch(console.error);
      });
    });
  });
})();
