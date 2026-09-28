const $ = id => document.getElementById(id);
let Q = [], i = 0, hits = 0;

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

function start(text) {
  Q = shuffle(parseCSV(text).filter(x => x.pergunta && x.opcao_a && x.opcao_b));
  if (!Q.length) { $("loadmsg").textContent = "Nenhuma pergunta válida encontrada no CSV."; return; }
  i = 0; hits = 0; $("load").hidden = $("end").hidden = true; $("quiz").hidden = false; show();
}
function show() {
  const p = Q[i], done = { v: false };
  $("cat").textContent = p.categoria; $("q").textContent = p.pergunta;
  $("count").textContent = `${i + 1}/${Q.length}`; $("prog").style.width = (i / Q.length * 100) + "%";
  $("next").disabled = true; $("next").textContent = "Escolha uma resposta";
  const opts = shuffle([["A", p.opcao_a, p.explicacao_a], ["B", p.opcao_b, p.explicacao_b]]);
  $("cards").innerHTML = "";
  opts.forEach(([key, txt, exp], n) => {
    const right = key === p.correta.toUpperCase(), b = document.createElement("button");
    b.className = "card c" + n; b.dataset.right = right;
    b.innerHTML = `<div class="in"><div class="face front"><span class="letter">${n ? "B" : "A"}</span><p></p></div><div class="face back"><span class="verdict">${right ? "✓ Resposta correta" : "✗ Não é essa"}</span><p class="exp"></p><span class="pick"></span></div></div>`;
    b.querySelector(".front p").textContent = txt; b.querySelector(".exp").textContent = exp;
    b.onclick = () => {
      if (done.v) return; done.v = true; if (right) hits++;
      document.querySelectorAll(".card").forEach(c => c.classList.add("flip", c.dataset.right === "true" ? "ok" : "no"));
      b.querySelector(".pick").textContent = "Sua escolha"; $("next").disabled = false; $("next").textContent = i === Q.length - 1 ? "Ver resultado" : "Próxima pergunta"; $("next").focus();
    };
    $("cards").appendChild(b);
  });
}
$("next").onclick = () => {
  if (++i < Q.length) return show();
  $("quiz").hidden = true; $("end").hidden = false; $("prog").style.width = "100%"; $("count").textContent = "";
  $("score").textContent = `${hits}/${Q.length}`;
  $("msg").textContent = hits / Q.length >= .8 ? "Excelente! Você está pronto(a) para atender." : hits / Q.length >= .5 ? "Bom caminho! Refaça para fixar as explicações." : "Vale rever as explicações dos cards e tentar de novo.";
};
$("again").onclick = () => start(window._csv);
function ready(t) { window._csv = t; start(t); }
fetch("data/perguntas.csv").then(r => { if (!r.ok) throw 0; return r.text(); }).then(ready).catch(() => {
  if (window.PERGUNTAS_CSV) return ready(window.PERGUNTAS_CSV);
  $("loadmsg").textContent = "Não foi possível carregar as perguntas. Selecione o arquivo data/perguntas.csv:";
  $("pick").hidden = false;
  $("pick").querySelector("input").onchange = e => e.target.files[0].text().then(ready);
});
