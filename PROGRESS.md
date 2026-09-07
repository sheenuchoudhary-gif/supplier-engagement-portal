# PROGRESS — The Corporate Supplier Sustainability Portal 2026

> Claude Code: read this file at the start of every session, before touching
> anything. Update it at every save point. Replace content, do not append.
> History lives in git.

**Session:** 1
**Last updated:** 7 September 2026
**Live URL:** none yet on `main`. Netlify is connected via a GitHub App
(not the Netlify MCP, which is not available in this Claude Code on the web
session) and is already building deploy previews automatically for
[PR #2](https://github.com/sheenuchoudhary-gif/supplier-engagement-portal/pull/2):
https://deploy-preview-2--supplier-engagement-portal-netlify.netlify.app.
A production URL will exist once this PR merges to `main`.

## Current state
The full v2.1 build is complete in `index.html`, a single page with six
show/hide views sharing one restyled stylesheet, deployable as a static site.

- **View 1, Landing:** v1.0 structure retained (nav, hero, stats, timeline,
  Key Resources, footer). Why We Are Asking rewritten with the required
  sentence and no "This is driven by" sentence. Two Routes replaced with the
  single gate question, "Do you have an EcoVadis scorecard?", Yes/No buttons
  of equal visual weight, no Download Template control on this page.
- **View 2, Plan A:** four required fields (company, contact, email,
  scorecard issue date) plus a required scorecard file upload (PDF/PNG/JPG,
  under 10 MB, filename and size read only, never parsed or transmitted). No
  scorecard link field. Date validated to the trailing 12 months, not future.
- **View 3, Plan B:** gate No lands here. Option 1 opens the guided portal
  questionnaire. Option 2 offers Download Template (unmodified asset) and
  Upload Completed Template.
- **View 4, Guided questionnaire:** 5 steps (Company Details 2, Environment
  21 across 5 labelled sub-groups, Social 3, Governance 2, Declaration 3
  fields) built from a portal question inventory transcribed from
  `docs/product-spec.md` Section 8 and cross-checked programmatically against
  every row of `assets/The_Corporate_Supplier_Questionnaire_2026.xlsx`, 28
  questions, 84 inputs (Supplier Response, Notes / Evidence, Status).
  Persistent, non-dismissible unsaved-progress warning on every step. Row 12
  renders as a number field per the workbook-error correction. Row 19 carries
  the PFAS auto-flag note as static helper text.
- **View 5, Upload:** SheetJS (.xlsx) and a hand-rolled CSV parser, both
  entirely in-browser. All-or-nothing validation against the workbook's own
  S1 to S7 structure (7 headers, 7 section headings, 30 rows including rows
  8 and 9), matched on verbatim workbook question text. Any mismatch rejects
  with exactly "File format doesn't match. Download the Excel file", no
  partial import. A passing file renders read only, grouped as Company
  Details / Environment / Social / Governance (rows 8 and 9 omitted from the
  review, as they are read only for validation).
- **View 6, Confirmation:** "Successfully submitted" plus the grouped recap
  for all three paths. No reference number, no download, no email claim.
- Brand: Inter throughout, tokens `#111111` / `#555555` / `#BC2D2E` /
  `#FFFFFF` only, type scale and spacing rhythm per spec Section 10. No
  Playfair Display, DM Sans, Acid Lime, or Ink/Stone/Linen/Chalk tokens
  remain anywhere in the codebase.
- `docs/product-spec.md` corrected to hold the actual v2.1 spec (a stale
  v2.0 copy had been left there; the v2.1 file had been uploaded to the repo
  root instead). The root duplicate was removed.

## Last session
Session 1 found `index.html` already built, but to the superseded v2.0 rules
(old Playfair/DM Sans brand, two route cards instead of a gate, EcoVadis link
field instead of a file upload, an ungrouped seven-section questionnaire).
Rebuilt the whole page to v2.1: new brand system, gate-based routing, Plan
A/Plan B structure, the 5-step ESG questionnaire, and workbook-accurate
upload validation. Verified the question inventory and the upload validator
against the actual xlsx (programmatic diff, zero mismatches across all 30
rows) and against a live browser (Playwright): full walkthroughs of Plan A,
Plan B guided, and Plan B upload (valid xlsx, valid CSV, two broken files)
all produced the expected result, with no console/page errors and no
horizontal overflow at 375px.

## Remaining work
- [ ] Builder: decide the cell E12 workbook correction, or consciously
      decline it (spec Section 15). The tool renders row 12 as a number
      field either way; the source workbook still carries the wrong
      dropdown, so downloads stay inconsistent with the portal until fixed.
- [ ] Merge PR #2 to `main` to get a production URL. Netlify is connected
      via GitHub (deploy previews are already building automatically per PR,
      confirmed green); the Netlify MCP tool itself was never needed.
- [ ] Once merged, click through the live site once, PR #2's deploy preview
      in particular: this sandbox's network policy blocks reaching any
      `netlify.app` host directly, so the live SheetJS `.xlsx` upload path
      could not be exercised from here (see Known issues).
- [ ] Acceptance criteria 26 (full manual pass on a real phone) and 27
      (post-deploy Netlify check) still need a human pass; everything else
      in Section 13 was verified this session (see Known issues for the one
      criterion that could not be verified from this sandbox).
- [ ] Builder: decide whether to password-protect the deployed URL before it
      goes live, per the build constraint that this must not reach suppliers.
[Rule: completed items leave this list and are absorbed into Current state. This list only shrinks.]

## Build decisions
- Portal question display text uses `docs/product-spec.md`'s wording for
  rows 12 and 40 (comma, not the workbook's em dash), per CLAUDE.md's rule
  that question text comes verbatim from the spec file. The upload validator
  separately matches against the workbook's own literal text (with its em
  dash) for those two rows, since that is what a genuine re-upload of the
  unmodified workbook will contain. Neither string reaches the rendered UI.
- Plan B's guided questionnaire and Plan B's upload review both render
  through one shared recap function, grouped Company Details / Environment
  (with its five sub-group labels) / Social / Governance, so the two paths
  stay visually and structurally identical.
- Nav and footer use the white background token throughout rather than
  reintroducing a dark band, since the brand section defines only the four
  listed tokens and names `#FFFFFF` as the page background.
- Gate buttons (Yes/No) are both rendered as plain black-outline buttons of
  identical size, not one filled with the accent, so neither answer reads as
  the preferred one, per "equal visual weight" and the accent's restriction
  to primary actions only.

## Known issues
- Netlify turns out to be connected via a GitHub App (not the Netlify MCP
  tool, which this Claude Code on the web session never had access to):
  PR #2 already has a green, working deploy preview at
  https://deploy-preview-2--supplier-engagement-portal-netlify.netlify.app.
  Merging that PR to `main` is what produces the production URL; no manual
  Netlify setup is actually needed.
- Acceptance criterion 23 (nothing transmitted) and the CDN-only requirement
  were verified by code inspection (no fetch/XHR/form-action/serverless code
  exists anywhere in the file) and by a live Playwright pass. The one CDN
  request that could not be exercised live from this sandbox is SheetJS
  itself: this session's outbound network policy blocks
  `cdnjs.cloudflare.com` (and, separately, every `netlify.app` host,
  including the deploy preview above), so the actual browser-side .xlsx
  upload path could not be click-tested here (Google Fonts loaded fine;
  the .xlsx parsing logic itself was independently verified against the
  real unmodified workbook via SheetJS in Node, and the CSV upload path,
  which shares the same validator and needs no CDN, was click-tested
  successfully in a real browser). Confirm the .xlsx upload on the deploy
  preview or the production URL, from a normal browser.
- Supplier Code of Conduct URL unresolved, carried over from v1.0, left as `#`.
- Global Environmental Policy URL unresolved, carried over from v1.0, left as `#`.
- Navigation logo retained from v1.0 (the plain "C" mark) and not otherwise
  redesigned for the new brand beyond recolouring; flagged for builder review.
- Why We Are Asking body copy is drafted by Claude Code and needs builder
  review before deployment.
- Typed-signature field in the declaration is kept, per spec Section 15;
  builder may still drop it as meaningless without real signature capture.
- Cell E12 in the source workbook carries a verification-method dropdown
  where a tonnage belongs; the tool works around it, the file still needs
  fixing if downloads and uploads are to stay consistent.
- The downloadable workbook keeps S1 to S7 while the portal presents the ESG
  grouping. Both structures coexist by design in this build.
- GDPR is not applicable only because nothing is transmitted or stored. This
  reverses the moment persistence is added: the next version needs a consent
  checkbox, a data statement at the point of collection, and a named
  deletion contact, and it will also store the uploaded scorecard file.

## Notes for next session
Netlify is connected via GitHub, not the Netlify MCP tool (which this
session never had access to and turned out not to need): PR #2 already has
a green deploy preview at
https://deploy-preview-2--supplier-engagement-portal-netlify.netlify.app.
Whoever picks this up next should: merge PR #2 to `main` for the production
URL, confirm the live site loads on desktop and mobile with the Excel
download and the .xlsx upload both working (this session could reach neither
`cdnjs.cloudflare.com` nor any `netlify.app` host to verify that last one
itself), then decide on password protection per the build constraint, and
record the live URL in this file's status header.
