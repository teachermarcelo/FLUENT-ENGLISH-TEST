const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando build...');
const SRC = path.join(__dirname, 'src');
const DIST = path.join(__dirname, 'docs');
const QUIZZES_DIR = path.join(SRC, 'content', 'quizzes');
const TEMPLATES_DIR = path.join(SRC, 'templates');
const ASSETS_DIR = path.join(SRC, 'assets');

// 1. Cria estrutura obrigatória
const mk = (p) => { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); };
mk(QUIZZES_DIR); mk(TEMPLATES_DIR); mk(path.join(ASSETS_DIR, 'css')); mk(path.join(ASSETS_DIR, 'js'));

// 2. Cria layout padrão se não existir
const layoutPath = path.join(TEMPLATES_DIR, 'layout.html');
if (!fs.existsSync(layoutPath)) {
  console.log('⚠️ layout.html não encontrado. Criando versão padrão...');
  fs.writeFileSync(layoutPath, `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>{{title}}</title><link rel="stylesheet" href="/assets/css/style.css"></head><body><main class="quiz-container" id="quiz-root"></main><script>window.QUIZ_DATA={{quizJson}};</script><script src="/assets/js/quiz-engine.js"></script></body></html>`);
}

// 3. Cria CSS padrão se não existir
const cssPath = path.join(ASSETS_DIR, 'css', 'style.css');
if (!fs.existsSync(cssPath)) {
  console.log('⚠️ style.css não encontrado. Criando versão padrão...');
  fs.writeFileSync(cssPath, `body{font-family:system-ui,sans-serif;background:#f8fafc;color:#1e293b;margin:0}.quiz-container{max-width:700px;margin:2rem auto;padding:1rem}.q-text{font-size:1.2rem;font-weight:600;margin:1rem 0}.options{display:flex;flex-direction:column;gap:.5rem}.opt-btn{background:#fff;border:2px solid #e2e8f0;padding:1rem;border-radius:8px;cursor:pointer;transition:.2s}.opt-btn:hover{border-color:#3b82f6}.opt-btn.correct{background:#dcfce7;border-color:#16a34a}.opt-btn.wrong{background:#fee2e2;border-color:#ef4444}.feedback-box{margin-top:1.5rem;padding:1rem;border-radius:8px;background:#f1f5f9}.tip-box{background:#fef3c7;border-left:4px solid #f59e0b;padding:.75rem;margin:.5rem 0}.btn{background:#2563eb;color:#fff;border:none;padding:.6rem 1.2rem;border-radius:6px;cursor:pointer;margin-top:1rem}.btn:disabled{background:#94a3b8;cursor:not-allowed}`);
}

// 4. Cria JS padrão se não existir
const jsPath = path.join(ASSETS_DIR, 'js', 'quiz-engine.js');
if (!fs.existsSync(jsPath)) {
  console.log('⚠️ quiz-engine.js não encontrado. Criando motor padrão...');
  const jsCode = 'document.addEventListener("DOMContentLoaded",function(){\n' +
    'var quiz=window.QUIZ_DATA,root=document.getElementById("quiz-root"),cur=0;\n' +
    'function render(){var q=quiz.questions[cur];\n' +
    'root.innerHTML="<h1>"+quiz.title+"</h1><p class=\'q-text\'>"+q.text+"</p><div class=\'options\'>"+q.options.map(function(o,i){return \'<div class="opt-btn" data-i="'+i+'">\'+o+\'</div>\';}).join(\'\')+\'</div><div class="feedback-box" style="display:none"><p class="msg"></p><div class="tip-box">\'+q.tip+\'</div><button class="btn next-btn">Próxima &#8594;</button></div>";\n' +
    'root.querySelectorAll(".opt-btn").forEach(function(btn){btn.addEventListener("click",function(){\n' +
    'var idx=parseInt(this.dataset.i);\n' +
    'root.querySelectorAll(".opt-btn").forEach(function(b){b.style.pointerEvents="none"});\n' +
    'this.classList.add(idx===q.correct?"correct":"wrong");\n' +
    'var fb=root.querySelector(".feedback-box");fb.style.display="block";\n' +
    'fb.querySelector(".msg").textContent=idx===q.correct?q.feedback.correct:q.feedback.incorrect;\n' +
    '})});\n' +
    'root.querySelector(".next-btn").addEventListener("click",function(){cur++;if(cur<quiz.questions.length)render();else root.innerHTML="<h1>Quiz Conclu\u00EDdo!</h1><p>Revise as dicas acima.</p><a href=\"/index.html\" class=\"btn\">Voltar</a>";});}\n' +
    'render();});';
  fs.writeFileSync(jsPath, jsCode);
}

// 5. Compila quizzes
const layout = fs.readFileSync(layoutPath, 'utf-8');
const files = fs.readdirSync(QUIZZES_DIR).filter(f => f.endsWith('.json'));
console.log('📂 Arquivos JSON encontrados: ' + files.length);

if(!fs.existsSync(DIST)) fs.mkdirSync(DIST, { recursive: true });
let homeLinks = '';

files.forEach(file => {
  try {
    const quiz = JSON.parse(fs.readFileSync(path.join(QUIZZES_DIR, file), 'utf-8'));
    let page = layout.replace('{{title}}', quiz.title).replace('{{quizJson}}', JSON.stringify(quiz));
    fs.writeFileSync(path.join(DIST, quiz.id + '.html'), page);
    homeLinks += '<li><a href="/' + quiz.id + '.html">' + quiz.title + ' (' + quiz.level + ')</a></li>\n';
    console.log('✅ Gerado: ' + quiz.id + '.html');
  } catch(e) { console.error('❌ Erro em ' + file + ':', e.message); }
});

// 6. Copia assets
fs.cpSync(path.join(ASSETS_DIR, 'css'), path.join(DIST, 'assets', 'css'), { recursive: true });
fs.cpSync(path.join(ASSETS_DIR, 'js'), path.join(DIST, 'assets', 'js'), { recursive: true });
console.log('📦 Assets copiados para /docs');

// 7. Gera index.html
fs.writeFileSync(path.join(DIST, 'index.html'), '<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>FLUENT ENGLISH TEST</title><link rel="stylesheet" href="/assets/css/style.css"></head><body style="padding:2rem"><h1>FLUENT ENGLISH TEST</h1><ul>' + homeLinks + '</ul><p style="color:#64748b;margin-top:2rem">Adicione JSONs em src/content/quizzes/ e rode node build.js</p></body></html>');
console.log('🎉 Build concluído! Abra a pasta /docs para testar.');
