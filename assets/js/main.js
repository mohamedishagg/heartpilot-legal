(function () {
  var KEY = "hp-lang", root = document.documentElement;
  var meta = {
    en: { title: document.title, desc: (document.querySelector('meta[name="description"]') || {}).content },
    ar: { title: "هارت بايلوت: رعاية قصور القلب ترافق المريض إلى بيته",
          desc: "هارت بايلوت تطبيق للفحص اليومي لمرضى قصور القلب بالعربية والإنجليزية. يخبر المريض بما يفعله وينبّه أحد أفراد العائلة عند الحاجة. قيد التحضير للتجربة." }
  };
  var is404 = /^\/404/.test(location.pathname) || document.querySelector('meta[name="robots"]');
  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function apply(lang) {
    root.lang = lang; root.dir = lang === "ar" ? "rtl" : "ltr";
    if (!is404) {
      document.title = meta[lang].title;
      var d = document.querySelector('meta[name="description"]');
      if (d && meta[lang].desc) d.content = meta[lang].desc;
    } else {
      document.title = lang === "ar" ? "الصفحة غير موجودة | هارت بايلوت" : "Page not found | HeartPilot";
    }
    var els = document.querySelectorAll("[data-aria-en]");
    for (var i = 0; i < els.length; i++) els[i].setAttribute("aria-label", els[i].getAttribute("data-aria-" + lang));
    var m = document.getElementById("mail");
    if (m) m.href = "mailto:" + m.getAttribute("href").split("?")[0].replace("mailto:", "") +
      "?subject=" + encodeURIComponent(m.getAttribute("data-subj-" + lang));
  }
  var saved = read();
  apply(saved === "ar" ? "ar" : "en");
  var b = document.getElementById("lang");
  if (b) b.addEventListener("click", function () {
    var next = root.lang === "ar" ? "en" : "ar"; apply(next); save(next);
  });
  var menu = document.getElementById("menu"), nav = document.getElementById("nav");
  if (menu && nav) {
    menu.addEventListener("click", function () {
      var o = nav.classList.toggle("open"); menu.setAttribute("aria-expanded", o ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") { nav.classList.remove("open"); menu.setAttribute("aria-expanded", "false"); }
    });
  }
})();
