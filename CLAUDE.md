# The Corporate Supplier Sustainability Portal 2026

## Identity
A public single-page portal that onboards Tier 1 suppliers into The Corporate's ESRS-aligned sustainability assessment and lets them submit through three doors inside the portal: an EcoVadis scorecard form, a guided seven-section questionnaire, or an upload of the completed Excel workbook.
Tier: 1 — public page, no login, no database; supplier input lives in browser memory for the session and is discarded on tab close (D2+A1)
Spec version governed: v2.0 — the version of docs/product-spec.md these rules were derived from.
Position: Standalone
Build constraint: this version stores nothing and sends nothing. It exists to validate the submission experience with The Corporate's internal EHS and Procurement teams. Never describe it as production-ready, and never imply in UI copy that data is saved, received, or retained.

## Session Protocol
At the start of every session:
1. Pull the latest from main before reading anything else.
2. Check docs/product-spec.md: if its version is newer than the "Spec version governed" line in this file, STOP. Tell the builder: "The spec has changed since this CLAUDE.md was written — re-run the Project Governor on the revised spec before building, or these rules may contradict it." Do not build against a stale CLAUDE.md.
3. Read PROGRESS.md in the project root — it is the current state of this build. If it is missing, recreate it with the structure at the end of this section, then continue.
4. Increment the session number and update the date in PROGRESS.md.
5. If "Notes for next session" has content: repeat the notes back to the builder, treat them as this session's priorities, then clear the section.
6. If this is session 1, run First Session Setup below before any build work.

Save point — after completing any module, feature, or fix:
1. Update PROGRESS.md: current state, remaining work, build decisions, known issues.
2. Commit and push to main.
3. Tell the builder in one line: "Save point committed: [what changed]."
Do not start the next piece of work before the save point is pushed. Never end a session without one — an ending session is a save point.

First Session Setup (session 1 only):
1. Create docs/ and move product-spec.md into it.
2. Install the brand skill: create .claude/skills/the-corporate-brand/ and place the provided brand file there as SKILL.md (add minimal name/description frontmatter if it has none).
3. Announce what moved, then commit and push before building anything.

PROGRESS.md structure (for the recreate rule): status header (Session / Last updated / Live URL), Current state, Last session (3–5 lines, replace each session), Remaining work (shrinking checklist), Build decisions (one line each), Known issues, Notes for next session.

## Commands
```
npx serve .
```

## Tech Stack
HTML · CSS · JavaScript · Netlify. Deployment: GitHub → Netlify, auto-deploys from main. Netlify MCP is active — create the site and deploy via MCP. Do not migrate this tool to React. The v1.0 landing page exists as built, brand-verified HTML and CSS: extend it, never rebuild it. The four new views may be show/hide sections in the same page or additional static pages sharing the stylesheet — your choice, but the v1.0 markup and CSS survive either way.
SheetJS (xlsx) loads from a CDN and parses the uploaded workbook entirely in the browser — no account, no key, no server call.

## Arms
Export — browser only, no server function — serves /assets/The_Corporate_Supplier_Questionnaire_2026.xlsx unmodified. Not generated, not populated, not altered.

## Hard Rules
- Nothing is stored and nothing is transmitted. Never introduce a serverless function, form handler, Netlify Form, third-party embed, or any endpoint carrying supplier input off the device. This is the build constraint, not a preference.
- The SheetJS CDN request is permitted and expected. Acceptance criterion 19 tests only for outbound requests carrying supplier input — a CDN script fetch carries none. Do not strip the library to satisfy that criterion, and do not report it as a violation.
- The email arm is off deliberately. No email is sent by any route under any condition. The existing mailto: link to the EHS Help Desk stays — it opens the user's own client and is not email sent by the tool.
- Browser storage (localStorage, sessionStorage, IndexedDB, cookies) is never used to persist answers between refreshes. Explicitly declined; the unsaved-progress warning covers it.
- No API keys and no environment variables exist for this tool. If a step appears to need one, that step is out of scope — stop and ask.

