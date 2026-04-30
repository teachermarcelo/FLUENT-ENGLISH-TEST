document.addEventListener('DOMContentLoaded', () => {
  const quiz = window.QUIZ_DATA;
  let currentQ = 0;

  function renderQuestion() {
    const q = quiz.questions[currentQ];
    document.querySelector('.q-text').textContent = q.text;
    const opts = document.querySelectorAll('.opt-btn');
    opts.forEach((opt, i) => {
      opt.querySelector('input').value = i;
      opt.nextElementSibling?.remove();
      opt.appendChild(document.createTextNode(q.options[i]));
      opt.style.pointerEvents = 'auto';
      opt.style.opacity = '1';
    });
    document.querySelector('.feedback-box').style.display = 'none';
  }

  document.querySelectorAll('.opt-btn input').forEach(input => {
    input.addEventListener('change', (e) => {
      const selected = parseInt(e.target.value);
      const q = quiz.questions[currentQ];
      const fb = document.querySelector('.feedback-box');
      fb.querySelector('.msg').textContent = selected === q.correct ? q.feedback.correct : q.feedback.incorrect;
      fb.querySelector('.tip-box').textContent = q.tip;
      fb.style.display = 'block';
      
      // Desabilita novas seleções até avançar
      document.querySelectorAll('.opt-btn input').forEach(i => i.disabled = true);
      document.querySelectorAll('.opt-btn').forEach(o => o.style.opacity = '0.6');
    });
  });

  document.querySelector('.next-btn').addEventListener('click', () => {
    currentQ++;
    if (currentQ < quiz.questions.length) renderQuestion();
    else {
      document.querySelector('.quiz-container h1').textContent = "Quiz Concluído";
      document.querySelector('#quiz-area').style.display = 'none';
      document.querySelector('#final-review').style.display = 'block';
      document.querySelector('#final-review').innerHTML = 
        `<p>Revise as dicas acima antes de tentar outro teste. A repetição com feedback é a chave da fluência.</p>
         <a href="/" class="btn-cta">Voltar à Home</a>`;
    }
  });

  renderQuestion();
});
