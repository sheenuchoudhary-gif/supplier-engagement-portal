# PROGRESS — The Corporate Supplier Sustainability Portal 2026

> Claude Code: read this file at the start of every session, before touching
> anything. Update it at every save point. Replace content — do not append.
> History lives in git.

**Session:** 1 — build in progress
**Last updated:** 4 September 2026 — Session 1
**Live URL:** none yet [Rule: fill in after the first successful deploy]

## Current state
First Session Setup complete: `docs/` created and `product-spec.md` moved into it; `the-corporate-brand` skill installed at `.claude/skills/the-corporate-brand/SKILL.md`; `The_Corporate_Supplier_Questionnaire_2026.xlsx` moved to `/assets/`; the v1.0 landing page renamed from `supplier-onboarding-V1.html` to `index.html` (content untouched at rename time) so Netlify serves it at the site root. The 30-question inventory in the workbook was opened and verified cell-by-cell against product-spec.md Section 8 — exact match, including the E12 dropdown-vs-number discrepancy. Views 2 to 5 do not exist yet; the Two Routes section on the landing page is still the v1.0 gate-question/email version.
[Rule: this section describes what exists and works right now — never what is planned. Completed checklist items get absorbed here in compressed form.]

## Last session
Session 1: ran First Session Setup (docs/, brand skill, assets/, index.html rename) and verified the workbook against the spec. Proceeding to build Views 2–5 and the revised Two Routes section in this same session.
[Rule: 3–5 lines maximum. Replace each session — what was built, changed, or fixed.]

## Remaining work
- [ ] Builder: decide the cell E12 workbook correction — fix the dropdown to allow a tonnage, or consciously decline it (spec Section 15). The tool renders row 12 as a number field either way; the workbook needs the fix so uploads and downloads stay consistent.
- [ ] Extend View 1 — revise only the Two Routes section of the existing landing page; three controls on Card 2, EcoVadis button stays on site, no email copy anywhere
- [ ] Build View 2 — EcoVadis submission form, five required fields, scorecard date validation
- [ ] Build View 3 — guided questionnaire, 7 sections, 30 questions, 90 inputs, persistent unsaved-progress warning, declaration step
- [ ] Build View 4 — file upload, in-browser parse via SheetJS, all-or-nothing validation, read-only review
- [ ] Build View 5 — shared confirmation view with recap, no reference number, no download
- [ ] Wire Export: "Download Assessment" serves the unmodified XLSX from /assets/ on click
- [ ] Local test pass — valid workbook upload, valid CSV upload, deliberately broken file, and a full walkthrough of all seven sections plus the declaration
- [ ] Verify criterion 19 specifically — inspect network traffic during and after submission on all three doors and confirm no supplier input leaves the browser
- [ ] Acceptance criteria pass — verify all 22 criteria in spec Section 13 before deploy
- [ ] Builder: decide whether to password-protect the deployed URL (Netlify access control) before it goes live. The build constraint says this must not reach suppliers, and MCP deploys to a public URL by default.
- [ ] Deploy to Netlify via MCP
[Rule: completed items leave this list and are absorbed into Current state. This list only shrinks.]

## Build decisions
None yet.
[Rule: one line per decision made during the build that is not in the spec — prompt structures, field formats, naming choices, library picks. Future sessions depend on these to stay consistent.]

## Known issues
- Supplier Code of Conduct URL unresolved — carried over from v1.0, left as `#`
- Global Environmental Policy URL unresolved — carried over from v1.0, left as `#`
- Card 2 description copy still references returning the file by email — Claude Code drafts a replacement in The Corporate voice, builder reviews before deployment
- Typed-signature field in the declaration is assumed kept; builder may drop it as meaningless without real signature capture
- Cell E12 in the source workbook carries a verification-method dropdown where a tonnage belongs — the tool works around it, the file still needs fixing
- GDPR is not applicable only because nothing is transmitted or stored. This reverses the moment persistence is added — the next version's spec needs a consent checkbox, a data statement at the point of collection, and a named deletion contact.
[Rule: bugs, edge cases, and deferred fixes. One line each. Remove when resolved.]

## Notes for next session
None.
[Rule: the builder writes here between sessions. Claude Code reads these aloud at session start, acts on them, then clears this section.]
