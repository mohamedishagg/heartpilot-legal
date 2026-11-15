(function () {
  var KEY = "hp-lang", root = document.documentElement;
  function m(n) { var e = document.querySelector('meta[name="' + n + '"]'); return e ? e.content : null; }
  var meta = {
    en: { title: document.title, desc: m("description") },
    ar: { title: m("title-ar"), desc: m("description-ar") }
  };
  var is404 = !!document.querySelector('meta[name="robots"]');
  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function apply(lang) {
    root.lang = lang; root.dir = lang === "ar" ? "rtl" : "ltr";
    if (is404) document.title = lang === "ar" ? "الصفحة غير موجودة | هارت بايلوت" : meta.en.title;
    else if (meta[lang].title) document.title = meta[lang].title;
    var d = document.querySelector('meta[name="description"]');
    if (d && meta[lang].desc) d.content = meta[lang].desc;
    var els = document.querySelectorAll("[data-aria-en]");
    for (var i = 0; i < els.length; i++) els[i].setAttribute("aria-label", els[i].getAttribute("data-aria-" + lang));
    var mail = document.getElementById("mail");
    if (mail) mail.href = "mailto:" + mail.getAttribute("href").split("?")[0].replace("mailto:", "") +
      "?subject=" + encodeURIComponent(mail.getAttribute("data-subj-" + lang));
  }
  var saved = read();
  apply(saved === "ar" ? "ar" : "en");
  var b = document.getElementById("lang");
  if (b) b.addEventListener("click", function () {
    var next = root.lang === "ar" ? "en" : "ar"; apply(next); save(next);
  });
  // Screens carousel: the next screen waits small in the corner, then glides to the centre.
  var stage = document.getElementById("carousel");
  if (stage) {
    var slots = stage.querySelectorAll(".slot"), caps = document.querySelectorAll(".scap"),
        dots = document.querySelectorAll(".dot-btn"), n = slots.length, idx = 0, timer = null, userMoved = false;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function render() {
      for (var i = 0; i < n; i++) {
        slots[i].className = "slot p" + ((i - idx + n) % n);
        caps[i].classList.toggle("on", i === idx);
        dots[i].classList.toggle("on", i === idx);
      }
      stage.setAttribute("data-i", idx);
    }
    function go(to, byUser) { idx = (to + n) % n; if (byUser) { userMoved = true; stop(); } render(); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function start() { if (!timer && !userMoved && !reduce) timer = setInterval(function () { go(idx + 1, false); }, 4800); }
    document.getElementById("next").addEventListener("click", function () { go(idx + 1, true); });
    document.getElementById("prev").addEventListener("click", function () { go(idx - 1, true); });
    for (var d = 0; d < n; d++) (function (k) { dots[k].addEventListener("click", function () { go(k, true); }); })(d);
    for (var q = 0; q < n; q++) (function (k) { slots[k].addEventListener("click", function () { if (slots[k].className.indexOf("p1") > -1) go(k, true); }); })(q);
    stage.addEventListener("mouseenter", stop);
    stage.addEventListener("mouseleave", start);
    document.addEventListener("visibilitychange", function () { if (document.hidden) stop(); else start(); });
    render(); start();
  }
})();
