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
  // Screens showcase: every few seconds the whole slide swipes left and the next colourway blends in.
  var show = document.getElementById("screens"), track = document.getElementById("track");
  if (show && track) {
    var sw = show.querySelectorAll(".sw"), n = sw.length, idx = 0, timer = null, paused = false, busy = false;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var pauseBtn = document.getElementById("pause");
    function paint() {
      track.style.transform = "translateX(" + (-idx * 20) + "%)";
      show.setAttribute("data-c", idx % n);
      for (var i = 0; i < n; i++) sw[i].classList.toggle("on", i === idx % n);
    }
    function snapBack() { track.classList.add("snap"); idx = 0; track.style.transform = "translateX(0)"; void track.offsetWidth; track.classList.remove("snap"); busy = false; }
    function go(to) {
      if (busy) return;
      if (to < 0) { track.classList.add("snap"); idx = n; track.style.transform = "translateX(" + (-n * 20) + "%)"; void track.offsetWidth; track.classList.remove("snap"); to = n - 1; }
      idx = to; busy = true; paint();
      var done = false;
      function fin() { if (done) return; done = true; if (idx >= n) snapBack(); else busy = false; }
      track.addEventListener("transitionend", function h(e) { if (e.target === track) { track.removeEventListener("transitionend", h); fin(); } });
      setTimeout(fin, reduce ? 0 : 1300);
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function start() { if (!timer && !paused && !reduce) timer = setInterval(function () { go(idx + 1); }, 4300); }
    for (var k = 0; k < n; k++) (function (j) { sw[j].addEventListener("click", function () { stop(); paused = true; syncPause(); go(j); }); })(k);
    function syncPause() { if (pauseBtn) { pauseBtn.setAttribute("aria-pressed", paused ? "true" : "false"); pauseBtn.textContent = paused ? "▶" : "❚❚"; } }
    if (pauseBtn) pauseBtn.addEventListener("click", function () { paused = !paused; syncPause(); if (paused) stop(); else start(); });
    var x0 = null;
    show.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    show.addEventListener("touchend", function (e) {
      if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 50) { stop(); paused = true; syncPause(); go(dx < 0 ? idx + 1 : idx - 1); }
    });
    document.addEventListener("visibilitychange", function () { if (document.hidden) stop(); else start(); });
    paint(); syncPause(); start();
  }
  // Join the waitlist: every Join button opens a small form where the visitor writes their email.
  var dlg = document.getElementById("join"), form = document.getElementById("join-form");
  if (dlg && form && dlg.showModal) {
    var em = document.getElementById("join-email"), err = document.getElementById("join-err"), ok = document.getElementById("join-ok");
    var openers = document.querySelectorAll('a[href="#contact"], a[href="/#contact"], #mail');
    function openJoin(e) { e.preventDefault(); err.hidden = true; ok.hidden = true; dlg.showModal(); em.focus(); }
    for (var i = 0; i < openers.length; i++) openers[i].addEventListener("click", openJoin);
    document.getElementById("join-close").addEventListener("click", function () { dlg.close(); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = em.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { err.hidden = false; em.setAttribute("aria-invalid", "true"); em.focus(); return; }
      err.hidden = true; em.removeAttribute("aria-invalid");
      var endpoint = form.getAttribute("data-endpoint");
      if (endpoint) {
        // Wire a signup endpoint here (see README). The email is sent as JSON.
        fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: v }) })
          .then(function (r) { if (!r.ok) throw 0; ok.querySelector("span").textContent = document.documentElement.lang === "ar" ? "تمت إضافتك إلى قائمة الانتظار." : "You are on the waitlist."; ok.hidden = false; })
          .catch(function () { window.location.href = mailtoFor(v); });
      } else {
        ok.hidden = false;
        window.location.href = mailtoFor(v);
      }
    });
    function mailtoFor(v) {
      var ar = document.documentElement.lang === "ar";
      var subj = ar ? "قائمة انتظار هارت بايلوت" : "HeartPilot waitlist";
      var body = ar ? "أرجو إضافتي إلى قائمة انتظار هارت بايلوت.\n\nبريدي الإلكتروني: " + v : "Please add me to the HeartPilot waitlist.\n\nMy email: " + v;
      return "mailto:" + form.getAttribute("data-to") + "?subject=" + encodeURIComponent(subj) + "&body=" + encodeURIComponent(body);
    }
  }
})();
