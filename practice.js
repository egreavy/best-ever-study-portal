// Chapter Test and Refresh tabs: quizzes, short answers and past paper questions
// with marking, the questions to fix, and the two ways to refresh before exams.
// All results go to quiz_attempts, which the voice tutor also reads and writes,
// so each one picks up from the others.
(function(){
  const css = `
  .pr-card{background:var(--t-card);border-radius:14px;padding:16px 20px;margin:0 0 10px;display:flex;flex-direction:column;gap:10px}
  .pr-card h3{margin:0;font-size:17px;font-weight:700;line-height:1.3}
  .pr-sub{margin:0;color:var(--t-muted);font-size:15px;line-height:1.45}
  .pr-small{margin:0;color:var(--t-muted);font-size:14px;line-height:1.45}
  .pr-steps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
  .pr-step{display:flex;flex-direction:column;gap:4px}
  .pr-step b{font-size:15px}
  .pr-step span{font-size:14px;color:var(--t-muted)}
  .pr-bar{height:8px;border-radius:99px;background:var(--t-line);overflow:hidden;margin-bottom:2px}
  .pr-bar i{display:block;height:100%;background:var(--t-ink);border-radius:99px}
  .pr-next{margin:0;font-size:15px;line-height:1.5}
  .pr-headrow{display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap}
  .pr-list{display:flex;flex-direction:column}
  .pr-li{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:10px 0;border-top:1px solid var(--t-line)}
  .pr-li:last-child{border-bottom:1px solid var(--t-line)}
  .pr-li-body{display:flex;flex-direction:column;gap:2px;min-width:0}
  .pr-li-title{font-size:16px;font-weight:700;line-height:1.4}
  .pr-li-note{font-size:14px;color:var(--t-muted);line-height:1.4}
  .pr-card details summary{cursor:pointer;font-weight:700;font-size:15px;padding:2px 0}
  .pr-refresh{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:10px;margin:0 0 10px}
  .pr-refresh .pr-card{margin:0}
  .pr-refresh .pr-side-btn{margin-top:auto;padding-top:6px}
  .pr-pill{align-self:flex-start;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--t-accent);background:var(--t-accent-tint);border-radius:999px;padding:3px 9px}
  .pr-right{background:var(--t-card);border-radius:14px;padding:12px 20px;margin:0 0 10px}
  .pr-card details ol,.pr-right ol{margin:8px 0 0;padding-left:22px;display:flex;flex-direction:column;gap:6px;font-size:14px;line-height:1.45;color:var(--t-muted)}
  .pr-hero{align-items:center;text-align:center;gap:8px;padding:24px 20px}
  .pr-hero-title{font-size:22px;font-weight:700;line-height:1.25}
  .pr-prog{gap:10px;padding:22px 24px}
  .pr-prog-top{display:flex;justify-content:space-between;align-items:baseline;gap:6px 16px;flex-wrap:wrap}
  .pr-prog .pr-hero-title{font-size:20px}
  .pr-last{font-size:15px;color:var(--t-muted)}.pr-last b{color:var(--t-ink)}
  .pr-sum{display:flex;flex-direction:column;gap:6px}
  .pr-sum-l{margin:0;display:flex;gap:4px 12px;flex-wrap:wrap;font-size:16px;line-height:1.45}
  .pr-sum-l .k{color:var(--t-muted);min-width:9.5em}
  .pr-viewprog{display:flex;flex-direction:column;gap:8px;border-top:1px solid var(--t-line);padding-top:10px}
  .pr-viewprog summary{cursor:pointer;font-weight:700;font-size:15px;min-height:32px;display:flex;align-items:center}
  .pr-viewprog[open]>*:not(summary){margin-top:8px}
  .pr-bar3{display:flex;height:12px;border-radius:99px;background:var(--t-line);overflow:hidden}
  .pr-bar3 i{display:block;height:100%}.pr-bar3 i.r{background:var(--t-accent)}.pr-bar3 i.f{background:#E0A43A}
  .pr-legend{display:flex;gap:6px 18px;flex-wrap:wrap;font-size:14px;color:var(--t-muted)}
  .pr-legend span{display:inline-flex;align-items:center;gap:6px}
  .pr-legend i{width:10px;height:10px;border-radius:3px;background:var(--t-line);display:inline-block}.pr-legend i.r{background:var(--t-accent)}.pr-legend i.f{background:#E0A43A}
  .pr-hero .pr-btn.big{margin-top:6px;font-size:18px;padding:14px 36px;min-height:54px}
  .ft{background:var(--t-card);border:2px solid var(--t-accent-border);border-radius:16px;padding:16px 18px;display:flex;align-items:center;gap:14px;text-align:left;font:inherit;color:var(--t-ink);cursor:pointer;width:100%;box-sizing:border-box;height:100%}
  .ft:hover{border-color:var(--t-accent)}
  .ft:focus-visible{outline:3px solid var(--t-accent);outline-offset:2px}
  .ft-icon{flex:none;width:50px;height:50px;border-radius:14px;background:var(--t-accent);color:var(--t-on-accent);display:grid;place-items:center}
  .ft-icon svg{width:24px;height:24px}
  .ft-body{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
  .ft-tag{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--t-accent)}
  .ft-title{font-size:17px;font-weight:700;line-height:1.25}
  .ft-line{font-size:14px;color:var(--t-muted);line-height:1.35}
  .ft-chev{flex:none;font-size:22px;color:var(--t-accent)}
  .pr-badge{flex:none;font-size:14px;font-weight:700;color:var(--t-accent);background:var(--t-accent-tint);border-radius:999px;padding:2px 10px}
  .pr-pair{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:10px;margin:0 0 10px}
  .pr-pair>:empty{display:none}
  .pr-pair[hidden]{display:none}
  .pr-answer{position:relative}
  .pr-answer textarea{padding-bottom:52px}
  .pr-tools{position:absolute;right:10px;bottom:12px;display:flex;gap:8px}
  .pr-icon{width:40px;height:40px;border-radius:50%;border:2px solid var(--t-ink);background:var(--t-card);color:var(--t-ink);display:grid;place-items:center;cursor:pointer;padding:0}
  .pr-icon svg{width:20px;height:20px}
  .pr-icon:focus-visible{outline:3px solid var(--t-accent);outline-offset:2px}
  .pr-icon:hover{background:var(--t-soft2)}
  .pr-icon.on{background:var(--t-ink);color:var(--t-on-accent);animation:prPulse 1.6s ease-out infinite}
  .pr-icon input{display:none}
  @keyframes prPulse{0%{box-shadow:0 0 0 0 rgba(31,35,40,.3)}100%{box-shadow:0 0 0 10px rgba(31,35,40,0)}}
  @media (prefers-reduced-motion:reduce){.pr-icon.on{animation:none}}
  .pr-pair .pr-paper{height:100%;box-sizing:border-box}
  .pr-side{gap:6px}
  .pr-side .pr-side-btn{margin-top:auto;padding-top:6px}
  .pr-mix{font-size:13px;color:var(--t-muted)}
  .pr-mix summary{cursor:pointer;font-weight:400;font-size:13px}
  .pr-pair>.pr-card,.pr-pair>*{margin:0}
    .pr-eyebrow{font-size:12px;font-weight:700;color:var(--t-muted);text-transform:uppercase;letter-spacing:.06em}
  .pr-choose-label{font-size:14px;font-weight:700;color:var(--t-muted);margin:4px 0 6px}
  .pr-choices{background:var(--t-card);border-radius:14px;padding:2px 20px;margin:0 0 10px;display:flex;flex-direction:column}
  .pr-choices .pr-choose-label{margin:12px 0 2px}
  .pr-more>summary{cursor:pointer;list-style:none;display:flex;align-items:center;justify-content:space-between;min-height:44px;margin:0;font-size:15px}
  .pr-more>summary::-webkit-details-marker{display:none}
  .pr-more>summary::after{content:"›";font-size:20px;transform:rotate(90deg);transition:transform .15s}
  .pr-more[open]>summary::after{transform:rotate(-90deg)}
  .pr-more[open]{padding-bottom:4px}
  .pr-runrow{align-items:center;gap:8px 14px}.pr-est{font-size:15px;color:var(--t-muted)}
  .pr-choice{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:11px 0;border:none;border-bottom:1px solid var(--t-line);background:none;text-align:left;font:inherit;color:inherit;cursor:pointer;width:100%}
  .pr-choice:last-child{border-bottom:none}
  .pr-choice .pr-li-body{flex:1}
  .pr-choice:hover .pr-li-title{text-decoration:underline}
  .pr-choice[disabled]{opacity:.5;cursor:default}
  .pr-chev{font-size:20px;color:var(--t-muted);flex:none}
  .pr-btn{border:2px solid var(--t-accent);background:var(--t-accent);color:var(--t-on-accent);border-radius:999px;padding:8px 18px;font-weight:700;font-size:15px;cursor:pointer;font-family:inherit;min-height:40px;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;white-space:nowrap}
  .pr-btn.big{font-size:16px;padding:11px 24px;min-height:46px}
  .pr-btn.ghost{background:var(--t-card);color:var(--t-accent)}
  .pr-btn svg{width:18px;height:18px;margin-right:6px;flex:none}
  .pr-improve{display:flex;flex-direction:column;gap:10px;margin:4px 0 6px}
  .pr-up{font-weight:700;color:var(--t-accent)}
  .pr-heard{margin:4px 2px 0;font-size:14px;color:var(--t-muted);font-style:italic}.pr-heard:empty{display:none}
  .pr-mine summary{cursor:pointer;font-weight:700;font-size:14px;color:var(--t-muted)}.pr-mine span{display:block;margin-top:6px;white-space:pre-wrap;font-size:15px;line-height:1.55;border-left:4px solid var(--t-line);padding-left:10px}
  .pr-ring{position:relative;display:inline-grid;place-items:center;flex:none}.pr-ring svg{position:absolute;inset:0}.pr-ring b{position:relative;font-size:16px;font-weight:700;color:var(--t-accent)}
  .pr-today{display:inline-flex;align-items:center;gap:8px;font-weight:700;color:var(--t-ink)}
  .pr-goalhit{background:var(--t-accent-tint);border-radius:10px;padding:10px 14px;font-size:15px;line-height:1.45}
  .pr-todaybox{display:flex;align-items:center;gap:14px;background:var(--t-soft);border-radius:12px;padding:12px 16px;font-size:16px;line-height:1.45}
  .pr-todaybox .pr-ring b{font-size:24px}
  .pr-nextup{background:var(--t-accent-tint);border-radius:14px;padding:16px 18px;display:flex;flex-direction:column;gap:8px;font-size:15px;line-height:1.5}
  .pr-nextup .lab{font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--t-accent)}
  .pr-nextup b{font-size:18px;line-height:1.3}
  .pr-nextup .pr-btn{align-self:flex-start;margin-top:4px}
  .pr-verd{display:flex;align-items:center;gap:8px}
  .pr-tick{flex:none;width:24px;height:24px;border-radius:50%;background:var(--t-accent);color:var(--t-on-accent);display:grid;place-items:center;font-size:13px;font-weight:700;animation:prPlus .4s ease-out}
  .pr-plus{display:inline-block;background:var(--t-accent);color:var(--t-on-accent);font-weight:700;font-size:13px;border-radius:999px;padding:1px 9px;margin-right:8px;animation:prPlus .5s ease-out}
  .pr-opt.pop{animation:prPop .45s ease-out}
  @keyframes prPop{0%{transform:scale(1);box-shadow:0 0 0 0 rgba(31,111,92,.35)}40%{transform:scale(1.02)}100%{transform:scale(1);box-shadow:0 0 0 12px rgba(31,111,92,0)}}
  @keyframes prPlus{0%{transform:translateY(6px);opacity:0}100%{transform:none;opacity:1}}
  @media (prefers-reduced-motion:reduce){.pr-opt.pop,.pr-plus,.pr-tick{animation:none}}
  .pr-score-msg{display:flex;align-items:center;gap:16px;border-radius:12px;padding:14px 16px;background:var(--t-soft);font-size:16px;line-height:1.45}
  .pr-score-msg.good{background:var(--t-accent-tint)}
  .pr-score-msg.low{background:var(--t-warn-tint)}
  .pr-nx-l{font-size:14px;font-weight:700;color:var(--t-muted)}
  .pr-nx{display:flex;align-items:center;gap:14px;padding:12px 14px;border-radius:14px;border:2px solid var(--t-line);background:var(--t-card);text-align:left;font:inherit;color:var(--t-ink);cursor:pointer;width:100%}
  .pr-nx:hover{border-color:var(--t-accent)}
  .pr-nx:focus-visible{outline:3px solid var(--t-accent);outline-offset:2px}
  .pr-nx.main{background:var(--t-accent-tint);border-color:var(--t-accent)}
  .pr-nx.minor{padding:6px 12px;border-width:1px;border-radius:10px;gap:10px}
  .pr-nx.minor .pr-li-note{display:none}
  .pr-nx.minor .pr-nx-i{width:30px;height:30px}
  .pr-key{display:flex;flex-direction:column;gap:8px}
  .pr-k{margin:0;font-size:17px;line-height:1.5}
  .pr-hear{margin-left:auto;display:inline-flex;align-items:center;gap:6px;border:1px solid var(--t-line);background:var(--t-card);color:var(--t-ink);font:inherit;font-size:14px;font-weight:700;border-radius:99px;padding:6px 12px;min-height:36px;cursor:pointer}
  .pr-hear.on{border-color:var(--t-accent);color:var(--t-accent)}
  .pr-more>summary,.pr-modelbl>summary{cursor:pointer;font-weight:700;min-height:36px;display:flex;align-items:center}
  .pr-modelbl:focus,.pr-modelbl>summary:focus,.pr-more>summary:focus{outline:none}
  .pr-modelbl>summary:focus-visible,.pr-more>summary:focus-visible{outline:3px solid var(--t-accent);outline-offset:2px;border-radius:6px}
  .pr-key h4{margin:6px 0 0;font-size:16px}
  .pr-key ul{margin:0;padding-left:20px;font-size:16px;line-height:1.55}
  .pr-focus .pr-more,.pr-focus .pr-modelbl,.pr-focus .pr-nextrow,.pr-focus .pr-key .pr-k{display:none}
  .pr-nx-i{flex:none;width:40px;height:40px;border-radius:12px;display:grid;place-items:center;background:var(--t-soft2);color:var(--t-accent)}
  .pr-nx.main .pr-nx-i{background:var(--t-accent);color:var(--t-on-accent)}
  .pr-nx-i svg{width:20px;height:20px;margin:0}
  .pr-nx .pr-li-body{flex:1}
  .pr-steps2{display:flex;flex-direction:column;gap:10px;background:var(--t-card);border-radius:14px;padding:14px 16px}
  .pr-bars{display:flex;gap:6px}.pr-bars i{flex:1;height:6px;border-radius:9px;background:var(--t-line)}.pr-bars i.on{background:var(--t-accent)}
  .pr-stepcard{background:var(--t-accent-tint);border-radius:12px;padding:14px 16px;display:flex;flex-direction:column;gap:6px;font-size:16px;line-height:1.5}
  .pr-stepcard b{font-size:18px}
  .pr-stepcard summary{cursor:pointer;font-weight:700;color:var(--t-accent);font-size:15px}
  .pr-stepcard details span{display:block;margin-top:4px}
  .pr-steps2 textarea{min-height:72px}
  .pr-verdict{border-left:4px solid var(--t-warn);background:var(--t-warn-tint);border-radius:10px;padding:10px 14px;font-size:15px;line-height:1.5}
  .pr-verdict.good{border-color:var(--t-accent);background:var(--t-accent-tint)}
  .pr-verdict[hidden]{display:none}
  .pr-added{border-top:1px solid var(--t-line);padding-top:10px;display:flex;flex-direction:column;gap:4px;font-size:14px;color:var(--t-muted);line-height:1.45}
  .pr-added b{color:var(--t-ink)}
  .pr-alldone{background:var(--t-accent-tint);color:var(--t-ink)!important;border-radius:10px;padding:10px 14px}
  .pp-hero{background:var(--t-card);border:2px solid var(--t-accent-border);border-radius:18px;padding:22px 24px;display:flex;align-items:center;gap:18px;margin:0 0 10px}
  .pp-hero .ft-icon{width:58px;height:58px;border-radius:16px}
  .pp-hero-b{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}
  .pp-hero-t{font-size:21px;font-weight:700;line-height:1.25}
  .pp-hero .pr-btn.big{flex:none;font-size:17px;padding:12px 28px;min-height:50px}
  @media (max-width:600px){.pp-hero{flex-wrap:wrap}.pp-hero .pr-btn.big{width:100%}}
  .pp-list{background:var(--t-card);border-radius:14px;padding:2px 20px;margin:0 0 10px;display:flex;flex-direction:column}
  .pp-head{display:flex;justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap;padding:12px 0 4px}
  .pp-head b{font-size:14px;color:var(--t-muted)}.pp-head span{font-size:13px;color:var(--t-muted)}
  .pp-row{display:flex;align-items:center;gap:14px;padding:12px 0;border:none;border-top:1px solid var(--t-line);background:none;text-align:left;font:inherit;color:inherit;cursor:pointer;width:100%}
  .pp-row:hover .pp-q{text-decoration:underline}
  .pp-row:focus-visible{outline:3px solid var(--t-accent);outline-offset:2px}
  .pp-yr{flex:none;width:48px;font-size:16px;font-weight:700;color:var(--t-accent)}
  .pp-b{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
  .pp-s{font-size:13px;font-weight:700;color:var(--t-muted)}
  .pp-q{font-size:15px;line-height:1.4;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
  .pp-chip{flex:none;font-size:13px;font-weight:700;border-radius:999px;padding:3px 10px;background:var(--t-soft2);color:var(--t-muted);white-space:nowrap}
  .pp-chip.good{background:var(--t-accent-tint);color:var(--t-accent)}
  .pp-chip.mid{background:var(--t-warn-tint);color:var(--t-warn)}
  .pp-more{padding:12px 0;border:none;border-top:1px solid var(--t-line);background:none;text-align:left;font:inherit;font-weight:700;font-size:15px;color:var(--t-accent);cursor:pointer}
  .pp-link{border:none;background:none;padding:0 4px;margin:0 0 14px;font:inherit;font-weight:700;font-size:15px;color:var(--t-accent);cursor:pointer;text-align:left}
  .pp-next{background:var(--t-accent-tint);border:none;border-radius:14px;padding:14px 20px;margin:0 0 10px;display:flex;align-items:center;gap:14px;width:100%;text-align:left;font:inherit;color:var(--t-ink);cursor:pointer}
  .pp-next .pr-li-body{flex:1}
  .pp-next b.go{flex:none;color:var(--t-accent);font-size:15px}
  .pp-before{font-size:19px;font-weight:700;margin:16px 2px 8px}
  .pr-btn.dark{background:var(--t-ink);border-color:var(--t-ink)}
  .pr-btn[disabled]{opacity:.6;cursor:default}
  .pr-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
  .pr-q{font-size:18px;font-weight:700;line-height:1.5;margin:0}
  .qd{display:flex;flex-direction:column;gap:10px}
  .qd-ask{background:color-mix(in srgb,var(--t-accent) 9%,var(--t-card));border-left:4px solid var(--t-accent);border-radius:10px;padding:12px 14px;display:flex;flex-direction:column;gap:8px}
  .qd blockquote{margin:0;padding:2px 0 2px 12px;border-left:3px solid var(--t-line);font-style:italic;font-size:16px;line-height:1.55}
  .qd-note{margin:0;font-size:14px;color:var(--t-muted);line-height:1.5}
  .qd-lead{margin:4px 0 -2px;font-size:14px;font-weight:700;color:var(--t-muted)}
  .qd-intro p,.qd-body p{margin:0 0 8px;font-size:16px;line-height:1.6}
  .qd-sec{border:1px solid var(--t-line);border-radius:10px;background:var(--t-card)}
  .qd .qd-sec>summary{cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center;gap:10px;padding:10px 14px;min-height:44px;font-weight:700;font-size:15px}
  .qd-sec>summary::-webkit-details-marker{display:none}
  .qd-sec>summary::after{content:"›";transform:rotate(90deg);font-size:20px;color:var(--t-muted);transition:transform .15s}
  .qd-sec[open]>summary::after{transform:rotate(-90deg)}
  .qd-sec[open] .qd-tap{display:none}
  .qd-tap{margin-left:auto;font-weight:500;font-size:13px;color:var(--t-muted)}
  .qd-body{padding:2px 14px 12px}
  .qd ul{margin:0 0 8px;padding-left:20px;font-size:16px;line-height:1.6}
  .qd-src{font-size:13px !important;color:var(--t-muted)}
  .qd-img{font-size:14px !important;color:var(--t-muted);font-style:italic}
  .qd-tablewrap{overflow-x:auto;margin:0 0 10px}
  .qd-table{border-collapse:collapse;font-size:15px;min-width:60%}
  .qd-table th,.qd-table td{border:1px solid var(--t-line);padding:6px 10px;text-align:left;vertical-align:top}
  .qd-table th{background:color-mix(in srgb,var(--t-line) 45%,transparent);font-weight:700}
  .qd-plain p{margin:0 0 8px;font-size:16px;line-height:1.6}
  .qd-fig{margin:0 0 10px;display:flex;flex-direction:column;gap:4px}
  .qd-zoom{display:block;padding:0;border:1px solid var(--t-line);border-radius:8px;background:#fff;cursor:zoom-in;overflow:hidden;max-width:100%}
  .qd-zoom img{display:block;max-width:100%;height:auto;max-height:520px;margin:0 auto;object-fit:contain}
  .qd-fig figcaption{font-size:13px;color:var(--t-muted)}
  .qd-fig.big figcaption{font-weight:700}
  .qd-lb{position:fixed;inset:0;z-index:1000;background:#111;display:flex;flex-direction:column}
  .qd-lb-bar{display:flex;align-items:center;gap:10px;padding:10px 12px;color:#fff;font-size:14px}
  .qd-lb-bar span{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .qd-lb-x{background:#fff;color:#111;border:0;border-radius:99px;width:40px;height:40px;font-size:18px;cursor:pointer}
  .qd-lb-scroll{flex:1;overflow:auto;display:flex;align-items:center;justify-content:center;touch-action:pinch-zoom pan-x pan-y}
  .qd-lb-scroll img{max-width:100%;max-height:100%;background:#fff}
  .qd-lb-tools{display:flex;justify-content:center;gap:10px;padding:10px}
  .qd-lb-tools button{background:#fff;color:#111;border:0;border-radius:99px;min-width:48px;height:40px;font-size:18px;font-weight:700;cursor:pointer}
  @media (max-width:600px){.qd-table{font-size:13.5px}.qd-table th,.qd-table td{padding:5px 6px}.qd-body{padding:2px 10px 10px}}
  .pr-meta{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;font-size:14px;color:var(--t-muted)}
  .pr-progress{height:6px;background:var(--t-line);border-radius:99px;overflow:hidden}.pr-progress i{display:block;height:100%;background:var(--t-ink)}
  .pr-opts{display:flex;flex-direction:column;gap:8px}
  .pr-opt{text-align:left;border:2px solid var(--t-line);background:var(--t-card);border-radius:12px;padding:10px 14px;min-height:46px;display:flex;gap:12px;align-items:flex-start;cursor:pointer;font:inherit;font-size:16px;color:inherit;line-height:1.45}
  .pr-opt b{flex:none;width:24px;height:24px;border-radius:50%;background:var(--t-soft2);display:grid;place-items:center;font-size:13px}
  .pr-opt:hover:not(:disabled){border-color:var(--t-ink)}
  .pr-opt.right{border-color:var(--t-accent);background:var(--t-accent-tint)}.pr-opt.wrong{border-color:var(--t-ink);background:var(--t-soft2)}.pr-opt:disabled{cursor:default}
  .pr-fb{border-radius:12px;padding:12px 14px;display:flex;flex-direction:column;gap:6px;font-size:15px;line-height:1.5;background:var(--t-soft)}
  .pr-fb.good{background:var(--t-accent-tint)}
  .pr-fb h4{margin:2px 0 0;font-size:15px}
  .pr-fb ul{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:3px}
  .pr-scheme{border-left:4px solid var(--t-line);padding-left:10px;color:var(--t-muted);font-size:14px}
  .pr-card textarea{width:100%;box-sizing:border-box;min-height:110px;font:inherit;font-size:16px;line-height:1.5;border:2px solid var(--t-line);border-radius:12px;padding:10px 12px;background:var(--t-soft);color:inherit;resize:vertical}
  .pr-card textarea:focus{outline:3px solid var(--t-accent);outline-offset:1px}
  .pr-tip{font-size:14px;color:var(--t-muted);margin:0;line-height:1.45}
  .pr-thumbs{display:flex;gap:8px;flex-wrap:wrap}.pr-thumbs img{width:72px;height:72px;object-fit:cover;border-radius:10px;border:1px solid var(--t-line)}
  .pr-thumbs:empty{display:none}
  .pr-rate{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
  .pr-rate button{border:2px solid var(--t-ink);background:var(--t-card);border-radius:12px;padding:8px 6px;cursor:pointer;font:inherit;font-weight:700;font-size:15px;min-height:44px;color:var(--t-ink)}
  .pr-score{font-size:30px;font-weight:700;line-height:1;font-variant-numeric:tabular-nums}
  .pr-err{color:#a32020;font-size:14px;margin:0}
  .pr-card button:focus-visible,.pr-choice:focus-visible,.pr-btn:focus-visible{outline:3px solid var(--t-accent);outline-offset:3px}
  @media (max-width:600px){.pr-li{flex-direction:column;align-items:flex-start}.pr-card{padding:14px 16px}.pr-choices{padding:2px 16px}.pr-steps{gap:8px}}
  `;
  function addCss(){ if (document.getElementById("pr-css")) return; const s=document.createElement("style"); s.id="pr-css"; s.textContent=css; document.head.appendChild(s); }
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const h = html => { const t=document.createElement("template"); t.innerHTML=html.trim(); return t.content.firstElementChild; };
  const shuffle = a => { a=a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]} return a; };
  const L = "ABCD";
  const isTouch = matchMedia("(pointer:coarse)").matches, isMac = /Mac/.test(navigator.platform||"");
  const speakTip = () => `<p class="pr-tip">To speak instead of typing: ${isTouch ? "tap the microphone on your keyboard" : isMac ? "press the Fn (Globe) key twice" : "press Windows + H"}.</p>`;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  // Adds a Speak my answer button that types what he says into the box (Chrome, Edge, Safari)
  const STEPS_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h10M4 12h7M4 17h10"/><path d="M16 15l2 2 4-4"/></svg>';
  const PEN_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>';
  const MIC_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><path d="M12 17v5"/></svg>';
  const PAPER_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/><path d="M8 13h8M8 17h5"/></svg>';
  const CAM_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>';
  function attachMic(row, ta, status){
    if (!SR) return false;
    const btn = h(`<button type="button" class="pr-icon" aria-pressed="false" aria-label="Speak your answer" title="Speak your answer">${MIC_SVG}</button>`);
    row.prepend(btn);
    let rec = null, base = "";
    const stop = () => { if (rec) { try { rec.stop(); } catch (e) {} } };
    btn.onclick = () => {
      if (rec) return stop();
      rec = new SR(); rec.lang = "en-IE"; rec.continuous = true; rec.interimResults = true;
      // Only ever ADD newly finished words at the cursor. Never rewrite the whole box, so text the
      // student has typed or deleted stays exactly as they left it.
      const heard = h(`<p class="pr-heard" aria-live="polite"></p>`); row.closest(".pr-answer").after(heard);
      rec.onresult = (e) => {
        let interim = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const r = e.results[i];
          if (r.isFinal) {
            const t = r[0].transcript.trim(); if (!t) continue;
            const at = ta.selectionStart ?? ta.value.length, before = ta.value.slice(0, at), after = ta.value.slice(at);
            const ins = (before && !/\s$/.test(before) ? " " : "") + t + (after && !/^\s/.test(after) ? " " : "");
            ta.value = before + ins + after;
            ta.selectionStart = ta.selectionEnd = at + ins.length;
          } else interim += r[0].transcript;
        }
        heard.textContent = interim ? "Hearing: " + interim : "";
      };
      const typed = () => stop();
      ta.addEventListener("keydown", typed, { once: true });
      rec.onerror = (e) => {
        status.textContent = e.error === "not-allowed" || e.error === "service-not-allowed"
          ? "The browser blocked the microphone. Allow it for this site (the icon in the address bar), then try again."
          : e.error === "no-speech" ? "Didn't hear anything. Tap the microphone and try again." : "Speaking didn't work this time. Try again, or type your answer.";
        status.hidden = false;
      };
      rec.onend = () => { rec = null; heard.remove(); ta.removeEventListener("keydown", typed); btn.classList.remove("on"); btn.setAttribute("aria-label", "Speak your answer"); btn.title = "Speak your answer"; btn.setAttribute("aria-pressed", "false"); };
      try {
        rec.start(); status.hidden = true;
        btn.classList.add("on"); btn.setAttribute("aria-label", "Stop speaking"); btn.title = "Stop speaking"; btn.setAttribute("aria-pressed", "true");
      } catch (e) { rec = null; }
    };
    row._stopMic = stop;
    return true;
  }
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

  // ---- data ----
  async function loadProgress(sb, profile, questions, freshSince){
    const ids = questions.map(q => q.id);
    if (!ids.length) return { latest:{}, src:{}, reviews:{}, when:{}, everWeak:new Set(), lastAt:null, remembered:new Set() };
    const inIds = ids.map(encodeURIComponent).join(",");
    const [att, rev] = await Promise.all([
      sb(`quiz_attempts?select=question_id,result,source,created_at&profile_id=eq.${profile.id}&question_id=in.(${inIds})&order=created_at.desc&limit=1000`),
      sb(`answer_reviews?select=question_id,marks_awarded,marks_available,feedback,created_at&profile_id=eq.${profile.id}&question_id=in.(${inIds})&order=created_at.desc&limit=200`)
    ]);
    const latest = {}, src = {}, when = {}, reviews = {}, everWeak = new Set(), ever = new Set();
    const fresh = freshSince ? new Date(freshSince) : null;
    (att||[]).forEach(a => {
      ever.add(a.question_id);
      if (Number(a.result) < 1) everWeak.add(a.question_id);
      if (fresh && new Date(a.created_at) < fresh) return;
      if (latest[a.question_id] === undefined) { latest[a.question_id] = Number(a.result); src[a.question_id] = a.source; when[a.question_id] = a.created_at; }
    });
    (rev||[]).forEach(r => { if (!reviews[r.question_id]) reviews[r.question_id] = r; });
    const lastAt = att && att[0] ? new Date(att[0].created_at) : null;
    // memory checks he passed, by the original question they were checking
    const remembered = new Set(); (att || []).forEach(a => { const mm = /^memory:(.+):pass$/.exec(a.source || ""); if (mm) remembered.add(mm[1]); });
    return { latest, src, when, reviews, everWeak, ever, lastAt, att: att || [], remembered };
  }
  async function record(sb, profile, qid, result, source){
    await sb("quiz_attempts", { method:"POST", prefer:"return=minimal", body:[{ profile_id: profile.id, question_id: qid, result, source }] });
  }
  function shrink(file){
    return new Promise((resolve, reject) => {
      const img = new Image(), url = URL.createObjectURL(file);
      img.onload = () => {
        const max = 1600, s = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement("canvas"); c.width = Math.round(img.width*s); c.height = Math.round(img.height*s);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
        resolve(c.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("That file isn't an image we can read. Try a photo or screenshot.")); };
      img.src = url;
    });
  }

  // What went wrong last time, in plain words
  function fixNote(q, prog){
    const r = prog.reviews[q.id];
    const recentReview = r && prog.when[q.id] && Math.abs(new Date(r.created_at) - new Date(prog.when[q.id])) < 120000;
    if (recentReview) {
      const tip = ((r.feedback || {}).to_improve || [])[0];
      return `${r.marks_awarded} out of ${r.marks_available} marks.${tip ? " " + tip : ""}`;
    }
    const where = { quiz: "in a quiz", tutor: "with your tutor", written: "in a written answer", helped: "after improving your answer", memory: "in a memory check" }[String(prog.src[q.id] || "").split(":")[0]] || "";
    return prog.latest[q.id] === 0 ? `You didn't know this one yet${where ? " (" + where + ")" : ""}` : `Half right${where ? " " + where : ""}. Nearly there.`;
  }
  const isPast = q => q.qtype === "exam" && !/^exam-style/i.test(q.source || "");
  // Read short feedback aloud with the device's own voice (tap again to stop)
  const SPEAK_SVG = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>`;
  function speakOut(btn, text){
    const ss = window.speechSynthesis; if (!ss) return;
    if (ss.speaking) { ss.cancel(); btn.classList.remove("on"); return; }
    const u = new SpeechSynthesisUtterance(text);
    const vs = ss.getVoices(), pick = vs.find(v => /en-IE/i.test(v.lang)) || vs.find(v => /en-GB/i.test(v.lang)) || vs.find(v => /^en/i.test(v.lang));
    if (pick) u.voice = pick;
    u.rate = 0.95;
    u.onend = u.onerror = () => btn.classList.remove("on");
    btn.classList.add("on"); ss.speak(u);
  }

  // ---- laying out long questions ----
  // q.display (when set) is the exam wording rearranged with simple line markers:
  //  "?? " the actual question   "!! " guidance in brackets   "\"\" " a statement/quote the question refers to
  //  "## " starts a source (document, extract, table)   "| a | b |" table rows (first row = header)
  //  "- " bullet   "~~ " source line (small print)   "[[image: ...]]" a picture on the exam paper
  //  other lines are paragraphs; lines like "(50 marks)" are dropped (marks show separately)
  const marksLine = l => /^\(?\s*\d+\s*marks?\s*\)?\.?$/i.test(l.trim());
  function qParse(q){
    if (!q || !q.display) return null;
    const P = { asks:[], notes:[], quotes:[], intro:[], secs:[] };
    let cur = null;
    String(q.display).split("\n").forEach(raw => {
      const l = raw.trim();
      if (!l || marksLine(l)) { if (!l) (cur ? cur.lines : P.intro).push(""); return; }
      if (l.startsWith("?? ")) P.asks.push(l.slice(3).trim());
      else if (l.startsWith("!! ")) P.notes.push(l.slice(3).trim());
      else if (l.startsWith('"" ')) P.quotes.push(l.slice(3).trim());
      else if (l.startsWith("## ")) { cur = { title: l.slice(3).trim(), lines: [] }; P.secs.push(cur); }
      else (cur ? cur.lines : P.intro).push(l);
    });
    return P.asks.length ? P : null;
  }
  function linesHtml(lines){
    let out = "", i = 0;
    const row = l => l.replace(/^\||\|$/g, "").split("|").map(c => c.trim());
    while (i < lines.length) {
      const l = lines[i];
      if (!l) { i++; continue; }
      if (l.startsWith("|")) {
        const rows = []; while (i < lines.length && lines[i].startsWith("|")) { if (!/^\|[\s:|-]+\|?$/.test(lines[i])) rows.push(row(lines[i])); i++; }
        out += `<div class="qd-tablewrap"><table class="qd-table"><thead><tr>${rows[0].map(c => `<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>${rows.slice(1).map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
        continue;
      }
      if (l.startsWith("- ")) { let li = ""; while (i < lines.length && lines[i].startsWith("- ")) { li += `<li>${esc(lines[i].slice(2))}</li>`; i++; } out += `<ul>${li}</ul>`; continue; }
      if (l.startsWith("~~ ")) out += `<p class="qd-src">${esc(l.slice(3))}</p>`;
      else if (/^\[\[img:/i.test(l)) {
        const parts = l.replace(/^\[\[img:\s*/i, "").replace(/\]\]\s*$/, "").split("|").map(x => x.trim());
        const src = parts[0] || "", alt = parts[1] || "Picture from the exam paper", big = /^big$/i.test(parts[2] || "");
        if (/^qimg\/[\w.-]+$/.test(src)) out += `<figure class="qd-fig${big ? " big" : ""}"><button type="button" class="qd-zoom" data-zoom="${esc(src)}" data-alt="${esc(alt)}" aria-label="Enlarge: ${esc(alt)}"><img src="${esc(src)}" alt="${esc(alt)}" loading="lazy"></button><figcaption>${big ? "Best on a bigger screen. Tap to enlarge, then zoom in." : "Tap to enlarge"}</figcaption></figure>`;
      }
      else if (/^\[\[image:/i.test(l)) out += `<p class="qd-img">Picture on the exam paper: ${esc(l.replace(/^\[\[image:\s*/i, "").replace(/\]\]$/, ""))}</p>`;
      else if (l.startsWith('"" ')) out += `<blockquote>${esc(l.slice(3))}</blockquote>`;
      else out += `<p>${esc(l)}</p>`;
      i++;
    }
    return out;
  }
  // Without a layout: keep the line breaks and turn runs of "a | b" lines into tables
  function plainHtml(text){
    const lines = String(text || "").split("\n").map(l => l.trim()).filter(l => !marksLine(l));
    const conv = lines.map(l => (l.match(/\|/g) || []).length >= 1 && !/^\(/.test(l) ? "|" + l + "|" : l);
    const fixed = conv.map((l, i) => l.startsWith("|") && !(conv[i-1] || "").startsWith("|") && !(conv[i+1] || "").startsWith("|") ? lines[i] : l);
    return linesHtml(fixed);
  }
  function questionHtml(q){
    const P = qParse(q);
    if (!P) return q.qtype === "exam" && /\n/.test(q.prompt || "") ? `<div class="qd qd-plain">${plainHtml(q.prompt)}</div>` : `<p class="pr-q">${esc(q.prompt)}</p>`;
    const total = P.secs.reduce((n, s) => n + s.lines.join(" ").length, 0);
    const open = total < 700;
    // A short lead-in (a sentence or two of context) reads best above the question; a long one goes under it
    const introText = P.intro.join(" ").trim(), introTop = introText.length > 0 && introText.length < 300;
    const intro = introText ? `<div class="qd-intro">${linesHtml(P.intro)}</div>` : "";
    return `<div class="qd">
      ${introTop ? intro : ""}
      <div class="qd-ask">${P.asks.map(a => `<p class="pr-q">${esc(a)}</p>`).join("")}${P.quotes.map(x => `<blockquote>${esc(x)}</blockquote>`).join("")}${P.notes.map(x => `<p class="qd-note">${esc(x)}</p>`).join("")}</div>
      ${!introTop ? intro : ""}
      ${P.secs.length ? `${!open ? `<p class="qd-lead">Read ${P.secs.length > 1 ? `these ${P.secs.length}` : "this"} first</p>` : ""}${P.secs.map(s => `<details class="qd-sec"${open ? " open" : ""}><summary><span>${esc(s.title)}</span><span class="qd-tap">${open ? "" : "Tap to read"}</span></summary><div class="qd-body">${linesHtml(s.lines)}</div></details>`).join("")}` : ""}
    </div>`;
  }
  // Tap a question picture to see it full screen (scroll/pinch to zoom; Esc or ✕ to close)
  function openZoom(src, alt){
    const box = h(`<div class="qd-lb" role="dialog" aria-modal="true" aria-label="${esc(alt)}"><div class="qd-lb-bar"><span>${esc(alt)}</span><button type="button" class="qd-lb-x" aria-label="Close">✕</button></div><div class="qd-lb-scroll"><img src="${esc(src)}" alt="${esc(alt)}"></div><div class="qd-lb-tools"><button type="button" data-z="-1" aria-label="Zoom out">−</button><button type="button" data-z="0">Fit</button><button type="button" data-z="1" aria-label="Zoom in">+</button></div></div>`);
    const img = box.querySelector("img"), sc = box.querySelector(".qd-lb-scroll");
    let z = 1;
    const apply = () => { img.style.width = z === 1 ? "" : (z * 100) + "%"; img.style.maxWidth = z === 1 ? "100%" : "none"; img.style.maxHeight = z === 1 ? "100%" : "none"; };
    box.querySelectorAll("[data-z]").forEach(b => b.onclick = () => { const d = +b.dataset.z; z = d === 0 ? 1 : Math.max(1, Math.min(4, z + d)); apply(); });
    const close = () => { box.remove(); document.removeEventListener("keydown", key); };
    const key = e => { if (e.key === "Escape") close(); };
    box.querySelector(".qd-lb-x").onclick = close;
    document.addEventListener("keydown", key);
    document.body.append(box);
    box.querySelector(".qd-lb-x").focus();
  }
  document.addEventListener("click", e => { const b = e.target.closest && e.target.closest(".qd-zoom"); if (b) openZoom(b.dataset.zoom, b.dataset.alt || ""); });

  // One line that says what the question asks (for lists)
  // The task itself, for previews: skips option lists like "JOSEPHUS / PLINY / TACITUS" and "(40 marks)" lines
  const promptAsk = p => {
    const ls = String(p || "").split("\n").map(l => l.trim()).filter(l => l && !/^\(\s*\d+\s*marks?\s*\)$/i.test(l));
    const isList = l => { const letters = l.replace(/[^A-Za-z]/g, ""), caps = l.replace(/[^A-Z]/g, ""); return /\s\/\s/.test(l) && letters.length && caps.length / letters.length > 0.6; };
    return ls.find(l => !isList(l)) || ls[0] || "";
  };
  const qMain = q => { const P = qParse(q); return P ? P.asks.join(" ") : promptAsk(q.prompt); };
  const shortTitle = q => q.qtype === "exam" ? `${isPast(q) ? "Past paper" : "Exam question"}: ${qMain(q)}` : q.prompt;

  // ---- mount ----
  async function mountPractice(slot, opts){
    const { topic, profile, sb, moreSlot, paperSlot, refreshSlot, prepSlot, rightSlot, goTo = () => {}, onStats = () => {}, onStartFresh = async () => {}, hideDuring = [], prepHide = [], nextUp = null, sessionNext = null, openToday = null, goHome = null, dailyGoal = 30 } = opts;
    const freshSince = typeof opts.freshSince === "function" ? opts.freshSince : () => opts.freshSince || null;
    if (!slot || !topic) return null;
    addCss();
    const questions = await sb(`quiz_questions?select=id,qtype,topic_label,difficulty,prompt,display,options,answer_index,explanation,model_answer,marking_scheme,source,marks&topic_id=eq.${topic.id}&order=id.asc`);
    if (!questions || !questions.length) return null;
    let prog = await loadProgress(sb, profile, questions, freshSince());
    let session = null;

    const mcq = questions.filter(q => q.qtype === "mcq"), rec = questions.filter(q => q.qtype === "recall"), ex = questions.filter(q => q.qtype === "exam");
    const fixes = () => questions.filter(q => prog.latest[q.id] !== undefined && prog.latest[q.id] < 1).sort((a, b) => prog.latest[a.id] - prog.latest[b.id]);
    const known = () => questions.filter(q => prog.latest[q.id] >= 1);
    const untried = () => questions.filter(q => prog.latest[q.id] === undefined);

    // Quick Tests: multiple choice and short answers only (exam questions live in Exam Prep)
    const quickFixes = () => fixes().filter(q => q.qtype !== "exam");
    function todaysPick(){
      const pick = quickFixes().slice(0, 3);
      const fill = (pool, n) => shuffle(pool.filter(q => !pick.includes(q))).slice(0, n).forEach(q => pick.push(q));
      const want = (type, n) => {
        const have = pick.filter(q => q.qtype === type).length, need = Math.max(0, n - have);
        const pool = type === "mcq" ? mcq : rec, fresh = pool.filter(q => prog.latest[q.id] === undefined && !pick.includes(q));
        fill(fresh.length >= need ? fresh : pool, need);
      };
      want("recall", rec.length ? 2 : 0);
      want("mcq", 10 - Math.min(2, rec.length));
      return shuffle(pick.slice(0, 3)).concat(shuffle(pick.slice(3)));
    }
    // Quick Tests run in rounds of 10: questions to try again first (not ones he just saw), then new ones
    const ROUND = 10;
    const estMin = list => Math.max(2, Math.round(list.reduce((n, q) => n + (q.qtype === "mcq" ? 25 : 90), 0) / 60));
    let lastRound = new Set();
    function roundList(){
      const quick = questions.filter(q => q.qtype !== "exam");
      const left = quick.filter(q => prog.latest[q.id] === undefined || prog.latest[q.id] < 1);
      const fx = left.filter(q => prog.latest[q.id] !== undefined), fresh = left.filter(q => prog.latest[q.id] === undefined);
      const list = shuffle(fx.filter(q => !lastRound.has(q.id))).concat(shuffle(fresh), shuffle(fx.filter(q => lastRound.has(q.id))));
      return (list.length ? list : shuffle(quick.slice())).slice(0, ROUND);
    }
    function todaysCaption(pick){
      const fx = quickFixes();
      const f = pick.filter(q => fx.includes(q)).length;
      const m = pick.filter(q => q.qtype === "mcq" && !fx.includes(q)).length;
      const r = pick.filter(q => q.qtype === "recall" && !fx.includes(q)).length;
      const parts = [];
      if (f) parts.push(`${f} to try again`);
      if (m) parts.push(`${m} multiple choice`);
      if (r) parts.push(plural(r, "short answer", "short answers"));
      return parts.join(" · ");
    }

    // ---- numbers for the tabs, and the Refresh tab ----
    const weakSpots = () => questions.filter(q => prog.everWeak.has(q.id) || !prog.ever.has(q.id));
    function paintStats(){
      const fx = fixes(), kn = known(), un = untried();
      onStats({ total: questions.length, tried: questions.length - un.length, fixes: fx.length, right: kn.length, triedEver: prog.ever.size, lastAt: prog.lastAt, pastTotal: ex.filter(isPast).length, examTotal: ex.length, examTried: ex.filter(q => prog.latest[q.id] !== undefined).length });
      paintRefresh();
      if (!session || session.where !== prepSlot) paintPrep();
    }
    function paintRefresh(){
      if (!refreshSlot) return;
      const ws = weakSpots(), hard = ws.filter(q => prog.everWeak.has(q.id)).length, never = ws.length - hard;
      const fresh = freshSince();
      const parts = [];
      if (hard) parts.push(`the ${plural(hard, "question", "questions")} you found hard before`);
      if (never) parts.push(`${plural(never, "question", "questions")} you never tried`);
      const weakDesc = parts.length ? parts.join(", plus ").replace(/^t/, "T") + "." + (ws.length > 15 ? " Up to 15 at a time, hardest first." : "") : "You've never got one wrong here. Try Retest the whole chapter instead.";
      const wrap = h(`<div><p class="pp-before">Before your exam</p><div class="pr-refresh">
        <div class="pr-card"><span class="pr-pill">Best when exams are close</span><h3 style="font-size:20px">Focus on weak spots</h3><p class="pr-sub">${esc(weakDesc)}</p><div class="pr-side-btn"><button type="button" class="pr-btn big" data-weak${ws.length ? "" : " disabled"}>Start</button></div></div>
        <div class="pr-card"><span class="pr-pill" style="visibility:hidden">.</span><h3 style="font-size:20px">Retest the whole chapter</h3><p class="pr-sub">Every question comes back as new. Your earlier results are kept, so you can see what stuck.</p>${fresh ? `<p class="pr-small">You started a retest on ${esc(new Date(fresh).toLocaleDateString("en-IE", { day:"numeric", month:"short" }))}: ${plural(known().length, "right", "right")} so far, ${fixes().length} to try again, ${untried().length} to go.</p>` : ""}<div class="pr-side-btn"><button type="button" class="pr-btn big ghost" data-fresh>${fresh ? "Retest again" : "Retest the chapter"}</button></div></div>
      </div></div>`);
      wrap.querySelector("[data-weak]").onclick = () => {
        const hardOnes = shuffle(ws.filter(q => prog.everWeak.has(q.id))), newOnes = shuffle(ws.filter(q => !prog.everWeak.has(q.id)));
        start("Weak Spots", hardOnes.concat(newOnes).slice(0, 15), "prep");
      };
      wrap.querySelector("[data-fresh]").onclick = async (e) => {
        e.target.disabled = true; e.target.textContent = "Starting…";
        await onStartFresh();
        prog = await loadProgress(sb, profile, questions, freshSince());
        paintStats(); home(); start("Retest", shuffle(questions.slice()).slice(0, 15), "prep");
      };
      refreshSlot.replaceChildren(wrap);
    }

    // ---- Exam Prep tab ----
    let prepAll = false;
    const pastSorted = () => ex.filter(isPast).sort((a, b) => String(b.source).localeCompare(String(a.source)) || a.id.localeCompare(b.id));
    const styleQs = () => ex.filter(q => !isPast(q));
    const yearOf = q => (String(q.source || "").match(/\b(19|20)\d{2}\b/) || [""])[0];
    const partOf = q => String(q.source || "").replace(/^\s*(19|20)\d{2}\s*State Exam\s*[-–·]\s*/i, "");
    function chip(q){
      const r = prog.reviews[q.id], v = prog.latest[q.id];
      if (prog.remembered && prog.remembered.has(q.id)) return `<span class="pp-chip good">Remembered &#10003;</span>`;
      if (v === undefined) return `<span class="pp-chip">Not tried</span>`;
      const score = r && r.marks_available ? `${r.marks_awarded}/${r.marks_available}` : v >= 1 ? "Got it" : "Tried";
      return v >= 1 ? `<span class="pp-chip good">${esc(score)}</span>` : `<span class="pp-chip mid">${esc(score)} · improve</span>`;
    }
    function prepQueue(){
      const past = pastSorted(), style = styleQs();
      const untriedP = past.filter(q => prog.latest[q.id] === undefined), weakP = past.filter(q => prog.latest[q.id] !== undefined && prog.latest[q.id] < 1);
      const untriedS = style.filter(q => prog.latest[q.id] === undefined), weakS = style.filter(q => prog.latest[q.id] !== undefined && prog.latest[q.id] < 1);
      const q = [...untriedP, ...weakP, ...untriedS, ...weakS];
      return (q.length ? q : [...past, ...style]).slice(0, 5);
    }
    function paintPrep(){
      if (!prepSlot) return;
      if (!ex.length) { prepSlot.replaceChildren(h(`<div class="pr-card"><p class="pr-sub" style="margin:0">Exam questions for this chapter are coming soon. You can still use the tools below.</p></div>`)); return; }
      const past = pastSorted(), style = styleQs(), pool = past.length ? past : style;
      const doneN = pool.filter(q => prog.latest[q.id] !== undefined).length;
      const years = past.map(yearOf).filter(Boolean).sort();
      const tag = past.length ? `Real State Exam questions${years.length ? ` · ${years[0] === years[years.length - 1] ? years[0] : years[0] + " to " + years[years.length - 1]}` : ""}` : "Exam-style questions from your textbook";
      const hero = h(`<div class="pp-hero"><span class="ft-icon">${PAPER_SVG}</span><span class="pp-hero-b"><span class="ft-tag">${esc(tag)}</span><span class="pp-hero-t">Do an exam question</span><span class="pr-sub">Write it, get it marked like the real exam, then improve it with your tutor. ${doneN} of ${pool.length} done.</span></span><button type="button" class="pr-btn big">Start</button></div>`);
      hero.querySelector("button").onclick = () => start("Exam Prep", prepQueue(), "prep");
      const nodes = [hero];
      const row = q => {
        const b = h(`<button type="button" class="pp-row"><span class="pp-yr">${esc(isPast(q) ? yearOf(q) : "")}</span><span class="pp-b"><span class="pp-s">${esc(isPast(q) ? partOf(q) : "Practice question")} · ${q.marks || 5} marks</span><span class="pp-q">${esc(qMain(q))}</span></span>${chip(q)}</button>`);
        b.onclick = () => start("Exam Prep", [q], "prep");
        return b;
      };
      const list = past.length ? past : style;
      const best = Object.values(prog.reviews).filter(r => list.some(q => q.id === r.question_id) && r.marks_available).sort((a, b) => b.marks_awarded / b.marks_available - a.marks_awarded / a.marks_available)[0];
      const box = h(`<div class="pp-list"><div class="pp-head"><b>${past.length ? "Past paper questions" : "Exam questions"}</b>${best ? `<span>Best mark so far ${best.marks_awarded}/${best.marks_available}</span>` : ""}</div></div>`);
      const show = prepAll ? list : list.slice(0, 4);
      show.forEach(q => box.append(row(q)));
      if (list.length > 4) {
        const m = h(`<button type="button" class="pp-more">${prepAll ? "Show fewer" : `See all ${list.length} ›`}</button>`);
        m.onclick = () => { prepAll = !prepAll; paintPrep(); };
        box.append(m);
      }
      nodes.push(box);
      if (past.length && style.length) {
        const l = h(`<button type="button" class="pp-link">Plus ${plural(style.length, "practice exam question", "practice exam questions")} written from your textbook ›</button>`);
        l.onclick = () => start("Practice exam questions", style.slice(), "prep");
        nodes.push(l);
      }
      prepSlot.replaceChildren(...nodes);
    }

    // ---- Test tab ----
    function setChrome(show, where){ hideDuring.forEach(el => { if (el) el.hidden = !show; }); prepHide.forEach(el => { if (el) el.hidden = !show; }); }
    // The last day he tested this chapter: first answer to each quick question that day
    function lastGo(quick){
      const ids = new Set(quick.map(q => q.id)), att = (prog.att || []).filter(a => ids.has(a.question_id) && a.source !== "tutor");
      if (!att.length) return null;
      const day = d => { const x = new Date(d); return x.getFullYear() + "-" + x.getMonth() + "-" + x.getDate(); };
      const k = day(att[0].created_at), first = {};
      att.filter(a => day(a.created_at) === k).forEach(a => { first[a.question_id] = Number(a.result); });
      const vals = Object.values(first); if (vals.length < 3) return null;
      const right = vals.filter(v => v >= 1).length, half = vals.filter(v => v > 0 && v < 1).length, pct = Math.round(vals.reduce((n, v) => n + v, 0) / vals.length * 100);
      const days = Math.round((new Date(new Date().toDateString()) - new Date(new Date(att[0].created_at).toDateString())) / 86400000);
      return { n: vals.length, right, half, pct, when: days <= 0 ? "today" : days === 1 ? "yesterday" : days < 7 ? `${days} days ago` : "on " + new Date(att[0].created_at).toLocaleDateString("en-IE", { day: "numeric", month: "short" }) };
    }
    function home(){
      session = null; setChrome(true);
      const fx = quickFixes();
      // Where he is on this chapter's quick questions, and how the last go went
      const quick = questions.filter(q => q.qtype !== "exam");
      const nRight = quick.filter(q => prog.latest[q.id] >= 1).length, nFix = fx.length, nNew = quick.length - nRight - nFix;
      const last = lastGo(quick);
      const pctW = n => quick.length ? (n / quick.length * 100).toFixed(1) + "%" : "0";
      const tried = nRight + nFix;
      const mainLabel = tried ? "Start practice" : "Start testing";
      const round = roundList(), rFix = round.filter(q => fx.includes(q)).length, rNew = round.filter(q => prog.latest[q.id] === undefined).length;
      const nextText = !nFix && !nNew ? `${round.length} mixed questions to check it stuck`
        : [rFix ? `${rFix} to try again` : "", rNew ? `${rNew} new` : ""].filter(Boolean).join(" and ");
      // Weak spot: the topic with the most questions to try again
      const wc = {}; fx.filter(q => q.qtype !== "exam" && q.topic_label).forEach(q => { wc[q.topic_label] = (wc[q.topic_label] || 0) + 1; });
      const weak = Object.keys(wc).sort((a, b) => wc[b] - wc[a])[0];
      // Secure: latest answer right, and right on at least two different days
      const qids = new Set(quick.map(q => q.id)), rightDays = {};
      (prog.att || []).forEach(a => { if (!qids.has(a.question_id) || Number(a.result) < 1) return; (rightDays[a.question_id] = rightDays[a.question_id] || new Set()).add(new Date(a.created_at).toDateString()); });
      const nSecure = quick.filter(q => prog.latest[q.id] >= 1 && rightDays[q.id] && rightDays[q.id].size >= 2).length;
      const line = (k, v) => `<p class="pr-sum-l"><span class="k">${k}</span><span class="v">${v}</span></p>`;
      const hero = h(`<div class="pr-card pr-prog">
          <span class="pr-hero-title">${tried ? "Your progress on this chapter" : "Test yourself on this chapter"}</span>
          <div class="pr-sum">
            ${last ? line("Last practice", `${esc(last.when.replace(/^on /, ""))}: <b>${last.right} of ${last.n} right</b>${last.half ? `, ${last.half} half right` : ""}`) : ""}
            ${line("This round", `<b>${esc(nextText)}</b>`)}
            ${weak ? line("Weak spot", esc(weak)) : ""}
          </div>
          <div class="pr-row pr-runrow" style="margin-top:4px"><button type="button" class="pr-btn big" data-run>${mainLabel}</button><span class="pr-est">${plural(round.length, "question", "questions")} · about ${estMin(round)} min</span></div>
          ${tried ? `<details class="pr-viewprog"><summary>View progress</summary>
            <p class="pr-small">Your latest answer to each of the ${quick.length} questions:</p>
            <div class="pr-bar3" aria-hidden="true"><i class="r" style="width:${pctW(nRight)}"></i><i class="f" style="width:${pctW(nFix)}"></i></div>
            <div class="pr-legend"><span><i class="r"></i>${nRight} right last time</span><span><i class="f"></i>${nFix} to try again</span><span><i></i>${nNew} not tried yet</span></div>
            <p class="pr-small"><b>${nSecure} of ${quick.length} secure</b>: right on two different days. That's when you really know it.</p>
            <p class="pr-small">"Last practice" counts your first answer to each question that day, so it can be lower than "right last time" once you've had another go.</p>
          </details>` : ""}</div>`);
      hero.querySelector("[data-run]").onclick = () => runToday();
      const nodes = [hero];
      if (paperSlot) paperSlot.replaceChildren();
      slot.replaceChildren(...nodes);

      if (moreSlot) {
        const box = h(`<details class="pr-choices pr-more"><summary class="pr-choose-label">More ways to practise</summary></details>`);
        const add = (title, note, fn, disabled, badge) => {
          const b = h(`<button type="button" class="pr-choice"${disabled ? " disabled" : ""}><span class="pr-li-body"><span class="pr-li-title">${esc(title)}</span><span class="pr-li-note">${esc(note)}</span></span>${badge ? `<span class="pr-badge">${badge}</span>` : ""}<span class="pr-chev" aria-hidden="true">›</span></button>`);
          b.onclick = fn; box.append(b);
        };
        add("Quick Quiz", "Multiple choice, one tap answers", () => start("Quick Quiz", shuffle(mcq)), !mcq.length);
        if (rec.length) add("Short Answer Practice", "Write a line or two, then compare", () => start("Short Answer Practice", shuffle(rec)));
        const nodes2 = [box];
        // Only once he's earned it: 80%+ on his last go
        if (ex.length && prepSlot && last && last.pct >= 80) {
          const nx = h(`<button type="button" class="pp-next"><span class="pr-li-body"><span class="pr-li-title">Know this chapter well?</span><span class="pr-li-note">Move on to Exam Prep and try ${ex.some(isPast) ? "a real past paper question" : "an exam question"}.</span></span><b class="go">Exam Prep ›</b></button>`);
          nx.onclick = () => goTo("refresh");
          nodes2.push(nx);
        }
        moreSlot.replaceChildren(...nodes2);
      }
      paintPrep();
      if (rightSlot) {
        const kn = known();
        rightSlot.replaceChildren();
        if (kn.length) {
          const d = h(`<div class="pr-right" style="padding:8px 0 0"><strong style="font-size:15px">Questions you've got right (${kn.length})</strong><ol></ol></div>`);
          kn.forEach(q => d.querySelector("ol").append(h(`<li>${esc(shortTitle(q))}</li>`)));
          rightSlot.append(d);
          const box2 = rightSlot.closest("details"); if (box2 && !session) box2.hidden = false;
        }
      }
    }

    // ---- today's 30 minutes ----
    const startOfToday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
    async function todayBase(){
      try {
        const rows = await sb(`study_time?select=seconds&profile_id=eq.${profile.id}&kind=eq.test&created_at=gte.${encodeURIComponent(startOfToday().toISOString())}`);
        return (rows || []).reduce((n, r) => n + (Number(r.seconds) || 0), 0) / 60;
      } catch (e) { return 0; }
    }
    const sessionSec = s => s && s.results.length ? Math.min(Math.round((Date.now() - s.t0) / 1000), s.results.length * 300 + 60, 7200) : 0;
    const todayMins = () => session ? Math.floor(session.base + sessionSec(session) / 60) : 0;
    function ringHtml(size, mins, stroke){
      const r = (size - stroke) / 2, c = 2 * Math.PI * r, f = Math.max(0, Math.min(1, mins / dailyGoal));
      return `<span class="pr-ring" style="width:${size}px;height:${size}px" aria-hidden="true"><svg width="${size}" height="${size}"><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="var(--t-line)" stroke-width="${stroke}"/><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="var(--t-accent)" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${(c * f).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 ${size/2} ${size/2})"/></svg>${mins >= dailyGoal ? "<b>&#10003;</b>" : ""}</span>`;
    }
    function paintRing(){
      if (!session || !session.today) return;
      const el = session.where.querySelector("[data-ring]"); if (!el) return;
      const m = todayMins();
      el.innerHTML = `${ringHtml(40, m, 5)}<span>${m >= dailyGoal ? `${m} min tested today` : `${m} of ${dailyGoal} min tested today`}</span>`;
      if (m >= dailyGoal && !session.hit) {
        session.hit = true;
        const card = session.where.querySelector(".pr-card");
        if (card && session.base < dailyGoal) card.querySelector(".pr-progress").after(h(`<div class="pr-goalhit"><b>Today's ${dailyGoal} minutes: done &#10003;</b> Anything more is a bonus.</div>`));
      }
    }
    // Work through this chapter's quick-test questions that are left (new ones and ones to fix)
    function runToday(){
      const list = roundList();
      lastRound = new Set(list.map(q => q.id));
      goTo("test");
      start("Practice round", list, undefined, true);
    }

    function start(name, list, where, today, extra){
      if (!list || !list.length) return;
      if (session) { logTime(session); home(); }
      session = { name, queue: list.map(q => ({ q, retry:false })), i:0, results:[], total:list.length, t0: Date.now(), where: where === "prep" && prepSlot ? prepSlot : slot, today: !!today, base: 0, memory: (extra && extra.memory) || null };
      if (today) todayBase().then(m => { if (session) { session.base = m; paintRing(); } });
      setChrome(false);
      next();
    }

    function next(){
      if (session.i >= session.queue.length) return finish();
      const entry = session.queue[session.i], { q, retry } = entry;
      const label = q.qtype === "exam" ? (isPast(q) ? `Past paper · ${esc(q.source || "")} · ${q.marks || 5} marks` : `Exam-style question · ${q.marks || 5} marks`) : q.qtype === "recall" ? "Short answer" : "Quick quiz";
      const card = h(`<div class="pr-card">
        <div class="pr-row" style="justify-content:space-between"><button type="button" class="pr-btn ghost" data-stop>← Go back</button><span class="pr-small" style="font-variant-numeric:tabular-nums">${entry.again ? "Improving your answer" : retry ? "Second try" : session.memory ? "Memory check" : `Question ${session.i+1} of ${session.total}`}</span></div>
        <div class="pr-progress"><i style="width:${Math.min(session.i,session.total)/session.total*100}%"></i></div>
        <div class="pr-meta"><span>${label}</span>${session.today ? `<span class="pr-today" data-ring></span>` : ""}</div>
        ${questionHtml(q)}</div>`);
      card.querySelector("[data-stop]").onclick = () => session.results.length ? finish() : home();
      session.t0 = session.t0 || Date.now();
      if (q.qtype === "mcq") mcqView(card, q, retry); else writtenView(card, q, retry, entry);
      session.where.replaceChildren(card);
      paintRing();
      card.scrollIntoView({ block:"start", behavior:"smooth" });
    }

    function nextBtn(card){
      // Say where it goes: next question, finish, or straight back to Exam Prep after a single question
      const lastOne = session.i >= session.queue.length - 1, single = lastOne && session.total === 1 && session.where === prepSlot;
      const label = !lastOne ? "Next question ›" : single ? "Back to Exam Prep" : "Finish practice";
      const b = h(`<div class="pr-row pr-nextrow"><button type="button" class="pr-btn">${label}</button></div>`);
      b.querySelector("button").onclick = () => {
        if (single) { logTime(session); home(); return; }
        session.i++; next();
      };
      card.append(b); b.querySelector("button").focus({ preventScroll:true });
    }
    const save = async (qid, v, source) => { await record(sb, profile, qid, v, source); prog = await loadProgress(sb, profile, questions, freshSince()); paintStats(); };
    function logTime(s){
      if (!s || !s.results.length) return;
      const sec = Math.min(Math.round((Date.now() - s.t0) / 1000), s.results.length * 300 + 60, 7200);
      if (sec > 0) sb("study_time", { method:"POST", prefer:"return=minimal", body:[{ profile_id: profile.id, topic_id: topic.id, kind:"test", seconds: sec }] });
    }

    function mcqView(card, q, retry){
      const opts = h(`<div class="pr-opts"></div>`), order = shuffle((q.options||[]).map((o,i)=>i));
      order.forEach((oi, pos) => {
        const b = h(`<button type="button" class="pr-opt"><b>${L[pos]}</b><span>${esc(q.options[oi])}</span></button>`);
        b.onclick = () => {
          const ok = oi === q.answer_index;
          opts.querySelectorAll(".pr-opt").forEach((x,p) => { x.disabled = true; if (order[p] === q.answer_index) x.classList.add("right"); });
          if (!ok) b.classList.add("wrong"); else b.classList.add("pop");
          if (!retry) { session.results.push({ q, v: ok?1:0 }); save(q.id, ok?1:0, "quiz"); }
          if (!ok && !retry) session.queue.push({ q, retry:true });
          card.append(h(`<div class="pr-fb ${ok?"good":""}"><span class="pr-verd">${ok ? `<span class="pr-tick" aria-hidden="true">&#10003;</span>` : ""}<strong>${ok?"Right.":"Not this one."}</strong></span><span>${esc(q.explanation||"")}</span>${!ok&&!retry?`<span class="pr-tip">You'll get another go at the end.</span>`:""}</div>`));
          nextBtn(card);
        };
        opts.append(b);
      });
      card.append(opts);
    }

    // After marking: "What next?" — improve it step by step, talk it through, or just try again
    function improveRow(card, q, text, f, entry){
      const isExam = q.qtype === "exam";
      const again = (added) => {
        session.queue.splice(session.i + 1, 0, { q, retry:true, again:true, added: added || [],
          prev: added && added.length ? (text ? text.trim() + "\n\n" : "") + added.join(" ") : text,
          tips: added && added.length ? [] : f.to_improve.slice(),
          before: { marks_awarded: f.marks_awarded, marks_available: f.marks_available } });
        session.total++; session.i++; next();
      };
      const opt = (key, icon, title, note, main) => `<button type="button" class="pr-nx${main ? " main" : " minor"}" data-${key}><span class="pr-nx-i">${icon}</span><span class="pr-li-body"><span class="pr-li-title">${title}</span><span class="pr-li-note">${note}</span></span><span class="pr-chev" aria-hidden="true">›</span></button>`;
      const wrap = h(`<div class="pr-improve">
        <span class="pr-nx-l">What next?</span>
        ${isExam ? opt("steps", STEPS_SVG, "Improve it step by step", `${Math.min(3, f.to_improve.length)} short step${Math.min(3, f.to_improve.length) === 1 ? "" : "s"}, one sentence each`, true) : ""}
        ${isExam && window.coachAnswer ? opt("talk", MIC_SVG, "Talk it through with my tutor", "A short voice call about this answer") : ""}
        ${opt("again", PEN_SVG, "Just try again", isExam ? "You already know what to fix" : "Have another go using these tips", !isExam)}
        <div data-coachslot></div></div>`);
      const cslot = wrap.querySelector("[data-coachslot]");
      const opts = () => wrap.querySelectorAll(".pr-nx, .pr-nx-l");
      const showOpts = on => opts().forEach(el => el.style.display = on ? "" : "none");
      wrap.querySelector("[data-again]").onclick = () => { cslot.replaceChildren(); again(); };
      const st = wrap.querySelector("[data-steps]");
      const focus = on => { const c = card.closest(".pr-card"); if (c) c.classList.toggle("pr-focus", on); };
      if (st) st.onclick = () => { showOpts(false); focus(true); stepper(cslot, q, text, f, (added) => { focus(false); again(added); }, () => { cslot.replaceChildren(); showOpts(true); focus(false); }); };
      const tk = wrap.querySelector("[data-talk]");
      if (tk) tk.onclick = () => { showOpts(false); focus(true);
        window.coachAnswer(cslot, { topic, profile, sb, question:q, answer:text, feedback:f,
          onEnd: ({ failed }) => {
            showOpts(true); focus(false);
            if (failed) return;
            // After a call: one clear next step (write it again); talking again stays possible
            const st2 = wrap.querySelector("[data-steps]"); if (st2) { st2.classList.remove("main"); st2.classList.add("minor"); }
            const t2 = wrap.querySelector("[data-talk]"); if (t2) { t2.querySelector(".pr-li-title").textContent = "Talk it through again"; t2.querySelector(".pr-li-note").textContent = "Another short voice call"; }
            const a = wrap.querySelector("[data-again]"); a.classList.add("main"); a.classList.remove("minor"); a.querySelector(".pr-li-title").textContent = "Write it again now"; a.querySelector(".pr-li-note").textContent = "Add the points you just talked through"; a.focus({ preventScroll:true });
            wrap.querySelector(".pr-nx-l").after(cslot);
          } }); };
      // Straight under the mark and summary, so the next step is the first thing he sees
      const head = card.querySelector(":scope > .pr-key") || card.querySelector(":scope > .pr-row");
      if (head) head.after(wrap); else card.append(wrap);
    }

    // Improve it step by step: one point at a time, one sentence each, then put it together
    async function stepper(slot2, q, text, f, onDone, onCancel){
      const box = h(`<div class="pr-steps2"><p class="pr-small">Working out your steps…</p></div>`);
      slot2.replaceChildren(box);
      const post = async (payload) => {
        const r = await fetch("/api/improve", { method:"POST", headers:{ "Content-Type":"application/json" },
          body: JSON.stringify(Object.assign({ question_id: q.id, answer: text, feedback: { marks_awarded: f.marks_awarded, marks_available: f.marks_available, summary: f.summary, to_improve: f.to_improve } }, payload)) });
        const d = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(d.error || "That didn't work just now. Try again.");
        return d;
      };
      let steps;
      try { steps = (await post({ action: "plan" })).steps; }
      catch (e) {
        box.replaceChildren(h(`<div class="pr-row"><p class="pr-err" style="flex:1">${esc(e.message)}</p><button type="button" class="pr-btn ghost">Back</button></div>`));
        box.querySelector("button").onclick = onCancel; return;
      }
      const added = []; let i = 0;
      function paint(){
        const s = steps[i], last = i === steps.length - 1;
        box.innerHTML = `
          <div class="pr-bars">${steps.map((_, k) => `<i class="${k <= i ? "on" : ""}"></i>`).join("")}</div>
          <div class="pr-row" style="justify-content:space-between"><span class="pr-eyebrow">Step ${i + 1} of ${steps.length}</span>${i ? `<span class="pr-small" style="color:var(--t-accent);font-weight:700">&#10003; ${i === 1 ? "Step 1" : "Steps 1–" + i} done</span>` : ""}</div>
          <div class="pr-stepcard"><b>${esc(s.title)}</b><span>${esc(s.why)}</span>${s.hint ? `<details><summary>Need a hint?</summary><span>${esc(s.hint)}</span></details>` : ""}</div>
          <label class="pr-nx-l" for="stepTa">Write one sentence</label>
          <div class="pr-answer"><textarea id="stepTa" rows="2" placeholder="Your sentence"></textarea><div class="pr-tools" data-inputs></div></div>
          <div class="pr-verdict" hidden></div>
          <div class="pr-row"><button type="button" class="pr-btn" data-check>Check it</button><button type="button" class="pr-btn ghost" data-skip>${last ? "Skip and put it together" : "Skip this step"}</button></div>
          <p class="pr-err" hidden></p>
          ${added.length ? `<div class="pr-added"><b>Your new sentences</b>${added.map((t, k) => `<span>${k + 1}. ${esc(t)}</span>`).join("")}</div>` : ""}`;
        const ta = box.querySelector("textarea"), tools = box.querySelector("[data-inputs]"), err = box.querySelector(".pr-err"),
          chk = box.querySelector("[data-check]"), skip = box.querySelector("[data-skip]"), ver = box.querySelector(".pr-verdict");
        attachMic(tools, ta, err);
        const stopMic = () => { if (tools._stopMic) tools._stopMic(); };
        const advance = (sentence) => {
          stopMic();
          if (sentence) added.push(sentence);
          if (last) finishSteps(); else { i++; paint(); box.scrollIntoView({ block:"nearest", behavior:"smooth" }); }
        };
        skip.onclick = () => advance(null);
        chk.onclick = async () => {
          stopMic();
          const sentence = ta.value.trim();
          if (!sentence) { err.textContent = "Write or say your sentence first."; err.hidden = false; return; }
          err.hidden = true; chk.disabled = true; chk.textContent = "Checking…";
          try {
            const d = await post({ action: "check", step: s, sentence });
            const good = d.verdict === "good";
            ver.className = "pr-verdict " + (good ? "good" : "");
            ver.innerHTML = `<b>${good ? "Good, that earns marks." : d.verdict === "close" ? "Nearly." : "Not yet."}</b> ${esc(d.message || "")}`;
            ver.hidden = false;
            chk.textContent = "Check again"; chk.className = "pr-btn ghost";
            let go = box.querySelector("[data-next]");
            if (!go) { go = h(`<button type="button" class="pr-btn" data-next>${last ? "Put it together ›" : "Next step ›"}</button>`); chk.before(go); }
            go.textContent = good ? (last ? "Put it together ›" : "Next step ›") : (last ? "Use it anyway and put it together ›" : "Use it anyway ›");
            go.onclick = () => advance(ta.value.trim());
            skip.style.display = "none";
            go.focus({ preventScroll:true });
          } catch (e) { err.textContent = e.message; err.hidden = false; chk.textContent = "Check it"; }
          finally { chk.disabled = false; }
        };
        ta.focus({ preventScroll:true });
      }
      function finishSteps(){
        if (!added.length) { onCancel(); return; }
        onDone(added);
      }
      paint();
    }

    function writtenView(card, q, retry, entry = {}){
      const images = [], isExam = q.qtype === "exam";
      const mem = session && session.memory && !entry.again && !retry ? session.memory : null;
      const box = h(`<div style="display:flex;flex-direction:column;gap:10px">
        <p class="pr-tip">Type your answer, tap the microphone to speak it, or add a photo of a written answer.</p>
        ${SR ? "" : speakTip()}
        <div class="pr-answer">
          <textarea aria-label="Your answer" placeholder="Your answer"></textarea>
          <div class="pr-tools" data-inputs><label class="pr-icon" title="Add a photo of your answer" aria-label="Add a photo of your answer">${CAM_SVG}<input type="file" accept="image/*" multiple></label></div>
        </div>
        <div class="pr-thumbs"></div>
        <div class="pr-row"><button type="button" class="pr-btn" data-fb>Check my answer</button><button type="button" class="pr-btn ghost" data-self>Just show the answer</button></div>
        <p class="pr-err" hidden></p></div>`);
      const ta = box.querySelector("textarea"), thumbs = box.querySelector(".pr-thumbs"), file = box.querySelector("input[type=file]"), err = box.querySelector(".pr-err");
      const fbBtn = box.querySelector("[data-fb]"), selfBtn = box.querySelector("[data-self]");
      if (mem) {
        // From fresh: no notes, no peeking at the answer, marked like the real exam
        box.querySelector(".pr-tip").innerHTML = `<b>Memory check.</b> Answer from memory, with no notes or book. It's marked like the real exam, and shows what has stuck since you did this chapter ${mem.days} days ago.`;
        selfBtn.style.display = "none";
      }
      if (entry.again) {
        ta.value = entry.prev || "";
        box.querySelector(".pr-tip").textContent = entry.added && entry.added.length
          ? `All steps done. Your new sentences are added at the end of your answer. Read it through, move things around if you like, then check it.${entry.before && isExam ? ` Last time: ${entry.before.marks_awarded} out of ${entry.before.marks_available}.` : ""}`
          : !isExam
          ? "Have another go, using the tips below."
          : entry.before
          ? `Last time: ${entry.before.marks_awarded} out of ${entry.before.marks_available}. Add the points you talked through, then check it again.`
          : "Add the points you talked through, then check it again.";
        if (entry.added && entry.added.length) { box.querySelector(".pr-tip").classList.add("pr-alldone"); ta.rows = 8; }
        selfBtn.style.display = "none";
        if (entry.tips && entry.tips.length) box.querySelector(".pr-tip").after(h(`<div class="pr-fb"><h4>${isExam ? "To get more marks" : "Where you can add more marks"}</h4><ul>${entry.tips.map(t => `<li>${esc(t)}</li>`).join("")}</ul></div>`));
      }
      const inputsRow = box.querySelector("[data-inputs]");
      attachMic(inputsRow, ta, err);
      const stopMic = () => { if (inputsRow._stopMic) inputsRow._stopMic(); };
      if (file) file.onchange = async () => {
        err.hidden = true;
        for (const f of Array.from(file.files || []).slice(0, 3 - images.length)) {
          try { const d = await shrink(f); images.push(d); thumbs.append(h(`<img alt="Your answer photo ${images.length}" src="${d}">`)); }
          catch (e) { err.textContent = e.message; err.hidden = false; }
        }
        file.value = "";
      };
      const done = (v, source) => {
        if (entry.again) { const r = session.results.find(x => x.q === q); if (r) r.v = Math.max(r.v, v); save(q.id, v, source); }
        else if (!retry) { session.results.push({ q, v }); save(q.id, v, source); }
      };
      const modelBlock = () => `<details class="pr-modelbl"><summary>${isExam ? "See the model answer and marking scheme" : "See a good answer"}</summary><div class="pr-fb" style="margin-top:8px"><span>${esc(q.model_answer||"")}</span>${q.marking_scheme?`<span class="pr-scheme"><strong>Marking scheme:</strong> ${esc(q.marking_scheme)}</span>`:""}</div></details>`;

      fbBtn.onclick = async () => {
        stopMic();
        const text = ta.value.trim();
        if (!text && !images.length) { err.textContent = "Type, speak or add a photo of your answer first, or use Just show the answer."; err.hidden = false; return; }
        fbBtn.disabled = selfBtn.disabled = true; fbBtn.textContent = "Reading your answer…"; err.hidden = true;
        try {
          const r = await fetch("/api/mark-answer", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ question_id: q.id, answer_text: text, images }) });
          const data = await r.json().catch(() => ({}));
          if (!r.ok || !data.feedback) throw new Error(data.error || "Feedback couldn't be generated.");
          const f = data.feedback, frac = f.marks_available ? f.marks_awarded / f.marks_available : 0;
          const v = frac >= 0.8 ? 1 : frac >= 0.4 ? 0.5 : 0;
          await sb("answer_reviews", { method:"POST", prefer:"return=minimal", body:[{ profile_id: profile.id, question_id: q.id, answer_text: text || f.transcription || null, marks_awarded: f.marks_awarded, marks_available: f.marks_available, feedback: f }] });
          done(v, mem ? `memory:${mem.origin}:${frac >= 0.6 ? "pass" : "miss"}` : entry.again ? "helped" : "written");
          box.remove();
          const list = a => a.length ? `<ul>${a.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>` : "";
          // Short first: the mark, one thing that worked, the one change worth most. The rest is folded.
          const good1 = f.went_well[0] || f.summary || "", fix1 = f.to_improve[0] || "";
          const shown = text || f.transcription || "";
          const upTxt = entry.before && f.marks_awarded > entry.before.marks_awarded ? (isExam ? `Up from ${entry.before.marks_awarded} to ${f.marks_awarded} marks.` : "Better than last time.") : "";
          const memLine = mem ? `<p class="pr-k pr-memres"><b>${frac >= 0.6 ? `You remembered this from ${mem.days} days ago &#10003;` : "Worth another go. This one will come back in a few days."}</b></p>` : "";
          const fbEl = h(`<div class="pr-fb ${v===1?"good":""}">
            <div class="pr-key">${memLine}
              <div class="pr-row" style="gap:12px 16px">${isExam ? `<span class="pr-score">${f.marks_awarded}/${f.marks_available}</span>` : `<span class="pr-verd">${v === 1 ? `<span class="pr-tick" aria-hidden="true">&#10003;</span><strong>Got it.</strong>` : `<strong>${v ? "Nearly." : "Not yet."}</strong>`}</span>`}${upTxt ? `<span class="pr-up">${upTxt}</span>` : ""}${"speechSynthesis" in window ? `<button type="button" class="pr-hear" data-hear aria-label="Hear the feedback">${SPEAK_SVG}<span>Hear it</span></button>` : ""}</div>
              ${isExam ? `${good1 ? `<p class="pr-k"><b>Good:</b> ${esc(good1)}</p>` : ""}
              ${fix1 ? `<p class="pr-k"><b>For more marks:</b> ${esc(fix1)}</p>` : ""}` : `${f.went_well.length ? `<h4>What you got right</h4>${list(f.went_well)}` : ""}
              ${f.to_improve.length ? `<h4>Where you can add more marks</h4>${list(f.to_improve)}` : ""}`}
            </div>
            ${isExam ? `<details class="pr-more"><summary>See the full marking</summary>
              ${f.summary ? `<p style="margin:8px 0 0">${esc(f.summary)}</p>` : ""}
              ${f.went_well.length ? `<h4>What you got right</h4>${list(f.went_well)}` : ""}
              ${f.to_improve.length ? `<h4>${isExam ? "How to get more marks" : "To make it better"}</h4>${list(f.to_improve)}` : ""}
              ${f.example ? `<h4>For example</h4><span>${esc(f.example)}</span>` : ""}
              ${shown ? `<details class="pr-mine"><summary>Your answer, as it was marked</summary><span>${esc(shown)}</span></details>` : ""}
            </details>` : ""}
          </div>`);
          card.append(fbEl);
          const hb = fbEl.querySelector("[data-hear]");
          if (hb) hb.onclick = () => speakOut(hb, (isExam
            ? [`${f.marks_awarded} out of ${f.marks_available}.`, upTxt, good1 ? "Good: " + good1 : "", fix1 ? "For more marks: " + fix1 : ""]
            : [v === 1 ? "Got it." : v ? "Nearly." : "Not yet.", upTxt, f.went_well.length ? "What you got right. " + f.went_well.join(" ") : "", f.to_improve.length ? "Where you can add more marks. " + f.to_improve.join(" ") : ""]).filter(Boolean).join(" "));
          if (f.to_improve.length && (isExam || v < 1) && (!f.marks_available || f.marks_awarded < f.marks_available)) improveRow(fbEl, q, text || f.transcription || "", f, entry);
          card.append(h(modelBlock()));
          nextBtn(card);
        } catch (e) {
          err.textContent = e.message + " You can still check it yourself with Just show the answer."; err.hidden = false;
          fbBtn.disabled = selfBtn.disabled = false; fbBtn.textContent = "Check my answer";
        }
      };

      selfBtn.onclick = () => {
        stopMic();
        box.remove();
        card.append(h(`<div class="pr-fb"><strong>${isExam?"Model answer":"A good answer"}</strong><span>${esc(q.model_answer||"")}</span>${q.marking_scheme?`<span class="pr-scheme"><strong>Marking scheme:</strong> ${esc(q.marking_scheme)}</span>`:""}</div>`));
        const r = h(`<div style="display:flex;flex-direction:column;gap:10px"><strong style="font-size:17px">How did you do?</strong><div class="pr-rate"><button type="button">Got it</button><button type="button">Half right</button><button type="button">Not yet</button></div></div>`);
        [1, 0.5, 0].forEach((v, i) => r.querySelectorAll("button")[i].onclick = () => { done(v, "quiz"); session.i++; next(); });
        card.append(r);
      };
      card.append(box);
    }

    function finish(){
      const R = session.results, good = R.filter(r => r.v >= 1), gaps = R.filter(r => r.v < 1);
      const card = h(`<div class="pr-card"><h3>${esc(session.name)}: done</h3>
        <p class="pr-next">${R.length ? `You answered ${plural(R.length, "question", "questions")}. ${plural(good.length, "was", "were")} right${gaps.length ? `, and ${plural(gaps.length, "goes", "go")} on your Try Again list` : ""}.` : "No answers saved this time."}</p>
        ${gaps.length > 4 ? `<details class="pr-fb"><summary style="cursor:pointer;font-weight:700">${gaps.length} to try again next time</summary><ul style="margin-top:6px">${gaps.map(r=>`<li>${esc(shortTitle(r.q))}</li>`).join("")}</ul><span class="pr-tip">Your tutor will start with these too.</span></details>` : gaps.length ? `<div class="pr-fb"><h4>To try again next time</h4><ul>${gaps.map(r=>`<li>${esc(shortTitle(r.q))}</li>`).join("")}</ul><span class="pr-tip">Your tutor will start with these too.</span></div>` : ""}
        <div class="pr-row" data-acts><button type="button" class="pr-btn${session.where !== prepSlot && R.length >= 3 ? " ghost" : ""}" data-home>Back to ${session.where === prepSlot ? "Exam Prep" : "Quick Tests"}</button></div></div>`);
      card.querySelector("[data-home]").onclick = () => home();
      // After a quick test: under 70% -> review the material; 80%+ -> on to exam questions
      if (session.where !== prepSlot && R.length >= 3) {
        const pct = Math.round(R.reduce((n, r) => n + r.v, 0) / R.length * 100);
        const acts = card.querySelector("[data-acts]");
        let msg, btn, missEl = null;
        if (pct < 70) {
          // Point at the ideas he missed, not the whole chapter
          const tl = [...new Set(gaps.map(r => r.q.topic_label).filter(Boolean))].slice(0, 3);
          msg = tl.length ? `Go over these, then test yourself again: ${tl.join(", ")}.` : `Go over the ones you missed, then test yourself again.`;
          btn = h(`<button type="button" class="pr-btn ghost">Open the revision guide</button>`); btn.onclick = () => { home(); goTo("learn"); };
          const miss = gaps.slice(0, 8).map(r => `<li><b>${esc(r.q.prompt)}</b><br>${esc(r.q.qtype === "mcq" ? (r.q.explanation || (r.q.options || [])[r.q.answer_index] || "") : (r.q.model_answer || r.q.explanation || ""))}</li>`).join("");
          if (miss) missEl = (h(`<details class="pr-fb pr-missed"><summary style="cursor:pointer;font-weight:700">What you missed (${gaps.length})</summary><ul style="margin-top:8px;display:flex;flex-direction:column;gap:8px">${miss}</ul></details>`));
        }
        else if (pct >= 80) { msg = ex.length ? `You know this well. Time to try exam questions.` : `You know this well.`; if (ex.length) { btn = h(`<button type="button" class="pr-btn">Go to Exam Prep ›</button>`); btn.onclick = () => { home(); goTo("refresh"); }; } }
        else { msg = `Nearly there. Try the ones you missed again, then you're ready for exam questions.`; const fx = quickFixes(); if (fx.length) { btn = h(`<button type="button" class="pr-btn">Try Again (${fx.length})</button>`); btn.onclick = () => start("Try Again", fx); } }
        const half = R.filter(r => r.v > 0 && r.v < 1).length;
        card.querySelector("h3").after(h(`<div class="pr-score-msg ${pct >= 80 ? "good" : pct < 70 ? "low" : ""}"><span class="pr-score">${good.length}/${R.length}</span><span><b>right</b>${half ? `, ${half} half right` : ""}<br>${esc(msg)}</span></div>`));
        if (missEl) { card.querySelector(".pr-score-msg").after(missEl); const tl2 = card.querySelector(":scope > .pr-fb:not(.pr-missed)"); if (tl2) tl2.remove(); }
        if (btn) acts.prepend(btn); else card.querySelector("[data-home]").classList.remove("ghost");
      }
      const wasToday = session.today, mins = todayMins(), stoppedEarly = session.i < session.queue.length - 1;
      logTime(session);
      const where = session.where;
      session = null;
      where.replaceChildren(card);
      if (wasToday) {
        const done = mins >= dailyGoal;
        (card.querySelector(".pr-missed") || card.querySelector(".pr-score-msg") || card.querySelector("h3")).after(h(`<div class="pr-todaybox">${ringHtml(64, mins, 7)}<span>${done ? `<b>Today's ${dailyGoal} minutes: done &#10003;</b> Anything more is a bonus.` : `<b>${mins} of ${dailyGoal} minutes</b> today. ${dailyGoal - mins} to go.`}</span></div>`));
        const leftHere = questions.filter(q => q.qtype !== "exam" && (prog.latest[q.id] === undefined || prog.latest[q.id] < 1)).length;
        const chTitle = String(topic.title).replace(/^Ch\s*\d+\s*:\s*/i, ""), nextN = Math.min(ROUND, leftHere);
        // Today's session comes first: once this chapter's part is done, go to the next item in it
        const pick = (sessionNext ? sessionNext(topic.id).catch(() => null) : Promise.resolve(null)).then(sn => sn || (leftHere ? { here: true, left: leftHere, title: stoppedEarly ? `Carry on with ${chTitle}` : `Another ${nextN} on ${chTitle}`, keep: stoppedEarly ? "Keep going" : `Another ${nextN}` } : (nextUp ? nextUp(topic.id) : null)));
        pick.then(n => {
          if (!n || !card.isConnected) return;
          const box = h(`<div class="pr-nextup"><span class="lab">Next up</span><b>${esc(n.title)}</b><span>${esc(n.note ? n.note : n.here ? `About ${estMin(roundList())} min. ${plural(n.left, "question", "questions")} left in this chapter.` : n.why === "unfinished" ? `You started this one ${n.when || "before"}. ${plural(n.left, "question", "questions")} left.` : `${plural(n.left, "question", "questions")} to try.`)}</span>
            <button type="button" class="pr-btn big" data-keep>${esc(n.keep || "Keep going")}</button>
            <div class="pr-row"><button type="button" class="pp-link" data-choose style="margin:0">Choose a different chapter</button></div></div>`);
          box.querySelector("[data-keep]").onclick = () => n.here ? runToday() : (openToday && openToday(n));
          box.querySelector("[data-choose]").onclick = () => goHome && goHome();
          card.querySelector(".pr-todaybox").after(box);
          card.querySelectorAll("[data-acts] .pr-btn").forEach(b => b.classList.add("ghost"));
          const hb = card.querySelector("[data-home]"); hb.textContent = "Stop for now"; hb.classList.add("ghost"); hb.onclick = () => goHome ? goHome() : home();
          box.querySelector("[data-keep]").focus({ preventScroll:true });
        });
      }
      card.scrollIntoView({ block:"start", behavior:"smooth" });
    }

    window.addEventListener("study-progress", async () => {
      if (!slot.isConnected) return;
      prog = await loadProgress(sb, profile, questions, freshSince()); paintStats(); if (!session) home();
    });

    paintStats();
    home();
    // A memory check: one exam question from fresh, on the Exam Prep tab
    function runMemory(qid, origin, days){
      const q = questions.find(x => x.id === qid); if (!q) return false;
      goTo("refresh");
      start("Memory check", [q], "prep", false, { memory: { origin, days: days || 7 } });
      return true;
    }
    return { refresh: paintStats, startToday: () => start("Your Daily Practice", todaysPick()), runToday, runMemory };
  }
  window.mountPractice = mountPractice;
})();
