# nexus-tech-talk-puppeteer

Criando um playground de automação com Puppeteer e Node.js.

### Exemplos

### image-diff

- Acessa o site `https://trve.in` e cria ou utiliza uma pasta com a data do dia dentro de `screenshots`.
- Caso não exista um arquivo de referência (`source.png`), gera um screenshot inicial.
- Captura um novo screenshot (`to-compare.png`) e compara com a referência utilizando `pixelmatch`.
- Gera uma imagem com as diferenças (`diff.png`) e registra a fração de diferença em `diff.txt`.

### latest-song

- Abre o site `https://trve.in`.
- Aguarda os elementos `.track` e `.artist` estarem presentes na página.
- Extrai e exibe no console do terminal o texto correspondente à faixa e ao artista.
