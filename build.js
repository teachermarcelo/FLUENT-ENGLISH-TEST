const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'src');
const DIST = path.join(__dirname, 'docs');

if (!fs.existsSync(DIST)) fs.mkdirSync(DIST, { recursive: true });
fs.cpSync(path.join(SRC, 'assets'), path.join(DIST, 'assets'), { recursive: true });

const layout = fs.readFileSync(path.join(SRC, 'templates', 'layout.html'), 'utf-8');
const quizzes = fs.readdirSync(path.join(SRC, 'content', 'quizzes'));

let homeLinks = '';

quizzes.forEach(file => {
  const raw = fs.readFileSync(path.join(SRC, 'content', 'quizzes', file), 'utf-8');
  const quiz = JSON.parse(raw);
  
  let page = layout
    .replace('{{title}}', quiz.title)
    .replace('{{level}}', quiz.level)
    .replace('{{quizJson}}', JSON.stringify(quiz));

  // Injeta as questões no HTML (simplificado para build estático)
  const questionsHtml = quiz.questions.map((q, i) => {
    const opts = q.options.map((opt, oi) => 
      `<label class="opt-btn"><input type="radio" name="q${i}" value="${oi}">${opt}</label>`
    ).join('');
    return `
    <div class="question-block" data-index="${i}">
      <p class="q-text">${q.text}</p>
      <div class="options">${opts}</div>
      <div class="feedback-box" style="display:none;">
        <p class="msg"></p>
        <div class="tip-box">${q.tip}</div>
        <button class="next-btn">Próxima →</button>
      </div>
    </div>`;
  }).join('\n');

  page = page.replace('<!-- QUESTÕES INJETADAS PELO BUILD -->', questionsHtml);
  
  const outPath = path.join(DIST, `${quiz.id}.html`);
  fs.writeFileSync(outPath, page);
  homeLinks += `<li><a href="/${quiz.id}.html">${quiz.title} (${quiz.level})</a></li>\n`;
});

// Gera index.html simples
const index = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>FLUENT ENGLISH TEST</title><link rel="stylesheet" href="/assets/css/style.css"></head>
<body><header class="site-header"><div class="logo">FLUENT ENGLISH TEST</div></header>
<main class="quiz-container"><h1>Testes Disponíveis</h1><ul>${homeLinks}</ul></main></body></html>`;
fs.writeFileSync(path.join(DIST, 'index.html'), index);

console.log(`✅ Build concluído! ${quizzes.length} quizzes gerados em /docs`);
