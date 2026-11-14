# Study Portal notes

- daniel.html and annabel.html are the same page for two students; keep them in sync (only the title, profile id,
  name, avatar letter and --profile colour differ).
- The shared scripts (theme, stickers, rewards, stages, practice, tutor, notes .js) are loaded with a `?v=` stamp in both
  HTML files. Whenever you change any of those .js files, bump the stamp in BOTH files (e.g. `?v=20261022b` -> `?v=20261023a`)
  so browsers don't keep running the old version.
- Exam question layouts live in quiz_questions.display (line markers: `??` question, `##` source section,
  `[[img: qimg/<file> | description | big]]` picture, `| a | b |` table rows). Pictures are in /qimg.
- Quick questions (internally "warm-ups"): quiz_questions with qtype 'build', answer_kind 'sentence' (or 'word' + accept),
  derived_from = the exam question id(s) they build towards, comma-separated when one fact serves several questions
  (null for a chapter fact no exam question needs). ids '<exam id>-w1'… or '<chapter>-quick-N'. topic_label groups them.
  In a chapter that has any, the steps are: Learn -> Multiple choice (the Test tab: MCQs only) -> Quick questions (the
  warmup tab: builds + the chapter's recall questions) -> Exam questions. Every fact an exam question needs should be
  covered by BOTH an MCQ and a quick question, and every MCQ fact by a quick question; write each fact once per format
  (retire duplicates). Builds are kept out of stages.js and the tutor (`qtype=neq.build`). "Quick questions first" on an
  exam question runs just its own. Quick-question answers are never shown on the exam question. Short answers show the
  answer only; a wrong one comes back once at the end of the set, and second tries are saved (right on the second try
  leaves the Try Again list). The next question's answer box is focused automatically; MCQs answer with A-D or 1-4.
  Done: Annabel's Science Ch 39 (45 MCQ, 52 quick). Daniel's Economics Ch 3 has 79 builds but its MCQs do not yet cover them.
