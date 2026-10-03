# Quiz Borabella

Quiz em cards com flip (explicação no verso) sobre os 22 produtos da Borabella, em tema escuro.

## Estrutura
- `index.html`, `css/style.css`, `js/app.js`: o site
- `data/perguntas.xlsx`: base editável (abas `perguntas`, `produtos`, `como_usar`)
- `data/perguntas.csv` e `data/produtos.csv`: o que o site lê (gerados do Excel)
- `img/`: imagens dos produtos (veja abaixo)
- `tools/`: scripts de conversão e de download das imagens

## Abrir o site
Duplo clique no `index.html` (ele lê `data/*.js`, cópias dos CSV) ou use `iniciar_site.bat` / `iniciar_site.sh` (precisa de Python).

## Imagens dos produtos
As imagens vêm das páginas oficiais da Borabella. O site tenta `img/<slug>.png` primeiro e, se não existir, usa a URL oficial (precisa de internet).
Para funcionar offline, rode uma vez com internet: `python tools/baixar_imagens.py`

## Como as imagens são usadas
- Perguntas "Reconheça a embalagem": a imagem aparece na pergunta e as opções descrevem só funções (sem citar o nome do produto), para treinar o reconhecimento visual.
- Demais perguntas: a imagem só aparece depois da resposta (painel "Conheça o produto"), para não induzir a escolha.
- No fim, os produtos das perguntas erradas aparecem para revisão.

## Adicionar perguntas
1. Edite `data/perguntas.xlsx` (veja a aba `como_usar`)
2. Rode `python tools/xlsx_para_csv.py` (precisa de `pip install openpyxl`; atualiza CSV e JS)
3. Recarregue o site
