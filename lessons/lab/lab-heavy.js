/* The "JavaScript way" for the playground pages.
   A real site ships ~650 KB of JavaScript (median mobile page, Web Almanac 2025).
   We don't download 650 KB here. Instead a busy loop keeps the browser's brain (the main
   thread) busy for as long as that code would take to read and run. The playground sets
   how long (0 = no extra cost, just this small file). */
(() => {
  // ?cost= in the address, or the playground page's setting (some servers drop the ?part)
  const setting = name => { try { return new URLSearchParams(location.search).get(name) ?? parent.__lab?.[name]; } catch { return null; } };
  const cost = Number(setting('cost')) || 0;
  const busy = ms => { const end = performance.now() + ms; while (performance.now() < end) {} };

  // 1. "Framework" code: read, compile and run it
  performance.mark('lab-js-start');
  busy(cost * 0.7);
  performance.mark('lab-js-end');

  // 2. Build the widgets: hide the FAQ answers, wire up the clicks
  function init() {
    performance.mark('lab-init-start');
    busy(cost * 0.3);
    const qs = [...document.querySelectorAll('.q')];
    for (const q of qs) {
      const a = q.nextElementSibling;
      a.hidden = true;
      q.setAttribute('aria-expanded', 'false');
      q.addEventListener('click', () => {
        busy(cost * 0.15); // the "re-render" a framework does on every click
        const open = a.hidden;
        for (const other of qs) { other.nextElementSibling.hidden = true; other.setAttribute('aria-expanded', 'false'); }
        a.hidden = !open;
        q.setAttribute('aria-expanded', String(open));
      });
    }
    const btn = document.querySelector('.menu-btn');
    const menu = document.querySelector('.js-menu');
    btn.addEventListener('click', () => {
      busy(cost * 0.15);
      menu.hidden = !menu.hidden;
      btn.setAttribute('aria-expanded', String(!menu.hidden));
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') menu.hidden = true; });
    performance.mark('lab-init-end');
    performance.mark('lab-ready');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
