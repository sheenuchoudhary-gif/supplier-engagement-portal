# The Corporate Supplier Sustainability Portal 2026

## Identity
A public portal that onboards Tier 1 suppliers into The Corporate's ESRS aligned sustainability assessment. A single gate question asks whether the supplier holds an EcoVadis scorecard. Yes goes to Plan A and submits scorecard details plus the scorecard file. No goes to Plan B, which offers the assessment in the portal or as a downloadable Excel template to complete offline and upload back.
Tier: 1, meaning a public page with no login and no database; supplier input lives in browser memory for the session and is discarded on tab close (D2+A1)
Spec version governed: v2.1, the version of docs/product-spec.md these rules were derived from.
Position: Standalone
Build constraint: this version stores nothing and sends nothing. It exists to validate the submission experience with The Corporate's internal EHS and Procurement teams. Never describe it as production ready, and never imply in interface copy that data is saved, received, or retained.

## Session Protocol
At the start of every session:
1. Pull the latest from main before reading anything else.
2. Check docs/product-spec.md: if its version is newer than the "Spec version governed" line in this file, STOP. Tell the builder: "The spec has changed since this CLAUDE.md was written. Re-run the Project Governor on the revised spec before building, or these rules may contradict it." Do not build against a stale CLAUDE.md.
3. Read PROGRESS.md in the project root. It is the current state of this build. If it is missing, recreate it with the structure at the end of this section, then continue.
4. Increment the session number and update the date in PROGRESS.md.
5. If "Notes for next session" has content: repeat the notes back to the builder, treat them as this session's priorities, then clear the section.
6. If this is session 1, run First Session Setup below before any build work.

Save point, after completing any module, feature, or fix:
1. Update PROGRESS.md: current state, remaining work, build decisions, known issues.
2. Commit and push to main.
3. Tell the builder in one line: "Save point committed: [what changed]."
Do not start the next piece of work before the save point is pushed. Never end a session without one. An ending session is a save point.

First Session Setup (session 1 only):
1. Create docs/ and move product-spec.md into it.
2. Announce what moved, then commit and push before building anything.
No brand skill is installed in this build. The brand is defined in the Brand section below.

PROGRESS.md structure (for the recreate rule): status header (Session / Last updated / Live URL), Current state, Last session (3 to 5 lines, replace each session), Remaining work (shrinking checklist), Build decisions (one line each), Known issues, Notes for next session.

## Commands
```
npx serve .
```

## Tech Stack
HTML, CSS, JavaScript, Netlify. Deploys from main via GitHub. Netlify MCP is active, so create the site and deploy via MCP. Do not migrate this tool to React. Reuse the v1.0 page structure and content from supplier_onboarding.html, but replace its stylesheet entirely: the old visual identity does not survive. New views render as show and hide sections in the same page, or as additional static pages sharing one stylesheet. SheetJS (xlsx) and Inter both load from CDNs and run in the browser, with no account, key, or server call.

## Arms
Export, browser only, no server function: serves /assets/The_Corporate_Supplier_Questionnaire_2026.xlsx unmodified from the "Download Template" control inside Plan B Option 2 and View 5. Not generated, not populated, not altered.

## Hard Rules
- Nothing is stored and nothing is transmitted. Never introduce a serverless function, form handler, Netlify Form, third party embed, or any endpoint carrying supplier input or uploaded files off the device. This is the build constraint, not a preference.
- The SheetJS and Google Fonts CDN requests are permitted and expected. Criterion 23 tests only for outbound requests carrying supplier input, which a CDN asset fetch does not. Do not strip either to satisfy that criterion, and do not report them as violations.
- No em dashes in any interface string: headings, body copy, button labels, form labels, helper text, validation messages, placeholder text, and any copy drafted during the build. Use a comma, a full stop, a colon, or a rewritten sentence. Question text quoted verbatim from the workbook is the only exception. En dashes in numeric ranges are acceptable.
- The old visual identity is removed. No Playfair Display, no DM Sans, no Acid Lime, and no Ink, Stone, Linen or Chalk tokens anywhere in the codebase. Do not load or install the-corporate-brand skill.
- The email arm is off deliberately. No email is sent by any path under any condition. The existing mailto: link to the EHS Help Desk stays, because it opens the user's own client and is not email sent by the tool.
- Browser storage (localStorage, sessionStorage, IndexedDB, cookies) is never used to persist answers between refreshes. Explicitly declined by the builder; the unsaved progress warning covers it.
- No API keys and no environment variables exist for this tool. If a step appears to need one, that step is out of scope. Stop and ask.

