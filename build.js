:root { --primary: #2563eb; --success: #16a34a; --error: #dc2626; --bg: #f8fafc; --card: #fff; }
body { font-family: 'Inter', system-ui, sans-serif; background: var(--bg); margin: 0; color: #1e293b; line-height: 1.6; }
.site-header { background: #0f172a; color: white; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; }
.quiz-container { max-width: 700px; margin: 3rem auto; padding: 0 1rem; }
.q-text { font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; }
.opt-btn { display: block; background: var(--card); border: 2px solid #e2e8f0; padding: 0.8rem 1rem; margin: 0.5rem 0; border-radius: 8px; cursor: pointer; transition: 0.2s; }
.opt-btn:hover { border-color: var(--primary); }
.opt-btn input { display: none; }
.opt-btn:has(input:checked) { border-color: var(--primary); background: #eff6ff; }
.feedback-box { margin-top: 1.5rem; padding: 1rem; border-radius: 8px; background: #f1f5f9; }
.feedback-box .msg { font-weight: 600; margin: 0 0 0.5rem; }
.tip-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 0.75rem; margin: 0.5rem 0; font-size: 0.95rem; }
.btn-cta { display: inline-block; background: var(--primary); color: white; padding: 0.6rem 1.2rem; border-radius: 6px; text-decoration: none; margin-top: 1rem; }
.next-btn { background: #334155; color: white; border: none; padding: 0.6rem 1rem; border-radius: 6px; cursor: pointer; margin-top: 0.5rem; }
.level-badge { background: #38bdf8; color: #0f172a; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.85rem; }
