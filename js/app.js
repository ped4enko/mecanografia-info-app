import { TEXTS, stripAccents } from './texts.js';
import { LAYOUTS, keysFor, shiftSide } from './keyboard.js';
import { STRINGS, detectLang, safeGet, safeSet } from './i18n.js';

const $ = (id) => document.getElementById(id);
const TEST_SECONDS = 60;
const HISTORY_KEY = 'mi.history';
const HISTORY_MAX = 50;

const state = {
  lang: detectLang(),
  mode: safeGet('mi.mode') || 'practice',
  text: '',
  lastIndex: -1,
  startedAt: 0,
  finished: false,
  keystrokes: 0,
  errors: 0,
  timer: 0
};

const el = {
  text: $('text'), input: $('input'), textBox: $('textBox'),
  wpm: $('wpm'), acc: $('acc'), time: $('time'), level: $('level'),
  result: $('result'), resultLine: $('resultLine'),
  keyboard: $('keyboard'), trainer: $('trainer'), stats: $('stats')
};

const t = () => STRINGS[state.lang];
const layoutName = () => (state.lang === 'en' ? 'us' : 'es');

// ---------- Text selection ----------

function pick(list, avoid) {
  if (list.length < 2) return list[0];
  let item;
  do { item = list[Math.floor(Math.random() * list.length)]; } while (item === avoid);
  return item;
}

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildText() {
  const lang = state.lang;
  if (state.mode === 'kids') {
    return shuffle(TEXTS[`kids_${lang}`]).slice(0, 3).join(' ');
  }
  const list = TEXTS[lang];
  if (state.mode === 'test') {
    // Enough text that a fast typist will not run out within a minute.
    return shuffle(list).join(' ');
  }
  const text = pick(list, state.text);
  return state.mode === 'noaccents' ? stripAccents(text) : text;
}

// ---------- Rendering ----------

function renderText() {
  el.text.textContent = '';
  const frag = document.createDocumentFragment();
  for (const ch of state.text) {
    const span = document.createElement('span');
    span.textContent = ch;
    if (ch === ' ') span.className = 'space';
    frag.appendChild(span);
  }
  el.text.appendChild(frag);
  el.textBox.scrollTop = 0;
}

function paint() {
  const typed = el.input.value;
  const spans = el.text.children;
  const upTo = Math.max(typed.length, state.lastIndex) + 1;
  for (let i = 0; i < Math.min(upTo, spans.length); i++) {
    const span = spans[i];
    span.classList.remove('ok', 'err', 'current');
    if (i < typed.length) span.classList.add(typed[i] === state.text[i] ? 'ok' : 'err');
    else if (i === typed.length) span.classList.add('current');
  }
  state.lastIndex = typed.length;

  const current = spans[typed.length];
  if (current) {
    const box = el.textBox;
    const top = current.offsetTop - box.offsetTop;
    if (top > box.scrollTop + box.clientHeight - 48 || top < box.scrollTop) {
      box.scrollTop = Math.max(0, top - 40);
    }
  }
  highlightKeys(state.text[typed.length]);
}

function renderKeyboard() {
  const rows = LAYOUTS[layoutName()];
  el.keyboard.textContent = '';
  rows.forEach((row, r) => {
    const rowEl = document.createElement('div');
    rowEl.className = 'kb-row';
    if (r === 3) rowEl.appendChild(key('shift-l', '⇧', 'lp', 'wide'));
    for (const [base, shifted, finger] of row) {
      const label = /[a-zñç]/.test(base) ? base.toUpperCase() : base;
      const k = key(base, label, finger);
      if (!/[a-zñç]/.test(base)) k.dataset.shifted = shifted;
      if (base === 'f' || base === 'j') k.classList.add('bump');
      rowEl.appendChild(k);
    }
    if (r === 3) rowEl.appendChild(key('shift-r', '⇧', 'rp', 'wide'));
    el.keyboard.appendChild(rowEl);
  });
  const spaceRow = document.createElement('div');
  spaceRow.className = 'kb-row';
  spaceRow.appendChild(key('space', '', 'th', 'space'));
  el.keyboard.appendChild(spaceRow);
}

function key(id, label, finger, extra) {
  const k = document.createElement('div');
  k.className = `key f-${finger}${extra ? ' ' + extra : ''}`;
  k.dataset.key = id;
  k.textContent = label;
  return k;
}

function highlightKeys(ch) {
  el.keyboard.querySelectorAll('.next').forEach((k) => k.classList.remove('next'));
  for (const info of keysFor(ch, layoutName())) {
    el.keyboard.querySelector(`[data-key="${CSS.escape(info.id)}"]`)?.classList.add('next');
    if (info.shift) el.keyboard.querySelector(`[data-key="${shiftSide(info.finger)}"]`)?.classList.add('next');
  }
}

