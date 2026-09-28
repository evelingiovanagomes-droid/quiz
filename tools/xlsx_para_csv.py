"""Converte data/perguntas.xlsx (aba 'perguntas') em data/perguntas.csv."""
import csv, json, sys
from pathlib import Path
from openpyxl import load_workbook

base = Path(__file__).resolve().parent.parent / "data"
ws = load_workbook(base / "perguntas.xlsx", data_only=True)["perguntas"]
linhas = [[("" if c is None else str(c).strip()) for c in r] for r in ws.iter_rows(values_only=True)]
linhas = [l for l in linhas if any(l)]
erros = []
for n, l in enumerate(linhas[1:], start=2):
    if len(l) < 8 or not all(l[:8]): erros.append(f"Linha {n}: campo vazio")
    elif l[5].upper() not in ("A", "B"): erros.append(f"Linha {n}: 'correta' deve ser A ou B")
if erros:
    print("\n".join(erros)); sys.exit(1)
with open(base / "perguntas.csv", "w", newline="", encoding="utf-8") as f:
    csv.writer(f).writerows([l[:8] for l in linhas])
print(f"OK: {len(linhas)-1} perguntas exportadas para data/perguntas.csv")
(base / "perguntas.js").write_text("window.PERGUNTAS_CSV = " + json.dumps((base / "perguntas.csv").read_text(encoding="utf-8"), ensure_ascii=False) + ";\n", encoding="utf-8")
print("OK: data/perguntas.js atualizado")
