# PROGRESS — The Corporate Supplier Sustainability Portal 2026

> Claude Code: read this file at the start of every session, before touching
> anything. Update it at every save point. Replace content, do not append.
> History lives in git.

**Session:** 0 — build not started
**Last updated:** 7 September 2026 — by Project Governor, pre-build
**Live URL:** none yet [Rule: fill in after the first successful deploy]

## Current state
The v1.0 landing page exists as built HTML, `supplier_onboarding.html`: static, two route cards, EcoVadis button pointing off-site, standalone Excel download, no user input. Its structure and content are reused; its stylesheet is discarded. Views 2 to 6 do not exist. No build session has run under any spec version. Repo contains CLAUDE.md, PROGRESS.md, product-spec.md (v2.1), supplier_onboarding.html, and The_Corporate_Supplier_Questionnaire_2026.xlsx. No brand skill file in this build.
[Rule: this section describes what exists and works right now, never what is planned. Completed checklist items get absorbed here in compressed form.]

## Last session
None — the first build session has not happened yet.
[Rule: 3–5 lines maximum. Replace each session: what was built, changed, or fixed.]

## Remaining work
- [ ] First Session Setup: create docs/, move reference files, commit (see CLAUDE.md Session Protocol). No brand skill to install.
- [ ] Builder: decide the cell E12 workbook correction, or consciously decline it (spec Section 15). The tool renders row 12 as a number field either way; the workbook needs the fix so downloads and uploads stay consistent.
- [ ] Open The_Corporate_Supplier_Questionnaire_2026.xlsx and verify the 28-question inventory against spec Section 8 before building View 4
- [ ] Replace the stylesheet: apply the Inter type scale, the #111111 / #555555 / #BC2D2E / #FFFFFF palette, and the spacing rhythm across every retained v1.0 section. Remove all Playfair Display, DM Sans, Acid Lime, Ink, Stone, Linen and Chalk.
- [ ] Rewrite View 1 copy: the required Scope 3 sentence in Why We Are Asking, removal of the "This is driven by" sentence, and the gate question replacing the two route cards
- [ ] Build View 2 — Plan A: four fields plus required scorecard file upload, date and file validation
- [ ] Build View 3 — Plan B: choice between filling in the portal and download/upload, carrying the Download Template control
- [ ] Build View 4 — in-portal questionnaire: 5 steps, 28 questions, 84 inputs, five Environment sub-groups, persistent unsaved-progress warning, declaration step
- [ ] Build View 5 — upload: in-browser parse via SheetJS, all-or-nothing validation against the workbook's S1–S7 structure, review rendered in the ESG grouping
- [ ] Build View 6 — confirmation recap for all three paths, with no reference number and no download
- [ ] Wire Export: Download Template serves the unmodified XLSX from /assets/ in View 3 and View 5
- [ ] Local test pass: valid workbook upload, valid CSV upload, deliberately broken file, both gate answers, and a full pass through all five steps
- [ ] Em dash sweep: search all rendered copy and confirm zero em dash characters outside verbatim workbook question text (criterion 3)
- [ ] Verify criterion 23: inspect network traffic on all three paths and confirm no supplier input or uploaded file leaves the browser
- [ ] Acceptance criteria pass: verify all 27 criteria in spec Section 13 before deploy
- [ ] Builder: decide whether to password-protect the deployed URL before it goes live. The build constraint says this must not reach suppliers, and MCP deploys to a public URL by default.
- [ ] Deploy to Netlify via MCP
[Rule: completed items leave this list and are absorbed into Current state. This list only shrinks.]

## Build decisions
None yet.
[Rule: one line per decision made during the build that is not in the spec: copy drafted, field formats, naming choices, library picks. Future sessions depend on these to stay consistent.]

## Known issues
- Supplier Code of Conduct URL unresolved, carried over from v1.0, left as `#`
- Global Environmental Policy URL unresolved, carried over from v1.0, left as `#`
- Navigation logo retained from v1.0 and not restyled for the new brand; flagged for builder review
- Why We Are Asking body copy is drafted by Claude Code and needs builder review before deployment
- Typed-signature field in the declaration is assumed kept; builder may drop it as meaningless without real signature capture
- Cell E12 in the source workbook carries a verification-method dropdown where a tonnage belongs; the tool works around it, the file still needs fixing
- The downloadable workbook keeps S1 to S7 while the portal presents the ESG grouping. Both structures coexist by design in this build; reorganising the workbook is deferred.
- GDPR is not applicable only because nothing is transmitted or stored. This reverses the moment persistence is added: the next version needs a consent checkbox, a data statement at the point of collection, and a named deletion contact, and it will also store the uploaded scorecard file.
[Rule: bugs, edge cases, and deferred fixes. One line each. Remove when resolved.]

## Notes for next session
None.
[Rule: the builder writes here between sessions. Claude Code reads these aloud at session start, acts on them, then clears this section.]
