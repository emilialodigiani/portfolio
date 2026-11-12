// Resalta en la barra de navegación la sección visible.
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  if (!links.length || !('IntersectionObserver' in window)) return;
  var byId = {};
  links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting || !byId[e.target.id]) return;
      links.forEach(function (l) { l.classList.remove('is-active'); });
      byId[e.target.id].classList.add('is-active');
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  Object.keys(byId).forEach(function (id) {
    var el = document.getElementById(id);
    if (el) obs.observe(el);
  });
})();

// Botones "Ver más": muestran u ocultan lo anterior a 2023.
(function () {
  document.querySelectorAll('.more-btn').forEach(function (btn) {
    var list = document.getElementById(btn.getAttribute('aria-controls'));
    if (!list) return;
    btn.addEventListener('click', function () {
      var open = list.classList.toggle('show-all');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.textContent = open ? 'Ver menos' : 'Ver más';
      if (list.classList.contains('career')) rescaleCareer(list);
    });
    if (list.classList.contains('career')) rescaleCareer(list);
  });
})();

// Ajusta la escala del timeline a los años visibles (la base es 2013–2027).
function rescaleCareer(list) {
  var BASE0 = 2013, SPAN = 14;
  var rows = Array.prototype.slice.call(list.querySelectorAll('.career-row'))
    .filter(function (r) { return r.offsetParent !== null || getComputedStyle(r).display !== 'none'; });
  var bars = [];
  rows.forEach(function (r) {
    var bar = r.querySelector('.bar');
    if (!bar) return;
    if (!bar.dataset.l) { bar.dataset.l = parseFloat(bar.style.left); bar.dataset.w = parseFloat(bar.style.width); }
    bars.push(bar);
  });
  if (!bars.length) return;
  var minStart = Math.min.apply(null, bars.map(function (b) { return BASE0 + b.dataset.l / 100 * SPAN; }));
  var from = Math.floor(minStart), to = BASE0 + SPAN, span = to - from;
  bars.forEach(function (b) {
    var s = BASE0 + b.dataset.l / 100 * SPAN, w = b.dataset.w / 100 * SPAN;
    b.style.left = ((s - from) / span * 100) + '%';
    b.style.width = (w / span * 100) + '%';
  });
  var years = list.querySelector('.years');
  if (years) {
    var step = span > 6 ? 2 : 1, html = '';
    for (var y = from + (span > 6 ? 1 : 0); y < to; y += step) {
      html += '<span style="left:' + ((y + 0.5 - from) / span * 100) + '%">' + y + '</span>';
    }
    years.innerHTML = html;
  }
}
