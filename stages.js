// Learn it. Test it. Prep it for the exam.
// Works out where each chapter is (Learn, Quick Tests or Exam Prep) and draws the homepage
// and the subject pages. Shared by every student page.
(function(){
  const css = `
  .hs{display:flex;flex-direction:column;gap:18px;font-family:'Atkinson Hyperlegible',Verdana,sans-serif;color:var(--t-ink)}
  .hs a{color:var(--t-accent)}
  .hs-hi{background:var(--t-hero);color:#FFFFFE;border-radius:18px;padding:22px 24px;display:flex;flex-direction:column;gap:16px}
  .hs-hi-top{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap}
  .hs-hi h2{margin:0;font-size:26px;line-height:1.2}
  .hs-tag-line{font-size:15px;color:#C9CFD6;margin:4px 0 0}
  .hs-streak{display:flex;align-items:center;gap:14px}
  .hs-days{display:flex;gap:6px}
  .hs-day{display:flex;flex-direction:column;align-items:center;gap:4px;font-size:12px;color:#C9CFD6}
  .hs-day i{width:20px;height:20px;border-radius:50%;background:#3A4149;display:block;box-sizing:border-box}
  .hs-day.on i{background:var(--t-accent-soft)}
  .hs-day.today{color:#FFFFFE;font-weight:700}
  .hs-day.today:not(.on) i{background:none;border:2px dashed var(--t-accent-soft)}
  .hs-streak-n{display:flex;flex-direction:column;align-items:flex-end}
  .hs-streak-n b{font-size:26px;line-height:1}
  .hs-streak-n span{font-size:13px;color:#C9CFD6}
  .hs-week{border-top:1px solid #3A4149;padding-top:14px;display:flex;flex-direction:column;gap:10px}
  .hs-eyebrow{font-size:13px;font-weight:700;color:#C9CFD6;text-transform:uppercase;letter-spacing:.06em}
  .hs-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
  .hs-stat{display:flex;flex-direction:column;gap:2px}
  .hs-stat b{font-size:22px;line-height:1.15}
  .hs-stat span{font-size:13px;color:#C9CFD6}
  .hs-head{display:flex;justify-content:space-between;align-items:baseline;gap:12px;flex-wrap:wrap}
  .hs-head h3{margin:0;font-size:20px}
  .hs-link{background:none;border:none;padding:0;font:inherit;font-size:15px;font-weight:700;color:var(--t-accent);cursor:pointer;text-decoration:underline;text-underline-offset:3px}
  .hs-sub{font-size:14px;color:var(--t-muted)}
  .hs-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
  .hs-tile{background:var(--t-card);border:none;border-radius:14px;padding:16px 18px;display:flex;flex-direction:column;gap:8px;text-align:left;font:inherit;color:var(--t-ink);cursor:pointer;box-shadow:0 1px 2px rgba(0,0,0,.04)}
  .hs-tile:hover{box-shadow:0 2px 8px rgba(0,0,0,.08)}
  .hs-tile:focus-visible,.hs-card:focus-visible,.hs-row:focus-visible{outline:3px solid var(--t-accent);outline-offset:2px}
  .hs-tile b{font-size:17px}
  .hs-bar{height:8px;background:var(--t-line);border-radius:99px;display:flex;overflow:hidden}
  .hs-bar i{display:block;height:100%}
  .hs-card{background:var(--t-card);border:none;border-radius:14px;padding:16px 18px;display:flex;flex-direction:column;gap:6px;text-align:left;font:inherit;color:var(--t-ink);cursor:pointer;box-shadow:0 1px 2px rgba(0,0,0,.04)}
  .hs-card:hover{box-shadow:0 2px 8px rgba(0,0,0,.08)}
  .hs-card .t{font-size:16px;font-weight:700;line-height:1.35}
  .hs-card .s{font-size:14px;line-height:1.4}
  .hs-card .go{margin-top:auto;padding-top:8px;font-size:15px;font-weight:700;color:var(--t-accent)}
  .hs-pill{align-self:flex-start;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;border-radius:999px;padding:3px 9px;flex:none}
  .hs-pill.learn{color:var(--t-ink);background:var(--t-soft2)}
  .hs-pill.test{color:var(--t-accent);background:var(--t-accent-tint)}
  .hs-pill.refresh{color:var(--t-warn);background:var(--t-warn-tint)}
  .hs-steps{flex:none;display:flex;flex-direction:column;align-items:flex-end;gap:3px;min-width:92px}
  .hs-arrows{display:flex}
  .hs-arrows i{display:block;width:16px;height:14px;margin-left:-3px;background:var(--t-line);clip-path:polygon(0 0,62% 0,100% 50%,62% 100%,0 100%,38% 50%)}
  .hs-arrows i:first-child{margin-left:0}
  .hs-arrows i.on{background:var(--t-accent)}
  .hs-steps-l{font-size:12px;font-weight:700;color:var(--t-muted);white-space:nowrap}
  .hs-card .hs-steps{align-items:flex-start;min-width:0}
  .hs-back{background:none;border:none;padding:0;font:inherit;font-size:16px;font-weight:700;color:var(--t-accent);cursor:pointer;align-self:flex-start}
  .hs h1{margin:0;font-size:30px;line-height:1.2}
  .hs-exam{background:var(--t-card);border-radius:14px;padding:14px 18px;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap}
  .hs-exam.soon{background:var(--t-warn-tint)}
  .hs-exam-text{display:flex;flex-direction:column;gap:3px}
  .hs-exam-text b{font-size:17px}
  .hs-exam form{display:flex;gap:8px;flex-wrap:wrap;align-items:center;width:100%}
  .hs-exam input{font:inherit;font-size:16px;border:2px solid var(--t-line);border-radius:10px;padding:8px 10px;min-height:44px;box-sizing:border-box}
  .hs-exam input[type=text]{flex:1 1 180px}
  .hs-btn{border:2px solid var(--t-accent);background:var(--t-accent);color:var(--t-on-accent);border-radius:999px;padding:8px 18px;font:inherit;font-weight:700;font-size:15px;cursor:pointer;min-height:42px;white-space:nowrap}
  .hs-btn.ghost{background:var(--t-card);color:var(--t-accent)}
  .hs-btn.small{font-size:14px;padding:5px 14px;min-height:36px}
  .hs-list{background:var(--t-card);border-radius:14px;overflow:hidden;display:flex;flex-direction:column}
  .hs-row{display:flex;align-items:center;gap:14px;padding:13px 18px;border:none;border-top:1px solid var(--t-line);background:none;font:inherit;color:var(--t-ink);text-align:left;cursor:pointer;width:100%}
  .hs-list>:first-child{border-top:none}
  .hs-row:hover .hs-row-t{text-decoration:underline}
  .hs-row.dim{color:var(--t-muted)}
  .hs-num{flex:none;width:34px;height:34px;border-radius:10px;background:var(--t-soft);display:grid;place-items:center;font-size:15px;font-weight:700;color:var(--t-muted)}
  .hs-num.ok{background:var(--t-accent-tint);color:var(--t-accent)}
  .hs-row-b{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}
  .hs-row-t{font-size:17px;font-weight:700;line-height:1.35}
  .hs-row-s{font-size:14px;color:var(--t-muted);line-height:1.4}
  .hs-chev{flex:none;font-size:20px;color:var(--t-muted)}
  .hs-rowwrap{display:flex;align-items:center;border-top:1px solid var(--t-line)}
  .hs-rowwrap .hs-row{border-top:none;flex:1;min-width:0;padding-right:8px}
  .hs-mark{flex:none;width:40px;height:40px;margin-right:12px;border-radius:50%;border:2px solid var(--t-line);background:var(--t-card);color:var(--t-muted);display:grid;place-items:center;cursor:pointer;padding:0}
  .hs-mark svg{width:18px;height:18px}
  .hs-mark:hover{border-color:var(--t-accent);color:var(--t-accent)}
  .hs-mark.on{background:var(--t-accent);border-color:var(--t-accent);color:var(--t-on-accent)}
  .hs-mark.on svg path{fill:currentColor}
  .hs-mark:focus-visible{outline:3px solid var(--t-accent);outline-offset:2px}
  .hs-markkey{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--t-muted);padding:10px 18px 0}
  .hs-markkey .hs-mark{width:26px;height:26px;margin:0;pointer-events:none}.hs-markkey .hs-mark svg{width:13px;height:13px}
  .hs-fold{background:var(--t-soft2)}
  .hs-fold .hs-show{flex:none;font-size:15px;font-weight:700;color:var(--t-accent)}
  .hs-group{display:block;padding:14px 18px 4px;border-top:1px solid var(--t-line);font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--t-muted)}
  .step-h{display:flex;align-items:center;gap:12px}
  .step-n{flex:none;width:32px;height:32px;border-radius:50%;background:var(--t-accent);color:var(--t-on-accent);display:grid;place-items:center;font-size:17px;font-weight:700}
  .step-in{margin-left:44px}
  .hs-link.step-in{margin-left:44px}
  .step2{display:flex;flex-direction:column;gap:14px}
  .step2-h{padding:0 24px}
  @media (max-width:600px){.step-in,.hs-link.step-in{margin-left:0 !important}.step2-h{padding:0}}
  .qa{background:var(--t-card);border-radius:18px;padding:24px 26px;display:flex;flex-direction:column;gap:12px}
  .qa h3{margin:0;font-size:19px}
  .qa-row{display:flex;gap:10px;align-items:center}
  .qa-box{flex:1;min-width:0;display:flex;align-items:center;gap:8px;border:2px solid var(--t-line);border-radius:14px;padding:6px 8px 6px 14px;background:var(--t-card)}
  .qa-box:focus-within{border-color:var(--t-accent)}
  .qa-box input{flex:1;border:none;outline:none;font:inherit;font-size:17px;padding:8px 0;background:transparent;color:var(--t-ink);min-width:0}
  .qa-mic{flex:none;width:40px;height:40px;border-radius:50%;border:2px solid var(--t-ink);background:var(--t-card);color:var(--t-ink);display:grid;place-items:center;cursor:pointer;padding:0}
  .qa-mic svg{width:20px;height:20px}
  .qa-mic.on{background:var(--t-ink);color:var(--t-on-accent)}
  .qa-list{display:flex;flex-direction:column}
  .qa-item{display:flex;align-items:center;gap:14px;padding:12px 0;border-top:1px solid var(--t-line)}
  .qa-ic{flex:none;width:36px;height:36px;border-radius:10px;display:grid;place-items:center;font-size:17px;font-weight:700}
  .qa-ic.done{background:var(--t-accent-tint);color:var(--t-accent)}
  .qa-ic.up{background:var(--t-soft2);color:var(--t-ink)}
  .qa-ic.date{background:var(--t-warn-tint);color:var(--t-warn)}
  .qa-ic.unclear{background:var(--t-soft2);color:var(--t-muted)}
  .qa-b{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
  .qa-b .k{font-size:13px;color:var(--t-muted)}
  .qa-b .t{font-size:16px;font-weight:700;line-height:1.35}
  .qa-b .w{font-size:15px}
  .qa-b select{font:inherit;font-size:15px;border:2px solid var(--t-line);border-radius:10px;padding:4px 8px;max-width:100%;background:var(--t-card);color:var(--t-ink)}
  .qa-check{flex:none;width:26px;height:26px;accent-color:var(--t-accent);cursor:pointer}
  .qa-msg{background:var(--t-accent-tint);border-radius:12px;padding:12px 16px;font-size:16px;display:flex;gap:12px;align-items:center;flex-wrap:wrap}
  .qa-err{color:#a32020;font-size:14px;margin:0}
  .hc{gap:28px}
  .hc-top{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap;padding:4px 2px 0}
  .hc-hello{display:flex;flex-direction:column;gap:4px}
  .hc-hello h2{margin:0;font-size:28px;line-height:1.2}
  .hc-hello span{font-size:16px;color:var(--t-muted)}
  .hc-meta{display:flex;flex-direction:column;align-items:flex-end;gap:6px}
  .hc-streak{font-size:15px;font-weight:700;color:var(--t-accent);background:var(--t-accent-tint);border-radius:999px;padding:5px 12px}
  .hc-weeklink{font-size:14px;color:var(--t-muted)}
  .hc-goal{flex-basis:100%;font-size:14px;color:var(--t-muted)}
  .hc-cele{background:var(--t-accent-tint);border-radius:18px;padding:18px 22px;display:flex;align-items:center;gap:16px;flex-wrap:wrap}
  .hc-cele-b{flex:1 1 260px;display:flex;flex-direction:column;gap:3px}
  .hc-cele-b b{font-size:18px}
  .hc-cele-btns{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
  .hc-cele-btns .hs-btn{font-size:15px;padding:8px 16px}
  .hc-week{background:var(--t-card);border-radius:18px;padding:18px 22px;display:flex;gap:24px;align-items:center;flex-wrap:wrap;margin-top:-14px}
  .hc-days{display:flex;gap:6px}
  .hc-day{display:flex;flex-direction:column;align-items:center;gap:4px;font-size:12px;color:var(--t-muted)}
  .hc-day i{width:18px;height:18px;border-radius:50%;background:var(--t-soft2);display:block;box-sizing:border-box}
  .hc-day.on i{background:var(--t-accent)}
  .hc-day.today{color:var(--t-ink);font-weight:700}
  .hc-day.today:not(.on) i{background:none;border:2px dashed var(--t-accent)}
  .hc-stats{flex:1;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
  .hc-stats div{display:flex;flex-direction:column}
  .hc-stats b{font-size:19px}
  .hc-stats span{font-size:13px;color:var(--t-muted)}
  .qa .step-h h3,.hc-card .step-h h3{margin:0;font-size:20px}
  .hc-card{background:var(--t-card);border-radius:18px;padding:24px 26px;display:flex;flex-direction:column;gap:20px}
  .ring{position:relative;display:inline-grid;place-items:center;flex:none}.ring svg{position:absolute;inset:0}.ring b{position:relative;font-size:22px;font-weight:700;color:var(--t-accent)}
  .hc-hero{background:var(--t-accent);color:var(--t-on-accent);border-radius:22px;padding:24px 24px;display:flex;flex-direction:column;gap:8px}
  .hc-hero .lab{font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;opacity:.85}
  .hc-hero .tt{font-size:23px;font-weight:700;line-height:1.25}
  .hc-hero .ss{font-size:15px;line-height:1.45;opacity:.9}
  .hc-hero .go{margin-top:8px;align-self:stretch;max-width:420px;background:var(--t-card);color:var(--t-accent);border:none;border-radius:999px;padding:15px 24px;font:inherit;font-size:18px;font-weight:700;cursor:pointer}
  .hc-hero .go:focus-visible{outline:3px solid var(--t-card);outline-offset:3px}
  .hc-hero .nt{font-size:13px;opacity:.85}
  .pl{background:var(--t-card);border-radius:22px;padding:22px 24px;display:flex;flex-direction:column;gap:12px;box-shadow:0 1px 3px rgba(0,0,0,.05)}
  .pl-head{display:flex;align-items:center;gap:16px}
  .pl-head b{font-size:20px;display:block}.pl-head span.s{font-size:15px;color:var(--t-muted)}
  .pl-then{font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--t-muted);margin-top:2px}
  .pl-row{display:flex;align-items:center;gap:14px;padding:14px 16px;border-radius:14px;border:1px solid var(--t-line);background:var(--t-card);text-align:left;font:inherit;color:var(--t-ink);cursor:pointer;width:100%}
  .pl-row:hover{border-color:var(--t-accent)}
  .pl-row.now{background:var(--t-accent-tint);border:2px solid var(--t-accent)}
  .pl-row:focus-visible{outline:3px solid var(--t-accent);outline-offset:2px}
  .pl-b{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}
  .pl-k{font-size:12px;font-weight:700;color:var(--t-muted);text-transform:uppercase;letter-spacing:.05em}
  .pl-t{font-size:17px;font-weight:700;line-height:1.3}
  .pl-n{font-size:13px;color:var(--t-muted)}
  .pl-bar{display:flex;border-radius:99px;background:var(--t-line);overflow:hidden}.pl-bar i{display:block;height:100%}.pl-bar i.r{background:var(--t-accent)}.pl-bar i.f{background:#E0A43A}
  .pl-go{flex:none;background:var(--t-accent);color:var(--t-on-accent);font-weight:700;font-size:16px;padding:11px 22px;border-radius:999px}
  @media (max-width:520px){.pl{padding:18px 16px}.pl-row.now{flex-wrap:wrap}.pl-row.now .pl-go{width:100%;text-align:center}}
  .hc-qa-open{border:2px dashed var(--t-line);background:none;border-radius:14px;padding:13px 16px;font:inherit;font-size:16px;font-weight:700;color:var(--t-accent);text-align:left;cursor:pointer;width:100%}
  .hc-today{display:flex;align-items:center;gap:12px}
  .hc-today span{font-size:14px;color:var(--t-muted);line-height:1.35}
  .hc-best{background:var(--t-accent-tint);border-radius:14px;padding:18px 20px;display:flex;align-items:center;gap:16px;flex-wrap:wrap}
  .hc-best-b{flex:1 1 240px;display:flex;flex-direction:column;gap:3px;min-width:0}
  .hc-eyebrow{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--t-accent)}
  .hc-best-t{font-size:19px;font-weight:700;line-height:1.3}
  .hc-best-s{font-size:15px}
  .hc-go{font-size:17px;padding:12px 28px;min-height:50px}
  .hc-sec{display:flex;flex-direction:column;gap:10px}
  .hc-label{font-size:15px;font-weight:700;color:var(--t-muted)}
  .hc-chips{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px}
  .hc-chip{border:none;background:var(--t-soft);border-radius:12px;padding:10px 14px;display:flex;flex-direction:column;gap:7px;text-align:left;font:inherit;color:var(--t-ink);cursor:pointer;min-width:0}
  .hc-chip:hover{background:var(--t-soft2)}
  .hc-chip b{font-size:15px;line-height:1.25}
  .hc-chip .hs-bar{margin-top:auto}
  .hc-chip .hs-bar{height:5px}
  .hc-chip:focus-visible,.hc-row:focus-visible{outline:3px solid var(--t-accent);outline-offset:2px}
  .hc-list{display:flex;flex-direction:column}
  .hc-row{display:flex;align-items:center;gap:14px;padding:12px 0;border:none;border-top:1px solid var(--t-soft2);background:none;font:inherit;color:var(--t-ink);text-align:left;cursor:pointer;width:100%}
  .hc-row:hover .hc-row-t{text-decoration:underline}
  .hc-row-b{flex:1;min-width:0;display:flex;flex-direction:column;gap:1px}
  .hc-row-t{font-size:16px;font-weight:700;line-height:1.35}
  .hc-row-s{font-size:14px;color:var(--t-muted)}
  @media (max-width:600px){.hc-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.hc-meta{align-items:flex-start}.hc-card,.qa{padding:20px 18px}.hc-go{width:100%}}
  .hs-empty{background:var(--t-card);border-radius:14px;padding:18px;color:var(--t-muted)}
  @media (max-width:700px){.hs-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.hs-stats{grid-template-columns:repeat(2,minmax(0,1fr))}}
  @media (max-width:600px){.hs-steps{min-width:0}.hs-steps-l{display:none}.hs-arrows i{width:12px;height:11px;margin-left:-2px}.hs-row{padding:12px 14px;gap:10px}.hs-row-t{font-size:16px}}
  @media (max-width:460px){.hs-grid{grid-template-columns:1fr}.hs-grid.tiles{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.hs-tile{padding:12px 14px;gap:6px}.hs-tile b{font-size:16px}}
  .ss-lead{font-size:19px;font-weight:700;line-height:1.3}.ss-lead span{font-weight:400;color:var(--t-muted)}
  .ss-sug{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
  .ss-sug li{display:flex;gap:12px;align-items:flex-start;background:var(--t-soft);border-radius:12px;padding:12px 14px}
  .ss-num{flex:none;width:26px;height:26px;border-radius:50%;background:var(--t-accent);color:var(--t-on-accent);display:grid;place-items:center;font-size:14px;font-weight:700}
  .ss-sug b{display:block;font-size:16px;line-height:1.3}.ss-sug .s{display:block;font-size:14px;color:var(--t-muted);margin-top:2px}
  .ss-go{width:100%;min-height:52px;font-size:17px}
  .ss-change{display:flex;align-items:center;justify-content:space-between;gap:12px;border-top:1px solid var(--t-line);padding-top:14px;flex-wrap:wrap}
  .ss-change>span{font-size:16px;font-weight:700}
  .ss-say{display:inline-flex;align-items:center;gap:8px;min-height:46px;padding:8px 20px}.ss-say svg{width:18px;height:18px}
  .ss-row{border:1px solid var(--t-line);border-radius:14px;padding:12px 14px;display:flex;flex-direction:column;gap:10px}
  .ss-row.next{border:2px solid var(--t-accent);background:var(--t-accent-tint)}
  .ss-main{display:flex;gap:12px;align-items:flex-start}
  .ss-tick{flex:none;width:28px;height:28px;border-radius:50%;border:2px solid var(--t-line);box-sizing:border-box;display:grid;place-items:center;color:var(--t-on-accent);font-size:15px;font-weight:700;margin-top:2px}
  .ss-row.done .ss-tick{background:var(--t-accent);border-color:var(--t-accent)}
  .ss-row.next .ss-tick{border-color:var(--t-accent)}
  .ss-b{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px;background:none;border:none;padding:0;text-align:left;font:inherit;color:var(--t-ink);cursor:pointer}
  .ss-b:focus-visible,.ss-x:focus-visible{outline:3px solid var(--t-accent);outline-offset:2px}
  .ss-row.done .pl-t{text-decoration:line-through;color:var(--t-muted)}
  .ss-x{flex:none;width:40px;height:40px;border:none;background:none;color:var(--t-muted);font:inherit;font-size:22px;line-height:1;cursor:pointer;border-radius:50%}
  .ss-x:hover{background:var(--t-soft2)}
  .ss-tag{align-self:flex-start;margin-left:40px;font-size:13px;font-weight:700;color:var(--t-accent);background:var(--t-card);border:1px solid var(--t-accent-soft);border-radius:8px;padding:4px 10px}
  .ss-check{margin-left:40px;display:flex;flex-direction:column;gap:8px;background:var(--t-soft);border-radius:10px;padding:10px 12px}
  .ss-check>span{font-size:14px;font-weight:700}
  .ss-check select{font:inherit;font-size:15px;border:2px solid var(--t-line);border-radius:10px;padding:6px 8px;max-width:100%;background:var(--t-card);color:var(--t-ink)}
  .ss-start{margin-left:40px;min-height:46px;font-size:16px}
  .ss-add{border:2px dashed var(--t-accent);background:var(--t-card);color:var(--t-accent);border-radius:999px;min-height:44px;font:inherit;font-weight:700;font-size:15px;cursor:pointer}
  .ss-k{font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--t-accent)}
  .ss-count{font-size:19px;font-weight:700}
  .fx-ask{background:var(--t-card);border:2px solid var(--t-accent-soft);border-radius:18px;padding:18px 22px;display:flex;align-items:center;gap:14px 18px;flex-wrap:wrap}
  .fx-ask-b{flex:1 1 280px;display:flex;flex-direction:column;gap:4px;font-size:15px;line-height:1.45}.fx-ask-b b{font-size:17px}
  .fx-ask-btns{display:flex;gap:10px;flex-wrap:wrap}
  .fx-top{display:flex;justify-content:space-between;align-items:center}
  .fx-list{display:flex;flex-direction:column;gap:10px}
  .fx-subj{border:1px solid var(--t-line);border-radius:14px;overflow:hidden}
  .fx-subj.open{border:2px solid var(--t-accent)}
  .fx-sh{display:flex;align-items:center;gap:12px;width:100%;padding:14px 16px;border:none;background:var(--t-card);font:inherit;color:var(--t-ink);text-align:left;cursor:pointer}
  .fx-sh>span:first-child{flex:1;display:flex;flex-direction:column;gap:2px}.fx-sh b{font-size:17px}.fx-sh .s,.fx-ch .s{font-size:14px;color:var(--t-muted)}
  .fx-best{margin:0 16px 10px;min-height:48px;font-size:16px;white-space:normal;text-align:left}.fx-best span{font-weight:400;opacity:.9}
  .fx-chs{display:flex;flex-direction:column;padding:0 16px 8px}
  .fx-ch,.fx-mem{display:flex;align-items:center;gap:12px;width:100%;padding:12px 0;border:none;border-top:1px solid var(--t-line);background:none;font:inherit;color:var(--t-ink);text-align:left;cursor:pointer}
  .fx-mem{border:2px solid var(--t-accent);background:var(--t-accent-tint);border-radius:14px;padding:12px 16px}
  .fx-ch-b{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}.fx-ch .t,.fx-mem .t{font-size:16px;font-weight:700;line-height:1.35}.fx-mem .s{font-size:14px;color:var(--t-muted)}
  .fx-sh:focus-visible,.fx-ch:focus-visible,.fx-mem:focus-visible{outline:3px solid var(--t-accent);outline-offset:2px}
  .fx-toggle{display:inline-flex;align-items:center;gap:8px;border:2px solid var(--t-line);background:var(--t-card);border-radius:999px;padding:5px 14px 5px 6px;font:inherit;font-size:15px;font-weight:700;color:var(--t-ink);cursor:pointer;min-height:40px}
  .fx-toggle.on{border-color:var(--t-accent);background:var(--t-accent-tint);color:var(--t-accent)}
  .fx-track{position:relative;width:38px;height:22px;border-radius:999px;background:var(--t-line);flex:none;transition:background .15s}
  .fx-track i{position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:var(--t-card);box-shadow:0 1px 2px rgba(0,0,0,.25);transition:left .15s}
  .fx-toggle.on .fx-track{background:var(--t-accent)}.fx-toggle.on .fx-track i{left:19px}
  .fx-toggle:focus-visible{outline:3px solid var(--t-accent);outline-offset:2px}
  @media (prefers-reduced-motion:reduce){.fx-track,.fx-track i{transition:none}}
  .fx-modes{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;padding:0 16px 16px}
  .fx-mode{display:flex;flex-direction:column;gap:4px;padding:16px;border:2px solid var(--t-accent);border-radius:14px;background:var(--t-accent-tint);font:inherit;color:var(--t-ink);text-align:left;cursor:pointer}
  .fx-mode b{font-size:17px}.fx-mode span{font-size:14px;color:var(--t-muted)}
  .fx-mode:focus-visible,.fx-q:focus-visible{outline:3px solid var(--t-accent);outline-offset:2px}
  .fx-sub-back{align-self:flex-start;margin:0 0 6px}
  .fx-pstat{font-size:15px}
  .fx-part{display:flex;flex-direction:column}
  .fx-part h4{margin:10px 0 4px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--t-muted)}
  .fx-q{display:flex;align-items:center;gap:12px;width:100%;padding:12px 0;border:none;border-top:1px solid var(--t-line);background:none;font:inherit;color:var(--t-ink);text-align:left;cursor:pointer}
  .fx-q .s{font-size:14px;color:var(--t-muted)}
  .fx-ql{flex:none;min-width:84px;font-size:16px;font-weight:700}
  .fx-q.later .fx-ql{color:var(--t-muted)}
  /* the chapter page in exam focus: only the exam questions */
  .cv-focus .cv-tabs,.cv-focus .cv-meta,.cv-focus .flag-note-row,.cv-focus #examSlot,.cv-focus #refreshSlot,.cv-focus #prepBackLearn{display:none!important}
  body.exam-focus #decor{display:none!important}
  .ss-mem{font-size:13px;font-weight:700;color:var(--t-accent);background:var(--t-accent-tint);border-radius:999px;padding:2px 8px;white-space:nowrap}
  .ss-listen{margin:0;display:flex;align-items:center;gap:10px;font-size:15px;font-weight:700;color:var(--t-accent)}
  .ss-listen i{flex:none;width:12px;height:12px;border-radius:50%;background:var(--t-accent);animation:ss-pulse 1.4s ease-in-out infinite}
  @keyframes ss-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.8)}}
  @media (prefers-reduced-motion:reduce){.ss-listen i{animation:none}}
  .qa-mic.on{box-shadow:0 0 0 4px var(--t-accent-tint)}
  .ss-foot{display:flex;justify-content:center;gap:18px;flex-wrap:wrap}
  @media (max-width:520px){.ss-tag,.ss-check,.ss-start{margin-left:0}.ss-change .hs-btn{width:100%;justify-content:center}}
  `;
  function addCss(){ if (document.getElementById("hs-css")) return; const s = document.createElement("style"); s.id = "hs-css"; s.textContent = css; document.head.appendChild(s); }
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
  const DAY = 86400000;
  const PRACTICE_TITLES = ["Flashcards Review", "Quiz Yourself", "Exam Practice"];
  const LEARN_MINUTES = { "Revision Guide": 5, "Video Overview": 8, "In-Depth Slide Deck": 15, "Audio Recap": 15, "Mind Map": 5 };
  const REFRESH_DAYS = 21;

  function startOfDay(d){ const x = new Date(d); x.setHours(0,0,0,0); return x; }
  function weekStart(d){ const x = startOfDay(d); const wd = (x.getDay() + 6) % 7; return new Date(x - wd * DAY); }
  function parseDate(s){ if (!s) return null; const [y,m,d] = String(s).slice(0,10).split("-").map(Number); return new Date(y, m-1, d); }
  function fmtDate(d){ return d.toLocaleDateString("en-IE", { weekday:"short", day:"numeric", month:"short" }).replace(",", ""); }
  function dayKey(d){ const x = new Date(d); return x.getFullYear() + "-" + (x.getMonth()+1) + "-" + x.getDate(); }
  function ago(d){
    const days = Math.round((startOfDay(new Date()) - startOfDay(d)) / DAY);
    if (days <= 0) return "today"; if (days === 1) return "yesterday";
    if (days < 7) return `${days} days ago`; if (days < 14) return "a week ago";
    if (days < 28) return `${Math.round(days/7)} weeks ago`; if (days < 45) return "a month ago";
    return `${Math.round(days/30)} months ago`;
  }
  function untilText(d){
    const days = Math.round((startOfDay(d) - startOfDay(new Date())) / DAY);
    if (days <= 0) return "today"; if (days === 1) return "tomorrow";
    if (days < 14) return `in ${days} days`; return `in ${Math.round(days/7)} weeks`;
  }
  function hm(sec){
    const m = Math.round(sec / 60);
    if (m < 60) return `${m} m`;
    return `${Math.floor(m/60)} h ${m % 60} m`;
  }
  const shortTitle = t => String(t || "").replace(/^Ch\s*\d+\s*:\s*/i, "");
  const inList = ids => ids.length ? "(" + ids.map(id => `"${id}"`).join(",") + ")" : '("00000000-0000-0000-0000-000000000000")';

  // ---- the rule for one chapter ----
  // stats: { total, tried, fixes, right, lastAt }  (tried/fixes/right count from fresh_since if set)
  function chapterStage(c){
    const { learnDone = 0, learnTotal = 0, classDone = false, freshSince = null, exam = null, stats = {} } = c;
    const total = stats.total || 0, tried = stats.tried || 0, fixes = stats.fixes || 0;
    const tested = total > 0 && tried >= Math.ceil(total * 0.8) && fixes === 0;
    const examDate = exam ? parseDate(exam.exam_date) : null;
    const today = startOfDay(new Date());
    const opensOn = examDate ? new Date(examDate - REFRESH_DAYS * DAY) : null;
    const refreshOpen = !!examDate && today >= opensOn && today <= examDate;
    let stage, done = false;
    if (refreshOpen && (freshSince || tested)) { stage = "refresh"; done = !!freshSince && tested; }
    else if (tried > 0 || (stats.triedEver || 0) > 0) { stage = "test"; done = tested; }
    else if (learnDone > 0) { stage = "learn"; done = learnTotal > 0 && learnDone >= learnTotal; }
    else stage = "none";
    return { stage, done, tested, refreshOpen, examDate, opensOn, learnDone, learnTotal, classDone, freshSince, stats };
  }

  // The next Quick Tests round (10 questions) and a rough time for it: ~25s multiple choice, ~90s short answer
  function nextRound(st){
    st = st || {};
    const left = st.quickLeft || 0, pool = left || st.quickTotal || 0;
    const n = Math.min(10, pool);
    if (!n) return null;
    const mcqShare = left ? (st.mcqLeft || 0) / left : (st.mcqAll || 0) / Math.max(1, st.quickTotal || 0);
    const mins = Math.max(2, Math.round(n * (mcqShare * 25 + (1 - mcqShare) * 90) / 60));
    return { n, mins, text: `Next round: ${n} question${n === 1 ? "" : "s"} · about ${mins} min` };
  }

  function statusLine(s){
    const st = s.stats || {};
    if (s.stage === "refresh") {
      if (s.done) return "Exam ready";
      if (s.freshSince) return st.fixes ? `Exam prep · ${st.fixes} to try again` : `Exam prep · ${plural((st.total||0) - (st.tried||0), "question", "questions")} to go`;
      return `Exams ${untilText(s.examDate)}${st.lastAt ? " · last tested " + ago(st.lastAt) : ""}`;
    }
    if (s.stage === "test") {
      if (!st.total) return "Questions coming soon";
      if (s.done) return st.lastAt ? `Tested · last time ${ago(st.lastAt)}` : "Tested";
      const r = nextRound(st);
      if (!st.tried) return r ? `Not tested yet · ${r.n} questions, about ${r.mins} min` : "not tested yet";
      return r ? r.text : "Tested";
    }
    if (s.stage === "learn") {
      if (s.done) return "Learnt · ready for a quick test";
      return s.learnDone / Math.max(1, s.learnTotal) >= 0.5 ? "Over halfway learnt" : "Started learning";
    }
    return "Not started";
  }
  const TAG = { learn: "Learn", test: "Quick Tests", refresh: "Exam Prep" };
  // Three arrows: none lit = not started, 1 = learning, 2 = quick tests, 3 = exam prep
  function stepLevel(c){
    if (c.stage === "refresh" || c.tested) return [3, "Exam prep"];
    if (c.stage === "test") return [2, "Quick tests"];
    if (c.stage === "learn") return [1, "Learning"];
    return [0, "Not started"];
  }
  function stepsArrows(c){
    const [n, label] = stepLevel(c);
    return `<span class="hs-arrows" role="img" aria-label="Step ${n} of 3: ${label}">${[1,2,3].map(i => `<i${i <= n ? ' class="on"' : ""}></i>`).join("")}</span>`;
  }
  function stepsMark(c){
    const [n, label] = stepLevel(c);
    return `<span class="hs-steps" aria-label="Step ${n} of 3: ${label}"><span class="hs-arrows" aria-hidden="true">${[1,2,3].map(i => `<i${i <= n ? ' class="on"' : ""}></i>`).join("")}</span><span class="hs-steps-l">${label}</span></span>`;
  }
  const BOOKMARK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4z"/></svg>';
  const DAILY_GOAL = 30;
  const STREAK_ROUND = 10;
  const STREAK_RULE = "A streak day is one finished round of 10 questions, one exam question, or 30 minutes of testing";
  // Where to pick up: the chapter tested most recently that still has quick-test questions left
  function leftOff(m){
    const chs = Object.values(m.topics).filter(c => c.stats && c.stats.total);
    const started = chs.filter(c => c.stats.lastAt && c.stats.quickLeft > 0).sort((a, b) => b.stats.lastAt - a.stats.lastAt);
    if (started[0]) return { c: started[0], why: "left" };
    const rev = revisionList(m).filter(c => c.stats && c.stats.quickLeft > 0);
    if (rev[0]) return { c: rev[0], why: "list" };
    const any = chs.filter(c => c.stats.quickLeft > 0).sort((a, b) => (a.order_num || 0) - (b.order_num || 0));
    return any[0] ? { c: any[0], why: "start" } : null;
  }
  // What to do next after finishing a chapter: another started-but-unfinished chapter (oldest first), then the revision list
  function nextUp(m, excludeId){
    const chs = Object.values(m.topics).filter(c => c.id !== excludeId && c.stats && c.stats.quickLeft > 0);
    const started = chs.filter(c => c.stats.lastAt).sort((a, b) => a.stats.lastAt - b.stats.lastAt);
    if (started[0]) return { c: started[0], why: "unfinished" };
    const rev = revisionList(m).filter(c => c.id !== excludeId && c.stats && c.stats.quickLeft > 0);
    if (rev[0]) return { c: rev[0], why: "list" };
    return chs[0] ? { c: chs[0], why: "new" } : null;
  }
  // Today's plan: the chapter to do now, then up to two more
  function todayPlan(m){
    const now = leftOff(m); if (!now) return [];
    const out = [now], seen = new Set([now.c.id]);
    // Mix subjects: prefer chapters from a subject not already in the plan. Only chapters he has
    // started testing or put on his revision list (never a random untouched chapter).
    const subj = c => (m.groupOf && m.groupOf[c.subject_id]) || c.subject_id;
    const used = new Set([subj(now.c)]);
    while (out.length < 3) {
      const started = Object.values(m.topics).filter(c => !seen.has(c.id) && c.stats && c.stats.quickLeft > 0 && c.stats.lastAt).sort((a, b) => a.stats.lastAt - b.stats.lastAt)
        .map(c => ({ c, why: "unfinished" }));
      const rev = revisionList(m).filter(c => !seen.has(c.id) && c.stats && c.stats.quickLeft > 0).map(c => ({ c, why: "list" }));
      const pool = started.concat(rev);
      const n = pool.find(p => !used.has(subj(p.c))) || pool[0];
      if (!n) break; out.push(n); seen.add(n.c.id); used.add(subj(n.c));
    }
    return out;
  }
  function progBar(st, h){
    const t = st.quickTotal || 1, w = n => ((n || 0) / t * 100).toFixed(1) + "%";
    return `<span class="pl-bar" style="height:${h}px" aria-hidden="true"><i class="r" style="width:${w(st.quickRight)}"></i><i class="f" style="width:${w(st.quickFix)}"></i></span>`;
  }
  function ringSvg(size, frac, label, stroke){
    const r = (size - stroke) / 2, c = 2 * Math.PI * r, f = Math.max(0, Math.min(1, frac));
    return `<span class="ring" style="width:${size}px;height:${size}px" aria-hidden="true"><svg width="${size}" height="${size}"><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="var(--t-line)" stroke-width="${stroke}"/><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="var(--t-accent)" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${(c * f).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 ${size/2} ${size/2})"/></svg><b>${label}</b></span>`;
  }
  const GO = { learn: "Keep learning ›", test: "Test myself ›", refresh: "Exam prep ›", none: "Start ›" };
  const TAB_FOR = { learn: "learn", test: "test", refresh: "refresh", none: "learn" };

  // ---- load everything the homepage and subject pages need ----
  async function loadOverview(sb, profile){
    const subjects = await sb(`subjects?select=id,title,description&user_id=eq.${profile.id}&order=title.asc`);
    const subjectIds = subjects.map(s => s.id);
    if (!subjectIds.length) return { subjects, topics: [] };
    const since = new Date(Date.now() - 400 * DAY).toISOString();
    const [topics, templatesAll, disabled, progress, status, exams, flags, timeRows, reviews, settings] = await Promise.all([
      sb(`topics?select=id,title,order_num,subject_id&subject_id=in.${inList(subjectIds)}&order=order_num.asc`),
      sb(`nlm_checklist_templates?select=id,subject_id,step_order,title&subject_id=in.${inList(subjectIds)}`),
      sb(`nlm_disabled_steps?select=template_id&profile_id=eq.${profile.id}`),
      sb(`nlm_progress?select=topic_id,step_order,updated_at&profile_id=eq.${profile.id}&done=eq.true`),
      sb(`chapter_status?select=topic_id,class_done_at,fresh_since,test_on&profile_id=eq.${profile.id}`),
      sb(`exam_dates?select=subject_id,label,exam_date&profile_id=eq.${profile.id}`),
      sb(`topic_flags?select=topic_id,flag_type,note,updated_at&profile_id=eq.${profile.id}`),
      sb(`study_time?select=kind,seconds,created_at&profile_id=eq.${profile.id}&created_at=gte.${encodeURIComponent(since)}`),
      sb(`answer_reviews?select=question_id,marks_awarded,marks_available,created_at&profile_id=eq.${profile.id}&order=created_at.asc&limit=2000`),
      sb(`student_settings?select=exam_focus&profile_id=eq.${profile.id}`).catch(() => [])
    ]);
    const topicIds = topics.map(t => t.id);
    const questions = [];
    // The database returns at most 1,000 rows per request, so page through every batch
    for (let i = 0; i < topicIds.length; i += 40) {
      for (let off = 0; ; off += 1000) {
        const part = await sb(`quiz_questions?select=id,topic_id,qtype,marks,source&topic_id=in.${inList(topicIds.slice(i, i + 40))}&order=id.asc&limit=1000&offset=${off}`) || [];
        part.forEach(q => questions.push(q));
        if (part.length < 1000) break;
      }
    }
    const attempts = [];
    for (let off = 0; ; off += 1000) {
      const part = await sb(`quiz_attempts?select=question_id,result,source,created_at&profile_id=eq.${profile.id}&order=created_at.asc&limit=1000&offset=${off}`) || [];
      part.forEach(a => attempts.push(a));
      if (part.length < 1000 || off > 50000) break;
    }
    return { subjects, topics, templatesAll, disabled, progress, status, exams, flags, timeRows, questions, attempts, reviews: reviews || [], focus: ((settings || [])[0] || {}).exam_focus || {} };
  }

  function buildModel(raw){
    const { subjects, topics } = raw;
    const m = { subjects: [], topics: {}, bySubject: {}, week: null };
    if (!topics.length) { m.subjects = subjects.map(s => ({ ...s, chapters: [] })); return m; }
    const off = new Set((raw.disabled || []).map(r => r.template_id));
    const learnSteps = {}, minutes = {};
    (raw.templatesAll || []).forEach(t => {
      if (off.has(t.id) || PRACTICE_TITLES.includes(t.title)) return;
      (learnSteps[t.subject_id] = learnSteps[t.subject_id] || new Set()).add(t.step_order);
      minutes[t.subject_id + ":" + t.step_order] = LEARN_MINUTES[t.title] || 5;
    });
    const topicSubject = {}; topics.forEach(t => { topicSubject[t.id] = t.subject_id; });
    const learnDone = {}, learnEvents = [], learnLast = {};
    (raw.progress || []).forEach(r => {
      const sid = topicSubject[r.topic_id];
      if (!sid || !(learnSteps[sid] && learnSteps[sid].has(r.step_order))) return;
      learnDone[r.topic_id] = (learnDone[r.topic_id] || 0) + 1;
      if (r.updated_at) learnLast[r.topic_id] = Math.max(learnLast[r.topic_id] || 0, new Date(r.updated_at).getTime());
      if (r.updated_at) learnEvents.push({ at: new Date(r.updated_at), min: minutes[sid + ":" + r.step_order] || 5 });
    });
    const status = {}; (raw.status || []).forEach(r => { status[r.topic_id] = r; });
    const exams = {}; (raw.exams || []).forEach(r => { exams[r.subject_id] = r; });
    const flags = {}; (raw.flags || []).forEach(r => { flags[r.topic_id] = r; });
    const qTopic = {}, qCount = {}, qQuick = {};
    (raw.questions || []).forEach(q => { qTopic[q.id] = q.topic_id; qCount[q.topic_id] = (qCount[q.topic_id] || 0) + 1; if (q.qtype !== "exam") qQuick[q.id] = q.qtype; });

    // results per topic, honouring "start fresh"
    const latest = {}, latestEver = {}, lastAt = {}, quickAt = {}, examAt = {};
    (raw.attempts || []).forEach(a => {
      const tid = qTopic[a.question_id]; if (!tid) return;
      const at = new Date(a.created_at);
      // answer times per chapter, so today's session can tell which items are done
      ((qQuick[a.question_id] ? quickAt : examAt)[tid] = (qQuick[a.question_id] ? quickAt : examAt)[tid] || []).push(at.getTime());
      latestEver[a.question_id] = Number(a.result);
      lastAt[tid] = at;
      const fresh = status[tid] && status[tid].fresh_since ? new Date(status[tid].fresh_since) : null;
      if (!fresh || at >= fresh) latest[a.question_id] = Number(a.result);
    });
    const stats = {};
    Object.keys(qCount).forEach(tid => { stats[tid] = { total: qCount[tid], tried: 0, fixes: 0, right: 0, triedEver: 0, lastAt: lastAt[tid] || null, quickLeft: 0 }; });
    Object.keys(latest).forEach(qid => { const s = stats[qTopic[qid]]; s.tried++; if (latest[qid] < 1) s.fixes++; else s.right++; });
    // quick-test questions still to try or fix in each chapter (what "today's 30 minutes" works through)
    Object.keys(qQuick).forEach(qid => { const s = stats[qTopic[qid]]; if (!s) return; s.quickTotal = (s.quickTotal || 0) + 1;
      if (latest[qid] === undefined) s.quickNew = (s.quickNew || 0) + 1; else if (latest[qid] < 1) s.quickFix = (s.quickFix || 0) + 1; else s.quickRight = (s.quickRight || 0) + 1;
      if (qQuick[qid] === "mcq") s.mcqAll = (s.mcqAll || 0) + 1;
      if (latest[qid] === undefined || latest[qid] < 1) { s.quickLeft++; if (qQuick[qid] === "mcq") s.mcqLeft = (s.mcqLeft || 0) + 1; } });
    // last day each chapter was tested: first answer to each quick question that day
    const lastDay = {}, firstOnDay = {};
    for (let i = (raw.attempts || []).length - 1; i >= 0; i--) { const a = raw.attempts[i], tid = qTopic[a.question_id]; if (!tid || !qQuick[a.question_id]) continue; const k = dayKey(a.created_at); if (!lastDay[tid]) lastDay[tid] = { k, at: new Date(a.created_at) }; if (lastDay[tid].k !== k) continue; (firstOnDay[tid] = firstOnDay[tid] || {})[a.question_id] = Number(a.result); }
    Object.keys(firstOnDay).forEach(tid => { const v = Object.values(firstOnDay[tid]), s = stats[tid]; if (!s || v.length < 3) return; s.lastPct = Math.round(v.reduce((n, x) => n + x, 0) / v.length * 100); s.lastTestedAt = lastDay[tid].at; });
    Object.keys(latestEver).forEach(qid => { stats[qTopic[qid]].triedEver++; });

    // Subjects with more than one book (Religion 1, Religion 2) show as one subject
    const groupName = t => String(t || "").replace(/\s*PolSoc$/i, "").replace(/\s+\d+$/, "").trim();
    const sibs = {}; subjects.forEach(s => (sibs[groupName(s.title)] = sibs[groupName(s.title)] || []).push(s.id));
    const examFor = sid => exams[sid] || (sibs[groupName((subjects.find(x => x.id === sid) || {}).title)] || []).map(id => exams[id]).find(Boolean) || null;
    subjects.forEach(s => { m.bySubject[s.id] = { ...s, fullTitle: s.title, title: groupName(s.title), chapters: [], exam: examFor(s.id) }; });
    topics.forEach(t => {
      const sid = t.subject_id; if (!m.bySubject[sid]) return;
      const st = status[t.id] || {};
      const info = chapterStage({
        learnDone: learnDone[t.id] || 0, learnTotal: (learnSteps[sid] || new Set()).size,
        classDone: !!st.class_done_at, freshSince: st.fresh_since || null,
        exam: examFor(sid), stats: stats[t.id] || { total: 0, tried: 0, fixes: 0, right: 0, triedEver: 0 }
      });
      const ch = { ...t, ...info, flag: flags[t.id] || null, classDoneAt: st.class_done_at || null, testOn: st.test_on || null, line: "",
        quickAt: quickAt[t.id] || [], examAt: examAt[t.id] || [], learnLastAt: learnLast[t.id] || 0 };
      ch.line = statusLine(ch);
      m.topics[t.id] = ch;
      m.bySubject[sid].chapters.push(ch);
    });
    m.realSubjects = subjects.map(s => m.bySubject[s.id]);
    m.groupOf = {};
    m.subjects = Object.values(sibs).map(ids => {
      const list = ids.map(id => m.bySubject[id]).sort((a, b) => a.fullTitle.localeCompare(b.fullTitle));
      if (list.length === 1) return list[0];
      const id = "g:" + list.map(x => x.id).join(",");
      list.forEach((x, i) => { m.groupOf[x.id] = id; x.chapters.forEach(c => { c.book = `Book ${i + 1}`; c.bookIdx = i; }); });
      const g = { id, title: list[0].title, members: list.map(x => x.id), chapters: list.flatMap(x => x.chapters), exam: list.map(x => x.exam).find(Boolean) || null };
      m.bySubject[id] = g;
      return g;
    });

    // this week
    const ws = weekStart(new Date());
    const thisWeek = d => d >= ws;
    let testSec = 0; (raw.timeRows || []).forEach(r => { if (r.kind === "test" && thisWeek(new Date(r.created_at))) testSec += r.seconds; });
    let learnMin = 0; learnEvents.forEach(e => { if (thisWeek(e.at)) learnMin += e.min; });
    (raw.timeRows || []).forEach(r => { if (r.kind === "learn" && thisWeek(new Date(r.created_at))) learnMin += r.seconds / 60; });
    let answered = 0, fixed = 0; const everWrong = new Set();
    (raw.attempts || []).forEach(a => {
      const at = new Date(a.created_at), r = Number(a.result);
      if (thisWeek(at)) { answered++; if (r >= 1 && everWrong.has(a.question_id)) { fixed++; everWrong.delete(a.question_id); } }
      if (r < 1) everWrong.add(a.question_id);
    });
    const days = new Set();
    (raw.attempts || []).forEach(a => days.add(dayKey(a.created_at)));
    (raw.timeRows || []).forEach(r => days.add(dayKey(r.created_at)));
    learnEvents.forEach(e => days.add(dayKey(e.at)));
    let streak = 0, d = startOfDay(new Date());
    if (!days.has(dayKey(d))) d = new Date(d - DAY);
    while (days.has(dayKey(d))) { streak++; d = new Date(d - DAY); }
    // minutes of TESTING per day (quick tests, exam questions, tutor) and completed goal weeks
    const dayMin = {};
    const addMin = (d, mins) => { const k = dayKey(d); dayMin[k] = (dayMin[k] || 0) + mins; };
    (raw.timeRows || []).forEach(r => { if (r.kind === "test") addMin(r.created_at, r.seconds / 60); });
    const GOAL_MIN = DAILY_GOAL, GOAL_DAYS = 5;
    // A streak day is one finished round (10 quick-test answers), one exam question, or 30 minutes of testing.
    // 30 minutes stays the daily goal, but a small finished session still counts.
    const quickDay = {}, examDay = {};
    (raw.attempts || []).forEach(a => { const k = dayKey(a.created_at); if (qQuick[a.question_id]) quickDay[k] = (quickDay[k] || 0) + 1; else if (qTopic[a.question_id]) examDay[k] = (examDay[k] || 0) + 1; });
    const goodDay = k => (dayMin[k] || 0) >= GOAL_MIN || (quickDay[k] || 0) >= STREAK_ROUND || (examDay[k] || 0) >= 1;
    const goodDaysIn = (start) => { let n = 0; for (let i = 0; i < 7; i++) if (goodDay(dayKey(new Date(start.getTime() + i * DAY)))) n++; return n; };
    let weeksDone = 0;
    for (let k = 1; k <= 57; k++) { if (goodDaysIn(new Date(ws.getTime() - k * 7 * DAY)) >= GOAL_DAYS) weeksDone++; }
    const thisWeekGood = goodDaysIn(ws);
    if (thisWeekGood >= GOAL_DAYS) weeksDone++;
    // streaks of days with 30+ minutes of testing, and all-time testing minutes
    const runs = []; let run = 0, streakNow = 0;
    for (let d = new Date(startOfDay(new Date()) - 400 * DAY); d <= new Date(); d = new Date(d.getTime() + DAY)) {
      if (goodDay(dayKey(d))) run++; else { if (run) runs.push(run); run = 0; }
    }
    if (run) runs.push(run);
    streakNow = run || (!goodDay(dayKey(new Date())) && runs.length && goodDay(dayKey(new Date(Date.now() - DAY))) ? runs[runs.length - 1] : 0);
    let testMin = 0; (raw.timeRows || []).forEach(r => { if (r.kind === "test") testMin += r.seconds / 60; });
    m.goal = { minutes: GOAL_MIN, days: GOAL_DAYS, dayMin, weeksDone, thisWeekGood, today: Math.round(dayMin[dayKey(new Date())] || 0), todayCounts: goodDay(dayKey(new Date())), streakRule: STREAK_RULE, weekDone: thisWeekGood >= GOAL_DAYS, runs, streakNow, testMin: Math.round(testMin) };
    m.week = { testSec, learnMin, answered, fixed, days, ws, streak };
    m.memory = memorySchedule(raw, m);
    // exam questions per chapter, for exam focus: how many, how many still to try or improve, and the marks in those
    const examBy = {};
    (raw.questions || []).forEach(q => { if (q.qtype !== "exam" || !m.topics[q.topic_id]) return;
      const e = examBy[q.topic_id] = examBy[q.topic_id] || { n: 0, tried: 0, open: 0, openMarks: 0, marks: 0 };
      const v = latestEver[q.id]; e.n++; e.marks += q.marks || 0;
      if (v !== undefined) e.tried++;
      if (v === undefined || v < 1) { e.open++; e.openMarks += q.marks || 0; } });
    Object.values(m.topics).forEach(c => { c.exam = examBy[c.id] || { n: 0, tried: 0, open: 0, openMarks: 0, marks: 0 }; });
    m.focus = raw.focus || {};
    // Real past papers, rebuilt from the chapter questions: subject -> year -> questions in paper order
    const bestRev = {};
    (raw.reviews || []).forEach(r => { if (!r.marks_available) return; const b = bestRev[r.question_id]; if (!b || r.marks_awarded > b.a) bestRev[r.question_id] = { a: Number(r.marks_awarded), b: Number(r.marks_available) }; });
    const wordNum = t => t.replace(/\bOne\b/gi, "1").replace(/\bTwo\b/gi, "2").replace(/\bThree\b/gi, "3").replace(/\bFour\b/gi, "4");
    m.papers = {};
    (raw.questions || []).forEach(q => {
      if (q.qtype !== "exam" || /^exam-style/i.test(q.source || "")) return;
      const c = m.topics[q.topic_id]; if (!c) return;
      const mm = /^((?:19|20)\d{2})\s*State Exam\s*[-–·]?\s*(.*)$/i.exec(q.source || ""); if (!mm) return;
      const year = mm[1], rest = (mm[2] || "").trim(), cut = rest.indexOf(",");
      const part = (cut > 0 ? rest.slice(0, cut) : rest).trim() || "Questions";
      let label = (cut > 0 ? rest.slice(cut + 1) : "").trim(), sub = "";
      const lm = /^(.*?):\s*(Q.*)$/i.exec(label); if (lm) { sub = lm[1].trim(); label = lm[2].trim(); }   // "Short Answer Questions: Q1 (a)"
      label = label.replace(/^Question\s*/i, "Q").replace(/\s+/g, " ");
      const norm = label.replace(/\s+/g, "").toLowerCase();
      const key = (m.groupOf && m.groupOf[c.subject_id]) || c.subject_id;
      const P = m.papers[key] = m.papers[key] || {};
      (P[year] = P[year] || []).push({ id: q.id, topic_id: q.topic_id, marks: q.marks || 0, part, sub, label, norm, sort: wordNum(part).toLowerCase() + " | " + norm, v: latestEver[q.id], best: bestRev[q.id] || null });
    });
    Object.values(m.papers).forEach(P => Object.keys(P).forEach(y => {
      // the same question saved twice ("Q1(c)" and "Q1 (c)"): keep one, preferring the one he's answered
      const seen = {};
      P[y].forEach(q => { const k = q.part.toLowerCase() + "|" + q.norm; const o = seen[k]; if (!o || (o.v === undefined && q.v !== undefined) || (!o.sub && q.sub && (o.v === undefined) === (q.v === undefined))) seen[k] = q; });
      P[y] = Object.values(seen).sort((a, b) => a.sort.localeCompare(b.sort, undefined, { numeric: true }));
    }));
    // the next exams coming up, across subjects
    const today0 = startOfDay(new Date());
    const ups = m.subjects.map(sj => sj.exam && parseDate(sj.exam.exam_date) >= today0 ? { label: sj.exam.label, date: parseDate(sj.exam.exam_date), iso: sj.exam.exam_date } : null).filter(Boolean).sort((a, b) => a.date - b.date);
    m.nextExam = ups[0] ? { ...ups[0], days: Math.round((ups[0].date - today0) / DAY) } : null;
    return m;
  }

  // ---- Memory checks ----
  // An exam question he scored 60%+ on (with or without help) comes back from fresh on a random day
  // 7–14 days later, as a different unseen question on the same chapter where there is one. Pass:
  // next check in 30 days (then 60). Miss: back in 3 days. A couple a week at most, never on
  // consecutive days, and the questions worth the most marks come first.
  // Each check is saved in quiz_attempts with source "memory:<original question id>:pass|miss".
  const MEM_MIN = 0.6, MEM_PER_WEEK = 2;
  function jitterDays(id){ let x = 0; for (const ch of String(id)) x = (x * 31 + ch.charCodeAt(0)) >>> 0; return 7 + (x % 8); }
  function memorySchedule(raw, m){
    const now = Date.now(), qs = {};
    (raw.questions || []).forEach(q => { qs[q.id] = q; });
    const isPastQ = q => q.qtype === "exam" && !/^exam-style/i.test(q.source || "");
    const anchor = {};
    (raw.reviews || []).forEach(r => {
      const q = qs[r.question_id]; if (!q || q.qtype !== "exam" || !r.marks_available) return;
      if (r.marks_awarded / r.marks_available < MEM_MIN) return;
      const t = new Date(r.created_at).getTime(); if (!anchor[q.id] || t < anchor[q.id]) anchor[q.id] = t;
    });
    const checks = [], tried = new Set(), lastTry = {};
    (raw.attempts || []).forEach(a => {
      const t = new Date(a.created_at).getTime();
      tried.add(a.question_id); lastTry[a.question_id] = Math.max(lastTry[a.question_id] || 0, t);
      const mm = /^memory:(.+):(pass|miss)$/.exec(a.source || "");
      if (mm) checks.push({ origin: mm[1], qid: a.question_id, t, pass: mm[2] === "pass" });
    });
    checks.sort((a, b) => a.t - b.t);
    const byOrigin = {}; checks.forEach(c => (byOrigin[c.origin] = byOrigin[c.origin] || []).push(c));
    const due = [];
    Object.keys(anchor).forEach(id => {
      const list = byOrigin[id] || [], last = list[list.length - 1];
      let at;
      if (!last) at = anchor[id] + jitterDays(id) * DAY;
      else if (!last.pass) at = last.t + 3 * DAY;
      else { let n = 0; for (let i = list.length - 1; i >= 0 && list[i].pass; i--) n++; at = last.t + (n >= 2 ? 60 : 30) * DAY; }
      if (at <= now) due.push({ id, at, from: last ? last.t : anchor[id] });
    });
    const todayStart = startOfDay(new Date()).getTime();
    const weekCount = checks.filter(c => c.t >= now - 7 * DAY).length;
    const lastCheck = checks.length ? checks[checks.length - 1].t : 0;
    const allowed = weekCount < MEM_PER_WEEK && lastCheck < todayStart - DAY;
    // biggest marks first, then the longest overdue
    due.sort((a, b) => ((qs[b.id] || {}).marks || 0) - ((qs[a.id] || {}).marks || 0) || a.at - b.at);
    let next = null;
    for (const d of due) {
      const o = qs[d.id]; if (!o || !m.topics[o.topic_id]) continue;
      const alt = Object.values(qs).filter(q => q.topic_id === o.topic_id && q.qtype === "exam" && q.id !== o.id && !tried.has(q.id))
        .sort((a, b) => (isPastQ(b) - isPastQ(a)) || Math.abs((a.marks || 0) - (o.marks || 0)) - Math.abs((b.marks || 0) - (o.marks || 0)) || (b.marks || 0) - (a.marks || 0))[0];
      const check = alt || (now - (lastTry[o.id] || 0) >= 14 * DAY ? o : null);
      if (!check) continue;
      next = { origin: o.id, qid: check.id, topic_id: o.topic_id, marks: check.marks || o.marks || 0, days: Math.max(1, Math.round((now - d.from) / DAY)), same: check.id === o.id };
      break;
    }
    const lastBy = {}; checks.forEach(c => { lastBy[c.origin] = c; });
    const remembered = new Set(Object.values(lastBy).filter(c => c.pass).map(c => c.origin));
    return { next: allowed ? next : null, waiting: next, checks, weekCount, remembered, eligible: Object.keys(anchor).length };
  }

  // Most urgent first: refresh before an exam, things he pinned, questions to fix, then learning
  function revisionList(m){
    const items = [];
    Object.values(m.topics).forEach(c => {
      const active = c.stage !== "none" && !c.done;
      if (!active && !c.flag) return;
      let score;
      const testDays = c.testOn ? (parseDate(c.testOn) - startOfDay(new Date())) / DAY : null;
      if (testDays !== null && testDays >= 0) score = testDays;
      else if (c.stage === "refresh" && !c.done) score = 0 + Math.max(0, (c.examDate - new Date()) / DAY);
      else if (c.flag && c.flag.note) score = 40;
      else if (c.flag && c.stage === "none") score = 300;
      else if (c.stats.total && c.classDoneAt && !c.stats.tried && (Date.now() - new Date(c.classDoneAt)) / DAY <= 7) score = 60 + (Date.now() - new Date(c.classDoneAt)) / DAY;
      else if (c.stage === "test" && c.stats.fixes) score = 100 - c.stats.fixes;
      else if (c.stage === "test") score = c.stats.total ? 150 : 400;
      else if (c.stage === "learn" && !c.done) score = 200;
      else score = 250;
      items.push({ c, score });
    });
    items.sort((a, b) => a.score - b.score || (a.c.order_num || 0) - (b.c.order_num || 0));
    return items.map(i => i.c);
  }

  // ---- exam date box (subject pages and the Exam Prep tab) ----
  function examBox(el, { sb, profile, subjectId, subjectIds, exam, onChange, compact }){
    const ids = subjectIds && subjectIds.length ? subjectIds : [subjectId];
    function paint(editing){
      const d = exam ? parseDate(exam.exam_date) : null;
      const opens = d ? new Date(d - REFRESH_DAYS * DAY) : null;
      const today = startOfDay(new Date());
      el.className = "hs-exam" + (d && today >= opens && today <= d ? " soon" : "");
      if (editing || !exam) {
        el.innerHTML = `<div class="hs-exam-text"><b>${exam ? "Change your exam date" : "When are your next exams?"}</b><span class="hs-sub">Your revision list puts exam prep first ${REFRESH_DAYS / 7} weeks before, so you're ready in time.</span></div>
          <form><input type="text" name="label" placeholder="e.g. Christmas exams" value="${esc(exam ? exam.label : "")}" aria-label="Which exams"><input type="date" name="date" value="${esc(exam ? exam.exam_date : "")}" aria-label="Exam date" required><button class="hs-btn" type="submit">Save</button>${exam ? `<button class="hs-btn ghost" type="button" data-cancel>Cancel</button><button class="hs-link" type="button" data-remove>Remove date</button>` : ""}</form>`;
        el.querySelector("form").onsubmit = async (e) => {
          e.preventDefault();
          const f = e.target, date = f.date.value, label = (f.label.value || "").trim() || "Exams";
          if (!date) return;
          f.querySelector("button[type=submit]").disabled = true;
          await sb("exam_dates", { method: "POST", prefer: "resolution=merge-duplicates,return=minimal", body: ids.map(id => ({ profile_id: profile.id, subject_id: id, label, exam_date: date, updated_at: new Date().toISOString() })) });
          exam = { label, exam_date: date }; paint(false); if (onChange) onChange(exam);
        };
        const c = el.querySelector("[data-cancel]"); if (c) c.onclick = () => paint(false);
        const r = el.querySelector("[data-remove]"); if (r) r.onclick = async () => {
          await sb(`exam_dates?profile_id=eq.${profile.id}&subject_id=in.(${ids.join(",")})`, { method: "DELETE", prefer: "return=minimal" });
          exam = null; paint(false); if (onChange) onChange(null);
        };
        return;
      }
      const open = today >= opens;
      el.innerHTML = `<div class="hs-exam-text"><b>${esc(exam.label)} · ${esc(fmtDate(d))}</b><span class="hs-sub">${today > d ? "These exams are over. Set your next exam date." : open ? `Exams ${untilText(d)}. Time for exam prep.` : `Exam prep goes to the top of your list on ${esc(fmtDate(opens))}.`}</span></div><button class="hs-link" type="button" data-edit>Change date</button>`;
      el.querySelector("[data-edit]").onclick = () => paint(true);
    }
    paint(false);
  }

  async function markClassDone(sb, profile, topicId, on){
    await sb("chapter_status", { method: "POST", prefer: "resolution=merge-duplicates,return=minimal",
      body: [{ profile_id: profile.id, topic_id: topicId, class_done_at: on ? new Date().toISOString() : null, updated_at: new Date().toISOString() }] });
  }
  async function startFresh(sb, profile, topicId){
    await sb("chapter_status", { method: "POST", prefer: "resolution=merge-duplicates,return=minimal",
      body: [{ profile_id: profile.id, topic_id: topicId, fresh_since: new Date().toISOString(), updated_at: new Date().toISOString() }] });
  }

  function subjectBar(chs){
    const n = chs.length || 1;
    const tested = chs.filter(c => c.done && c.stage !== "learn").length;
    const testing = chs.filter(c => (c.stage === "test" || c.stage === "refresh") && !c.done).length;
    const learning = chs.filter(c => c.stage === "learn").length;
    const bar = `<div class="hs-bar" aria-hidden="true"><i style="width:${tested/n*100}%;background:var(--t-accent)"></i><i style="width:${testing/n*100}%;background:var(--t-accent-soft)"></i><i style="width:${learning/n*100}%;background:var(--t-ink)"></i></div>`;
    const refresh = chs.filter(c => c.stage === "refresh" && !c.done).length;
    const parts = [];
    if (refresh) parts.push(`${refresh} to refresh`);
    if (testing - refresh) parts.push(`${testing - refresh} to test`);
    if (tested) parts.push(`${tested} tested`);
    if (learning) parts.push(`${learning} learning`);
    return { bar, parts, tested, testing, learning };
  }

  function revCard(c, subjTitle){
    const tag = stepsMark(c);
    const note = c.flag && c.flag.note ? ` · ${esc(c.flag.note)}` : "";
    return `<button type="button" class="hs-card" data-open="${c.id}" data-tab="${TAB_FOR[c.stage]}">${tag}
      <span class="hs-sub">${esc(subjTitle)} · Ch ${esc(String(c.order_num ?? ""))}</span>
      <span class="t">${esc(shortTitle(c.title))}</span>
      ${c.stage === "none" && !note ? "" : `<span class="s">${esc(c.line)}${note}</span>`}
      <span class="go">${GO[c.stage]}</span></button>`;
  }

  // ---- "What's new at school?" ----
  const QA_MIC = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><path d="M12 17v5"/></svg>';
  function isoDay(d){ const x = new Date(d); return x.getFullYear() + "-" + String(x.getMonth()+1).padStart(2,"0") + "-" + String(x.getDate()).padStart(2,"0"); }
  function mountQuickAdd(el, m, { sb, profile, reload, state }){
    if (!el) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const subjTitle = id => (m.bySubject[id] || {}).title || "";
    const chOf = id => m.topics[id];
    const chName = c => `${subjTitle(c.subject_id)} · Ch ${c.order_num ?? ""}`;
    const STATE_WORD = c => ({ none: "not started", learn: "learning", test: "testing", refresh: "refreshing" })[c.stage] + (c.classDone ? ", done in class" : "");
    const guessChapter = (sid) => {
      const rev = revisionList(m).filter(c => c.subject_id === sid);
      if (rev.length) return rev[0].id;
      const chs = (m.bySubject[sid] || { chapters: [] }).chapters;
      return (chs.find(c => c.stage === "none") || chs[0] || {}).id || null;
    };
    function paintInput(msgHtml, value){
      el.innerHTML = `<div class="step-h"><div><h3>What's new at school?</h3><span class="hs-sub">Say or type what's coming up, what you did in class, or any tests.</span></div></div>
        <form class="qa-row"><div class="qa-box"><input type="text" name="t" autocomplete="off" aria-label="What's new at school" placeholder='e.g. "econ ch 3 coming up, we did polsoc ch 5, geog test friday"'>${SR ? `<button type="button" class="qa-mic" aria-label="Speak" title="Speak">${QA_MIC}</button>` : ""}</div><button class="hs-btn ghost" type="submit" style="min-height:48px;padding:10px 22px;font-size:16px">Add</button></form>
        <p class="qa-err" hidden></p>${msgHtml || ""}`;
      const form = el.querySelector("form"), input = form.t, err = el.querySelector(".qa-err");
      if (value) input.value = value;
      const mic = el.querySelector(".qa-mic");
      let rec = null;
      if (mic) mic.onclick = () => {
        if (rec) { try { rec.stop(); } catch (e) {} return; }
        rec = new SR(); rec.lang = "en-IE"; rec.interimResults = true; rec.continuous = true;
        const base = input.value ? input.value.replace(/\s*$/, " ") : "";
        rec.onresult = (e) => { for (let i = e.resultIndex; i < e.results.length; i++) { const r = e.results[i]; if (r.isFinal && r[0].transcript.trim()) input.value = (input.value.replace(/\s*$/, " ") + r[0].transcript.trim()).replace(/^\s+/, ""); } };
        rec.onerror = (e) => { err.textContent = e.error === "not-allowed" ? "The browser blocked the microphone. Allow it for this site, or type instead." : "Didn't catch that. Try again or type it."; err.hidden = false; };
        rec.onend = () => { rec = null; mic.classList.remove("on"); };
        try { rec.start(); mic.classList.add("on"); err.hidden = true; } catch (e) { rec = null; }
      };
      const undo = el.querySelector("[data-undo]"); if (undo) undo.onclick = async () => { undo.disabled = true; undo.textContent = "Undoing…"; await state.qaUndo(); state.qaUndo = null; reload(); };
      form.onsubmit = async (e) => {
        e.preventDefault();
        if (rec) { try { rec.stop(); } catch (x) {} }
        const text = input.value.trim(); if (!text) { input.focus(); return; }
        const btn = form.querySelector("button[type=submit]"); btn.disabled = true; btn.textContent = "Reading…"; err.hidden = true;
        try {
          const now = new Date();
          const r = await fetch("/api/quick-add", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
            text, today: isoDay(now), weekday: now.toLocaleDateString("en-IE", { weekday: "long" }),
            subjects: (m.realSubjects || m.subjects).map(s => ({ id: s.id, title: s.fullTitle || s.title })),
            chapters: Object.values(m.topics).map(c => ({ id: c.id, subject: subjTitle(c.subject_id), num: c.order_num, title: shortTitle(c.title), state: STATE_WORD(c) }))
          }) });
          const data = await r.json().catch(() => ({}));
          if (!r.ok || !Array.isArray(data.actions)) throw new Error(data.error || "Couldn't read that just now.");
          if (!data.actions.length) throw new Error("Nothing to change in that. Try naming the subject and chapter.");
          paintConfirm(text, data.actions);
        } catch (x) { err.textContent = x.message; err.hidden = false; btn.disabled = false; btn.textContent = "Add"; }
      };
    }
    function paintConfirm(text, actions){
      actions.forEach(a => { if ((a.type === "class_test" || a.type === "deadline") && !a.topic_id) a.topic_id = guessChapter(a.subject_id); if (!a.subject_id && a.topic_id && chOf(a.topic_id)) a.subject_id = chOf(a.topic_id).subject_id; });
      const item = (a, i) => {
        const c = a.topic_id ? chOf(a.topic_id) : null;
        const d = a.date ? fmtDate(parseDate(a.date)) : "";
        const chSelect = () => { const chs = (m.bySubject[a.subject_id] || { chapters: [] }).chapters.slice().sort((x, y) => (x.order_num || 0) - (y.order_num || 0));
          return `<select data-i="${i}" aria-label="Which chapter">${chs.map(x => `<option value="${x.id}"${x.id === a.topic_id ? " selected" : ""}>Ch ${x.order_num ?? ""}: ${esc(shortTitle(x.title))}</option>`).join("")}</select>`; };
        let ic, k, t, w;
        if (a.type === "class_done") { ic = ["done", "✓"]; k = chName(c); t = shortTitle(c.title); w = "Covered in class: added to your revision list for a quick test"; }
        else if (a.type === "coming_up") { ic = ["up", "›"]; k = chName(c); t = shortTitle(c.title); w = `Coming up${d ? " " + d : " in class"}: added to your revision list to learn ahead`; }
        else if (a.type === "class_test") { ic = ["date", "!"]; k = `${subjTitle(a.subject_id)} · class test`; t = d; w = `Which chapter? ${chSelect()}`; }
        else if (a.type === "deadline") { ic = ["date", "!"]; k = `${subjTitle(a.subject_id)} · ${esc(a.label || "deadline")}`; t = `Due ${d}`; w = `For ${chSelect()}`; }
        else if (a.type === "exam") { ic = ["date", "!"]; k = subjTitle(a.subject_id); t = `${esc(a.label || "Exams")} · ${d}`; w = "Sets the exam date, so exam prep starts 3 weeks before"; }
        else { ic = ["unclear", "?"]; k = "Not sure about this part"; t = `"${esc(a.said)}"`; w = esc(a.reason || "Couldn't match it to a chapter."); }
        const can = a.type !== "unclear";
        return `<div class="qa-item"><span class="qa-ic ${ic[0]}">${ic[1]}</span><span class="qa-b"><span class="k">${esc(k)}</span><span class="t">${a.type === "unclear" || a.type === "exam" || a.type === "deadline" ? t : esc(t)}</span><span class="w">${w}</span></span>${can ? `<input type="checkbox" class="qa-check" data-i="${i}" checked aria-label="Include this">` : ""}</div>`;
      };
      const usable = actions.some(a => a.type !== "unclear");
      el.innerHTML = `<div class="step-h"><div><h3>What's new at school?</h3><span class="hs-sub">You said: "${esc(text)}"</span></div></div>
        <b style="font-size:17px">Here's what I'll do</b>
        <div class="qa-list">${actions.map(item).join("")}</div>
        <div style="display:flex;gap:10px;flex-wrap:wrap">${usable ? `<button class="hs-btn" type="button" data-ok style="min-height:48px;padding:10px 24px;font-size:16px">Looks right</button>` : ""}<button class="hs-btn ghost" type="button" data-again style="min-height:48px;padding:10px 22px;font-size:16px">Start again</button></div>
        ${usable ? `<span class="hs-sub">Untick anything that's wrong.</span>` : ""}<p class="qa-err" hidden></p>`;
      el.querySelectorAll("select[data-i]").forEach(s => s.onchange = () => { actions[+s.dataset.i].topic_id = s.value; });
      el.querySelector("[data-again]").onclick = () => paintInput("", text);
      const ok = el.querySelector("[data-ok]");
      if (ok) ok.onclick = async () => {
        ok.disabled = true; ok.textContent = "Saving…";
        const chosen = actions.filter((a, i) => { const cb = el.querySelector(`.qa-check[data-i="${i}"]`); return a.type !== "unclear" && cb && cb.checked; });
        try { const summary = await applyActions(chosen); state.qaMsg = summary; reload(); }
        catch (x) { const e2 = el.querySelector(".qa-err"); e2.textContent = "Something didn't save. Try again."; e2.hidden = false; ok.disabled = false; ok.textContent = "Looks right"; }
      };
    }
    async function applyActions(list){
      const undo = [], said = [];
      const flagPrev = id => { const c = chOf(id); return c && c.flag ? { ...c.flag } : null; };
      const setFlag = (id, note) => sb("topic_flags", { method: "POST", prefer: "resolution=merge-duplicates,return=minimal", body: [{ topic_id: id, profile_id: profile.id, flag_type: "revise", note, updated_at: new Date().toISOString() }] });
      const restoreFlag = (id, prev) => prev ? sb("topic_flags", { method: "POST", prefer: "resolution=merge-duplicates,return=minimal", body: [{ topic_id: id, profile_id: profile.id, flag_type: prev.flag_type || "revise", note: prev.note || "", updated_at: new Date().toISOString() }] })
        : sb(`topic_flags?topic_id=eq.${id}&profile_id=eq.${profile.id}`, { method: "DELETE", prefer: "return=minimal" });
      const setStatus = (id, fields) => sb("chapter_status", { method: "POST", prefer: "resolution=merge-duplicates,return=minimal", body: [{ profile_id: profile.id, topic_id: id, ...fields, updated_at: new Date().toISOString() }] });
      for (const a of list) {
        const c = a.topic_id ? chOf(a.topic_id) : null;
        if (a.type === "class_done" && c) {
          const prevAt = c.classDoneAt, prevFlag = flagPrev(c.id);
          await setStatus(c.id, { class_done_at: new Date().toISOString() });
          await setFlag(c.id, "Covered in class · test yourself");
          undo.push(async () => { await setStatus(c.id, { class_done_at: prevAt }); await restoreFlag(c.id, prevFlag); });
          said.push(`${chName(c)} is on your revision list for a quick test`);
        } else if (a.type === "coming_up" && c) {
          const prevFlag = flagPrev(c.id);
          await setFlag(c.id, "Coming up in class" + (a.date ? " " + fmtDate(parseDate(a.date)) : ""));
          undo.push(() => restoreFlag(c.id, prevFlag));
          said.push(`${chName(c)} is on your revision list`);
        } else if ((a.type === "class_test" || a.type === "deadline") && c) {
          const prevFlag = flagPrev(c.id), prevOn = c.testOn;
          const note = a.type === "class_test" ? `Class test ${fmtDate(parseDate(a.date))}` : `${a.label || "Due"} ${fmtDate(parseDate(a.date))}`;
          await setStatus(c.id, { test_on: a.date }); await setFlag(c.id, note);
          undo.push(async () => { await setStatus(c.id, { test_on: prevOn }); await restoreFlag(c.id, prevFlag); });
          said.push(a.type === "class_test" ? `the ${subjTitle(c.subject_id)} test is on ${fmtDate(parseDate(a.date))}` : `${a.label || "your deadline"} is on ${fmtDate(parseDate(a.date))}`);
        } else if (a.type === "exam" && a.subject_id) {
          const prev = (m.bySubject[a.subject_id] || {}).exam || null;
          await sb("exam_dates", { method: "POST", prefer: "resolution=merge-duplicates,return=minimal", body: [{ profile_id: profile.id, subject_id: a.subject_id, label: a.label || "Exams", exam_date: a.date, updated_at: new Date().toISOString() }] });
          undo.push(() => prev ? sb("exam_dates", { method: "POST", prefer: "resolution=merge-duplicates,return=minimal", body: [{ profile_id: profile.id, subject_id: a.subject_id, label: prev.label, exam_date: prev.exam_date, updated_at: new Date().toISOString() }] })
            : sb(`exam_dates?profile_id=eq.${profile.id}&subject_id=eq.${a.subject_id}`, { method: "DELETE", prefer: "return=minimal" }));
          said.push(`${subjTitle(a.subject_id)} ${a.label || "exams"} set for ${fmtDate(parseDate(a.date))}`);
        }
      }
      state.qaUndo = async () => { for (const u of undo.reverse()) await u(); };
      if (!said.length) return "Nothing was changed.";
      const s = said.join(", ").replace(/, ([^,]*)$/, " and $1");
      return "Done. " + s.charAt(0).toUpperCase() + s.slice(1) + ".";
    }
    const msg = state.qaMsg ? `<div class="qa-msg"><span style="flex:1">${esc(state.qaMsg)}</span>${state.qaUndo ? `<button type="button" class="hs-link" data-undo>Undo</button>` : ""}</div>` : "";
    state.qaMsg = null;
    paintInput(msg);
  }

  // ---- Today's session ----
  // The homepage opens with a suggested plan for today ("Here's what I'd do today"). The student
  // either accepts it (Let's go) or says what they'd rather do (Say it), and the result becomes
  // today's session: a short to-do list that ticks itself off as they work through it.
  // Kept in this browser for the day (localStorage), so nothing new is needed in the database.
  const sessionKey = profile => `sp-session:${profile.id}:${isoDay(new Date())}`;
  function loadSession(profile){
    try {
      const prefix = `sp-session:${profile.id}:`, key = sessionKey(profile);
      for (let i = localStorage.length - 1; i >= 0; i--) { const k = localStorage.key(i); if (k && k.startsWith(prefix) && k !== key) localStorage.removeItem(k); }
      const s = JSON.parse(localStorage.getItem(key) || "null");
      return s && Array.isArray(s.items) ? s : null;
    } catch (e) { return null; }
  }
  function saveSession(profile, s, m){
    if (s && m) s.items.forEach(it => { if (!it.what) { const d = describe(m, it); if (d) it.what = d.what; } });
    try { if (s) localStorage.setItem(sessionKey(profile), JSON.stringify(s)); else localStorage.removeItem(sessionKey(profile)); } catch (e) {} }

  const subjOf = (m, c) => { const s = m.bySubject[c.subject_id] || {}; return `${s.title || ""}${c.book ? " " + c.book : ""}`; };
  // One quick-test item: how many rounds and questions, and roughly how long
  function testItem(c, rounds, kind){
    const st = c.stats || {}, r = nextRound(st); if (!r) return null;
    const pool = st.quickLeft || st.quickTotal || r.n;
    const q = Math.max(1, Math.min(pool, rounds * 10));
    return { topic_id: c.id, kind: kind || "test", rounds, q, mins: Math.max(2, Math.round(r.mins * q / r.n)) };
  }
  function memoryItem(m){
    const n = m.memory && m.memory.next; if (!n || !m.topics[n.topic_id]) return null;
    return { topic_id: n.topic_id, kind: "memory", qid: n.qid, origin: n.origin, marks: n.marks, days: n.days, mins: Math.max(5, Math.min(25, Math.round((n.marks || 10) * 0.5))) };
  }
  // Fill today's remaining minutes from today's plan: finish one chapter's questions before moving on
  function suggestSession(m, need){
    const items = []; let total = 0;
    const mem = memoryItem(m); if (mem) { items.push(mem); total += mem.mins; }
    for (const p of todayPlan(m)) {
      if (total >= need) break;
      if (mem && p.c.id === mem.topic_id) continue;
      const st = p.c.stats || {}, left = st.quickLeft || st.quickTotal || 0;
      const maxRounds = Math.max(1, Math.min(3, Math.ceil(left / 10)));
      let rounds = 1, it = testItem(p.c, rounds); if (!it) continue;
      while (rounds < maxRounds && total + it.mins < need) { const more = testItem(p.c, rounds + 1); if (!more || total + more.mins > need + 3) break; rounds++; it = more; }
      items.push(it); total += it.mins;
    }
    return items;
  }
  function itemStatus(c, it, since, m){
    if (!c) return { done: false, n: 0 };
    if (it.kind === "memory") { const ck = ((m && m.memory && m.memory.checks) || []).find(x => x.origin === it.origin && x.t >= since); return { done: !!ck, n: 0, pass: ck ? ck.pass : null }; }
    if (it.kind === "learn") return { done: (c.learnLastAt || 0) >= since, n: 0 };
    if (it.kind === "exam") { const n = (c.examAt || []).filter(t => t >= since).length; return { done: n >= 1, n }; }
    const n = (c.quickAt || []).filter(t => t >= since).length;
    return { done: n >= (it.q || 1), n };
  }
  function describe(m, it){
    const c = m.topics[it.topic_id]; if (!c) return null;
    const st = c.stats || {}, short = shortTitle(c.title);
    let what = it.what, detail;
    if (it.kind === "memory") { what = what || "Memory check"; detail = `a ${it.marks ? it.marks + "-mark " : ""}exam question, from memory · you did this chapter ${it.days} days ago · about ${it.mins} min`; }
    else if (it.kind === "learn") { what = what || "Learn"; detail = `video or revision guide · about ${it.mins} min`; }
    else if (it.kind === "exam") { what = what || "Exam question"; detail = `write one and get it marked · about ${it.mins} min`; }
    else if (it.kind === "revise") { what = what || "Revise"; detail = `revision guide, then a quick round · about ${it.mins} min`; }
    else {
      const fixOnly = st.quickFix && !st.quickNew && (st.quickLeft || 0) <= it.q;
      what = what || (fixOnly ? `${plural(st.quickFix, "question", "questions")} you got wrong` : (st.quickLeft && st.quickLeft <= it.q ? "Finish Quick Tests" : "Quick Tests"));
      detail = `${it.rounds > 1 ? it.rounds + " rounds" : "1 round"} · about ${it.mins} min`;
    }
    return { c, subj: subjOf(m, c), name: `Ch ${c.order_num ?? ""}: ${short}`, short, what, detail };
  }
  // The next unfinished item in today's session, for "Next up" after a round. Returns null while
  // the chapter they're on still has session work left, so they carry on there first.
  function sessionNext(m, profile, currentId){
    const s = loadSession(profile); if (!s) return null;
    const rows = s.items.map(it => ({ it, c: m.topics[it.topic_id] })).filter(r => r.c);
    const here = rows.find(r => r.c.id === currentId);
    if (here && here.it.kind !== "memory" && !itemStatus(here.c, here.it, s.startedAt, m).done) return null;
    const next = rows.find(r => r.c.id !== currentId && r.it.kind !== "memory" && !itemStatus(r.c, r.it, s.startedAt, m).done);
    if (!next) return null;
    const d = describe(m, next.it);
    return { c: next.c, item: next.it, tab: { learn: "learn", revise: "learn", exam: "refresh" }[next.it.kind] || "test",
      title: `Next in today's session: ${d.subj} · ${d.name}`, note: `${d.what} · ${d.detail}.` };
  }

  function mountSession(el, m, { profile, openChapter, state, again }){
    const goalMin = m.goal ? m.goal.minutes : DAILY_GOAL, todayMin = m.goal ? m.goal.today : 0;
    const need = todayMin >= goalMin ? 10 : goalMin - todayMin;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const head = (sub) => `<div class="pl-head">${ringSvg(56, todayMin / goalMin, todayMin >= goalMin ? "&#10003;" : "", 7)}<span><b>Today's session</b><span class="s">${sub || (todayMin >= goalMin ? `Today's ${goalMin} minutes: done &#10003; Anything more is a bonus.` : todayMin ? `${todayMin} of ${goalMin} minutes tested today. ${goalMin - todayMin} to go.` : `${goalMin} minutes of testing today.`)}${todayMin < goalMin ? (m.goal && m.goal.todayCounts ? " Today counts for your streak &#10003;" : " One round counts for your streak.") : ""}</span></span></div>`;
    const sum = items => items.reduce((n, it) => n + (it.mins || 0), 0);
    const open = (it) => {
      const c = m.topics[it.topic_id]; if (!c) return;
      if (it.kind === "test") { state.todayRun = c.id; openChapter(c.id, c.subject_id, "test"); }
      else if (it.kind === "memory") { state.memoryRun = { topic: c.id, qid: it.qid, origin: it.origin, days: it.days }; openChapter(c.id, c.subject_id, "refresh"); }
      else openChapter(c.id, c.subject_id, it.kind === "exam" ? "refresh" : "learn");
    };

    // 1. The suggestion
    function paintAsk(){
      const sug = suggestSession(m, need);
      el.className = "pl";
      if (!sug.length) {
        el.innerHTML = `${head()}<div class="ss-lead">What would you like to study today?</div>
          <span class="hs-sub" style="font-size:15px">Say a chapter or two, like "test the consumer, revise evidence for Jesus".</span>
          <button type="button" class="hs-btn ss-go ss-say" data-say style="justify-content:center">${QA_MIC} Say it</button>`;
        el.querySelector("[data-say]").onclick = () => paintSay();
        return;
      }
      el.innerHTML = `${head()}
        <div class="ss-lead">${todayMin >= goalMin ? "Fancy a bonus round?" : "Here's what I'd do today"} <span>(about ${sum(sug)} min)</span></div>
        <ol class="ss-sug">${sug.map((it, i) => { const d = describe(m, it); return `<li><span class="ss-num">${i + 1}</span><span><b>${esc(d.what)} on ${esc(d.short)}</b><span class="s">${esc(d.subj)} · ${esc(d.detail)}</span></span></li>`; }).join("")}</ol>
        <button type="button" class="hs-btn ss-go" data-go>Let's go</button>
        <div class="ss-change"><span>Want to change anything?</span><button type="button" class="hs-btn ghost ss-say" data-say>${QA_MIC} Say it</button></div>`;
      el.querySelector("[data-go]").onclick = () => { saveSession(profile, { source: "suggested", startedAt: Date.now(), items: sug }, m); paintSession(); };
      el.querySelector("[data-say]").onclick = () => paintSay();
    }

    // 2. Say (or type) what they want instead
    function paintSay(value){
      el.className = "pl";
      el.innerHTML = `${head()}
        <div class="ss-lead">What do you want to do today?</div>
        <span class="hs-sub" style="font-size:15px">Say or type chapters, like "revise evidence for Jesus, test the consumer".</span>
        <form class="qa-row"><div class="qa-box"><input type="text" name="t" autocomplete="off" aria-label="What you want to study today" placeholder='e.g. "test the consumer, revise ch 5 religion"'>${SR ? `<button type="button" class="qa-mic" aria-label="Speak" title="Speak">${QA_MIC}</button>` : ""}</div><button class="hs-btn" type="submit" style="min-height:48px;padding:10px 22px;font-size:16px">Set it up</button></form>
        <p class="ss-listen" hidden><i aria-hidden="true"></i><span>Listening… say what you'd like to study. Tap the microphone when you've finished.</span></p>
        <p class="qa-err" hidden></p>
        <div class="ss-foot"><button type="button" class="hs-link" data-cancel>Back to my suggestion</button></div>`;
      const listening = el.querySelector(".ss-listen");
      const form = el.querySelector("form"), input = form.querySelector("input[name=t]"), err = el.querySelector(".qa-err"), mic = el.querySelector(".qa-mic");
      if (value) input.value = value;
      el.querySelector("[data-cancel]").onclick = () => { stop(); paintAsk(); };
      // Speech: words appear in the box as they're spoken, and the mic button clearly shows when it's listening.
      // "Say it" starts listening straight away; the mic button then shows it's on and stops it.
      let rec = null, heard = false;
      function setOn(on){
        if (!mic) return;
        mic.classList.toggle("on", on);
        mic.setAttribute("aria-label", on ? "Stop listening" : "Speak");
        mic.title = on ? "Stop listening" : "Speak";
        listening.hidden = !on;
        input.placeholder = on ? "Listening…" : 'e.g. "test the consumer, revise ch 5 religion"';
      }
      function stop(){ if (rec) { try { rec.stop(); } catch (e) {} } }
      function listen(){
        if (rec) { stop(); return; }
        const base = input.value ? input.value.replace(/\s*$/, " ") : "";
        let finals = "";
        heard = false;
        rec = new SR(); rec.lang = "en-IE"; rec.interimResults = true; rec.continuous = true;
        rec.onresult = (e) => {
          let interim = "";
          for (let i = e.resultIndex; i < e.results.length; i++) {
            const r = e.results[i], t = r[0].transcript;
            if (r.isFinal) finals += t.trim() + " "; else interim += t;
          }
          heard = true;
          input.value = (base + finals + interim).replace(/\s+/g, " ").replace(/^\s+/, "");
        };
        rec.onerror = (e) => {
          err.textContent = e.error === "not-allowed" || e.error === "service-not-allowed" ? "The browser blocked the microphone. Allow it for this site (the icon in the address bar), or type instead."
            : e.error === "no-speech" ? "Didn't hear anything. Tap the microphone and try again, or type it."
            : e.error === "audio-capture" ? "No microphone found. Check one is plugged in and switched on, or type instead."
            : "Didn't catch that. Tap the microphone and try again, or type it.";
          err.hidden = false;
        };
        rec.onend = () => { rec = null; setOn(false); input.value = input.value.trim(); if (heard) input.focus(); };
        try { rec.start(); setOn(true); err.hidden = true; } catch (e) { rec = null; setOn(false); }
      }
      if (mic) { mic.onclick = listen; if (!value) listen(); else input.focus(); } else input.focus();
      form.onsubmit = async (e) => {
        e.preventDefault(); stop();
        const text = input.value.trim(); if (!text) { input.focus(); return; }
        const btn = form.querySelector("button[type=submit]"); btn.disabled = true; btn.textContent = "Setting up…"; err.hidden = true;
        try {
          const subjTitle = id => (m.bySubject[id] || {}).title || "";
          const stateWord = c => { const st = c.stats || {}; return ({ none: "not started", learn: "learning", test: "testing", refresh: "exam prep" })[c.stage] + (st.quickFix ? `, ${st.quickFix} to try again` : ""); };
          const r = await fetch("/api/plan-session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
            text,
            subjects: (m.realSubjects || m.subjects).map(s => ({ id: s.id, title: s.fullTitle || s.title })),
            chapters: Object.values(m.topics).map(c => ({ id: c.id, subject: subjTitle(c.subject_id) + (c.book ? " " + c.book : ""), num: c.order_num, title: shortTitle(c.title), state: stateWord(c) }))
          }) });
          const data = await r.json().catch(() => ({}));
          if (!r.ok || !Array.isArray(data.items)) throw new Error(data.error || "Couldn't read that just now.");
          const s = buildFromSaid(data.items);
          if (!s.items.length) throw new Error(s.unclear.length ? `Couldn't match "${s.unclear[0].said}" to a chapter. Try the subject and chapter number.` : "Couldn't find a chapter in that. Try naming the subject and chapter.");
          saveSession(profile, s, m); paintSession();
        } catch (x) { err.textContent = x.message; err.hidden = false; btn.disabled = false; btn.textContent = "Set it up"; }
      };
    }

    // Turn what they said into session items, then add anything that's due and they left out
    function buildFromSaid(said){
      const items = [], unclear = [], seen = new Set();
      said.forEach(a => {
        const c = a.topic_id ? m.topics[a.topic_id] : null;
        if (!c || a.kind === "unclear") { if (a.said) unclear.push({ said: a.said }); return; }
        if (seen.has(c.id)) return; seen.add(c.id);
        const hasQuick = !!(c.stats && c.stats.quickTotal);
        let it = null;
        if (a.kind === "learn" || (!hasQuick && a.kind !== "exam")) {
          it = { topic_id: c.id, kind: "learn", mins: 8 };
        } else if (a.kind === "exam") {
          it = { topic_id: c.id, kind: "exam", mins: 12 };
        } else if (a.kind === "revise") {
          const t = testItem(c, 1, "revise"); it = t ? { ...t, mins: t.mins + 5 } : { topic_id: c.id, kind: "learn", mins: 8 };
        } else {
          it = testItem(c, 1);
        }
        if (it) { if (a.sure === false) it.unsure = true; items.push(it); }
      });
      // Something due they didn't mention: questions they got wrong in a chapter they've been testing
      if (items.length) {
        const due = Object.values(m.topics).filter(c => !seen.has(c.id) && c.stats && c.stats.quickFix && c.stats.lastAt)
          .sort((a, b) => (b.stats.quickFix || 0) - (a.stats.quickFix || 0))[0];
        const coversFixes = items.some(it => { const c = m.topics[it.topic_id]; return c && c.stats && c.stats.quickFix && it.kind !== "learn"; });
        if (due && !coversFixes) {
          const q = Math.min(due.stats.quickFix, 5), t = testItem(due, 1);
          if (t) items.push({ ...t, q, mins: Math.max(2, Math.round(t.mins * q / Math.max(1, t.q))), added: true });
        }
      }
      const mem = memoryItem(m);
      if (items.length && mem && !items.some(it => it.topic_id === mem.topic_id && it.kind === "memory")) items.push({ ...mem, added: true });
      return { source: "mine", startedAt: Date.now(), items, unclear };
    }

    // 3. Today's session list
    function paintSession(){
      const s = loadSession(profile); if (!s) { paintAsk(); return; }
      const rows = s.items.map((it, i) => ({ it, i, d: describe(m, it), st: itemStatus(m.topics[it.topic_id], it, s.startedAt, m) })).filter(r => r.d);
      const doneN = rows.filter(r => r.st.done).length, left = rows.filter(r => !r.st.done);
      const nextIdx = left.length ? left[0].i : -1;
      const minsLeft = sum(left.map(r => r.it));
      const short = left.length && todayMin + minsLeft < goalMin - 3;
      el.className = "pl";
      if (!rows.length) { saveSession(profile, null); paintAsk(); return; }
      const allDone = !left.length;
      const line = allDone ? (todayMin >= goalMin ? `All done &#10003; and today's ${goalMin} minutes are in.` : `All done &#10003; ${goalMin - todayMin} minutes to go today.`)
        : `About ${minsLeft} min${doneN ? " left" : ""}${!short ? (todayMin >= goalMin ? "" : ` · gets you to your ${goalMin} today`) : ` · ${goalMin - todayMin - minsLeft} short of your ${goalMin}`}`;
      const chapterPick = (it, i) => {
        const c = m.topics[it.topic_id], chs = (m.bySubject[c.subject_id] || { chapters: [] }).chapters.slice().sort((a, b) => (a.order_num || 0) - (b.order_num || 0));
        return `<div class="ss-check"><span>Is this the right chapter?</span><select data-pick="${i}" aria-label="Which chapter">${chs.map(x => `<option value="${x.id}"${x.id === c.id ? " selected" : ""}>Ch ${x.order_num ?? ""}: ${esc(shortTitle(x.title))}</option>`).join("")}</select><button type="button" class="hs-btn small" data-sure="${i}" style="align-self:flex-start">Yes, that's it</button></div>`;
      };
      const progress = r => r.it.kind === "memory" && r.st.done ? (r.st.pass ? "Remembered ✓" : "Done · it'll come back in a few days") : r.st.done ? "Done" : (r.it.kind === "test" || r.it.kind === "revise") && r.st.n ? `${Math.min(r.st.n, r.it.q)} of ${r.it.q} answered` : "";
      el.innerHTML = `${head()}
        <span class="ss-k">${s.source === "mine" ? "Your plan" : "Suggested plan"}</span>
        <div><div class="ss-count">${allDone ? "All done" : `${doneN} of ${rows.length} done`}</div><span class="hs-sub" style="font-size:15px">${line}</span></div>
        ${rows.map(r => `<div class="ss-row${r.st.done ? " done" : ""}${r.i === nextIdx ? " next" : ""}">
          <div class="ss-main"><span class="ss-tick" aria-hidden="true">${r.st.done ? "&#10003;" : ""}</span>
            <button type="button" class="ss-b" data-item="${r.i}"><span class="pl-k">${esc(r.d.subj)}</span><span class="pl-t">${esc(r.d.name)}</span><span class="pl-n">${esc(r.d.what)} · ${esc(r.d.detail)}${progress(r) ? " · " + esc(progress(r)) : ""}</span></button>
            ${r.st.done ? "" : `<button type="button" class="ss-x" data-remove="${r.i}" aria-label="Remove ${esc(r.d.short)} from today's session" title="Remove">&times;</button>`}</div>
          ${r.it.added && !r.st.done ? `<span class="ss-tag">Added by me: it's due</span>` : ""}
          ${r.it.unsure && !r.st.done ? chapterPick(r.it, r.i) : ""}
          ${r.i === nextIdx ? `<button type="button" class="hs-btn ss-start" data-item="${r.i}">${r.st.n ? "Keep going" : "Start"}</button>` : ""}
        </div>`).join("")}
        ${short ? `<button type="button" class="ss-add" data-add>+ Add a round to reach ${goalMin}</button>` : ""}
        ${(s.unclear || []).length ? `<span class="hs-sub">Couldn't match ${s.unclear.map(u => `"${esc(u.said)}"`).join(", ")} to a chapter. Add it from "Or choose yourself" below.</span>` : ""}
        <div class="ss-foot">${allDone ? `<button type="button" class="hs-btn" data-new>Plan some more</button>` : `<button type="button" class="hs-link" data-new>Change plan</button>`}</div>`;
      el.querySelectorAll("[data-item]").forEach(b => b.onclick = () => open(s.items[+b.dataset.item]));
      el.querySelectorAll("[data-remove]").forEach(b => b.onclick = () => { s.items.splice(+b.dataset.remove, 1); saveSession(profile, s.items.length ? s : null); paintSession(); });
      el.querySelectorAll("[data-pick]").forEach(sel => sel.onchange = () => {
        const it = s.items[+sel.dataset.pick], c = m.topics[sel.value]; if (!c) return;
        const fresh = it.kind === "learn" || it.kind === "exam" || !(c.stats && c.stats.quickTotal) ? { topic_id: c.id, kind: it.kind === "exam" ? "exam" : "learn", mins: it.kind === "exam" ? 12 : 8 } : testItem(c, 1, it.kind);
        if (fresh && it.kind === "revise") fresh.mins += 5;
        s.items[+sel.dataset.pick] = fresh || it; saveSession(profile, s, m); paintSession();
      });
      el.querySelectorAll("[data-sure]").forEach(b => b.onclick = () => { delete s.items[+b.dataset.sure].unsure; saveSession(profile, s); paintSession(); });
      const add = el.querySelector("[data-add]"); if (add) add.onclick = () => {
        // another round on the first test item with questions to spare, otherwise the next chapter from today's plan
        const more = s.items.find(it => it.kind === "test" && !it.added && m.topics[it.topic_id] && (m.topics[it.topic_id].stats.quickLeft || 0) > it.q);
        if (more) { const t = testItem(m.topics[more.topic_id], more.rounds + 1); if (t) { Object.assign(more, { rounds: t.rounds, q: t.q, mins: t.mins }); delete more.what; } }
        else { const extra = todayPlan(m).map(p => p.c).find(c => !s.items.some(it => it.topic_id === c.id)); const t = extra && testItem(extra, 1); if (t) s.items.push(t); }
        saveSession(profile, s, m); paintSession();
      };
      el.querySelector("[data-new]").onclick = () => { saveSession(profile, null); paintAsk(); };
    }

    if (loadSession(profile)) paintSession(); else paintAsk();
  }

  // ---- Exam focus ----
  // Two weeks before exams the homepage offers exam focus (never switches it on by itself). When on, the
  // homepage is just subjects → chapters → exam questions, highest marks first, with nothing else on screen.
  const FOCUS_DAYS = 14;
  async function saveFocus(sb, profile, f){
    try { await sb("student_settings", { method: "POST", prefer: "resolution=merge-duplicates,return=minimal", body: [{ profile_id: profile.id, exam_focus: f, updated_at: new Date().toISOString() }] }); } catch (e) {}
  }
  function focusPrompt(m){
    const f = m.focus || {}, x = m.nextExam;
    if (f.on || !x || x.days > FOCUS_DAYS) return "";
    if (f.dismissed === x.iso || (f.snooze && f.snooze >= isoDay(new Date()))) return "";
    const when = x.days === 0 ? "start today" : x.days === 1 ? "start tomorrow" : `are ${x.days} days away`;
    return `<div class="fx-ask"><span class="fx-ask-b"><b>${esc(x.label || "Your exams")} ${when}.</b><span>Want to switch on exam focus? It keeps things simple: just exam questions, one subject at a time. You can switch it off any time with the Exam focus switch at the top.</span></span>
      <span class="fx-ask-btns"><button type="button" class="hs-btn" data-fx-on>Switch on exam focus</button><button type="button" class="hs-btn ghost" data-fx-later>Not now</button></span></div>`;
  }
  function focusHtml(m, state){
    const x = m.nextExam, open = state.fxOpen || null;
    const line = x ? `${esc(x.label || "Exams")} ${x.days === 0 ? "start today" : x.days === 1 ? "start tomorrow" : `in ${x.days} days`}` : "Just exam questions, one subject at a time";
    const mode = state.fxMode || "", year = state.fxYear || "";
    const chip = qq => qq.best ? `<span class="pp-chip${qq.best.a / Math.max(1, qq.best.b) >= 0.6 ? " good" : " mid"}">${qq.best.a}/${qq.best.b}</span>` : qq.v !== undefined ? `<span class="pp-chip${qq.v >= 1 ? " good" : " mid"}">${qq.v >= 1 ? "Got it" : "Tried"}</span>` : `<span class="pp-chip">Not tried</span>`;
    // One year's paper, as set: sections in order, each question opens straight into that question
    const sjOpen = open ? m.bySubject[open] : null;
    if (sjOpen && mode === "paper" && m.papers[open] && m.papers[open][year]) {
      const qs = m.papers[open][year], tried = qs.filter(q => q.v !== undefined), withMarks = tried.filter(q => q.best);
      const got = withMarks.reduce((t, q) => t + q.best.a, 0), of = withMarks.reduce((t, q) => t + q.best.b, 0);
      const parts = []; qs.forEach(q => { const last = parts[parts.length - 1]; if (!last || last.key !== q.part.toLowerCase()) parts.push({ key: q.part.toLowerCase(), name: q.part, sub: q.sub, qs: [q] }); else { last.qs.push(q); if (!last.sub && q.sub) last.sub = q.sub; } });
      return `<div class="pl fx">
        <div class="fx-top"><button type="button" class="hs-link" data-fx-back="papers">&larr; ${esc(sjOpen.title)} papers</button></div>
        <div class="ss-lead">${esc(sjOpen.title)} · ${esc(year)} paper</div>
        <span class="hs-sub" style="font-size:15px">The questions as they were set in the ${esc(year)} exam. In the real exam you choose which questions to answer, so start with chapters you've covered. Tap a question to answer it. It's marked like the real exam.</span>
        <div class="fx-pstat"><b>${tried.length} of ${qs.length} tried</b>${of ? ` · ${got} of ${of} marks on those` : ""}</div>
        ${parts.map(pt => `<div class="fx-part"><h4>${esc(pt.name)}${pt.sub && !pt.name.toLowerCase().includes(pt.sub.toLowerCase()) ? ` · ${esc(pt.sub)}` : ""}</h4>${pt.qs.map(q => { const c = m.topics[q.topic_id]; const notYet = c && c.stage === "none";
          return `<button type="button" class="fx-q${notYet ? " later" : ""}" data-fx-q="${q.id}"><span class="fx-ql">${esc(q.label || "Question")}</span><span class="fx-ch-b"><span class="s">${c ? `${c.book ? esc(c.book) + " · " : ""}Ch ${esc(String(c.order_num ?? ""))}: ${esc(shortTitle(c.title))}` : ""} · ${q.marks} marks${notYet ? " · not started yet" : ""}</span></span>${chip(q)}</button>`; }).join("")}</div>`).join("")}
      </div>`;
    }
    const subs = m.subjects.map(sj => {
      const chs = sj.chapters.filter(c => c.exam && c.exam.n).sort((a, b) => (a.bookIdx || 0) - (b.bookIdx || 0) || (a.order_num || 0) - (b.order_num || 0));
      if (!chs.length) return "";
      const n = chs.reduce((t, c) => t + c.exam.n, 0), tried = chs.reduce((t, c) => t + c.exam.tried, 0);
      const best = chs.slice().sort((a, b) => b.exam.openMarks - a.exam.openMarks)[0];
      const years = Object.keys(m.papers[sj.id] || {}).sort().reverse();
      const isOpen = open === sj.id;
      let body = "";
      if (isOpen && !mode) {
        body = `<div class="fx-modes">
          ${years.length ? `<button type="button" class="fx-mode" data-fx-mode="papers"><b>Try an exam paper</b><span>A real past paper, as set · ${years.length > 1 ? `${years[years.length - 1]}–${years[0]}` : years[0]}</span></button>` : ""}
          <button type="button" class="fx-mode" data-fx-mode="topics"><b>Choose a topic</b><span>A more focused session on one chapter</span></button></div>`;
      } else if (isOpen && mode === "papers") {
        body = `<div class="fx-chs"><button type="button" class="hs-link fx-sub-back" data-fx-back="">&larr; Back</button>${years.map(y => { const qs = m.papers[sj.id][y], t = qs.filter(q => q.v !== undefined).length;
          return `<button type="button" class="fx-ch" data-fx-year="${y}"><span class="fx-ch-b"><span class="t">${y} paper</span><span class="s">${plural(qs.length, "question", "questions")}${t ? ` · you've tried ${t}` : ""}</span></span><span class="hs-chev" aria-hidden="true">›</span></button>`; }).join("")}</div>`;
      } else if (isOpen && mode === "topics") {
        body = `<div class="fx-chs"><button type="button" class="hs-link fx-sub-back" data-fx-back="">&larr; Back</button>
          ${best && best.exam.openMarks ? `<button type="button" class="hs-btn fx-best" data-fx-ch="${best.id}">Start with ${esc(shortTitle(best.title))} <span>· most marks to win</span></button>` : ""}
          ${chs.map(c => `<button type="button" class="fx-ch" data-fx-ch="${c.id}"><span class="fx-ch-b"><span class="t">${c.book ? esc(c.book) + " · " : ""}Ch ${esc(String(c.order_num ?? ""))}: ${esc(shortTitle(c.title))}</span><span class="s">${plural(c.exam.n, "question", "questions")}${c.exam.open ? ` · ${c.exam.openMarks} marks to win` : " · all done"}</span></span><span class="hs-chev" aria-hidden="true">›</span></button>`).join("")}</div>`;
      }
      return `<div class="fx-subj${isOpen ? " open" : ""}">
        <button type="button" class="fx-sh" data-fx-subj="${sj.id}" aria-expanded="${isOpen}"><span><b>${esc(sj.title)}</b><span class="s">${plural(n, "exam question", "exam questions")} · ${tried} tried</span></span><span class="hs-chev" aria-hidden="true">${isOpen ? "&#709;" : "›"}</span></button>
        ${body}
      </div>`;
    }).join("");
    const mem = memoryItem(m);
    const memHtml = mem ? (() => { const c = m.topics[mem.topic_id]; return `<button type="button" class="fx-mem" data-fx-mem><span class="fx-ch-b"><span class="ss-k">Memory check due</span><span class="t">${esc(subjOf(m, c))} · ${esc(shortTitle(c.title))}</span><span class="s">A ${mem.marks}-mark question from memory · about ${mem.mins} min</span></span><span class="hs-chev" aria-hidden="true">›</span></button>`; })() : "";
    return `<div class="pl fx">
      <span class="ss-k">Exam focus</span>
      <div class="ss-lead">${line}</div>
      <span class="hs-sub" style="font-size:15px">Pick a subject, then try a real exam paper or choose a topic for a more focused session.</span>
      ${memHtml}
      <div class="fx-list">${subs || `<span class="hs-sub">No exam questions yet.</span>`}</div>
    </div>`;
  }

  // ---- homepage ----
  function renderHome(view, m, { profile, openChapter, openSubject, state, sb, reload, openSettings }){
    addCss();
    const w = m.week;
    const hour = new Date().getHours();
    const cele = window.Decor && m.goal ? Decor.celebration(m.goal) : null;
    const hello = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
    const letters = ["M","T","W","T","F","S","S"], todayKey = dayKey(new Date());
    const dots = letters.map((l, i) => {
      const d = new Date(w.ws.getTime() + i * DAY), k = dayKey(d);
      return `<span class="hc-day${w.days.has(k) ? " on" : ""}${k === todayKey ? " today" : ""}"><i></i>${l}</span>`;
    }).join("");
    const rev = revisionList(m);
    const best = rev[0] || null;
    const rest = rev;
    const showAll = state && state.homeShowAll;
    const subjTitle = id => (m.bySubject[id] || {}).title || "";
    const weekOpen = state && state.weekOpen;
    const chips = m.subjects.map(s => {
      const b = subjectBar(s.chapters);
      return `<button type="button" class="hc-chip" data-subject="${s.id}"><b>${esc(s.title)}</b>${b.bar}</button>`;
    }).join("");
    const bestNote = best ? [subjTitle(best.subject_id), best.flag && best.flag.note ? best.flag.note : "", best.line].filter(Boolean).join(" · ") : "";
    const row = c => `<button type="button" class="hc-row" data-open="${c.id}" data-tab="${TAB_FOR[c.stage]}">
        <span class="hc-row-b"><span class="hc-row-t">${esc(shortTitle(c.title))}</span><span class="hc-row-s">${esc(subjTitle(c.subject_id))}${c.book ? " " + esc(c.book) : ""} · ${esc(c.flag && c.flag.note ? c.flag.note : stepLevel(c)[1].toLowerCase())}</span></span>
        ${stepsArrows(c)}<span class="hs-chev" aria-hidden="true">›</span></button>`;
    const goalMin = m.goal ? m.goal.minutes : DAILY_GOAL, todayMin = m.goal ? m.goal.today : 0;
    const focusOn = !!(m.focus && m.focus.on);
    if (state) state.examFocus = focusOn;
    document.body.classList.toggle("exam-focus", focusOn);
    view.innerHTML = `<div class="hs hc">
      <div class="hc-top">
        <div class="hc-hello"><h2>${hello}, ${esc(profile.name)}</h2><span>${m.goal && m.goal.streakNow ? `${plural(m.goal.streakNow, "day", "days")} in a row · ` : ""}${goalMin} minutes of testing a day</span></div>
        <div class="hc-meta">
          <button type="button" class="fx-toggle${focusOn ? " on" : ""}" role="switch" aria-checked="${focusOn}" data-fx-toggle><span class="fx-track" aria-hidden="true"><i></i></span><span>Exam focus${focusOn ? " on" : ""}</span></button>
          <button type="button" class="hs-link hc-weeklink" data-week aria-expanded="${!!weekOpen}">This week: ${hm(w.testSec)} testing</button>
        </div>
      </div>
      ${focusOn ? focusHtml(m, state || {}) : `${focusPrompt(m)}${Object.keys(m.topics).length ? `<div id="todaySession"></div>` : ""}`}
      ${weekOpen ? `<div class="hc-week">
        <div class="hc-days" aria-label="Days studied this week">${dots}</div>
        <div class="hc-stats">
          <div><b>${hm(w.testSec)}</b><span>testing myself</span></div>
          <div><b>${w.learnMin ? "about " + hm(w.learnMin * 60) : "0 m"}</b><span>learning</span></div>
          <div><b>${w.answered}</b><span>questions answered</span></div>
          <div><b>${w.fixed}</b><span>answers fixed</span></div>
        </div>
        ${m.goal ? `<span class="hc-goal">${esc(m.goal.streakRule)}. Today: ${m.goal.today} of ${m.goal.minutes} minutes.${window.Decor ? (() => { const n = Decor.nextUp(m.goal)[0]; return n ? ` Next reward: ${n.name} (${n.have} of ${n.need} ${n.unit}).` : ""; })() : ""}</span>` : ""}</div>` : ""}
      ${!focusOn && cele ? `<div class="hc-cele"><span class="hc-cele-b"><b>Reward earned for ${esc(cele.why[cele.why.length - 1])}!</b><span>Choose one for your page${cele.left > 1 ? ` (${cele.left} to choose)` : ""}.</span></span><span class="hc-cele-btns"><button type="button" class="hs-btn" data-spend="sticker">+1 sticker</button><button type="button" class="hs-btn" data-spend="writing">+1 writing</button><button type="button" class="hs-btn" data-spend="photo">+1 photo</button></span></div>` : ""}
      ${focusOn ? "" : `<div class="hc-card">
        <h3 style="margin:0;font-size:19px">Or choose yourself</h3>
        ${m.subjects.length ? `<div class="hc-sec"><span class="hc-label">Pick a subject</span><div class="hc-chips">${chips}</div></div>` : `<div class="hs-empty">No subjects yet.</div>`}
        ${rest.length ? `<div class="hc-sec"><span class="hc-label">My revision list</span>
          <div class="hc-list">${rest.slice(0, showAll ? rest.length : 3).map(row).join("")}</div>
          ${rest.length > 3 ? `<button type="button" class="hs-link" style="align-self:flex-start" data-all>${showAll ? "Show fewer" : `See all ${rest.length}`}</button>` : ""}</div>` : ""}
      </div>
      <div class="qa" id="quickAdd"></div>`}
    </div>`;
    view.querySelectorAll("[data-subject]").forEach(b => b.onclick = () => openSubject(b.dataset.subject));
    view.querySelectorAll("[data-open]").forEach(b => b.onclick = () => { const c = m.topics[b.dataset.open]; openChapter(c.id, c.subject_id, b.dataset.tab); });
    const again = () => renderHome(view, m, { profile, openChapter, openSubject, state, sb, reload, openSettings });
    const all = view.querySelector("[data-all]"); if (all) all.onclick = () => { state.homeShowAll = !showAll; again(); };
    view.querySelector("[data-week]").onclick = () => { state.weekOpen = !weekOpen; again(); };
    view.querySelectorAll("[data-spend]").forEach(b => b.onclick = async () => { b.disabled = true; await Decor.spend(sb, b.dataset.spend); if (openSettings) openSettings(); });
    const qaBtn = view.querySelector("[data-qa]"); if (qaBtn) qaBtn.onclick = () => { state.qaOpen = true; again(); const i = view.querySelector("#quickAdd input"); if (i) i.focus(); };
    view.querySelectorAll("[data-today]").forEach(td => td.onclick = () => { const c = m.topics[td.dataset.today]; state.todayRun = c.id; openChapter(c.id, c.subject_id, "test"); });
    // exam focus controls
    const setFocus = (f) => { m.focus = f; saveFocus(sb, profile, f); again(); window.scrollTo({ top: 0 }); };
    view.querySelectorAll("[data-fx-on]").forEach(b => b.onclick = () => setFocus({ ...(m.focus || {}), on: true, since: isoDay(new Date()) }));
    const later = view.querySelector("[data-fx-later]"); if (later) later.onclick = () => setFocus({ ...(m.focus || {}), on: false, snooze: isoDay(new Date(Date.now() + 3 * DAY)) });
    const tg = view.querySelector("[data-fx-toggle]"); if (tg) tg.onclick = () => focusOn
      ? setFocus({ ...(m.focus || {}), on: false, dismissed: m.nextExam ? m.nextExam.iso : null })
      : setFocus({ ...(m.focus || {}), on: true, since: isoDay(new Date()) });
    view.querySelectorAll("[data-fx-subj]").forEach(b => b.onclick = () => { state.fxOpen = state.fxOpen === b.dataset.fxSubj ? null : b.dataset.fxSubj; state.fxMode = ""; state.fxYear = ""; again(); });
    view.querySelectorAll("[data-fx-mode]").forEach(b => b.onclick = () => { state.fxMode = b.dataset.fxMode; again(); });
    view.querySelectorAll("[data-fx-year]").forEach(b => b.onclick = () => { state.fxMode = "paper"; state.fxYear = b.dataset.fxYear; again(); window.scrollTo({ top: 0 }); });
    view.querySelectorAll("[data-fx-back]").forEach(b => b.onclick = () => { state.fxMode = b.dataset.fxBack; state.fxYear = ""; again(); });
    view.querySelectorAll("[data-fx-q]").forEach(b => b.onclick = () => { const qs = (m.papers[state.fxOpen] || {})[state.fxYear] || []; const q = qs.find(x => x.id === b.dataset.fxQ); const c = q && m.topics[q.topic_id]; if (!c) return; state.paperRun = { topic: c.id, qid: q.id }; openChapter(c.id, c.subject_id, "refresh"); });
    view.querySelectorAll("[data-fx-ch]").forEach(b => b.onclick = () => { const c = m.topics[b.dataset.fxCh]; state.examRun = c.id; openChapter(c.id, c.subject_id, "refresh"); });
    const fm = view.querySelector("[data-fx-mem]"); if (fm) fm.onclick = () => { const it = memoryItem(m); const c = m.topics[it.topic_id]; state.memoryRun = { topic: c.id, qid: it.qid, origin: it.origin, days: it.days }; openChapter(c.id, c.subject_id, "refresh"); };
    if (view.querySelector("#todaySession")) mountSession(view.querySelector("#todaySession"), m, { profile, openChapter, state, again });
    if (sb && view.querySelector("#quickAdd")) mountQuickAdd(view.querySelector("#quickAdd"), m, { sb, profile, reload, state });
  }

  // ---- subject page: a smart list that shows what matters now ----
  function rangeText(chs){
    const nums = chs.map(c => c.order_num).filter(n => n != null);
    const contiguous = nums.length === chs.length && nums.every((n, i) => i === 0 || n === nums[i-1] + 1);
    if (contiguous && nums.length > 1) return `Chapters ${nums[0]}–${nums[nums.length-1]}`;
    if (contiguous && nums.length === 1) return `Chapter ${nums[0]}`;
    return plural(chs.length, "chapter", "chapters");
  }
  function renderSubject(view, m, subjectId, { sb, profile, openChapter, goHome, reload, state }){
    addCss();
    const s = m.bySubject[(m.groupOf && m.groupOf[subjectId]) || subjectId];
    if (!s) { goHome(); return; }
    const chs = s.chapters.slice().sort((a, b) => (a.bookIdx || 0) - (b.bookIdx || 0) || (a.order_num || 0) - (b.order_num || 0));
    const isTested = c => c.done && (c.stage === "test" || c.stage === "refresh");
    const onTheGo = chs.filter(c => (c.stage !== "none" && !isTested(c)) || (c.flag && !isTested(c)));
    const tested = chs.filter(isTested);
    const reached = Math.max(-1, ...chs.map((c, i) => (c.stage !== "none" || c.flag) ? i : -1));
    const notStarted = chs.filter(c => c.stage === "none" && !c.flag);
    const comingUp = notStarted.filter(c => chs.indexOf(c) > reached).slice(0, 3);
    const later = notStarted.filter(c => !comingUp.includes(c));
    const open = state.subjectOpen = state.subjectOpen || {};
    const b = subjectBar(chs);

    const row = (c) => {
      const tag = isTested(c) ? "" : stepsMark(c);
      const classBtn = "";
      const note = c.flag && c.flag.note ? ` · ${esc(c.flag.note)}` : "";
      const on = !!c.flag;
      const mark = `<button type="button" class="hs-mark${on ? " on" : ""}" data-mark="${c.id}" aria-pressed="${on}" aria-label="${on ? "On your revision list. Tap to remove" : "Add to your revision list"}" title="${on ? "On your revision list" : "Add to your revision list"}">${BOOKMARK}</button>`;
      return `<div class="hs-rowwrap"><button type="button" class="hs-row${c.stage === "none" ? " dim" : ""}" data-open="${c.id}" data-tab="${TAB_FOR[c.stage]}">
        <span class="hs-num${isTested(c) ? " ok" : ""}">${isTested(c) ? "✓" : esc(String(c.order_num ?? "-"))}</span>
        <span class="hs-row-b"><span class="hs-row-t">${esc(shortTitle(c.title))}</span><span class="hs-row-s">${c.book ? esc(c.book) + " · " : ""}${esc(c.stage === "none" ? (comingUp.includes(c) ? "Coming up next" : "Not started") : c.line)}${note}</span>${classBtn ? `<span style="display:block;margin-top:6px">${classBtn}</span>` : ""}</span>
        ${tag}<span class="hs-chev" aria-hidden="true">›</span></button>${mark}</div>`;
    };
    const fold = (key, title, sub, list, icon) => {
      if (!list.length) return "";
      const isOpen = !!open[subjectId + key];
      return `<button type="button" class="hs-row hs-fold" data-fold="${key}" aria-expanded="${isOpen}">
          <span class="hs-num${icon === "✓" ? " ok" : ""}">${icon}</span>
          <span class="hs-row-b"><span class="hs-row-t" style="font-size:16px">${esc(title)}</span><span class="hs-row-s">${esc(sub)}</span></span>
          <span class="hs-show">${isOpen ? "Hide" : "Show"}</span></button>${isOpen ? list.map(row).join("") : ""}`;
    };
    const opensSoon = s.exam ? (() => { const d = parseDate(s.exam.exam_date); return d ? `Exam prep from ${fmtDate(new Date(d - REFRESH_DAYS * DAY))}` : ""; })() : "";
    const testedSub = tested.some(c => c.stage === "refresh") ? "Exam ready" : (opensSoon || "Well done");
    let listHtml = "";
    listHtml += fold("tested", `${rangeText(tested)} · ${tested.length === 1 ? "tested" : "all tested"}`, testedSub, tested, "✓");
    if (onTheGo.length) listHtml += `<span class="hs-group">On the go</span>` + onTheGo.map(row).join("");
    if (comingUp.length) listHtml += `<span class="hs-group">Coming up</span>` + comingUp.map(row).join("");
    listHtml += fold("later", `${rangeText(later)}`, later.length && comingUp.length ? "Later in the year" : "Start any time", later, "…");

    view.innerHTML = `<div class="hs">
      <button type="button" class="hs-back" data-home>← Home</button>
      <h1>${esc(s.title)}</h1>
      <div style="display:flex;flex-direction:column;gap:8px">${b.bar}<span class="hs-sub" style="font-size:16px">${esc(b.parts.length ? b.parts.join(" · ") : "Pick a chapter to start")}</span></div>
      <div id="hsExam"></div>
      <div class="hs-head"><h3>Chapters</h3></div>
      ${chs.length ? `<div class="hs-list"><span class="hs-markkey"><span class="hs-mark on">${BOOKMARK}</span>Tap the bookmark to add a chapter to your revision list</span>${listHtml}</div>` : `<div class="hs-empty">No chapters yet.</div>`}
    </div>`;
    examBox(view.querySelector("#hsExam"), { sb, profile, subjectId: (s.members || [s.id])[0], subjectIds: s.members || [s.id], exam: s.exam, onChange: () => reload() });
    view.querySelector("[data-home]").onclick = goHome;
    view.querySelectorAll("[data-fold]").forEach(b2 => b2.onclick = () => { open[subjectId + b2.dataset.fold] = !open[subjectId + b2.dataset.fold]; renderSubject(view, m, subjectId, { sb, profile, openChapter, goHome, reload, state }); });
    view.querySelectorAll("[data-mark]").forEach(el => el.addEventListener("click", async () => {
      const id = el.dataset.mark, on = el.getAttribute("aria-pressed") === "true";
      el.disabled = true; el.classList.toggle("on", !on); el.setAttribute("aria-pressed", String(!on));
      try {
        if (on) await sb(`topic_flags?topic_id=eq.${id}&profile_id=eq.${profile.id}`, { method: "DELETE", prefer: "return=minimal" });
        else await sb("topic_flags", { method: "POST", prefer: "resolution=merge-duplicates,return=minimal", body: [{ topic_id: id, profile_id: profile.id, flag_type: "revise", note: "", updated_at: new Date().toISOString() }] });
      } catch (e) {}
      reload();
    }));
    view.querySelectorAll("[data-classdone]").forEach(el => {
      const act = async (e) => { e.stopPropagation(); e.preventDefault(); el.textContent = "Saving…"; await markClassDone(sb, profile, el.dataset.classdone, true); reload(); };
      el.addEventListener("click", act);
      el.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") act(e); });
    });
    view.querySelectorAll("[data-open]").forEach(b2 => b2.addEventListener("click", (e) => { if (e.target.closest("[data-classdone]")) return; openChapter(b2.dataset.open, subjectId, b2.dataset.tab); }));
  }

  window.Stages = { ago, leftOff, nextUp, sessionNext, ringSvg, DAILY_GOAL, loadOverview, buildModel, renderHome, renderSubject, chapterStage, statusLine, examBox, markClassDone, startFresh, parseDate, fmtDate, untilText, REFRESH_DAYS, PRACTICE_TITLES, addCss };
})();