// ---------- Metrics ----------

function elapsedMs() {
  return state.startedAt ? Date.now() - state.startedAt : 0;
}

function correctChars() {
  const typed = el.input.value;
  let n = 0;
  for (let i = 0; i < typed.length; i++) if (typed[i] === state.text[i]) n++;
  return n;
}

function computeWpm() {
  const minutes = elapsedMs() / 60000;
  return minutes > 0.02 ? Math.round(correctChars() / 5 / minutes) : 0;
}

function computeAcc() {
  if (!state.keystrokes) return 100;
  return Math.max(0, Math.round(((state.keystrokes - state.errors) / state.keystrokes) * 100));
}

function levelFor(wpm) {
  const idx = wpm < 15 ? 0 : wpm < 30 ? 1 : wpm < 45 ? 2 : wpm < 60 ? 3 : 4;
  return t().levels[idx];
}

function fmtTime(ms) {
  const s = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function updateMetrics() {
  const wpm = computeWpm();
  el.wpm.textContent = wpm;
  el.acc.textContent = `${computeAcc()}%`;
  el.time.textContent = state.mode === 'test'
    ? fmtTime(TEST_SECONDS * 1000 - elapsedMs())
    : fmtTime(elapsedMs());
  el.level.textContent = state.startedAt ? levelFor(wpm) : '—';
}

// ---------- Session flow ----------

function reset(newText = true) {
  clearInterval(state.timer);
  if (newText || !state.text) state.text = buildText();
  Object.assign(state, { lastIndex: -1, startedAt: 0, finished: false, keystrokes: 0, errors: 0, timer: 0 });
  el.input.value = '';
  el.input.disabled = false;
  el.input.maxLength = state.text.length;
  el.result.hidden = true;
  renderText();
  paint();
  updateMetrics();
  focusInput();
}

function start() {
  state.startedAt = Date.now();
  state.timer = setInterval(() => {
    updateMetrics();
    if (state.mode === 'test' && elapsedMs() >= TEST_SECONDS * 1000) finish();
  }, 250);
}

function finish() {
  if (state.finished) return;
  state.finished = true;
  clearInterval(state.timer);
  if (state.mode === 'test') state.startedAt = Date.now() - TEST_SECONDS * 1000;
  updateMetrics();
  el.input.disabled = true;
  const wpm = computeWpm();
  const acc = computeAcc();
  el.resultLine.textContent = t().resultLine(wpm, acc);
  el.result.hidden = false;
  saveSession({ wpm, acc, mode: state.mode, lang: state.lang, at: Date.now() });
  $('newBtn').focus();
}

function onInput(e) {
  // Dead keys (´ ¨ `) can open a composition; wait until the accented letter is final.
  if (state.finished || e?.isComposing) return;
  const typed = el.input.value;
  if (!state.startedAt && typed.length) start();
  // Count every newly typed character as a keystroke; mistakes stay counted after backspace.
  if (typed.length > state.lastIndex) {
    for (let i = Math.max(0, state.lastIndex); i < typed.length; i++) {
      state.keystrokes++;
      if (typed[i] !== state.text[i]) state.errors++;
    }
  }
  paint();
  updateMetrics();
  if (typed.length >= state.text.length) finish();
}

function focusInput() {
  if (!el.trainer.hidden) el.input.focus({ preventScroll: true });
}

// ---------- Stats ----------

function loadHistory() {
  try { return JSON.parse(safeGet(HISTORY_KEY)) || []; } catch { return []; }
}

function saveSession(session) {
  const history = loadHistory();
  history.push(session);
  safeSet(HISTORY_KEY, JSON.stringify(history.slice(-HISTORY_MAX)));
}

function renderStats() {
  const history = loadHistory();
  const wpms = history.map((h) => h.wpm);
  $('statBest').textContent = wpms.length ? Math.max(...wpms) : 0;
  $('statAvg').textContent = wpms.length ? Math.round(wpms.reduce((a, b) => a + b, 0) / wpms.length) : 0;
  $('statCount').textContent = history.length;
  $('statsEmpty').hidden = history.length > 0;

  const chart = $('chart');
  chart.textContent = '';
  const recent = history.slice(-20);
  const max = Math.max(10, ...recent.map((h) => h.wpm));
  for (const h of recent) {
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = `${Math.max(4, (h.wpm / max) * 100)}%`;
    bar.title = `${h.wpm} ${t().wpm} · ${h.acc}% · ${new Date(h.at).toLocaleDateString(state.lang)}`;
    const label = document.createElement('span');
    label.textContent = h.wpm;
    bar.appendChild(label);
    chart.appendChild(bar);
  }
}

// ---------- Mode, language, theme ----------

function setMode(mode) {
  state.mode = mode;
  safeSet('mi.mode', mode);
  document.querySelectorAll('.mode').forEach((b) => {
    const active = b.dataset.mode === mode;
    b.classList.toggle('active', active);
    b.setAttribute('aria-selected', active);
  });
  const isStats = mode === 'stats';
  el.trainer.hidden = isStats;
  el.stats.hidden = !isStats;
  if (isStats) {
    clearInterval(state.timer);
    renderStats();
  } else {
    reset(true);
  }
}

function applyLang() {
  const s = t();
  document.documentElement.lang = state.lang;
  $('langSelect').value = state.lang;
  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const v = s[node.dataset.i18n];
    if (typeof v === 'string') node.textContent = v;
  });
  document.querySelectorAll('[data-i18n-title]').forEach((node) => {
    const v = s[node.dataset.i18nTitle];
    node.title = v;
    node.setAttribute('aria-label', v);
  });
  const list = $('helpList');
  list.textContent = '';
  for (const line of s.helpBody) {
    const li = document.createElement('li');
    li.textContent = line;
    list.appendChild(li);
  }
  renderKeyboard();
}

