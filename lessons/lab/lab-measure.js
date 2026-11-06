/* The measuring tape. Loaded the same way (defer) on all three pages, so it costs the same
   everywhere. It reads the browser's own timings and sends them to the playground page.
   Measuring is a real "brain" job, so this part needs JavaScript. */
(() => {
  const lab = document.documentElement.dataset.lab;
  const waitsForJs = document.documentElement.dataset.ready === 'js';
  const setting = name => { try { return new URLSearchParams(location.search).get(name) ?? parent.__lab?.[name]; } catch { return null; } };
  const run = setting('run');
  const send = (name, value) => { if (parent !== window) parent.postMessage({ lab, run, name, value }, '*'); };
  const watch = (type, cb, opts = {}) => {
    try { new PerformanceObserver(list => list.getEntries().forEach(cb)).observe({ type, buffered: true, ...opts }); } catch {}
  };
  const markAt = name => performance.getEntriesByName(name)[0]?.startTime;
  const nav = performance.getEntriesByType('navigation')[0];

  // TTFB: first byte of the HTML arrived
  if (nav) send('ttfb', nav.responseStart);

  // FCP: first text or picture painted
  let fcp = 0;
  watch('paint', e => { if (e.name === 'first-contentful-paint') { fcp = e.startTime; send('fcp', fcp); sendReady(); } });

  // LCP: the biggest thing painted
  watch('largest-contentful-paint', e => send('lcp', e.startTime));
  // Ask once more at the end, in case the browser was slow to hand the entries over
  const finalLcp = () => new Promise(done => {
    try {
      const po = new PerformanceObserver(l => { const all = l.getEntries(); po.disconnect(); done(all.at(-1)?.startTime); });
      po.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch { done(); }
    setTimeout(done, 500);
  });

  // CLS: how much things jumped around (not counting jumps right after a click)
  let cls = 0;
  watch('layout-shift', e => { if (!e.hadRecentInput) { cls += e.value; send('cls', cls); } });

  // INP: the slowest click so far (from click to the next painted frame)
  let inp = 0;
  watch('event', e => { if (e.interactionId && e.duration > inp) { inp = e.duration; send('inp', inp); } }, { durationThreshold: 16 });

  // Main thread busy: long tasks (over 50 ms). An early listener in <head> catches the first ones.
  const longTasks = () => {
    const early = window.__longTasks || [];
    const seen = new Set();
    return early.filter(t => !seen.has(t.startTime) && seen.add(t.startTime));
  };
  const busyTotal = () => {
    const tasks = longTasks();
    if (tasks.length || 'PerformanceLongTaskTiming' in window) return tasks.reduce((s, t) => s + t.duration, 0);
    // Browsers without the Long Tasks API: use our own marks instead
    return jsSpans().reduce((s, [a, b]) => s + (b - a > 50 ? b - a : 0), 0);
  };
  const jsSpans = () => [['lab-js-start', 'lab-js-end'], ['lab-init-start', 'lab-init-end']]
    .map(([a, b]) => [markAt(a), markAt(b)]).filter(([a, b]) => a != null && b != null);

  // Ready to click: painted AND the buttons actually work
  function sendReady() {
    if (!fcp) return;
    const wired = waitsForJs ? markAt('lab-ready') : nav?.domInteractive; // CSS page: works as soon as the HTML is read
    if (wired != null) send('ready', Math.max(fcp, wired));
  }

  addEventListener('load', () => setTimeout(async () => {
    const lcp = await finalLcp();
    if (lcp != null) send('lcp', lcp);
    sendReady();
    send('busy', busyTotal());
    const dl = performance.getEntriesByType('resource').find(r => r.name.includes('lab-heavy.js'));
    send('done', { js: jsSpans(), dl: dl ? [dl.startTime, dl.responseEnd] : null, load: nav ? nav.loadEventStart : performance.now() });
  }, 800));
  // keep "busy" live after clicks too
  setInterval(() => send('busy', busyTotal()), 1000);
})();
