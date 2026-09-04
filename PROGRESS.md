# PROGRESS — The Corporate Supplier Sustainability Portal 2026

> Claude Code: read this file at the start of every session, before touching
> anything. Update it at every save point. Replace content — do not append.
> History lives in git.

**Session:** 1 — build complete, not yet deployed
**Last updated:** 4 September 2026 — Session 1
**Live URL:** none yet — Netlify MCP is not connected in this session; deploy is unblocked but not done. [Rule: fill in after the first successful deploy]

## Current state
All five views exist in `index.html` as show/hide sections sharing the v1.0 stylesheet, per spec v2.0. Hero, stats row, Why We Are Asking, What Happens Next timeline, Key Resources, and footer are byte-identical to v1.0 — only the Two Routes section changed. `docs/product-spec.md`, `.claude/skills/the-corporate-brand/SKILL.md`, and `/assets/The_Corporate_Supplier_Questionnaire_2026.xlsx` are in place from First Session Setup.

- **View 1 (landing):** Two Routes rebuilt as two always-visible cards (no gate question). Card 1 "Submit EcoVadis Scorecard" opens View 2 in-portal. Card 2 has three controls: "Fill in the Portal" → View 3, "Upload Completed File" → View 4, "Download Assessment" (ghost-styled, visually secondary) → `/assets/...xlsx`. No email-return copy anywhere. Added zero new Acid Lime usage — v1.0's existing uses (hero underline, hero bottom rule, timeline step number) are untouched and were not audited/reduced, per "extend, don't rebuild."
- **View 2 (EcoVadis):** 5 fields, inline validation (required, email format, URL format, scorecard date within the trailing 12 months and not in the future — the one rule that blocks an otherwise complete submission). Resets to blank on every entry into the view.
- **View 3 (guided questionnaire):** All 7 sections / 30 questions / 90 inputs built from a JS data model transcribed from and verified against `docs/product-spec.md` Section 8 and the workbook (openpyxl dump matched cell-for-cell, including data-validation dropdown lists). Row 8/9 render as ordinary questions with no bypass logic; row 12 is a number field; row 19 shows the PFAS auto-flag note as static helper text. Persistent, non-dismissible unsaved-progress banner. Step-by-step nav with no required-field enforcement. Declaration step (name, date, typed signature) submits to View 5. Rebuilds blank every time the view is entered.
- **View 4 (upload):** Accepts `.xlsx`/`.csv` only, ≤10 MB, via file picker or drag-drop. SheetJS (CDN, `cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js`) parses `.xlsx` client-side; a hand-written parser handles `.csv`. Both feed one shared row-matching validator (Rule 1): header row, then all 7 section headings and all 30 question rows must appear in order (extra/reordered surrounding rows are tolerated; a missing or reordered required row rejects the whole file). Pass → read-only recap grouped by section, blanks shown as blank, "Replace File" / "Submit". Fail → exact string "File format doesn't match — Download the Excel file", no partial import, resets to initial state. Resets to blank on every entry into the view.
- **View 5 (confirmation):** "Successfully submitted" + read-only recap for whichever door was used (EcoVadis fields, or section-grouped Q&A + declaration for the guided/upload doors). No reference number, no download, no stored-record claim, no email.
- Routing is hash-based (`#view-2`/`#view-3`/`#view-4`; confirmation has no hash, so it can't be reopened/bookmarked as if a record existed). Direct URL entry to any of the three loads that view fresh and empty. A `hashchange` listener keeps in-tab hash edits and back/forward navigation working, not just the initial load.
- Nothing is transmitted: no serverless function, form handler, or third-party endpoint exists anywhere in the codebase; the only outbound requests are the Google Fonts stylesheet and the SheetJS CDN script (both carry no supplier input).

## Last session
Session 1: ran First Session Setup, then built Views 2–5 and the revised Two Routes section, wired the Export arm, and tested locally with Playwright (Chromium) end to end — landing → each door → confirmation; EcoVadis date validation (too-old, valid); questionnaire full 7-section + declaration walk with a real submitted recap; upload with a valid `.xlsx`, a valid CSV export, a broken file (missing question row), a wrong file type, and an oversized file; direct-URL loads of views 2–4; network-request capture during all three submissions. Found and fixed two real bugs surfaced by testing: hash-only navigation didn't re-route (added a `hashchange` listener), and re-entering a door mid-session without a full reload could show a previous attempt's stale answers (each door now resets to blank on every entry, not just on first load). Also independently unit-tested the Rule 1 matching/validation logic in Node against rows read from the actual workbook via openpyxl, bypassing the browser entirely, to pin down the algorithm before/alongside the browser tests.

## Remaining work
- [ ] Builder: decide the cell E12 workbook correction — fix the dropdown to allow a tonnage, or consciously decline it (spec Section 15). The tool renders row 12 as a number field either way; the workbook itself still needs the fix so uploads and downloads stay consistent.
- [ ] Builder: the two Key Resources document links (Supplier Code of Conduct, Global Environmental Policy) remain `#` — unresolved since v1.0, no real URLs supplied yet.
- [ ] Builder: decide whether to password-protect the deployed URL (Netlify access control) before it goes live — the build constraint says this must not reach suppliers.
- [ ] Deploy to Netlify. **Netlify MCP was not connected in this session** (no `mcp__netlify__*` tools were available), so deploy could not be done here despite CLAUDE.md/spec assuming it's active — connect it and deploy in a future session, or deploy manually.
- [ ] After deploy: reload the live URL and re-check the Excel download, all three doors, and mobile layout against the real hosted assets (local testing used a local static server; CDN font/script loads are confirmed correct by inspection and a local mirror test, not by the actual deployed page).
[Rule: completed items leave this list and are absorbed into Current state. This list only shrinks.]

## Build decisions
- Renamed `supplier-onboarding-V1.html` → `index.html` (content unchanged at rename) so Netlify serves it at the site root; content extended after the rename.
- Built Views 2–5 as show/hide sections in `index.html` (not separate pages), sharing the one stylesheet, per the spec's "Claude Code's choice."
- Routing is `location.hash`-based (`#view-2/3/4`) with a `hashchange` listener; View 5 intentionally has no hash so a completed submission can't be reopened by URL as if a record existed.
- SheetJS pinned at `0.18.5` (the last version published to npm/mirrored on cdnjs) via `https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js`.
- Upload validation (Rule 1) matches the header row, then walks the file top to bottom locating the 7 section headings and 30 question rows in order; rows before/between/after the required ones are ignored rather than causing rejection, so a supplier's incidental extra rows or blank spacer rows don't break an otherwise-valid file. A missing, renamed, or reordered required row still rejects the whole file with no partial import, per Rule 1's rationale.
- `.xlsx` and `.csv` uploads are validated by one shared row-matching function; `.xlsx` rows come from `XLSX.utils.sheet_to_json(ws, {header:1})`, `.csv` rows from a hand-written quote-aware CSV parser (no library needed for CSV per the spec).
- Declaration values on upload (Signatory Name / Date / Signature) are read from row 43, columns E/F/G — the same cells the workbook's declaration labels occupy, since suppliers fill these in over the label text.
- Two Routes card badges use Ink/Chalk/Stone, not Acid Lime, to stay inside the landing page's already-spent 2-use lime budget (hero underline, hero bottom rule, timeline step number) — no new lime added anywhere in Views 2–5 either.
- Testing note for future sessions: this session's sandbox blocks `cdnjs.cloudflare.com` and is flaky on `fonts.googleapis.com` at the network-policy level (unrelated to the deployed site — real visitor browsers reach both directly). Local testing of the SheetJS-dependent upload path used a local mirror of `xlsx.full.min.js` copied from the npm package of the same version; the shipped `index.html` still references the real CDN URL.

## Known issues
- Supplier Code of Conduct URL unresolved — carried over from v1.0, left as `#`
- Global Environmental Policy URL unresolved — carried over from v1.0, left as `#`
- Typed-signature field in the declaration is kept (typed name standing in for a signature, per spec) — builder may drop it as meaningless without real signature capture
- Cell E12 in the source workbook carries a verification-method dropdown where a tonnage belongs — the tool works around it by rendering row 12 as a number field regardless of source, but the workbook file itself still needs the fix so uploads/downloads stay consistent
- GDPR is not applicable only because nothing is transmitted or stored. This reverses the moment persistence is added — the next version's spec needs a consent checkbox, a data statement at the point of collection, and a named deletion contact.
- Not yet deployed — no live URL to verify criteria 21–22 (mobile/responsive and "deploys to Netlify") against a real hosted instance.
[Rule: bugs, edge cases, and deferred fixes. One line each. Remove when resolved.]

## Notes for next session
None.
[Rule: the builder writes here between sessions. Claude Code reads these aloud at session start, acts on them, then clears this section.]
