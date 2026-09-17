# Product Spec — The Corporate Supplier Sustainability Portal 2026

**Version:** 2.2
**Date:** 17 September 2026
**Author:** Zyad Hatquai
**Status:** Confirmed

---

> ⚠ **BUILD CONSTRAINT. READ BEFORE BUILDING ANYTHING.**
>
> This version of the tool **stores submissions and uploaded files in Supabase.** It is a real change from v2.1: nothing is discarded anymore. That also means this build is **still not ready to circulate to real Tier 1 suppliers**, for three reasons that are not yet resolved:
>
> 1. The GDPR data statement and deletion contact in Section 7 are placeholders. They must be replaced with real text and a real contact before any supplier submits data through this tool.
> 2. There is no admin or review interface. The Corporate reviews submissions directly in the Supabase dashboard, not inside the tool. This is intentional for this version, not a gap to fix during the build.
> 3. No login exists yet. Anyone with the URL can submit. The deployed URL should stay access restricted (see Section 15) until the builder is ready for real suppliers to use it.
>
> Claude Code must not describe this build as production ready and must not add any capability beyond what is specified here, in particular no admin screen, no resumable progress, and no login.

---

> ✏️ **GLOBAL COPY RULE. APPLIES TO EVERY STRING IN THE INTERFACE.**
>
> **No em dashes (—) anywhere in portal content.** Not in headings, body copy, button labels, form labels, helper text, validation messages, or placeholder text. Use a comma, a full stop, a colon, or a rewritten sentence instead.
>
> This applies to copy Claude Code drafts itself as well as copy specified in this document. En dashes in numeric ranges are acceptable. Question text quoted from the Excel workbook is reproduced verbatim and is the only exception, since it must match the file.

---

## Section 1 — Tool Summary

**Tool name:** The Corporate Supplier Sustainability Portal 2026

**What it does:** A public page that onboards Tier 1 suppliers into The Corporate's ESRS aligned sustainability assessment programme. A single gate question asks whether the supplier holds an EcoVadis scorecard. Suppliers answering Yes go to Plan A and submit their EcoVadis details and scorecard file. Suppliers answering No go to Plan B and choose between completing the assessment directly in the portal or downloading the Excel template, completing it offline, and uploading the finished file. Both doors now open with a shared identity step, and every completed submission, including uploaded files, is written to a database instead of being discarded when the tab closes.

**Who uses it:** Tier 1 supplier contacts, meaning sustainability managers, EHS leads, and procurement representatives at supplier organisations, who receive the URL directly from The Corporate's Procurement or EHS team. No login is required to submit. The Corporate's own EHS and Procurement teams review completed submissions directly in the Supabase dashboard; no one else has access.

**Why it exists:** v2.1 validated the submission experience but stored nothing, so it could not yet be given to real suppliers: a supplier who completed it would see "Successfully submitted" and The Corporate would receive nothing. This version removes that block by persisting submissions, so the tool can eventually replace the email based process it was built to retire.

**Build status:** Iteration. Version 2.1 (7 September 2026) was Tier 1, Data Model D2: session only, nothing transmitted or stored. This version, 2.2, moves the data model to D3, adds a shared "Company and Contact Details" step as the opening step of both Plan A and Plan B, stores the EcoVadis scorecard file and the uploaded completed template file in Supabase Storage, and changes the GDPR outcome from confirmed not applicable to applies.

---

## Section 2 — Classification

### Data Model

**Decision:** D3

| Label | What it means | This tool? |
|-------|--------------|-----------|
| D1 — Hardcoded | All data is written into the code by the developer. Users cannot input anything that persists. | No |
| D2 — Session | Data enters the tool during use and disappears when the tab closes. No database. | No |
| D3 — Persisted | Data is written to a database and survives after the session ends. Supabase is required. | Yes |

