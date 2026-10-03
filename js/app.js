const $ = id => document.getElementById(id);
let ALL = [], Q = [], P = {}, i = 0, hits = 0, missed = new Set();
const VISUAL = "Reconheça a embalagem";

function parseCSV(t) {
  t = t.replace(/^\uFEFF/, ""); const rows = []; let r = [], f = "", q = false;
  for (let k = 0; k < t.length; k++) {
    const c = t[k];
    if (q) { if (c === '"') { if (t[k + 1] === '"') { f += '"'; k++; } else q = false; } else f += c; }
    else if (c === '"') q = true;
    else if (c === ",") { r.push(f); f = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && t[k + 1] === "\n") k++; r.push(f); f = ""; if (r.some(x => x.trim())) rows.push(r); r = []; }
    else f += c;
  }
  if (f || r.length) { r.push(f); rows.push(r); }
  const h = rows.shift().map(x => x.trim());
  return rows.map(v => Object.fromEntries(h.map((k, n) => [k, (v[n] || "").trim()])));
}
const shuffle = a => { for (let n = a.length - 1; n > 0; n--) { const j = Math.floor(Math.random() * (n + 1)); [a[n], a[j]] = [a[j], a[n]]; } return a; };
const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt) e.textContent = txt; return e; };

// Imagem do produto: tenta img/<slug>.png (local), depois a URL oficial, depois um espaço reservado.
function placeholder() {
  const d = el("div", "ph"); d.innerHTML = '<svg viewBox="0 0 56 80" fill="none" stroke="#6b4a66" stroke-width="3"><rect x="18" y="2" width="20" height="12" rx="3"/><path d="M14 22c0-4 4-8 14-8s14 4 14 8v50c0 4-4 6-14 6s-14-2-14-6z"/></svg><span>imagem indisponível</span>';
  return d;
}
function tile(slug, alt) {
  const t = el("div", "tile"), im = new Image(), p = P[slug]; let step = 0;
  im.alt = alt || ""; im.referrerPolicy = "no-referrer"; im.decoding = "async";
  im.onerror = () => { if (++step === 1 && p && p.imagem_url) im.src = p.imagem_url; else { im.onerror = null; im.replaceWith(placeholder()); } };
  im.src = "img/" + slug + ".png"; t.appendChild(im); return t;
}

