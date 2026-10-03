"""Baixa as imagens dos produtos (URLs da aba 'produtos') para a pasta img/, para o site funcionar offline.
Rode uma vez com internet:  python tools/baixar_imagens.py"""
import csv, urllib.request
from pathlib import Path

raiz = Path(__file__).resolve().parent.parent
(raiz / "img").mkdir(exist_ok=True)
with open(raiz / "data" / "produtos.csv", encoding="utf-8-sig", newline="") as f:
    for p in csv.DictReader(f):
        destino = raiz / "img" / f"{p['slug']}.png"
        if destino.exists(): print("já existe:", destino.name); continue
        try:
            req = urllib.request.Request(p["imagem_url"], headers={"User-Agent": "Mozilla/5.0"})
            destino.write_bytes(urllib.request.urlopen(req, timeout=30).read())
            print("baixada:", destino.name)
        except Exception as e:
            print("FALHOU:", p["slug"], "-", e)
