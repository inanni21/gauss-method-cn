const N = 3;
const DEF = [[2,1,-1,8],[-3,-1,2,-11],[-2,1,2,-3]];

function init() {
  const g = document.getElementById('grid');
  g.innerHTML = '';
  for (let i = 0; i < N; i++) {
    const row = document.createElement('div');
    row.style.marginBottom = '4px';
    for (let j = 0; j <= N; j++) {
      if (j === N) row.innerHTML += '<label> = </label>';
      const inp = document.createElement('input');
      inp.type = 'number'; inp.id = `m${i}${j}`; inp.value = DEF[i][j];
      row.appendChild(inp);
    }
    g.appendChild(row);
  }
  document.getElementById('out').innerHTML = '';
}

function get() {
  return Array.from({length: N}, (_, i) =>
    Array.from({length: N+1}, (_, j) => +document.getElementById(`m${i}${j}`).value)
  );
}

function fmt(m) {
  return m.map(r => '[ ' + r.map(v => v.toFixed(2).padStart(7)).join('  ') + ' ]').join('\n');
}

function solve() {
  const m = get(), steps = [];
  steps.push('Matriz inicial:\n' + fmt(m));

  for (let col = 0; col < N; col++) {
    let p = col;
    for (let r = col+1; r < N; r++) if (Math.abs(m[r][col]) > Math.abs(m[p][col])) p = r;
    if (p !== col) { [m[col], m[p]] = [m[p], m[col]]; steps.push(`Troca L${col+1} ↔ L${p+1}:\n` + fmt(m)); }

    for (let r = col+1; r < N; r++) {
      const f = m[r][col] / m[col][col];
      for (let c = col; c <= N; c++) m[r][c] -= f * m[col][c];
      steps.push(`L${r+1} ← L${r+1} - (${f.toFixed(2)})·L${col+1}:\n` + fmt(m));
    }
  }

  const x = Array(N).fill(0);
  for (let i = N-1; i >= 0; i--) {
    x[i] = m[i][N];
    for (let j = i+1; j < N; j++) x[i] -= m[i][j] * x[j];
    x[i] /= m[i][i];
  }

  document.getElementById('out').innerHTML =
    steps.map(s => `<div class="step">${s}</div>`).join('') +
    `<div class="sol">Solução: x₁ = ${x[0].toFixed(4)} &nbsp; x₂ = ${x[1].toFixed(4)} &nbsp; x₃ = ${x[2].toFixed(4)}</div>`;
}

init();