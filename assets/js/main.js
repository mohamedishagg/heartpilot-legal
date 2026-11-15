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
})();
