"""Gera data/perguntas.js e data/produtos.js a partir dos CSV (permite abrir o index.html com duplo clique)."""
import json
from pathlib import Path

base = Path(__file__).resolve().parent.parent / "data"
for nome, var in (("perguntas", "PERGUNTAS_CSV"), ("produtos", "PRODUTOS_CSV")):
    texto = (base / f"{nome}.csv").read_text(encoding="utf-8-sig")
    (base / f"{nome}.js").write_text(f"window.{var} = " + json.dumps(texto, ensure_ascii=False) + ";\n", encoding="utf-8")
print("OK: data/perguntas.js e data/produtos.js atualizados")