function toggleTheme() {
  const root = document.documentElement;
  const current = root.dataset.theme
    || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const next = current === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  safeSet('mi.theme', next);
}

let toastTimer = 0;
function toast(message, action) {
  const node = $('toast');
  node.textContent = message;
  if (action) {
    const btn = document.createElement('button');
    btn.className = 'btn btn-primary';
    btn.textContent = action.label;
    btn.addEventListener('click', action.run);
    node.appendChild(btn);
  }
  node.hidden = false;
  clearTimeout(toastTimer);
  if (!action) toastTimer = setTimeout(() => { node.hidden = true; }, 4000);
}

// ---------- PWA ----------

function setupPwa() {
  let deferred = null;
  const installBtn = $('installBtn');
  addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferred = e;
    installBtn.hidden = false;
  });
  installBtn.addEventListener('click', async () => {
    if (!deferred) return;
    deferred.prompt();
    await deferred.userChoice;
    deferred = null;
    installBtn.hidden = true;
  });
  addEventListener('appinstalled', () => { installBtn.hidden = true; });
  addEventListener('offline', () => toast(t().offline));

  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.register('sw.js').then((reg) => {
    reg.addEventListener('updatefound', () => {
      const worker = reg.installing;
      worker?.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) {
          toast(t().updated, { label: t().reload, run: () => worker.postMessage('skipWaiting') });
        }
      });
    });
  }).catch(() => { /* offline support unavailable */ });
  // Reload only when an updated worker replaces an existing one, not on first install.
  const hadController = !!navigator.serviceWorker.controller;
  let reloading = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading || !hadController) return;
    reloading = true;
    location.reload();
  });
}

// ---------- Wiring ----------

function init() {
  $('year').textContent = new Date().getFullYear();
  applyLang();

  el.input.addEventListener('input', onInput);
  el.input.addEventListener('compositionend', () => onInput());
  el.input.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') { e.preventDefault(); reset(false); }
  });
  el.textBox.addEventListener('click', focusInput);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && state.finished && !el.trainer.hidden) { e.preventDefault(); reset(false); }
  });

  $('restartBtn').addEventListener('click', () => reset(false));
  $('newBtn').addEventListener('click', () => reset(true));
  document.querySelectorAll('.mode').forEach((b) => b.addEventListener('click', () => setMode(b.dataset.mode)));
  $('langSelect').addEventListener('change', (e) => {
    state.lang = e.target.value;
    safeSet('mi.lang', state.lang);
    applyLang();
    setMode(state.mode);
  });
  $('themeBtn').addEventListener('click', toggleTheme);
  $('helpBtn').addEventListener('click', () => $('helpDialog').showModal());
  $('resetStats').addEventListener('click', () => {
    if (confirm(t().confirmReset)) { safeSet(HISTORY_KEY, '[]'); renderStats(); }
  });

  // Deep links from the manifest shortcuts, e.g. ?mode=test
  const urlMode = new URLSearchParams(location.search).get('mode');
  const valid = ['practice', 'test', 'kids', 'noaccents', 'stats'];
  setMode(valid.includes(urlMode) ? urlMode : valid.includes(state.mode) ? state.mode : 'practice');

  setupPwa();
}

init();