## Brand
No brand skill. These rules are the brand, taken from spec Section 10, and apply to every view including the retained v1.0 sections:
- Typeface: Inter from Google Fonts. Fallback: Helvetica Neue, Arial, system-ui, sans-serif. Voice: short declarative sentences, active voice, no exclamation points, no emoji.
- Colour: text #111111, secondary text #555555 for helper and caption and disabled states, accent #BC2D2E, background #FFFFFF. The maroon accent carries primary buttons, active states, focus rings and key emphasis only, never large filled areas. Secondary and back controls are text or outline styles in #111111, never maroon.
- Type scale: H1 weight 700, tracking -4%, line height 1.0. H2 and view titles weight 700, -3%, 1.05. Taglines and subheadings 400 to 500, -1%, 1.25 to 1.3. Bullet headings and form group labels 600 to 700, -1.5%, 1.15. Body and helper text 400, normal tracking, 1.35 to 1.4.
- Spacing rhythm, tight within a text group and generous between groups: heading to tagline 8 to 12px, bullet heading to its text 5 to 8px, between bullet groups 20 to 24px, between page sections at least 64px on desktop.

## Business Rules
- Landing page: reuse the v1.0 structure and content, restyle every element, and change two sections. Why We Are Asking must contain the exact sentence "We need your cooperation to reduce our Scope 3 emissions." and must not contain any sentence beginning "This is driven by"; its remaining copy is drafted by Claude Code covering Scope 3 exposure (71%, location based, 2023 base year) and shared responsibility, with regulatory context not leading the section, for builder review.
- The Submission section replaces the two v1.0 route cards with one gate question, "Do you have an EcoVadis scorecard?", as its heading, plus Yes and No buttons of equal visual weight and a supporting line about the 12 month validity window. No other buttons appear there, and Download Template is not on the landing page.
- The gate is the only branch in the tool. Yes opens Plan A, No opens Plan B, and no other conditional logic exists anywhere. Never add skip logic inside the questionnaire. The gate answer is not stored, not passed into any form as a hidden value, and not shown in the confirmation recap.
- Plan A takes four required fields, being company legal name, contact name, contact email and scorecard issue date, plus a required scorecard file upload. There is no scorecard link field. The scorecard issue date must fall within the 12 months preceding today, and the file must be .pdf, .png or .jpg under 10MB. A date outside that window or in the future, or any other file type or size, produces an inline message and blocks submission. The file is read for filename and size only: never parsed, never previewed beyond the filename, never transmitted.
- The portal questionnaire has 5 steps: Company Details (2 questions), Environment (21), Social (3), Governance (2), Declaration (3 fields). That is 28 questions and 84 inputs. Every question carries three inputs: Supplier Response, Notes / Evidence, and a Status dropdown of Not Started, In Progress, Complete, N/A, EcoVadis Bypass. Question text and ESRS references come verbatim from docs/product-spec.md, in the order given there. Nothing invented, reworded, reordered, or omitted.
- The Environment step uses five labelled sub-groups with clear visual separation, one step per screen with generous spacing: Climate and Decarbonisation, Pollution and PFAS, Water and Marine Resources, Circular Economy and Waste, Biodiversity and Ecosystems. Do not compress the steps into one scrolling page.
- Portal grouping and workbook structure deliberately differ. The workbook keeps S1 to S7 with all 30 rows, and validation checks that structure, so rows 8 and 9 must be present for a file to validate. Those two rows are excluded from the portal form and from the upload review, because the gate makes them redundant. The review and the recap present results in the Company Details, Environment, Social, Governance grouping.
- Row 12 renders as a number field, not the source file's verification method dropdown, which is an error in the workbook. Row 19 shows its PFAS auto-flag note as static helper text, with no flagging behaviour built. No question in the portal form is required. Blanks are allowed and display as blank in the recap. The unsaved progress warning appears on every step, is prominent, and is not dismissible.
- Upload validation is all or nothing: accept only .xlsx or .csv containing all seven column headers, all seven S1 to S7 section headings, and all thirty question rows in workbook order matched on question text. Any failure rejects the file outright with exactly "File format doesn't match. Download the Excel file", with no partial import, no salvaged rows, and no list of what was missing. Do not soften this, because a lenient parser silently drops supplier answers.
- The confirmation view shows "Successfully submitted" plus a read only recap: from Plan A the four values and the attached filename, from either Plan B option the grouped answers and declaration. No reference number, no download of the submission, no email, no claim that a record has been stored or that anyone will respond. Any view opens with an empty form if reached directly by URL or by using the browser back button to change the gate answer; no state carries across. The two Key Resources document URLs remain unresolved: leave them as `#` and flag to the builder. Retain the existing navigation logo as is and flag it for review.

Out of scope, do not build:
- Any persistence: database storage, submissions reaching The Corporate, storage or parsing of the uploaded scorecard file, browser saved progress between refreshes, supplier login
- Any downstream tooling or notification: internal review dashboard, submission tracker, PFAS auto-flag workflow, automated EcoVadis validation, email on submission or download
- Reorganising the downloadable workbook into the ESG grouping, since it keeps S1 to S7 in this build. On the confirmation view: reference or submission number, download of the completed submission. In the questionnaire: required field enforcement

## Reference Docs
Read before building the related part:
- docs/product-spec.md, holding the full 28 question inventory with row numbers and ESRS references, all six view specifications, the four logic rules, the full brand system, and the 27 acceptance criteria
- /assets/The_Corporate_Supplier_Questionnaire_2026.xlsx, which must be opened and verified against the inventory before building View 4
PROGRESS.md in the root is read at every session start per the Session Protocol.
