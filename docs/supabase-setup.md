# Supabase Setup, The Corporate Supplier Sustainability Portal 2026

This file is the schema source of truth from the moment it exists, per CLAUDE.md.
Update it at every save point that touches the database.

## Project

| Detail | Value |
|--------|-------|
| Name | the-corporate-sustainability |
| Project ID | `txnvlyrvjjuuqyjelkep` |
| Project URL | `https://txnvlyrvjjuuqyjelkep.supabase.co` |
| Plan | Free |
| Region | `eu-west-1` (Ireland) |

**Region note:** CLAUDE.md and the spec call for `eu-central-1` (Frankfurt). The project
already existed in `eu-west-1` when this session started (created 11 September 2026, before
any table existed). The builder was asked and chose to keep it in Ireland rather than delete
and recreate an otherwise-empty project. Ireland is within the EU/EEA, so this does not change
the GDPR outcome in spec Section 7; it is a deviation from the written spec, recorded here for
visibility.

## Table: `submissions`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key, default `gen_random_uuid()` |
| created_at | timestamptz | Default `now()` |
| submission_path | text | Not null, one of `ecovadis`, `questionnaire`, `template_upload` (CHECK constraint) |
| company_legal_name | text | Not null |
| contact_name | text | Not null |
| contact_email | text | Not null |
| contact_title | text | Not null |
| consent_given | boolean | Not null |
| scorecard_issue_date | date | Nullable, Plan A only |
| scorecard_file_path | text | Nullable, Plan A only, Storage path in `ecovadis-scorecards` |
| template_file_path | text | Nullable, Plan B Option 2 only, Storage path in `template-uploads` |
| payload | jsonb | Nullable, holds `questionnaire_answers` + declaration fields (Plan B Option 1) or `template_parsed_answers` + declaration fields (Plan B Option 2) |

### RLS policies, `submissions`

RLS is enabled. One policy exists:

| Policy | Role | Operation | Effect |
|--------|------|-----------|--------|
| `anon_insert_only` | anon | INSERT | `with check (true)`, unrestricted insert |

No SELECT, UPDATE, or DELETE policy exists for `anon`. The service role, used only inside the
Supabase dashboard, bypasses RLS entirely and needs no explicit policy.

## Storage buckets

Both buckets are private (`public = false`).

| Bucket | Holds | File size limit | Allowed MIME types |
|--------|-------|-----------------|---------------------|
| `ecovadis-scorecards` | Plan A scorecard file upload | 10 MB | `application/pdf`, `image/png`, `image/jpeg` |
| `template-uploads` | Plan B Option 2 completed workbook or CSV | 10 MB | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, `application/vnd.ms-excel`, `text/csv`, `application/csv` |

### RLS policies, Storage

| Policy | Role | Operation | Effect |
|--------|------|-----------|--------|
| `anon_insert_scorecards` | anon | INSERT | `with check (bucket_id = 'ecovadis-scorecards')` |
| `anon_insert_templates` | anon | INSERT | `with check (bucket_id = 'template-uploads')` |

No list or read (SELECT) policy exists for `anon` on `storage.objects`, on either bucket, so an
uploaded file cannot be read back through the anon key. Files are retrieved by The Corporate
through the Supabase Storage browser in the dashboard, using the service role.

## Auth

Not configured. This build uses no accounts (Access Model A1). No Supabase Auth provider is
enabled and none should be added in this version.

## Credentials

| Credential | Where it lives |
|-----------|----------------|
| Anon key (legacy, JWT) | Netlify environment variable `SUPABASE_ANON_KEY`, read directly by the browser at build time via `env.js` (see `netlify.toml`). Never committed to this repo. |
| Service role key | Not used anywhere in this repository. Exists only for The Corporate's own use inside the Supabase dashboard. |

The project URL (`https://txnvlyrvjjuuqyjelkep.supabase.co`) is stored as the Netlify
environment variable `SUPABASE_URL`, same mechanism, same non-commit rule.

## Advisors

`get_advisors` (security) returned zero lint findings after the migrations below were applied.

## Migrations applied

1. `create_submissions_table`, creates the table, enables RLS, adds the anon insert-only policy.
2. `create_storage_buckets_and_policies`, creates both buckets and their anon insert-only
   storage policies.

---

**Last updated:** 17 September 2026, Session 3.
