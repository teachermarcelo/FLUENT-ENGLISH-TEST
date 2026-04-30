const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando build...');
const SRC = path.join(__dirname, 'src');
const DIST = path.join(__dirname, 'docs');
const quizzesDir = path.join(SRC, 'content', 'quizzes');

// 1. Verifica pasta de quizzes
if (!fs.existsSync(quizzesDir)) {
  console.error('❌ ERRO: Pasta src/content/quizzes não existe!');
  process.exit(1);
}

// 2. Lista arquivos JSON
const files = fs.readdirSync(quizzesDir).filter(f => f.endsWith('.json'));
console.log(`📂 Arquivos JSON encontrados: ${files.length}`);

if (files.length === 0) {
  console.warn('⚠️ Nenhum arquivo .json encontrado. Adicione um em src/content/quizzes/ e rode novamente.');
  process.exit(0);
}

// 3. Prepara pasta de saída
if (!fs.existsSync(DIST)) fs.mkdirSync(DIST, { recursive: true });
fs.cpSync(path.join(SRC, 'assets'), path.join(DIST, 'assets'), { recursive: true });
console.log('📦 Assets copiados para /docs');

// 4. Gera quizzes
const layout = fs.readFileSync(path.join(SRC, 'templates', 'layout.html'), 'utf-8');
let homeLinks = '';

files.forEach(file => {
  try {
    const raw = fs.readFileSync(path.join(quizzesDir, file), 'utf-8');
    const quiz = JSON.parse(raw);
    
    const questionsHtml = quiz.questions.map((q, i) => `
      <div class="question-block" data-index="${i}">
        <p class="q-text">${q.text}</p>
        <div class="options">${q.options.map((opt, oi) => 
          `<label class="opt-btn"><input type="radio" name="q${i}" value="${oi}">${opt}</label>`
        ).join('')}</div>
        <div class="feedback-box" style="display:none;">
          <p class="msg"></p>
          <div class="tip-box">${q.tip}</div>
          <button class="next-btn">Próxima →</button>
        </div>
      </div>`
    ).join('\n');

    let page = layout
      .replace('{{title}}', quiz.title)
      .replace('{{level}}', quiz.level)
      .replace('{{quizJson}}', JSON.stringify(quiz))
      .replace('<!-- QUESTÕES INJETADAS PELO BUILD -->', questionsHtml);

    fs.writeFileSync(path.join(DIST, `${quiz.id}.html`), page);
    homeLinks += `<li><a href="/${quiz.id}.html">${quiz.title} <span class="level-badge">${quiz.level}</span></a></li>\n`;
    console.log(`✅ Gerado: ${quiz.id}.html`);
  } catch (e) {
    console.error(`❌ Erro ao processar ${file}:`, e.message);
  }
});

// 5. Gera index.html
const index = `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>FLUENT ENGLISH TEST</title><link rel="stylesheet" href="/assets/css/style.css"></head>
<body><header class="site-header"><div class="logo">FLUENT ENGLISH TEST</div></header>
<main class="quiz-container"><h1>Testes Disponíveis</h1><ul style="list-style:none;padding:0;">${homeLinks}</ul>
<p style="color:#64748b;margin-top:2rem;">Adicione novos quizzes em <code>src/content/quizzes/</code> e rode <code>node build.js</code></p></main></body></html>`;

fs.writeFileSync(path.join(DIST, 'index.html'), index);
console.log(`🎉 Build concluído! ${files.length} quiz(s) gerado(s) em /docs`);
