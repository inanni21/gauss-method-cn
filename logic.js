const TAMANHO = 3;
const MATRIZ_PADRAO = [[2,1,-1,8],[-3,-1,2,-11],[-2,1,2,-3]];

function inicializar() {
  const grade = document.getElementById('grid');
  grade.innerHTML = '';
  for (let linha = 0; linha < TAMANHO; linha++) {
    const divLinha = document.createElement('div');
    divLinha.style.marginBottom = '4px';
    for (let coluna = 0; coluna <= TAMANHO; coluna++) {
      if (coluna === TAMANHO) divLinha.innerHTML += '<label> = </label>';
      const campo = document.createElement('input');
      campo.type = 'number'; campo.id = `m${linha}${coluna}`; campo.value = MATRIZ_PADRAO[linha][coluna];
      divLinha.appendChild(campo);
    }
    grade.appendChild(divLinha);
  }
  document.getElementById('out').innerHTML = '';
}

function lerMatriz() {
  return Array.from({length: TAMANHO}, (_, linha) =>
    Array.from({length: TAMANHO+1}, (_, coluna) => +document.getElementById(`m${linha}${coluna}`).value)
  );
}

function formatarMatriz(matriz) {
  return matriz.map(linha => '[ ' + linha.map(valor => valor.toFixed(2).padStart(7)).join('  ') + ' ]').join('\n');
}

function resolver() {
  const matriz = lerMatriz(), passos = [];
  passos.push('Matriz inicial:\n' + formatarMatriz(matriz));

  for (let coluna = 0; coluna < TAMANHO; coluna++) {
    let linhaPivo = coluna;
    for (let linha = coluna+1; linha < TAMANHO; linha++) if (Math.abs(matriz[linha][coluna]) > Math.abs(matriz[linhaPivo][coluna])) linhaPivo = linha;
    if (linhaPivo !== coluna) { [matriz[coluna], matriz[linhaPivo]] = [matriz[linhaPivo], matriz[coluna]]; passos.push(`Troca L${coluna+1} ↔ L${linhaPivo+1}:\n` + formatarMatriz(matriz)); }

    for (let linha = coluna+1; linha < TAMANHO; linha++) {
      const fator = matriz[linha][coluna] / matriz[coluna][coluna];
      for (let c = coluna; c <= TAMANHO; c++) matriz[linha][c] -= fator * matriz[coluna][c];
      passos.push(`L${linha+1} ← L${linha+1} - (${fator.toFixed(2)})·L${coluna+1}:\n` + formatarMatriz(matriz));
    }
  }

  const solucao = Array(TAMANHO).fill(0);
  for (let i = TAMANHO-1; i >= 0; i--) {
    solucao[i] = matriz[i][TAMANHO];
    for (let j = i+1; j < TAMANHO; j++) solucao[i] -= matriz[i][j] * solucao[j];
    solucao[i] /= matriz[i][i];
  }

  const nomes = ['x', 'y', 'z'];
  document.getElementById('out').innerHTML =
    passos.map(passo => `<div class="step">${passo}</div>`).join('') +
    `<div class="sol">Solução: ${nomes.map((nome, i) => `${nome} = ${solucao[i].toFixed(4)}`).join(' &nbsp; ')}</div>`;
}

inicializar();