**Reason:** Submissions must be retrievable after the supplier closes the tab so The Corporate can review them later. A submission made by one person (the supplier) must be visible to someone else (The Corporate's reviewers). Files uploaded by suppliers, the EcoVadis scorecard and the completed template, must be stored and retrievable after the session ends.

**D3 triggers, checked:**
- [x] Data must be retrievable after the session ends
- [x] Multiple sessions contribute to the same dataset (every supplier's submission accumulates in the same table)
- [ ] An audit trail or history is needed
- [x] Data submitted by one person must be visible to another
- [ ] Results must be accessible via a URL after the session ends
- [x] Files uploaded by users must be stored and retrievable later

---

### Access Model

**Decision:** A1

| Label | What it means | This tool? |
|-------|--------------|-----------|
| A1 — Public | Anyone with the URL can use it. No login, no account required. | Yes |
| A2 — Authentication | Users must log in. All logged in users see the same thing. | No |
| A3 — Authorization | Users must log in and have different roles. | No |

**Reason:** The portal is still distributed as a direct link with no account or login. Login for suppliers, so they can see their own past submissions, is a planned future addition (see the forward compatibility note in Section 6) but is explicitly out of scope for this version.

> **Promotion rule:** not triggered here. A1 stays A1 even though the data model moved to D3, because D3 alone does not require auth; the promotion rule only fires when A2 or A3 is confirmed.

---

### Tier

**Tier:** 2

D3 plus A1 resolves to Tier 2: Netlify plus Supabase, no accounts, no RLS role split. This is a change from v2.1, which was Tier 1.

---

### Standalone or Stack

**This tool is:** Standalone. It does not share its Supabase project with any other tool. There is no separate internal review tool: The Corporate reviews submissions directly in the Supabase dashboard rather than through a second, built interface.

---

## Section 3 — Arms

Unchanged from v2.1. Arms do not change the tier.

### AI API Arm

**Active:** No

---

### Export Arm

**Active:** Yes

| Detail | Answer |
|--------|--------|
| Format | XLSX |
| What is exported | `The_Corporate_Supplier_Questionnaire_2026.xlsx`, the pre-formatted Excel workbook, served as a static asset from `/assets/`. Not generated, not populated, not altered. |
| Placement | Inside Plan B, Option 2, as the "Download Template" control, and referenced again from View 6 if the supplier arrives there without the file. |
| PDF design intent | N/A. Format is XLSX only. |

---

### Email Arm

**Active:** No

> No email is sent anywhere, by any path, under any condition. The `mailto:` link to the EHS Help Desk in Key Resources is retained. It opens the user's own email client and is not an email sent by the tool.

---

### Scheduled Automation Arm

**Active:** No

---

## Section 4 — Stack and Deployment

### All Tiers

| Detail | Answer |
|--------|--------|
| Frontend framework | HTML/CSS/JS, unchanged. Do not migrate this tool to React. The existing page structure and content are reused; only the parts described in Section 8 change. |
| Deployment target | Netlify |
| Netlify MCP | Active, carried over from v2.1. Netlify is connected via Claude Desktop Connectors. Claude Code updates the existing site and deploys automatically. |

**GitHub:** This is an iteration on an existing repository. The repo, and `product-spec.md`, `CLAUDE.md`, and `PROGRESS.md` in its root, already exist. The builder updates those three files with this spec's output and the Project Governor's output before the next Claude Code session opens. Claude Code does not create a new repo.

**Client side library required:** SheetJS (`xlsx`), loaded from a CDN, unchanged. Reading the uploaded workbook still happens entirely in the browser before the parsed answers are written to the database.

---

### CONDITIONAL: Supabase project

**Supabase project status:** New. This is the first version of this tool to use a database. Claude Code creates the project via MCP at the start of the build session.

**Supabase plan:** Free. It pauses after roughly a week of no traffic, which is acceptable for this stage: the tool is still internal facing and low volume, and someone can restore it manually in the dashboard if needed.

| Detail | Answer |
|--------|--------|
| Proposed project name | the-corporate-sustainability |
| Confirmed project name | the-corporate-sustainability, confirmed by the builder |

> Claude Code will pause at the start of the session, confirm the project name, and create the Supabase project via MCP before building anything. The project ID will be recorded in `docs/supabase-setup.md` once created.

**supabase-setup.md:** Claude Code creates this file at the end of the build session that creates the schema, and updates it on every session that touches the database afterward. It records the project name, project ID, all tables and fields, storage buckets, RLS policies, and the current absence of Auth configuration.

---

### CONDITIONAL: Stack

N/A. Standalone tool, as stated in Section 2.

---

## Section 5 — Data Architecture

This section is the input Claude Code uses to build the database schema via MCP.

**What data is collected or stored in this tool:**

| Field name | Plain language label | Data type | Who provides it | Required? |
|-----------|---------------------|-----------|----------------|-----------|
| company_legal_name | Company legal name | Text | Supplier, Company and Contact Details step, both doors | Yes |
| contact_name | Contact person name | Text | Supplier, Company and Contact Details step, both doors | Yes |
| contact_email | Contact person email | Email, format validated | Supplier, Company and Contact Details step, both doors | Yes |
| contact_title | Contact person title or role | Text | Supplier, Company and Contact Details step, both doors | Yes |
| consent_given | Data consent checkbox | Boolean | Supplier, Company and Contact Details step, both doors | Yes, must be true to submit |
| submission_path | Which door and option was used | Text: `ecovadis` / `questionnaire` / `template_upload` | Automatic | Yes |
| scorecard_issue_date | Scorecard issue date | Date | Supplier, Plan A only | Yes, Plan A only |
| scorecard_file_path | Storage location of the uploaded scorecard file | Text (Supabase Storage path) | Supplier upload, Plan A only | Yes, Plan A only |
| questionnaire_answers | The 28 questions, each with Supplier Response, Notes or Evidence, and Status | JSON | Supplier, Plan B Option 1 only | No fields within it are required, matching v2.1 |
| declaration_signatory_name | Authorised signatory name | Text | Supplier, Plan B Option 1 declaration only | Yes, when that step is reached |
| declaration_date | Declaration date | Date | Supplier, Plan B Option 1 declaration only | Yes, when that step is reached |
| declaration_signature | Typed signature | Text | Supplier, Plan B Option 1 declaration only | Yes, when that step is reached |
| template_file_path | Storage location of the uploaded workbook or CSV | Text (Supabase Storage path) | Supplier upload, Plan B Option 2 only | Yes, Plan B Option 2 only |
| template_parsed_answers | Parsed answers read from the uploaded file, in the same shape as questionnaire_answers | JSON | Automatic, parsed in the browser before submission | Yes, Plan B Option 2 only |
| created_at | Submission timestamp | Timestamp | Automatic | Yes |

**Tables needed:**

| Table name | What it stores | Key fields |
|-----------|---------------|-----------|
| submissions | One row per completed submission, from any of the three paths | id, created_at, submission_path, company_legal_name, contact_name, contact_email, contact_title, consent_given, scorecard_issue_date, scorecard_file_path, template_file_path, and a `payload` JSONB column holding whichever of questionnaire_answers, declaration fields, or template_parsed_answers applies to that row's submission_path |

> One table, not three, because the fields that differ between paths (scorecard details, questionnaire answers, template answers) are naturally optional and path specific. A single `payload` JSONB column keeps the schema simple for a builder reviewing rows directly in the Supabase table editor, and keeps `company_legal_name` and `contact_email` as plain, filterable, sortable columns common to every row regardless of path.

**File storage:** Yes.

Two kinds of files are stored, both in Supabase Storage, both private (not publicly readable buckets):
- The EcoVadis scorecard file from Plan A: `.pdf`, `.png`, or `.jpg`, under 10 MB, as validated in Section 9.
- The completed workbook or CSV file uploaded in Plan B, Option 2, after it has passed the file match validation in Section 9.

Both are uploaded to storage only at the point of final submission, alongside the row insert into `submissions`, not earlier. The Corporate retrieves these files through the Supabase Storage browser in the dashboard, using the `scorecard_file_path` or `template_file_path` value on the relevant row to locate them; no signed URL or download link is exposed inside the tool itself.

**Derived or calculated data:** No.

---

## Section 6 — Access and Permissions

**Access Model is A1: no login, no roles.** The standard RLS role table in the template (unauthenticated vs authenticated vs admin) does not apply here, because there is only one kind of caller: the anonymous browser client that every supplier uses.

That does not mean no RLS. **This is required, not optional:** the Supabase anon key is embedded in the tool's frontend JavaScript and is visible to anyone who opens the browser's developer tools. Without RLS, anyone could read every supplier's submission, including personal data, directly through that key.

**RLS policy for the `submissions` table:**

| Caller | Can read | Can insert | Can update | Can delete |
|--------|---------|-----------|-----------|-----------|
| anon (the public browser client, all suppliers) | No | Yes | No | No |
| service role (Supabase dashboard, used by The Corporate to review) | All rows | Yes | Yes | Yes |

RLS must be enabled on `submissions` with exactly one policy for the anon role: `INSERT` only, with no `SELECT`, `UPDATE`, or `DELETE` policy for anon at all. The Corporate reviews and, if ever necessary, corrects or removes rows using the service role through the Supabase dashboard, which bypasses RLS entirely; no policy needs to grant it explicitly.

**Same principle for Storage:** both storage buckets are private. The anon role may upload (insert) new objects but may not list or read back objects it or anyone else has uploaded. The Corporate accesses stored files through the Supabase Storage browser in the dashboard.

**Forward compatibility note, for the next version, not built now:** the builder's stated plan is that suppliers will eventually be able to log in to see their own past submissions. `contact_email` is deliberately kept as a plain, indexable column for this reason: when Auth is added, a new RLS policy can allow an authenticated user to `SELECT` rows where `contact_email` matches their own verified email, without changing the table shape. No other schema change should be needed to add that policy later.

> No A2/A3 privacy note applies, since this version has no accounts.

---

## Section 7 — GDPR

### MANDATORY DECISION

**GDPR outcome:** Applies. Personal data is now collected through the tool's forms and is stored, which it was not in v2.1.

> **Scope rule reminder:** this outcome changed because the data model changed from D2 to D3. The forms collect the same kinds of personal fields as before; what changed is that they are now retained rather than discarded.

**Personal data collected:** company legal name, contact person name, contact person email, contact person title or role, authorised signatory name (Plan B Option 1 declaration only). The 28 questionnaire answers and any free text within them are not treated as personal data by default, but a supplier could in principle type identifying information into a free text answer; no redaction or filtering is built for this.

**Consent checkpoint on the form:** Yes. The Company and Contact Details step (Section 8, View 2) shows a checkbox and the data statement below, immediately below the four fields. The checkbox must be checked before the supplier can continue to the rest of that door's flow. This applies identically on both doors, since View 2 is shared.

**Data statement text shown to users at the point of collection:**

> "Your data will be stored securely and used only to review your sustainability submission as part of The Corporate's supplier programme. You can request deletion at any time by contacting [DELETION CONTACT, TO BE CONFIRMED BY THE BUILDER BEFORE THIS TOOL IS GIVEN TO REAL SUPPLIERS]."

**Deletion mechanism:** A named contact at The Corporate, not yet identified, receives deletion requests and manually deletes the corresponding row from `submissions` and any associated files from Storage using the Supabase dashboard. This is a placeholder. See Section 15, it is the first open question and must be resolved before real suppliers use this tool, though it does not block Claude Code from building the form with the placeholder text above.

---

## Section 8 — Screen and UI Structure

Seven views. View 1 is unchanged from v2.1. View 2 is new and shared by both doors. Views 3 through 7 correspond to v2.1's Views 2 through 6, renumbered, with the storage and recap changes described in each.

---

### View 1 — Landing Page

Unchanged from v2.1. Gate question "Do you have an EcoVadis scorecard?" with Yes and No buttons of equal visual weight. Yes opens View 2 in its Plan A context. No opens View 2 in its Plan B context.

---

### View 2 — Company and Contact Details (new, shared by both doors)

- **Purpose:** Establish who is submitting before anything else in that door's flow happens. This is the opening step of both Plan A and Plan B, not a screen before the gate.

- **What is visible:**
  - A heading that names which plan the supplier is in, for example "EcoVadis submission, step 1 of 2" or "Complete your assessment, step 1", so the supplier knows this is the start of the path they chose, not a new detour.
  - Four required text fields:

    | Field | Type | Notes |
    |-------|------|-------|
    | Company legal name | Text | |
    | Contact name | Text | |
    | Contact email | Email | Format validated |
    | Contact title or role | Text | |

  - A consent checkbox, unchecked by default, with the data statement from Section 7 as its label or immediately beside it.
  - A back control returning to the landing page.
  - A "Continue" control.

- **User actions:** Complete the four fields, check the consent box, continue, or go back.

- **What happens next:** Continue is blocked with inline messages until all four fields are filled, the email is validly formatted, and the consent box is checked. Once valid, Continue opens **View 3** if this is the Plan A context, or **View 4** if this is the Plan B context. These values are held in memory for the rest of that session and are not re-asked; they are combined with whatever View 3, 5, or 6 collects when the final submission is written to the database.

> This is a new, separate step. It does not replace or remove the company and contact fields already present inside View 3's own form. A supplier on the EcoVadis path will see their company name and contact details asked for twice, once here and once again in View 3. This duplication is intentional for this version: View 2 exists so that every path, including Plan B Option 2's upload path, which previously had no identity capture anywhere, gets a submission owner recorded in the database. Consolidating the two is explicitly deferred; see Section 15.

---

### View 3 — Plan A: EcoVadis Submission

Unchanged in content from v2.1's View 2. Reached only after View 2 in its Plan A context.

- **Purpose:** Capture the scorecard details and the scorecard file from a supplier who already holds one.

- **What is visible:**
  - Heading identifying this as the EcoVadis route, and a short line restating the 12 month validity requirement.
  - Four text fields, all required: Company legal name, Contact name, Contact email (format validated), Scorecard issue date (must fall within the last 12 months, see Section 9).
  - Scorecard file upload, required. Accepts `.pdf`, `.png`, `.jpg`. Shows the selected filename once chosen, with a control to replace it. There is no scorecard link field.
  - A back control returning to View 2.
  - Submit button.

- **User actions:** Complete four fields, attach the scorecard file, submit, or go back.

- **What happens next:** On valid submission, the scorecard file is uploaded to Storage, a row is written to `submissions` with `submission_path` set to `ecovadis`, and the supplier is taken to **View 7**. On invalid input, inline field level messages appear and nothing is submitted. See Section 9 for what happens if the database write itself fails.

---

### View 4 — Plan B: Choose How to Submit

Unchanged in content from v2.1's View 3. Reached only after View 2 in its Plan B context.

- **Purpose:** Give a supplier without a scorecard the choice between filling in the portal and working offline in Excel.

- **What is visible:**
  - Heading and a short line explaining that the full assessment is required and can be completed either way.
  - Option 1: Fill in the information directly in the portal. Description noting that the assessment must be completed in one sitting because progress is not saved. Button opens **View 5**.
  - Option 2: Download the template, complete it, and upload it. Description noting that this suits organisations where several colleagues contribute. Two controls: "Download Template", which downloads `The_Corporate_Supplier_Questionnaire_2026.xlsx` from `/assets/`, and "Upload Completed Template", which opens **View 6**.
  - Back control returning to View 2.

- **User actions:** Choose an option, download the template, or go back.

- **What happens next:** Navigation to View 5 or View 6.

---

### View 5 — Fill in the Portal

Unchanged in content and structure from v2.1's View 4. Still one sitting only, no resumable progress; this was confirmed explicitly during this iteration's interview and is not changing now that a database exists (see Section 15 for the deferred alternative).

- **Purpose:** Let the supplier complete the full assessment inside the portal, section by section.

- **What is visible:**
  - A persistent, prominent, non dismissible warning above the form on every step: progress is not saved, and refreshing, navigating back, or closing the tab will lose all answers.
  - A step indicator, for example "Step 2 of 5".
  - One section per screen with Back and Next controls. No field is enforced as required.
  - For every question: its ESRS reference, its full question text, and three inputs: Supplier Response, Notes / Evidence, and a Status dropdown (`Not Started` / `In Progress` / `Complete` / `N/A` / `EcoVadis Bypass`).
  - Final step, Declaration: the declaration text from the workbook, plus Authorised Signatory Name, Date, and a typed Signature field. Submit button.
  - Question inventory: 5 steps, 28 questions, 84 inputs, exactly as in v2.1 Section 8 (Company Details 2, Environment 21 across five labelled sub-groups, Social 3, Governance 2, Declaration 3 fields). Question text and ESRS references are unchanged and still come verbatim from this document.

- **User actions:** Move through the sections, answer any combination of the 84 inputs, complete the declaration, submit.

- **What happens next:** On submit, a row is written to `submissions` with `submission_path` set to `questionnaire`, the 28 answers in `payload` as `questionnaire_answers`, and the three declaration fields in `payload` alongside them. The supplier is taken to **View 7**. See Section 9 for what happens if the database write fails.

---

### View 6 — Upload Completed Template

Unchanged in content and validation from v2.1's View 5, except that the file itself is now stored, not discarded.

- **Purpose:** Accept the completed workbook back, read it in the browser, show the supplier what was found, and store both the file and the parsed answers.

- **What is visible, initial state:** Short instruction, a file picker accepting `.xlsx` and `.csv` only, a "Download Template" control, a back control to View 4.

- **What is visible, after a file that passes validation:** The parsed answers rendered read only, grouped as Company Details, Environment, Social, Governance, exactly as in v2.1. Rows 8 and 9 are read during validation but not displayed. Declaration values if present. A "Replace file" control. Submit button.

- **What is visible, after a file that fails validation:** The exact message "File format doesn't match. Download the Excel file", with the download control alongside it. No partial import.

- **User actions:** Select a file, review what was read, replace the file, submit, or go back.

- **What happens next:** On submit, the original file is uploaded to Storage, a row is written to `submissions` with `submission_path` set to `template_upload` and the parsed answers in `payload` as `template_parsed_answers`, and the supplier is taken to **View 7**. See Section 9 for what happens if the database write fails.

---

### View 7 — Confirmation

Same recap structure as v2.1's View 6, with copy updated to reflect that a record now genuinely exists.

- **Purpose:** Confirm to the supplier that their submission was received and recorded, and show what was submitted.

- **What is visible:**
  - Heading: "Successfully submitted."
  - A recap of what was submitted, rendered read only, including the company and contact details from View 2. From Plan A, the four Plan A field values plus the attached filename. From either Plan B option, the answers grouped as Company Details, Environment, Social, Governance with all three values per question, plus the declaration.
  - A control returning to the landing page.
  - **Still not present:** no reference or submission number, no download of the submission, no email confirmation. This is unchanged from v2.1 by explicit choice during this iteration's interview, not an oversight; see Section 15 if this should be revisited now that a record does exist.

- **User actions:** Read the recap, return to the landing page.

- **What happens next:** Nothing further happens client side. The submission already exists in the database at this point; nothing new is written or discarded when the tab closes.

---

## Section 9 — Logic and Calculations

No scoring, no calculation. Five rules govern behaviour; the first four are unchanged from v2.1.

### Rule 1 — File match validation (View 6)

Unchanged from v2.1. An uploaded file is accepted only if it is `.xlsx` or `.csv`, all seven column headers are present and intact, all seven section headings are present, and all thirty question rows are present in workbook order matched on question text. Any failure rejects the file outright with exactly "File format doesn't match. Download the Excel file", with no partial import. Rows 8 and 9 must be present for a file to validate, but are not displayed in the review.

### Rule 2 — The gate is the only branch

Unchanged from v2.1. The gate question on the landing page is the single branching point. Yes goes to Plan A (View 2 in its Plan A context), No goes to Plan B (View 2 in its Plan B context). No other conditional logic exists anywhere, including inside View 2. The gate answer itself is not stored and not shown in the confirmation recap.

### Rule 3 — Scorecard date validation (View 3)

Unchanged from v2.1. The scorecard issue date must fall within the 12 months preceding today's date. A date outside that window, or in the future, produces an inline validation message and blocks submission.

### Rule 4 — Scorecard file validation (View 3)

Unchanged from v2.1. The uploaded scorecard must be `.pdf`, `.png`, or `.jpg`, and under 10 MB. Anything else produces an inline message and blocks submission.

### Rule 5 — Submission write failure (new, applies to Views 3, 5, and 6)

Because submitting now means writing to a real database and, on two of the three paths, uploading a file to Storage, either of those can fail (a dropped connection, a Supabase outage, a file that fails to upload). On any submit action:

1. Attempt the file upload first, if that path involves one (Plan A, Plan B Option 2).
2. If the file upload fails, show an inline message such as "Something went wrong submitting your file. Please try again." and do not write a row to `submissions`. The supplier stays on the same view with their entered data intact, and may retry.
3. If the file upload succeeds, attempt the row insert into `submissions`.
4. If the row insert fails, show the same kind of inline retry message. Do not navigate to View 7. An already uploaded file in this case is left in Storage as an orphaned object; no automatic cleanup is built for this version, since it is an edge case, not a normal path.
5. Only navigate to View 7 once the row insert has succeeded.

### Edge cases

| Case | Behaviour |
|------|-----------|
| Supplier leaves questionnaire fields blank | Allowed. No question in View 5 is required. Blanks appear as blank in the confirmation recap. |
| Supplier refreshes, navigates back, or closes the tab mid form | All answers are lost, on every view including View 2. By design, and warned about on every step of View 5. This is unchanged even though a database now exists; nothing is saved until the final submit action succeeds. |
| Supplier leaves a View 2 field blank, or types an invalid email | Continue is blocked with an inline message. Unlike View 5, all four View 2 fields and the consent checkbox are required. |
| Uploaded template matches but every answer cell is empty | Accepted. The review renders all questions with blank values. The supplier may still submit. |
| Uploaded template is over 10 MB or is not a real workbook despite its extension | Rejected with the standard message. |
| Supplier answers the gate, then uses the browser back button to change the answer | Allowed. The other plan opens with an empty View 2. No state carries across. |
| Supplier opens a submission view directly by URL without passing the gate | The view loads normally with an empty form. No state is expected to carry over. |
| Submit action fails partway through (file uploaded, row insert fails, or vice versa) | See Rule 5. Inline retry message, no navigation to View 7, no automatic cleanup of an orphaned uploaded file. |

---

## Section 10 — Brand and Visual Direction

Unchanged from v2.1. Applies identically to the new View 2.

**Brand reference:** No brand skill. Defined below. The `the-corporate-brand` skill is not used and must not be applied.

**Typeface:** Inter, from Google Fonts. Fallback: Helvetica Neue, Arial, system-ui, sans-serif.

**Colour:** Text `#111111`, secondary text `#555555` for helper and caption and disabled states, accent `#BC2D2E`, background `#FFFFFF`. The accent carries primary buttons, active states, focus rings and key emphasis only, never large filled areas.

**Type scale:** H1 weight 700, tracking -4%, line height 1.0. H2 and view titles weight 700, -3%, 1.05. Taglines and subheadings 400 to 500, -1%, 1.25 to 1.3. Bullet headings and form group labels 600 to 700, -1.5%, 1.15. Body and helper text 400, normal tracking, 1.35 to 1.4.

**Spacing rhythm:** Heading to tagline 8 to 12px, bullet heading to its text 5 to 8px, between bullet groups 20 to 24px, between page sections at least 64px on desktop. View 2's four fields and consent checkbox follow the same spacing rhythm as View 3's existing form.

**Visual feel:** Clean, modern, editorial. Restrained use of a single accent colour.

---

## Section 11 — API and Credentials

| Service | What it does in this tool | Key required | Where key is stored |
|---------|--------------------------|-------------|-------------------|
| Supabase | Database (submissions table) and file storage (scorecards, uploaded templates) | Anon key (public, browser safe, insert only via RLS) plus service role key (used only by The Corporate inside the Supabase dashboard, never in this tool's code) | Netlify environment variables (anon key only; the service role key is never entered anywhere in this project) |

**Client side library, not a service:**

| Library | What it does | Key required |
|---------|-------------|-------------|
| SheetJS (`xlsx`), loaded from CDN | Parses the uploaded `.xlsx` workbook in the browser | No |
| Inter, loaded from Google Fonts CDN | Typeface | No |

**Credentials readiness:**

| Credential | Status | Where to get it |
|-----------|--------|----------------|
| Supabase anon key | Created by Claude Code with the project | Supabase dashboard, Project Settings, API |

> **Security rule, no exceptions:** the Supabase service role key must never appear in any file in this repository, in any Netlify environment variable used by the frontend, or anywhere the browser can read it. Only the anon key, restricted by the RLS policy in Section 6, is used by the tool itself. Claude Code must not introduce any serverless function, form handler, or third party endpoint beyond the direct Supabase client calls described in Sections 5 and 6.

---

## Section 12 — Out of Scope — Phase 2

| Deferred feature | Reason it is deferred |
|-----------------|----------------------|
| Admin or review interface inside the tool | The Corporate reviews submissions directly in the Supabase dashboard for this version. Building a review screen would make this a stack, two tools sharing one Supabase project, which is a larger change. Confirmed explicitly during this iteration's interview. |
| Resumable or save and continue progress | Confirmed explicitly: the guided questionnaire stays one sitting only. The database stores completed submissions, not in progress work. |
| Supplier login | Moves the tool to Tier 3. The schema anchors on `contact_email` so this can be added later without a rebuild, but it is not built now. |
| Consolidating View 2's fields with View 3's existing company and contact fields | Confirmed explicitly: kept separate for this version, so every path gets a uniform identity capture without restructuring View 3. |
| Submission tracker showing which Tier 1 suppliers have responded | Requires a supplier roster, which does not exist yet. |
| PFAS auto-flag review workflow | The workbook notes that "Yes" at row 19 triggers a PFAS Risk review. The tool displays that note as static text and takes no action on it. |
| Automated EcoVadis scorecard validation | Requires EcoVadis API access. The tool validates the issue date and the file type only. |
| Reorganising the downloadable Excel workbook into Environment, Social and Governance | The workbook keeps its S1 to S7 structure. The portal regroups on screen only. |
| Email notification on submission | Email arm is not active. |
| Reference or submission number on the confirmation view | Confirmed explicitly: kept out for this version even though a record now exists, matching v2.1's behaviour. See Section 15 if this should be revisited. |
| Download of the completed submission from the confirmation view | Same reason. |
| Required field enforcement in the questionnaire (View 5) | No question is mandatory in this version, matching v2.1. This does not apply to View 2, whose four fields and consent checkbox are required. |

---

## Section 13 — Acceptance Criteria

| # | What to verify | Expected result | Done? |
|---|---------------|-----------------|-------|
| 1 | Landing page and gate are unchanged | View 1 renders exactly as in v2.1; Yes and No route to View 2 in the correct context | [ ] |
| 2 | View 2 appears first on both doors | Both Yes and No land on the Company and Contact Details step before View 3 or View 4 | [ ] |
| 3 | View 2 fields are required | Continue is blocked with inline messages if any of the four fields is blank, the email is malformed, or the consent box is unchecked | [ ] |
| 4 | View 2 does not remove View 3's existing fields | View 3 still shows its own company legal name, contact name, and contact email fields, unchanged from v2.1 | [ ] |
| 5 | Plan A submission creates a database row and stores the file | Submitting View 3 creates one row in `submissions` with `submission_path` "ecovadis" and the correct field values, and uploads the scorecard file to Storage with its path recorded on that row | [ ] |
| 6 | Plan B Option 1 submission creates a database row | Submitting View 5 creates one row in `submissions` with `submission_path` "questionnaire" and the 28 answers and declaration fields correctly present in `payload` | [ ] |
| 7 | Plan B Option 2 submission creates a database row and stores the file | Submitting View 6 creates one row in `submissions` with `submission_path` "template_upload", uploads the original file to Storage, and stores the parsed answers in `payload` | [ ] |
| 8 | Anon key cannot read submissions | Using the anon key from the browser, attempting to select from `submissions` returns no rows, confirming the RLS policy in Section 6 is active | [ ] |
| 9 | Anon key cannot update or delete submissions | Attempting either from the browser using the anon key fails | [ ] |
| 10 | Storage buckets are private | Files uploaded through the tool are not reachable via a public, unauthenticated URL | [ ] |
| 11 | GDPR consent blocks submission | The consent checkbox on View 2 must be checked before Continue proceeds, on both doors | [ ] |
| 12 | GDPR data statement is present | The placeholder data statement text from Section 7 renders beneath the consent checkbox | [ ] |
| 13 | Submit failure handling works | Simulating a failed database write on any of Views 3, 5, or 6 shows the inline retry message and does not navigate to View 7 | [ ] |
| 14 | Confirmation copy is accurate | View 7 still shows no reference number, no download, no email claim, and its recap includes the View 2 identity fields | [ ] |
| 15 | Questionnaire structure is unchanged | View 5 still has 5 steps, 28 questions, 84 inputs, matching v2.1's inventory exactly | [ ] |
| 16 | Upload validation is unchanged | View 6 still rejects any file missing a header, a section heading, or a question row with exactly "File format doesn't match. Download the Excel file" | [ ] |
| 17 | Date and file validation on View 3 are unchanged | The 12 month scorecard date window and the pdf, png, jpg, 10 MB file rules from v2.1 still apply | [ ] |
| 18 | No em dashes anywhere | A search of all rendered copy, including the new View 2, returns zero em dash characters, other than verbatim workbook question text | [ ] |
| 19 | Brand is applied to View 2 | View 2 uses Inter, the four brand tokens, and the same type scale and spacing rhythm as the rest of the tool | [ ] |
| 20 | Deploys with Supabase reachable | The live Netlify URL loads, and a full pass through each of the three submission paths results in a visible row in the Supabase table editor and, where applicable, a file in Storage | [ ] |

---

## Section 14 — Build Path

**This tool's tier:** Tier 2

---

### Pre-build steps

- [x] Tool Architect skill, interview complete, this spec written and confirmed by the builder
- [ ] Project Governor skill, CLAUDE.md and PROGRESS.md produced from this spec
- [x] GitHub repo already exists from v2.1. No new repo is created.
- [ ] `product-spec.md` updated in the repo root with this version
- [ ] `CLAUDE.md` updated in the repo root with the Project Governor's new output
- [ ] `PROGRESS.md` updated in the repo root with the Project Governor's new output
- [x] No brand skill file, unchanged from v2.1
- [x] Netlify already connected, Netlify MCP active, no action needed
- [ ] No credentials to prepare manually; Claude Code creates the Supabase project and its anon key via MCP at the start of the build session

---

### Tier 2 — build session

- [ ] Open Claude Code in the project folder
- [ ] Claude Code runs Session Protocol: reads PROGRESS.md, checks the spec version against CLAUDE.md's governed version, proceeds since this spec is what CLAUDE.md will be regenerated from
- [ ] Claude Code reads this `product-spec.md`, the updated `CLAUDE.md`, and `PROGRESS.md`
- [ ] Supabase, new project: Claude Code proposes "the-corporate-sustainability", waits for the builder's confirmation, then creates the project via Supabase MCP
- [ ] Claude Code builds the `submissions` table, both storage buckets, and the RLS policy from Section 6, via Supabase MCP
- [ ] Claude Code creates `docs/supabase-setup.md`
- [ ] Claude Code builds View 2 and wires it into both doors ahead of Views 3 and 4
- [ ] Claude Code updates Views 3, 5, and 6 to write to `submissions` and Storage on submit, including the Rule 5 failure handling
- [ ] Claude Code updates View 7's copy per Section 8
- [ ] Test locally: a full pass through all three submission paths, confirming rows and files appear correctly, and confirming the anon key cannot read, update, or delete
- [ ] Run the em dash sweep, criterion 18
- [ ] Netlify MCP is active: Claude Code sets the anon key as an environment variable and deploys automatically

---

## Section 15 — Open Questions

| Question | Who answers it | Blocking? |
|----------|---------------|-----------|
| What is the real GDPR data statement purpose text and the real deletion contact, to replace the Section 7 placeholder? | Builder | No for the build itself, Claude Code builds with the placeholder text. Yes before any real supplier is given this URL. |
| Should the deployed URL be access restricted, for example with Netlify password protection, given that it now writes real data to a real database rather than discarding everything? | Builder | No, but strongly recommended, more so than in v2.1 |
| Cell E12 in the source workbook still carries a verification method dropdown where a tonnage belongs. Should the workbook be corrected? | Builder | No. The tool renders E12 as a number field regardless. |
| Should the typed signature field in the declaration be kept, or dropped as meaningless without real signature capture? | Builder | No. This spec assumes it is kept, unchanged from v2.1. |
| Should The Corporate logo in the navigation bar be restyled or replaced now that the brand has changed? | Builder | No. Claude Code retains the existing logo and flags it for review, unchanged from v2.1. |
| Now that a database record genuinely exists, should View 7 show a reference number or a download of the submission after all? | Builder | No. This spec keeps both out for this version, per an explicit decision during this iteration's interview, but it is worth revisiting since the original reason for omitting them no longer holds. |
| Should the `submissions` table use a single JSONB `payload` column per this spec's proposed design, or should Company Details, EcoVadis, questionnaire, and template data live in separate tables? | Builder | No. Claude Code proceeds with the single table design proposed in Section 5 if this is not answered before the build session. |

---

## Section 16 — Tool Version History

| Version | Date | What changed in the tool |
|---------|------|--------------------------|
| v1.0 | 12 June 2026 | Retroactive spec of the existing supplier onboarding landing page. Tier 1, D1 plus A1. Static page, two route cards, EcoVadis button to an external site, static Excel download, no user input. |
| v2.0 | 4 September 2026 | Both routes became submission doors inside the portal. Data model moved D1 to D2, session only input, still no database, tier unchanged at 1. Four new views added: EcoVadis form, guided seven section questionnaire, file upload with in browser parsing and review, and a shared confirmation view. File match validation and scorecard date validation added. Email return removed from all copy. Build constrained to internal testing only. |
| v2.1 | 7 September 2026 | Submission restructured behind a single gate question, "Do you have an EcoVadis scorecard?", replacing the two side by side route cards. Yes opens Plan A, No opens Plan B. Plan A now takes a scorecard file upload instead of a scorecard link. Questionnaire regrouped from S1 to S7 into Company Details, Environment, Social, Governance and Declaration. Download Template moved from the landing page into Plan B Option 2. Visual identity replaced entirely: Inter typeface with maroon `#BC2D2E` accent adopted. |
| v2.2 | 17 September 2026 | Added Supabase persistence: submissions and uploaded files are stored instead of discarded when the tab closes. Data model moved D2 to D3, tier moved 1 to 2, access model unchanged at A1. New shared Company and Contact Details step, company legal name, contact name, contact email, contact title or role, and GDPR consent, added as the first step of both Plan A and Plan B, ahead of their existing content, which is kept unchanged and separate by explicit decision. The EcoVadis scorecard file and the uploaded completed template file are now stored in Supabase Storage rather than read for metadata only. RLS restricts the public anon key to insert only on the submissions table and on both storage buckets; no client side read, update, or delete. No admin or review interface built; The Corporate reviews submissions directly in the Supabase dashboard. The submissions table's `contact_email` column is deliberately kept plain and indexable so supplier login can be added in a later version without a schema rebuild. GDPR outcome changed from confirmed not applicable to applies, with a placeholder data statement and deletion contact pending builder confirmation before real suppliers use the tool. Confirmation view copy updated to reflect that submissions are now genuinely recorded. |

---

*This spec is written for Claude Code. It assumes zero prior context. Every decision, rule, and requirement must be explicit enough that the builder can hand this document to Claude Code without a single verbal explanation.*
