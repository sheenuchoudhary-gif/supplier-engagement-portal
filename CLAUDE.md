# The Corporate Supplier Sustainability Portal 2026

## Identity
A public portal that onboards Tier 1 suppliers into The Corporate's ESRS aligned sustainability assessment; suppliers reach it via a direct URL from Procurement or EHS, and every completed submission, including uploaded files, is now written to Supabase instead of being discarded when the tab closes.
Tier: 2, public submission form, no login, data now persists to Supabase (D3+A1)
Spec version governed: v2.2, the version of docs/product-spec.md these rules were derived from.
Position: Standalone

## Session Protocol
At the start of every session:
1. Pull the latest from main before reading anything else.
2. Check docs/product-spec.md: if its version is newer than the "Spec version governed" line in this file, STOP. Tell the builder: "The spec has changed since this CLAUDE.md was written. Re-run the Project Governor on the revised spec before building, or these rules may contradict it." Do not build against a stale CLAUDE.md.
3. Read PROGRESS.md in the project root. It is the current state of this build. If it is missing, recreate it with the structure at the end of this section, then continue.
4. Increment the session number and update the date in PROGRESS.md.
5. If "Notes for next session" has content: repeat the notes back to the builder, treat them as this session's priorities, then clear the section.
6. If this is session 1, run First Session Setup below before any build work.

Save point, after completing any module, feature, fix, or schema change:
1. Update PROGRESS.md: current state, remaining work, build decisions, known issues.
2. If the database was touched, any table, policy, or bucket change, update docs/supabase-setup.md in the same save point.
3. Commit and push to main.
4. Tell the builder in one line: "Save point committed: [what changed]."
Do not start the next piece of work before the save point is pushed. Never end a session without one. An ending session is a save point.

First Session Setup (session 1 only, already complete for this project):
1. Create docs/ and move product-spec.md into it.
2. Announce what moved, then commit and push before building anything.
No brand skill is installed in this build. The brand is defined in the Brand section below.

PROGRESS.md structure (for the recreate rule): status header (Session / Last updated / Live URL), Current state, Last session (3 to 5 lines, replace each session), Remaining work (shrinking checklist), Build decisions (one line each), Known issues, Notes for next session.

## Commands
```
npx serve .
```

## Tech Stack
HTML, CSS, JavaScript, Netlify, Supabase. SheetJS (xlsx) and Inter both load from CDNs and run in the browser. Deployment: GitHub to Netlify, auto-deploys from main. Netlify MCP is active. Update the existing site, set environment variables, and deploy via MCP. Do not migrate this tool to React.

## Arms
Export, browser only, no server function: serves /assets/The_Corporate_Supplier_Questionnaire_2026.xlsx unmodified from the "Download Template" control inside Plan B Option 2 and View 6. Not generated, not populated, not altered.

## Environment Variables
SUPABASE_URL and SUPABASE_ANON_KEY, both from Supabase Project Settings, API, both Netlify environment variables.
Key storage follows function placement: this build has no server functions, so the browser reads these two Netlify environment variables directly. No value ever appears in code or in any file committed to GitHub. Confirm both exist before first use.

## Supabase
Project: "the-corporate-sustainability", does not exist yet. At the start of the session that builds this, confirm this name with the builder once more, then create the project via Supabase MCP before building anything. Region: EU (Frankfurt), since GDPR applies to this version. Plan: Free, pauses after roughly a week without traffic, acceptable for this stage; restore manually in the dashboard if needed.

Build this schema, authoritative until docs/supabase-setup.md exists:
submissions: id, created_at, submission_path, company_legal_name, contact_name, contact_email, contact_title, consent_given, scorecard_issue_date, scorecard_file_path, template_file_path, payload (JSONB)

Storage: two private buckets, one for the EcoVadis scorecard file (Plan A) and one for the completed template upload (Plan B Option 2). The spec does not name these buckets. Choose names during setup and record them in docs/supabase-setup.md.

RLS, build these policies, never skip:
submissions: anon can insert only. No select, update, or delete policy for anon at all. The service role, used only inside the Supabase dashboard, bypasses RLS and needs no explicit policy.
Both storage buckets: anon can insert (upload) only. No list or read policy, so an uploaded file cannot be read back through the anon key.

After setup, write docs/supabase-setup.md and update it at every save point that touches the database. It must contain project name, project ID, project URL, plan, every table with field names and types, RLS policies per table, the bucket names and their access rules, and a last updated line with date and session number. From the moment it exists, that file is the schema source of truth.