## Brand
Brand is governed by the the-corporate-brand skill at .claude/skills/the-corporate-brand/SKILL.md (installed in First Session Setup). Invoke it for any UI or visual work, including all four new views.
Hard rules that hold even if the skill is not loaded:
- Fonts: Playfair Display headings, DM Sans 300 body, DM Sans 500 labels — Google Fonts CDN, no other families. Colours: Ink #000000, Stone #B6B09F, Linen #EAE4D5, Chalk #F2F2F2, White #FFFFFF, Acid Lime #C8F135 — no browser or framework defaults.
- Acid Lime: two uses per page maximum, always against #000000, never on a light background. The landing page has already spent both — the Supplier Programme 2026 pill and the timeline step numbers. Add none to that page.
- Square corners (border-radius: 0) and no shadows on every button, card, and input. Cards take a 0.5px Stone border. No blue links, no blue focus rings — underline plus Ink only.
- Copy follows The Corporate voice: short declarative sentences, active voice, no exclamation points, no emoji.

## Business Rules
- Extend the landing page, do not rebuild it. Only the Two Routes section changes; hero, stats row, Why We Are Asking, What Happens Next, Key Resources, and footer render exactly as in v1.0.
- Two Routes section: Card 1's "Submit EcoVadis Scorecard" opens View 2 in the portal and must not open ecovadis.com or otherwise leave the site. Card 2 carries three controls — "Fill in the portal" → View 3, "Upload completed file" → View 4, "Download Assessment" → the XLSX, styled secondary to the other two. No copy anywhere may still instruct suppliers to return the file by email.
- Scorecard issue date must fall within the 12 months preceding today. Outside that window or in the future produces an inline message and blocks submission. This is the only rule in the tool that rejects an otherwise complete input.
- The guided questionnaire renders all 7 sections, 30 questions, and 90 inputs — Supplier Response, Notes / Evidence, and a Status dropdown (Not Started / In Progress / Complete / N/A / EcoVadis Bypass) on every question — in workbook order, with question text and ESRS references exactly as written in docs/product-spec.md. Nothing invented, reworded, reordered, or omitted.
- Three workbook exceptions: rows 8 and 9 render as ordinary questions and drive no behaviour — never add EcoVadis skip logic, all seven sections are always walked; row 12 renders as a number field, not the source file's verification-method dropdown, which is an error; row 19 shows its PFAS auto-flag note as static helper text with no flagging behaviour built.
- No questionnaire field is required; blanks are allowed and display as blank in the recap. The unsaved-progress warning appears on all seven sections and the declaration step, is prominent, and is not dismissible.
- Upload validation is all-or-nothing: accept only .xlsx or .csv containing all seven column headers, all seven section headings, and all thirty question rows in spec order matched on question text. Any failure rejects the file outright with exactly "File format doesn't match — Download the Excel file" — no partial import, no salvaged rows, no list of what was missing. Do not soften this; a lenient parser silently drops supplier answers.
- The confirmation view shows "Successfully submitted" plus a read-only recap. No reference number, no download of the submission, no email, no claim that a record has been stored or that anyone will be in touch.
- Views 2, 3, and 4 load normally with empty forms if opened directly by URL; no state carries over. The two Key Resources document URLs remain unresolved — leave them as `#` and flag to the builder.

Out of scope — do not build:
- Any persistence: database storage, submissions reaching The Corporate, browser-saved progress between refreshes (explicitly declined), supplier login
- Any downstream tooling or notification: internal review dashboard, submission tracker, PFAS auto-flag review workflow, automated EcoVadis validation, email on submission or download
- On the confirmation view: reference or submission number, download of the completed submission. In the guided questionnaire: EcoVadis bypass branching, required-field enforcement

## Reference Docs
Read before building the related part:
- docs/product-spec.md — the full 30-question inventory with row numbers and ESRS references, all five view specifications, the three logic rules, and the 22 acceptance criteria
- /assets/The_Corporate_Supplier_Questionnaire_2026.xlsx — open and verify the question inventory against the spec before building View 3
- .claude/skills/the-corporate-brand/SKILL.md — full brand system
PROGRESS.md in the root is read at every session start per the Session Protocol.
