# Study Portal notes

- daniel.html and annabel.html are the same page for two students; keep them in sync (only the title, profile id,
  name, avatar letter and --profile colour differ).
- The shared scripts (theme, stickers, rewards, stages, practice, tutor, notes .js) are loaded with a `?v=` stamp in both
  HTML files. Whenever you change any of those .js files, bump the stamp in BOTH files (e.g. `?v=20261022b` -> `?v=20261023a`)
  so browsers don't keep running the old version.
- Exam question layouts live in quiz_questions.display (line markers: `??` question, `##` source section,
  `[[img: qimg/<file> | description | big]]` picture, `| a | b |` table rows). Pictures are in /qimg.
- Warm-up questions: quiz_questions with qtype 'build', answer_kind 'sentence' (or 'word' + accept), derived_from = the
  exam question id, ids '<exam id>-w1'…. One per marking-scheme point, written from the marking scheme. They are kept out of
  quick tests, stages.js and the tutor (`qtype=neq.build`). They run from the chapter's Warm up tab (shown only when
  the chapter has warm-ups) or "Warm up first" on the exam question. Short answers (answer_kind set) show the answer only:
  no "try again" or "see a good answer"; a wrong one comes back once at the end of the set.
  Pilots: Daniel's Economics Ch 3 (12 past paper questions, 58 warm-ups); Annabel's Science Ch 39 Water and Carbon
  Cycles (5 exam questions, 29 warm-ups).
