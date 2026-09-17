# PROGRESS — The Corporate Supplier Sustainability Portal 2026

> Claude Code: read this file at the start of every session, before touching
> anything. Update it at every save point. Replace content, do not append.
> History lives in git.

**Session:** 3
**Last updated:** 17 September 2026
**Live URL:** Not yet confirmed reachable. PR #5 merged to `main`, but both
the production build and the deploy preview failed with Netlify's "Exposed
secrets detected" scan (see Known issues), so the live site was still
serving the pre-v2.2 build with no database connection. Fixed in this save
point by adding `SECRETS_SCAN_OMIT_KEYS` to `netlify.toml`; needs a fresh
push and deploy to confirm.

## Current state
The v2.2 build is complete in `index.html`: a single page, now eight
show/hide views (Landing, the new Company and Contact Details step, Plan A,
Plan B choice, questionnaire, upload, confirmation, EHS contact form),
deployable as a static site, with submissions and uploaded files now written
to Supabase instead of being discarded.

- **View 1, Landing:** Unchanged from v2.1. Gate buttons now call
  `startIdentity('a' | 'b')` instead of routing straight to Plan A / Plan B.
- **View 2, Company and Contact Details (new):** Shared by both doors. Four
  required fields (company legal name, contact name, contact email, contact
  title or role) plus the GDPR consent checkbox and the Section 7 placeholder
  data statement. Heading text changes by context ("EcoVadis submission, step
  1 of 2" vs "Complete your assessment, step 1"). Held in memory only
  (`identity` object), never in browser storage. Continue is blocked with
  inline messages until all four fields are valid and consent is checked.
  Does not consolidate with View 3's own duplicate fields, by explicit spec
  decision; the schema (Section 5) has no separate columns for View 3's own
  copies, so only View 2's values populate the row's plain columns, while
  View 3's own fields are still captured, validated, and shown in the View 7
  recap, matching the "duplication is intentional" instruction.
- **View 3, Plan A:** Unchanged fields from v2.1. On submit: uploads the
  scorecard file to the `ecovadis-scorecards` bucket, then inserts a
  `submissions` row with `submission_path` "ecovadis", using View 2's
  identity fields for the plain columns. Rule 5 failure handling: upload
  failure or insert failure shows an inline retry message, re-enables the
  submit button, and does not navigate to View 7.
- **View 4, Plan B choice:** Unchanged, back control now returns to View 2.
- **View 5, questionnaire:** Unchanged 5 steps / 28 questions / 84 inputs. On
  submit: inserts a `submissions` row with `submission_path` "questionnaire",
  `payload` holding `questionnaire_answers` (flat, keyed by row number) and
  the declaration fields. Same Rule 5 handling.
- **View 6, upload:** Unchanged Rule 1 validation (all-or-nothing against the
  workbook's S1 to S7 structure). On submit: uploads the original file to the
  `template-uploads` bucket, then inserts a row with `submission_path`
  "template_upload" and `payload` holding `template_parsed_answers` plus any
  declaration found. Same Rule 5 handling.
- **View 7, Confirmation:** Recap now includes a "Company and Contact
  Details" group sourced from View 2, ahead of the plan-specific recap, on
  all three paths. Lede copy updated to "Your submission has been recorded."
  Still no reference number, no download, no email claim.
- **Supabase:** Project `the-corporate-sustainability` (already existed,
  created before this session; see Known issues for the region note). Table
  `submissions` built with RLS, anon insert-only, no select, update, or
  delete policy for anon. Two private Storage buckets,
  `ecovadis-scorecards` and `template-uploads`, each with an anon
  insert-only policy scoped to that bucket only, no list or read policy.
  Verified directly via SQL: exactly three policies exist across both
  tables, all INSERT, all scoped to `anon`. `get_advisors` (security)
  returned zero findings. Full schema recorded in `docs/supabase-setup.md`.
- **Credentials:** `SUPABASE_URL` and `SUPABASE_ANON_KEY` are read from
  `window.SUPABASE_URL` / `window.SUPABASE_ANON_KEY`, set by `env.js`.
  `env.js` is generated only at Netlify build time by
  `scripts/generate-env.js` (wired via `netlify.toml`'s build command) from
  the two Netlify environment variables, and is gitignored, never committed.
  Locally (`npx serve .`), `env.js` does not exist and submissions correctly
  fail into the Rule 5 retry path rather than throwing.
- Root duplicate `product-spec.md` removed again; `docs/product-spec.md`
  (v2.2) is canonical.

## Last session
Session 3 opened from a fresh folder upload containing the v2.2
`product-spec.md`, an already-regenerated `CLAUDE.md`, and a stale
`PROGRESS.md` still describing v2.1 plus unchecked v2.2 remaining-work items.
Found the Supabase project already created (session before this one, or by
the builder) but empty, in `eu-west-1` (Ireland) instead of the spec's
`eu-central-1` (Frankfurt); builder chose to keep it in Ireland rather than
delete and recreate an empty project. No Netlify MCP tool was available this
session despite CLAUDE.md saying it is active; builder was told to set the
two environment variables manually once given the values. Built the full
v2.2 feature set: Supabase schema and Storage, View 2, and Supabase writes
on all three submission paths with Rule 5 failure handling. Tested locally
with Playwright; this sandbox's network policy blocks `supabase.co`,
`cdnjs.cloudflare.com`, and `cdn.jsdelivr.net` outright (confirmed via the
proxy status endpoint), so the Rule 5 failure path was exercised for real
(client unreachable) rather than simulated, and RLS was verified by
querying `pg_policy` directly through the Supabase MCP rather than through
a browser anon-key call.

## Remaining work
- [ ] Builder: confirm the next deploy (production and/or a new PR preview)
      passes Netlify's secret scan now that `SECRETS_SCAN_OMIT_KEYS` is set,
      and that the live site loads.
- [ ] Once live, click through all three submission paths against the real
      Supabase project, from a normal browser, and confirm a row appears in
      the `submissions` table editor and a file appears in the matching
      Storage bucket for Plan A and Plan B Option 2 (acceptance criterion
      20). This sandbox could not do this itself, its network policy blocks
      `supabase.co`.
- [ ] Confirm the .xlsx upload path (not just CSV) once a browser can reach
      `cdnjs.cloudflare.com`; this session's CSV upload test exercised the
      same validator and Supabase write path successfully, but SheetJS
      itself remains unverified live, carried over from session 1.
- [ ] Builder: decide whether the deployed URL should be access restricted
      (spec Section 15), now more relevant since it writes real data.
- [ ] Builder: supply the real GDPR data statement purpose text and a real
      deletion contact to replace the Section 7 placeholder, before any real
      supplier uses this tool (spec's build constraint, blocking for go
      live, not for this build).
- [ ] Builder: decide whether to recreate the Supabase project in
      `eu-central-1` (Frankfurt) to match CLAUDE.md exactly, or accept
      `eu-west-1` (Ireland) as documented in `docs/supabase-setup.md`.
- [ ] Acceptance criteria 26 equivalent (full manual pass on a real phone)
      and a post-deploy check still need a human pass, carried over.
- [ ] Cell E12 workbook correction, typed signature field, and navigation
      logo review, all carried over from v2.1, builder has not decided.
[Rule: completed items leave this list and are absorbed into Current state. This list only shrinks.]

## Build decisions
- View 2's identity fields, not View 3's own duplicate fields, populate the
  `submissions` row's plain columns (`company_legal_name`, `contact_name`,
  `contact_email`, `contact_title`), since spec Section 5's schema has no
  second set of columns for the duplicate. View 3's own fields stay in the
  UI, required and validated, unchanged from v2.1, and are shown in the View
  7 recap, but their entered values are not separately persisted.
- Supabase JS is loaded from `cdn.jsdelivr.net` (the `@supabase/supabase-js`
  UMD build), a new CDN beyond the two CLAUDE.md already names (SheetJS,
  Google Fonts), since no client library ships any other way for a
  build-step-free static site. Loaded the same way as SheetJS: a plain
  `<script>` tag, no bundler.
- `env.js` plus a `netlify.toml` build command (`node scripts/generate-env.js`)
  is the mechanism by which the browser reads the two Netlify environment
  variables, since this build has no server function and Netlify does not
  inject env vars into static HTML on its own. `env.js` is gitignored and
  exists only inside Netlify's build output, never in the repository, per
  the hard rule that no credential value appears in any committed file.
- `submitToDatabase()` is one shared helper used by all three submit paths
  (Views 3, 5, 6), implementing Rule 5 uniformly: upload first if a file is
  involved, insert the row only after a successful upload, surface the same
  kind of inline retry message on either failure, never navigate to View 7
  until the insert succeeds.
- Storage object paths use a random UUID plus the original file extension,
  not the original filename, avoiding any collision or special-character
  handling; the original filename is preserved only in the on-screen recap,
  not in the stored path.
- Payload JSON for the questionnaire and template upload paths stores flat,
  row-number-keyed answers (`{ "11": {response, notes, status}, ... }`)
  rather than the grouped recap structure, since the grouped structure exists
  only to drive the on-screen recap and is trivially rebuildable from the
  flat form, keeping the stored payload smaller and simpler for a reviewer
  reading it directly in the Supabase table editor.
- Portal question display text for rows 12 and 40 still uses the spec's
  wording (no em dash); the upload validator still matches the workbook's
  own literal text separately for those two rows. Carried over from v2.1,
  unaffected by this session's changes.

## Known issues
- Netlify's built-in secret scanner failed both the production build and the
  PR #5 deploy preview with "Exposed secrets detected", because `env.js`
  intentionally contains the literal `SUPABASE_URL` and `SUPABASE_ANON_KEY`
  values so the browser can read them at runtime. Fixed by adding
  `SECRETS_SCAN_OMIT_KEYS = "SUPABASE_URL,SUPABASE_ANON_KEY"` under
  `[build.environment]` in `netlify.toml`, telling the scanner these two are
  expected to appear in the published output. Confirm the next deploy
  passes.
- The Supabase project already existed in `eu-west-1` (Ireland) rather than
  the spec's `eu-central-1` (Frankfurt) when this session started, with no
  tables yet. Builder was asked and chose to keep it in Ireland rather than
  delete and recreate an empty project. Ireland is within the EU/EEA, so
  this does not change the GDPR outcome, but it is a deviation from the
  written spec and CLAUDE.md. Recorded in `docs/supabase-setup.md`.
- This session had no Netlify MCP tool available, despite CLAUDE.md and the
  spec both stating it is active and connected. Could not check the site's
  live status, set environment variables, or trigger a deploy. The builder
  must do the environment variable step manually; the existing GitHub to
  Netlify auto-deploy from `main` should otherwise still apply once this
  session's changes are pushed and merged.
- Carried over from session 2, still unconfirmed: whether the Netlify
  deploy preview's "Site not found" issue was transitional or a real site
  configuration problem.
- This sandbox's network policy blocks `supabase.co`, `cdnjs.cloudflare.com`,
  and `cdn.jsdelivr.net` outright (403 policy denial at the egress proxy,
  confirmed via the proxy status endpoint), so the full submission flow,
  including SheetJS-based .xlsx parsing and a real Supabase write, could not
  be exercised end to end from here. What could be verified locally: all
  navigation and validation logic, the CSV upload path end to end against
  the real Rule 1 validator, and the Rule 5 failure path for real (the
  Supabase client genuinely could not connect). RLS was verified by querying
  `pg_policy` directly, not by attempting a live anon-key read.
- Navigation logo, typed signature field, and cell E12 workbook issue: all
  carried over from v2.1 and v2.2's spec, unchanged, still flagged for
  builder review.
- GDPR data statement and deletion contact in View 2 are still the Section 7
  placeholder text. Must be replaced with real values before any real
  supplier uses this tool; this is an explicit, acknowledged build
  constraint, not an oversight.

## Notes for next session
None.
