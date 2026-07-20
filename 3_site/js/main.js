/* ==========================================================================
   Copper Cup Coffee — main.js
   ========================================================================== */

(function () {
  "use strict";

  var LANG_KEY = "site-lang";

  /* ---------- i18n ---------- */
  function applyLang(lang) {
    var dict = window.I18N[lang] || window.I18N.en;
    document.documentElement.setAttribute("lang", lang);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) el.textContent = dict[key];
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-placeholder");
      if (dict[key] !== undefined) el.setAttribute("placeholder", dict[key]);
    });

    if (dict["meta.title"]) document.title = dict["meta.title"];
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && dict["meta.description"]) metaDesc.setAttribute("content", dict["meta.description"]);

    document.querySelectorAll(".lang-switch button, .lang-switch-mobile button").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-lang") === lang);
    });

    localStorage.setItem(LANG_KEY, lang);
  }

  function initLangSwitch() {
    var saved = localStorage.getItem(LANG_KEY) || "en";
    applyLang(saved);
    document.querySelectorAll("[data-lang]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyLang(btn.getAttribute("data-lang"));
      });
    });
  }

  /* ---------- Sticky header ---------- */
  function initStickyHeader() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    function onScroll() {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobile nav ---------- */
  function initMobileNav() {
    var burger = document.querySelector(".burger");
    var nav = document.querySelector(".mobile-nav");
    if (!burger || !nav) return;
    function close() {
      nav.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
    }
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("nav-open", open);
    });
    nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", close); });
  }

  /* ---------- FAQ accordion ---------- */
  function initFaq() {
    document.querySelectorAll(".faq-item").forEach(function (item) {
      var question = item.querySelector(".faq-question");
      if (!question) return;
      question.addEventListener("click", function () {
        var wasOpen = item.classList.contains("is-open");
        item.closest(".faq-list").querySelectorAll(".faq-item").forEach(function (el) {
          el.classList.remove("is-open");
          el.querySelector(".faq-question").setAttribute("aria-expanded", "false");
        });
        if (!wasOpen) {
          item.classList.add("is-open");
          question.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  /* ---------- Menu tabs ---------- */
  function initTabs() {
    var tabs = document.querySelectorAll(".menu-tab");
    var panels = document.querySelectorAll(".menu-panel");
    if (!tabs.length) return;
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var target = tab.getAttribute("data-tab");
        tabs.forEach(function (t) { t.classList.toggle("is-active", t === tab); });
        panels.forEach(function (p) { p.classList.toggle("is-active", p.getAttribute("data-panel") === target); });
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("in-view"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach(function (el) { observer.observe(el); });

    // Safety net: never leave content permanently hidden if the observer
    // fails to catch an element (e.g. zero-height edge cases).
    setTimeout(function () {
      items.forEach(function (el) { el.classList.add("in-view"); });
    }, 2500);
  }

  /* ---------- Forms ---------- */
  function initForms() {
    document.querySelectorAll("form[data-form]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!form.checkValidity()) { form.reportValidity(); return; }
        var success = form.querySelector(".form-success");
        if (success) success.classList.add("is-visible");
        form.reset();
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initLangSwitch();
    initStickyHeader();
    initMobileNav();
    initFaq();
    initTabs();
    initReveal();
    initForms();
  });
})();
