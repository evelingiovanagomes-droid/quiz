"""Gera data/perguntas.js a partir de data/perguntas.csv (permite abrir o index.html com duplo clique)."""
import json
from pathlib import Path

base = Path(__file__).resolve().parent.parent / "data"
texto = (base / "perguntas.csv").read_text(encoding="utf-8-sig")
(base / "perguntas.js").write_text("window.PERGUNTAS_CSV = " + json.dumps(texto, ensure_ascii=False) + ";\n", encoding="utf-8")
print("OK: data/perguntas.js atualizado")