## Hard Rules
- API keys never in any frontend file or GitHub commit. Only the anon key is used by this tool, as a Netlify environment variable read directly by the browser; no server function exists in this build. The service role key is never used by this tool and must never appear anywhere in this repo; it exists only for The Corporate's own use inside the Supabase dashboard.
- Netlify Identity: never. Supabase Auth is not used in this build, since there are no accounts, and must not be introduced. RLS is never disabled on any table; if a query fails, fix the policy or the query.
- No em dashes in any interface string: headings, body copy, button labels, form labels, helper text, validation messages, and placeholder text, including copy drafted during the build. Use a comma, a full stop, a colon, or a rewritten sentence. Question text quoted verbatim from the workbook is the only exception. En dashes in numeric ranges are acceptable.
- The old visual identity is removed. No Playfair Display, no DM Sans, no Acid Lime, and no Ink, Stone, Linen or Chalk tokens anywhere in the codebase.
- The email arm is off. No email is sent by any path under any condition. The existing mailto: link to the EHS Help Desk stays, because it opens the user's own client and is not email sent by the tool.
- Browser storage, localStorage, sessionStorage, IndexedDB, cookies, is never used to persist form answers between refreshes, on any view including View 2. The non dismissible unsaved progress warning covers this. Nothing is saved until the final submit action succeeds and writes to the database.
- GDPR: the consent checkbox and the confirmed data statement from spec Section 7 are required on View 2 before continuing, on both doors. Personal data collected: company legal name, contact name, contact email, contact title, and, on the declaration step, the signatory name. Deletion requests go to the contact named in Section 7, still a placeholder there; it must be replaced with a real contact before real suppliers use this tool. Supabase region: EU (Frankfurt).

## Brand
No brand skill. These inline rules apply until one is added to the repo:
- Background #FFFFFF. Text #111111. Secondary text #555555 for helper, caption, and disabled states. Accent #BC2D2E, primary buttons, active states, and focus rings only, never large filled areas.
- Font: Inter from Google Fonts, fallback Helvetica Neue, Arial, system-ui, sans-serif.
- Type scale and spacing rhythm per spec Section 10. No drop shadows beyond what v1.0 already used.

## Business Rules
- The gate question is the only branch anywhere. No other conditional logic exists, and the gate answer itself is never stored or shown in the recap.
- View 2, Company and Contact Details, is a new shared first step on both doors: four required fields plus the GDPR consent checkbox, held in memory and merged into the submission row at final submit. It duplicates View 3's own company and contact fields by explicit design choice. Do not consolidate them.
- Plan A, View 3: four required fields plus a required scorecard file upload, pdf, png, or jpg under 10MB. No scorecard link field. Issue date must fall within the trailing 12 months and not be in the future.
- Plan B Option 1, View 5: 5 steps, 28 questions, 84 inputs, Supplier Response, Notes or Evidence, and Status, no required fields, unchanged from v2.1. Environment has five labelled sub-groups. Row 12 renders as a number field, a workbook error. Row 19 shows its PFAS note as static text only.
- Plan B Option 2, View 6: upload validation is all or nothing against the workbook's S1 to S7 structure, 7 headers, 7 section headings, 30 rows including rows 8 and 9. Any mismatch rejects with exactly "File format doesn't match. Download the Excel file." Rows 8 and 9 are validated but never shown in the review or the recap.
- Submission write, Rule 5, new: on submit, upload any file first. If the upload fails, show an inline retry message and do not write a row. If it succeeds, insert the submissions row. If that insert fails, show the same retry message and do not navigate to View 7. An orphaned uploaded file from a failed insert is left as is, no automatic cleanup is built.
- View 7, Confirmation: "Successfully submitted" plus a read only recap including the View 2 identity fields. Still no reference number, no download, no email confirmation.
- No admin or review interface is built; The Corporate reviews rows and files directly in the Supabase dashboard. Files are uploaded to Storage only at the point of final submission, never earlier, and no signed URL or download link is ever exposed inside the tool.
- The typed signature field in the declaration is kept, and the navigation logo is retained as is, both unchanged from v2.1; the logo is flagged for builder review.

Out of scope, do not build:
- Admin or review interface inside the tool, and a submission tracker across suppliers
- Resumable or save and continue progress, and supplier login; contact_email is kept plain and indexable so login can be added later without a schema rebuild
- Consolidating View 2's fields with View 3's own fields
- PFAS auto-flag review workflow, and automated EcoVadis scorecard validation
- Reorganising the downloadable workbook into the ESG grouping, and email notification on submission
- Reference or submission number, or a download control, on the confirmation view, and required field enforcement in the questionnaire, View 5

## Reference Docs
Read before building the related part:
- docs/product-spec.md, holding the full 28 question inventory, all seven view specifications, the five logic rules, the full brand system, and the 20 acceptance criteria
- docs/supabase-setup.md, the schema source of truth, created during this session
- /assets/The_Corporate_Supplier_Questionnaire_2026.xlsx, which must be re-verified against the inventory if View 5 or View 6 changes
PROGRESS.md in the root is read at every session start per the Session Protocol.