function menu() {
  ["quiz", "end", "load"].forEach(s => $(s).hidden = true); $("menu").hidden = false;
  $("prog").style.width = "0"; $("count").textContent = "";
  const v = ALL.filter(x => x.categoria === VISUAL).length;
  $("n-all").textContent = ALL.length + " perguntas"; $("n-visual").textContent = v + " perguntas"; $("n-know").textContent = (ALL.length - v) + " perguntas";
}
function start(mode) {
  const pool = ALL.filter(x => mode === "visual" ? x.categoria === VISUAL : mode === "know" ? x.categoria !== VISUAL : true);
  Q = shuffle(pool.slice()); i = 0; hits = 0; missed = new Set();
  $("menu").hidden = $("end").hidden = true; $("quiz").hidden = false; show();
}
function show() {
  const p = Q[i], done = { v: false }, visual = !!p.imagem_pergunta;
  $("cat").textContent = p.categoria; $("q").textContent = p.pergunta;
  $("count").textContent = `${i + 1}/${Q.length}`; $("prog").style.width = (i / Q.length * 100) + "%";
  $("hint").textContent = visual ? "Observe a embalagem e escolha a função certa" : "Escolha a resposta certa";
  $("qimg").hidden = !visual; $("qimg").innerHTML = ""; if (visual) $("qimg").appendChild(tile(p.imagem_pergunta, "Embalagem do produto"));
  $("reveal").hidden = true; $("reveal").innerHTML = "";
  $("next").disabled = true; $("next").textContent = "Escolha uma resposta";
  const opts = shuffle([["A", p.opcao_a, p.explicacao_a], ["B", p.opcao_b, p.explicacao_b]]);
  $("cards").innerHTML = "";
  opts.forEach(([key, txt, exp], n) => {
    const right = key === p.correta.toUpperCase(), b = document.createElement("button");
    b.className = "card c" + n; b.dataset.right = right;
    b.innerHTML = `<div class="in"><div class="face front"><span class="letter">${n ? "B" : "A"}</span><p></p></div><div class="face back"><span class="verdict">${right ? "✓ Resposta correta" : "✗ Não é essa"}</span><p class="exp"></p><span class="pick"></span></div></div>`;
    b.querySelector(".front p").textContent = txt; b.querySelector(".exp").textContent = exp;
    b.onclick = () => {
      if (done.v) return; done.v = true;
      if (right) hits++; else (p.produtos || "").split("|").forEach(s => s && missed.add(s));
      document.querySelectorAll(".card").forEach(c => c.classList.add("flip", c.dataset.right === "true" ? "ok" : "no"));
      b.querySelector(".pick").textContent = "Sua escolha";
      reveal(p);
      $("next").disabled = false; $("next").textContent = i === Q.length - 1 ? "Ver resultado" : "Próxima pergunta"; $("next").focus();
    };
    $("cards").appendChild(b);
  });
}
// A imagem do produto só aparece DEPOIS da resposta (exceto nas perguntas de reconhecimento), para não induzir a escolha.
function reveal(p) {
  const r = $("reveal"); r.innerHTML = ""; r.appendChild(el("h2", "", "Conheça o produto"));
  (p.produtos || "").split("|").filter(s => P[s]).forEach(s => {
    const it = el("div", "item"), tx = el("div"); it.appendChild(tile(s, P[s].nome));
    tx.appendChild(el("span", "", P[s].linha)); tx.appendChild(el("b", "", P[s].nome)); tx.appendChild(el("small", "", P[s].resumo));
    it.appendChild(tx); r.appendChild(it);
  });
  r.hidden = false;
}
$("next").onclick = () => {
  if (++i < Q.length) return show();
  $("quiz").hidden = true; $("end").hidden = false; $("prog").style.width = "100%"; $("count").textContent = "";
  $("score").textContent = `${hits}/${Q.length}`;
  $("msg").textContent = hits / Q.length >= .8 ? "Excelente! Você conhece bem a linha Borabella." : hits / Q.length >= .5 ? "Bom caminho! Refaça para fixar as explicações." : "Vale rever as explicações dos cards e tentar de novo.";
  const g = $("missedGrid"); g.innerHTML = ""; const ms = [...missed].filter(s => P[s]);
  ms.forEach(s => { const d = el("div"); d.appendChild(tile(s, P[s].nome)); d.appendChild(el("small", "", P[s].nome)); g.appendChild(d); });
  $("missed").hidden = !ms.length;
};
$("again").onclick = menu;
document.querySelectorAll(".mode").forEach(b => b.onclick = () => start(b.dataset.mode));

function ready(perguntasTxt, produtosTxt) {
  P = Object.fromEntries(parseCSV(produtosTxt).map(x => [x.slug, x]));
  ALL = parseCSV(perguntasTxt).filter(x => x.pergunta && x.opcao_a && x.opcao_b);
  if (!ALL.length) { $("loadmsg").textContent = "Nenhuma pergunta válida encontrada no CSV."; return; }
  menu();
}
const get = (url, fallback) => fetch(url).then(r => { if (!r.ok) throw 0; return r.text(); }).catch(() => { if (fallback) return fallback; throw 0; });
Promise.all([get("data/perguntas.csv", window.PERGUNTAS_CSV), get("data/produtos.csv", window.PRODUTOS_CSV)])
  .then(([a, b]) => ready(a, b))
  .catch(() => {
    $("loadmsg").textContent = "Não foi possível carregar os dados. Selecione data/perguntas.csv e data/produtos.csv:";
    $("pick").hidden = false;
    $("pick").querySelector("input").onchange = async e => {
      const f = [...e.target.files], rd = n => f.find(x => x.name.includes(n));
      if (rd("perguntas") && rd("produtos")) ready(await rd("perguntas").text(), await rd("produtos").text());
    };
  });
