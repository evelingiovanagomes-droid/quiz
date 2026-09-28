# Quiz de Cosméticos Capilares

Site de perguntas e respostas em cards com flip (explicação no verso).

## Estrutura
- `index.html`, `css/style.css`, `js/app.js`: o site
- `data/perguntas.xlsx`: base editável (Excel)
- `data/perguntas.csv`: o que o site lê (gerado do Excel)
- `tools/xlsx_para_csv.py`: converte Excel em CSV (precisa de `pip install openpyxl`)

## Abrir o site
Basta dar duplo clique no `index.html`: as perguntas são carregadas automaticamente de `data/perguntas.csv`
(ou, ao abrir direto do arquivo, de `data/perguntas.js`, uma cópia gerada do CSV).
Opcional: `iniciar_site.bat` / `iniciar_site.sh` abrem o site num servidor local (precisa de Python).

## Adicionar perguntas
1. Edite `data/perguntas.xlsx` (veja a aba `como_usar`)
2. Rode `python tools/xlsx_para_csv.py` (atualiza o CSV e o `perguntas.js`)
3. Recarregue o site

Se você editar o `perguntas.csv` diretamente, rode `python tools/csv_para_js.py` para atualizar o `perguntas.js`.
