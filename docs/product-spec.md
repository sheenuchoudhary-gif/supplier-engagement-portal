# Product Spec — The Corporate Supplier Sustainability Portal 2026

**Version:** 2.0
**Date:** 4 September 2026
**Author:** Zyad Hatquai
**Status:** Confirmed

---

> ⚠ **BUILD CONSTRAINT — READ BEFORE BUILDING ANYTHING**
>
> This version of the tool **stores nothing and sends nothing**. Every submission door renders an on-screen confirmation and then discards the data when the tab closes. No database, no email, no server-side storage.
>
> This build exists to validate the submission experience with The Corporate's internal EHS and Procurement teams. **It must not be circulated to Tier 1 suppliers.** A supplier who completed it would see "Successfully submitted" and The Corporate would receive nothing.
>
> Claude Code must not describe this build as production-ready, must not imply data is retained anywhere in the UI copy, and must not add any storage, email, or persistence capability that is not specified in this document.

---

## Section 1 — Tool Summary

**Tool name:** The Corporate Supplier Sustainability Portal 2026

**What it does:** A single public page that onboards Tier 1 suppliers into The Corporate's ESRS-aligned sustainability assessment programme and, in this version, turns both submission routes into doors inside the portal. Suppliers with an EcoVadis scorecard submit their scorecard details through a short in-portal form. Suppliers without one either complete the seven-section questionnaire directly in the portal or download the Excel template, complete it internally, and upload the finished file back for review before submitting.

**Who uses it:** Tier 1 supplier contacts — sustainability managers, EHS leads, and procurement representatives at supplier organisations — who receive the URL directly from The Corporate's Procurement or EHS team. In this version, the audience is The Corporate's own internal EHS and Procurement teams testing the flow before it is given to suppliers.

**Why it exists:** V1 routed suppliers to an external site or to a downloadable Excel returned by email. This version proves whether suppliers can complete the assessment inside the portal itself, so that the email exchange can be removed in a later version once persistence is added.

**Build status:** Iteration. The previous version (v1.0, 12 June 2026) is a Tier 1 static single-page landing page built as `supplier_onboarding.html` — hardcoded content, two buttons, one static Excel download, no user input of any kind. This build keeps that page's structure, copy, brand, and layout intact and changes only the **Two Routes** section, adding four new views behind it: an EcoVadis submission form, a guided seven-section questionnaire, a file upload and review view, and a shared confirmation view.

---

## Section 2 — Classification

### Data Model

**Decision:** D2

| Label | What it means | This tool? |
|-------|--------------|-----------|
| D1 — Hardcoded | All data is written into the code by the developer. Users cannot input anything that persists. The tool displays what the developer put in. | No |
| D2 — Session | Data enters the tool during use and disappears when the tab closes. No database. Covers both uploaded files and form inputs. | Yes |
| D3 — Persisted | Data is written to a database and survives after the session ends. Supabase is required. | No |

**Reason:** Suppliers now type answers and upload a file, so the tool takes user input — but nothing is transmitted or retained. All input lives in browser memory for the length of the session and is intentionally discarded when the tab closes or reloads.

**This is a change from v1.0, which was D1.** No user input existed at all in the previous version.

**D3 is triggered if any of the following are true — none apply in this build:**
- [ ] Data must be retrievable after the session ends
- [ ] Multiple sessions contribute to the same dataset
- [ ] An audit trail or history is needed
- [ ] Data submitted by one person must be visible to another
- [ ] Results must be accessible via a URL after the session ends
- [ ] Files uploaded by users must be stored and retrievable later

> Every one of these triggers **will** apply to the next version of this tool. See Section 12.

---

### Access Model

**Decision:** A1

| Label | What it means | This tool? |
|-------|--------------|-----------|
| A1 — Public | Anyone with the URL can use it. No login, no account required. | Yes |
| A2 — Authentication | Users must log in. All logged-in users see the same thing and have the same permissions. | No |
| A3 — Authorization | Users must log in and have different roles. Different roles see different data or have different permissions. | No |

**Reason:** The portal is distributed as a direct link. No account, no login, no identity check. Unchanged from v1.0.

---

### Tier

**Tier:** 1

| Tier | D+A combination | Stack | Deployment |
|------|----------------|-------|------------|
| 1 | D1+A1 or D2+A1 | Netlify only | Netlify |
| 2 | D3+A1 | Netlify + Supabase (no auth) | Netlify |
| 3 | D3+A2 or D3+A3 | Netlify + Supabase (auth + RLS) | Netlify |

D2 + A1 resolves to Tier 1. No database, no accounts, Netlify alone. Same tier as v1.0.

---

### Standalone or Stack

**This tool is:** Standalone — it does not share a database with any other tool. There is no database.

---

## Section 3 — Arms

### AI API Arm

**Active:** No

---

### Export Arm

**Active:** Yes

| Detail | Answer |
|--------|--------|
| Format | XLSX |
| What is exported | `The_Corporate_Supplier_Questionnaire_2026.xlsx` — the pre-formatted Excel workbook, served as a static asset from the project's `/assets/` folder. Unchanged from v1.0. The file is not generated, not populated server-side, and not modified in any way. **What changes in this version is only its placement:** the "Download Assessment" button now sits inside the Full Questionnaire card as the entry point to Door Two, rather than standing alone as the route's only action. |
| PDF design intent | N/A — format is XLSX only |

> The confirmation view does **not** offer a download of what the supplier submitted. Providing one would imply a record exists. See Section 8.

---

### Email Arm

**Active:** No

> Explicitly confirmed during the interview: no email is sent anywhere, by any route, under any condition. The `mailto:` link to the EHS Help Desk in the Key Resources section is retained from v1.0 — it opens the user's own email client and is not an email sent by the tool.

---

### Scheduled Automation Arm

**Active:** No

---

## Section 4 — Stack and Deployment

### All Tiers

| Detail | Answer |
|--------|--------|
| Frontend framework | HTML/CSS/JS. **Do not migrate this tool to React.** v1.0 exists as a built single-page HTML file with the brand CSS already applied; rewriting it in React would discard working, brand-verified markup for no functional gain. The four new views are rendered as show/hide sections within the same page, or as additional static pages sharing the same stylesheet — Claude Code chooses, but the v1.0 landing page markup and CSS must be preserved. |
| Deployment target | Netlify |
| Netlify MCP | **Active** — Netlify is connected via Claude Desktop Connectors. Claude Code will create or update the site and deploy automatically. |

**Client-side library required:**
Reading the uploaded `.xlsx` workbook requires **SheetJS (xlsx)**, loaded from a CDN and run entirely in the browser. No account, no API key, no server. CSV parsing needs no library. No file is ever transmitted off the supplier's device.

**GitHub — pre-build requirement for all Tier 1, 2, and 3 tools:**
The user creates the GitHub repo before the first Claude Code session. The `product-spec.md`, `CLAUDE.md`, and `PROGRESS.md` must be uploaded to the repo root before Claude Code opens. Claude Code assumes the repo exists, commits changes regularly, and pushes to main. It does not create or configure the repo.

---

### CONDITIONAL: Supabase project

N/A — Tier 1. No Supabase project, no database, no schema.

---

### CONDITIONAL: Stack

N/A — standalone tool.

---

## Section 5 — Data Architecture

**N/A — Data Model is D2. There is no database and no schema to build.**

For completeness, this is what the tool holds **in browser memory only**, and discards on tab close or refresh:

| What is held | Where it comes from | Fate |
|-------------|--------------------|------|
| Company legal name, contact name, contact email, scorecard link, scorecard issue date | EcoVadis door — typed by supplier | Discarded |
| 30 Supplier Response values | Guided door — typed or selected by supplier | Discarded |
| 30 Notes / Evidence values | Guided door — typed by supplier | Discarded |
| 30 Status values | Guided door — selected by supplier | Discarded |
| Signatory name, declaration date, typed signature | Guided door declaration step | Discarded |
| Parsed contents of an uploaded workbook or CSV | Upload door — read in the browser | Discarded |

**File storage:** No. The uploaded file is read in the browser using the File API and never leaves the supplier's device. It is not uploaded to Netlify, not posted to any endpoint, and not retained after the session.

**Derived or calculated data:** No.

---

## Section 6 — Access and Permissions

**N/A — Access Model is A1.** No authentication, no roles, no RLS.

---

## Section 7 — GDPR

**GDPR outcome:** **Not applicable — confirmed.**

The tool's forms do collect fields that would ordinarily be personal data: contact name, contact email, company name, authorised signatory name. However, this build transmits nothing and stores nothing. The data never leaves the supplier's own browser, The Corporate never receives it, and no data controller relationship is created. There is nothing to consent to, nothing to hold, and nothing to delete.

> ⚠ **This outcome reverses the moment persistence is added.** The next version of this tool — the one that writes submissions to a database — collects contact name, contact email, company legal name, and authorised signatory name through its forms. That version's spec must include a consent checkbox, a data statement shown at the point of collection, and a named deletion contact, per the Phase 9 framework. This is flagged here so it is not missed at that point.

---

## Section 8 — Screen and UI Structure

The tool has five views. View 1 is the existing v1.0 landing page with one section modified. Views 2 to 5 are new.

---

### View 1 — Landing Page

- **Purpose:** Communicate The Corporate's programme and let the supplier choose their route. Entry point for everything.

- **What is visible:** Identical to v1.0 — navigation bar with The Corporate logo; hero with the "SUPPLIER PROGRAMME 2026" pill, H1, body paragraph, and the four-figure stats row (690,000 tCO₂e / 71% Scope 3 / 2045 / 500+); the "Why We Are Asking" section; the "Two Routes. One Destination." section; the four-step "What Happens Next" timeline; the three Key Resources cards; the footer. **Only the Two Routes section changes.**

  **Two Routes. One Destination. — revised**

  Two cards side by side, stacking on mobile, exactly as v1.0 lays them out. No gate question and no path-selection screen in front of them. The supplier reads both cards and chooses.

  - **Card 1 — "ECOVADIS SCORECARD"**
    Retains its v1.0 label and description: suppliers holding a valid EcoVadis scorecard issued within the last 12 months may submit their scorecard instead of completing the full questionnaire.
    - Primary CTA: **"Submit EcoVadis Scorecard"** → opens **View 2** inside the portal.
    - **Changed from v1.0:** this button previously opened `ecovadis.com` in a new tab. It no longer leaves the site.

  - **Card 2 — "FULL QUESTIONNAIRE"**
    Description explains that suppliers without a valid scorecard complete the ESRS-aligned assessment, and that they may do so either in the portal or offline in Excel. Copy must no longer reference returning the file by email.
    - Button A: **"Fill in the portal"** → opens **View 3**.
    - Button B: **"Upload completed file"** → opens **View 4**.
    - Button C: **"Download Assessment"** → downloads `The_Corporate_Supplier_Questionnaire_2026.xlsx` from `/assets/`. Presented as the companion to Button B, visually secondary to A and B.

- **User actions:** Choose a route, download the Excel, open any Key Resource, contact the EHS Help Desk via `mailto:`, scroll.

- **What happens next:** Route buttons navigate to views 2, 3, or 4. All other actions behave as in v1.0.

---

### View 2 — EcoVadis Submission

- **Purpose:** Capture a supplier's existing EcoVadis scorecard details without leaving the portal.

- **What is visible:**
  - Section heading and a short line of context restating that the scorecard must have been issued within the last 12 months.
  - Five fields, all required:

    | Field | Type | Notes |
    |-------|------|-------|
    | Company legal name | Text | |
    | Contact name | Text | |
    | Contact email | Email | Format validated |
    | EcoVadis scorecard link | URL | Format validated |
    | Scorecard issue date | Date | Must be within the last 12 months of today's date — see Section 9 |

  - A back link returning to the landing page.
  - Submit button.

- **User actions:** Complete the five fields and submit, or go back.

- **What happens next:** On valid submission → **View 5**. On invalid input, inline field-level messages; the form does not submit.

---

### View 3 — Guided Questionnaire (Door One)

- **Purpose:** Let the supplier complete the full assessment inside the portal, section by section.

- **What is visible:**
  - **A persistent, prominent warning above the form, visible on every step:** the supplier's progress is not saved, and refreshing, navigating back, or closing the tab will lose all answers. The assessment must be completed in one sitting. This warning is mandatory and must not be dismissible.
  - A step indicator showing position in the sequence (e.g. "Section 3 of 7").
  - One section per screen, in workbook order, with Back and Next controls. Next does not block on incomplete answers — no field is enforced as required.
  - For every question: its section code, its ESRS reference, its full question text, and **three inputs**:
    1. **Supplier Response** — type per the inventory below
    2. **Notes / Evidence** — free text, every question
    3. **Status** — dropdown on every question: `Not Started` / `In Progress` / `Complete` / `N/A` / `EcoVadis Bypass`
  - **Step 8 — Declaration.** Displays the declaration text from the workbook: *"I confirm that the information provided in this assessment is accurate and complete to the best of my knowledge."* Three fields: Authorised Signatory Name (text), Date (date), Signature (text — a typed name standing in for a signature, since a browser form cannot capture a real one). Submit button.

- **User actions:** Move through the seven sections, answer any combination of the 90 inputs, complete the declaration, submit.

- **What happens next:** Submit → **View 5**.

**Question inventory — all 30 questions, in workbook order. Claude Code must reproduce these exactly and must not invent, reword, reorder, or omit any of them.**

Source: `The_Corporate_Supplier_Questionnaire_2026.xlsx`, sheet `Supplier Assessment 2026`. Row numbers are given so the build can be verified against the file.

#### S1 — General Information & EcoVadis Bypass (All ESRS)

| Row | ESRS ref | Response input type | Question text |
|-----|----------|--------------------|---------------|
| 6 | — | Text (multi-line) | Legal name and registered country of the responding entity. |
| 7 | — | Text (multi-line) | Primary contact name, title, and email address for this assessment. |
| 8 | Bypass | Dropdown: `Yes — Scorecard Attached` / `No — Will Complete Questionnaire` | Do you hold a valid EcoVadis Sustainability Scorecard (issued within the last 12 months)? If YES: attach scorecard link in the Notes column and proceed directly to the Status column. Sections S2–S7 are not required. |
| 9 | — | Text | EcoVadis Scorecard Link (if applicable). Paste URL or attach document reference. |

> Rows 8 and 9 are rendered for fidelity to the workbook but **drive no behaviour in the tool** — see Section 9.

#### S2 — Climate & Decarbonisation (ESRS E1)

| Row | ESRS ref | Response input type | Question text |
|-----|----------|--------------------|---------------|
| 11 | E1-4 | Number | Total Scope 1 emissions for last fiscal year (metric tonnes CO₂e). Include verification method. |
| 12 | E1-4 | Number | Total Scope 2 emissions for last fiscal year — market-based (metric tonnes CO₂e). |
| 13 | E1-4 | Number | Total Scope 3 emissions for last fiscal year (metric tonnes CO₂e). Specify categories included. |
| 14 | E1-3 | Dropdown: `Yes` / `No` | Does your organisation have a Science-Based Target (SBTi) validated decarbonisation target? |
| 15 | E1-2 | Text (long) | Describe your top three decarbonisation projects currently in progress or planned for the next 24 months. Include estimated tCO₂e reduction and the specific technology being utilised (e.g., electrification of heat, on-site renewables). |
| 16 | E1-2 | Text (long) | What are the primary technical or financial barriers preventing you from reaching a 50% reduction in Scope 1 and 2 emissions by 2030? |

> **Row 12 correction.** In the source workbook, cell E12 carries a dropdown restricted to `Verified by Third Party / Internally Calculated / Estimated / Not Tracked`, which makes it impossible to enter a tonnage. This is a workbook error. The tool renders row 12 as a **number field**, consistent with rows 11 and 13. See Section 15.

#### S3 — Pollution & PFAS (ESRS E2)

| Row | ESRS ref | Response input type | Question text |
|-----|----------|--------------------|---------------|
| 18 | E2-3 | Number | Total weight of substances of concern (REACH, SVHC list) used in production last fiscal year (kg). |
| 19 | E2-3 | Dropdown: `Yes` / `No` | Do any of your products or production processes contain or utilise PFAS compounds ("Forever Chemicals")? |
| 20 | E2-3 | Text (long) | If your products contain PFAS, detail your substitution roadmap. Have you identified viable non-PFAS alternatives? Provide your target date for a complete phase-out. |
| 21 | E2-2 | Text (long) | Describe your industrial wastewater treatment process. What specific measures are in place to ensure zero leakage of hazardous chemicals into local water systems? |

> Row 19 carries a note in the workbook: *"⚠ AUTO-FLAG: 'Yes' triggers PFAS Risk review"*. Display this as static helper text beneath the question. **No flagging behaviour is built in this version** — see Section 12.

#### S4 — Water & Marine Resources (ESRS E3)

| Row | ESRS ref | Response input type | Question text |
|-----|----------|--------------------|---------------|
| 23 | E3-1 | Number | Total water withdrawal last fiscal year (m³). Specify source (municipal, groundwater, surface). |
| 24 | E3-1 | Dropdown: `Yes` / `No` | Is your primary production facility located in a high-water-stress region (WRI Aqueduct score ≥3)? |
| 25 | E3-2 | Text (long) | Provide details on any water-saving or closed-loop recycling projects implemented at your facility. How has your total water intensity (litres per unit produced) changed over the last three years? |
| 26 | E3-2 | Text (long) | If your facility is in a high-water-stress region, what is your operational contingency plan for severe drought conditions to ensure supply continuity to The Corporate? |

#### S5 — Circular Economy & Waste (ESRS E5)

| Row | ESRS ref | Response input type | Question text |
|-----|----------|--------------------|---------------|
| 28 | E5-2 | Number | Total waste generated last fiscal year (tonnes). Breakdown: landfill / recycled / energy recovery / hazardous. |
| 29 | E5-4 | Number | Percentage of post-consumer recycled (PCR) content in the components supplied to The Corporate (%). |
| 30 | E5-3 | Text (long) | How are you incorporating circularity into the specific components you supply to The Corporate? Examples: design for disassembly, modularity, or increasing PCR content. |
| 31 | E5-2 | Text (long) | Detail your strategy for achieving Zero Waste to Landfill. What are your primary waste streams, and what innovative recycling or upcycling initiatives have you launched recently? |

#### S6 — Biodiversity & Ecosystems (ESRS E4)

| Row | ESRS ref | Response input type | Question text |
|-----|----------|--------------------|---------------|
| 33 | E4-2 | Dropdown: `Yes` / `No` | Are any of your production sites located within or adjacent to (within 1 km) a protected area or biodiversity hotspot? |
| 34 | E4-3 | Text (long) | Describe any initiatives taken to minimise the impact of your operations on local biodiversity. Include land-use management, native planting schemes, or light/noise pollution reduction. |
| 35 | E4-5 | Text (long) | Have you undertaken a biodiversity impact assessment (TNFD or equivalent) for your primary production sites? If yes, share key findings. If no, provide your target assessment date. |

#### S7 — Social, Labour & Governance (ESRS S2 · G1)

| Row | ESRS ref | Response input type | Question text |
|-----|----------|--------------------|---------------|
| 37 | S2-1 | Dropdown: `Yes` / `No` | Does your organisation have a formal Human Rights and Labour Rights Policy, aligned with the UN Guiding Principles on Business and Human Rights? |
| 38 | S2-2 | Dropdown: `Yes` / `No` | Have you conducted a human rights due diligence assessment of your Tier 1 and Tier 2 supply chains in the last 24 months? |
| 39 | S2-4 | Text (long) | Describe the grievance mechanism available to workers in your supply chain. How many grievances were filed and resolved in the last 12 months? |
| 40 | G1-1 | Dropdown: `Yes` / `No` | Does your organisation have a verified conflict minerals policy (3TG — tin, tantalum, tungsten, gold) in place, including OECD Due Diligence guidance compliance? |
| 41 | G1-2 | Text (long) | Describe your supplier code of conduct and how compliance is monitored across your own supply chain. Include details of any third-party audits conducted in the last 24 months. |

**Totals to verify against: 7 sections, 30 questions, 90 response inputs, plus 3 declaration fields.**

---

### View 4 — Upload Completed File (Door Two)

- **Purpose:** Accept the completed workbook back, read it in the browser, and show the supplier what was found before they submit.

- **What is visible — initial state:**
  - Short instruction: upload the completed questionnaire, either the Excel workbook or a CSV export of it.
  - File picker accepting `.xlsx` and `.csv` only. Drag-and-drop optional.
  - A link to download the template again, for suppliers who arrive here without it.
  - Back link to the landing page.

- **What is visible — after a file that passes validation:**
  - The parsed answers rendered read-only, grouped by section S1 to S7, in workbook order, showing for each question: the question text, the Supplier Response, the Notes / Evidence, and the Status found in the file. Empty cells display as blank rather than being hidden, so the supplier can see what they left out.
  - The declaration values if present in the file.
  - A "Replace file" control to start over.
  - Submit button beneath the review.

- **What is visible — after a file that fails validation:**
  - The exact message: **"File format doesn't match — Download the Excel file"**, with the download control alongside it.
  - No partial import, no preview, no list of what was missing. The file is rejected outright and the view returns to its initial state.

- **User actions:** Select a file, review what was read, replace the file, submit, or go back.

- **What happens next:** Submit → **View 5**.

---

### View 5 — Confirmation

- **Purpose:** Confirm to the supplier that their submission was received, and show what was submitted.

- **What is visible:**
  - Heading: **"Successfully submitted"**
  - A recap of what was submitted, rendered read-only. For the EcoVadis route, the five field values. For either questionnaire door, the answers grouped by section S1 to S7 with all three values per question, plus the declaration.
  - A link back to the landing page.
  - **Not present:** no reference or submission number, no download of the submission, no "we will be in touch" claim about a response, no email confirmation. A reference number would imply a stored record exists.

- **User actions:** Read the recap, return to the landing page.

- **What happens next:** Nothing. The data is discarded when the tab closes or the page reloads. No transmission occurs at any point.

---

## Section 9 — Logic and Calculations

This tool performs **no scoring, no calculation, and no conditional rendering based on any supplier answer.** Three rules govern behaviour.

### Rule 1 — File match validation (View 4)

An uploaded file is **accepted** only if all of the following are true:

1. It is a `.xlsx` workbook or a `.csv` file.
2. All **seven column headers** are present and intact: `SECTION`, `ESRS REF`, `TYPE`, `QUESTION / METRIC`, `SUPPLIER RESPONSE`, `NOTES / EVIDENCE`, `STATUS`.
3. All **seven section headings** are present: S1 General Information & EcoVadis Bypass, S2 Climate & Decarbonisation, S3 Pollution & PFAS, S4 Water & Marine Resources, S5 Circular Economy & Waste, S6 Biodiversity & Ecosystems, S7 Social, Labour & Governance.
4. All **thirty question rows** are present, **in the order given in Section 8**, matched on question text.

If any condition fails, the file is **rejected outright** with the message "File format doesn't match — Download the Excel file". There is no partial import and no attempt to salvage matched rows. The same rule applies identically to the CSV export.

**Rationale for strictness, recorded so it is not softened during the build:** suppliers routinely insert rows, rename sheets, merge cells, or delete sections that do not apply to them. A lenient parser silently drops answers, which is worse than a clear rejection.

### Rule 2 — No EcoVadis branching inside the guided questionnaire

The workbook instructs that a supplier answering YES at row 8 may skip S2 to S7. **The tool does not implement this branch.** Rows 8 and 9 render as ordinary questions and drive no behaviour. The guided questionnaire always walks all seven sections in order.

This is deliberate: EcoVadis holders have their own door (View 2) on the landing page, which makes an in-form bypass redundant. Claude Code must not add skip logic.

### Rule 3 — Scorecard date validation (View 2)

The scorecard issue date must fall within the 12 months preceding today's date. A date outside that window, or in the future, produces an inline validation message and blocks submission. This is the only rule in the tool that rejects an otherwise complete input.

### Edge cases

| Case | Behaviour |
|------|-----------|
| Supplier leaves questionnaire fields blank | Allowed. No field in the guided questionnaire is required. Blanks appear as blank in the confirmation recap. |
| Supplier refreshes, navigates back, or closes the tab mid-form | All answers are lost. This is by design and is warned about on every step of View 3. |
| Uploaded file matches but every answer cell is empty | Accepted. The review renders all thirty questions with blank values; the supplier may still submit. |
| Uploaded file is over ~10 MB or is not a real workbook despite its extension | Rejected with the standard message. |
| Supplier opens a submission view directly by URL without going through the landing page | The view loads normally with an empty form. No state is expected to carry over. |

---

## Section 10 — Brand and Visual Direction

**Brand reference:** `the-corporate-brand` skill file — upload flat to the repo root before the build session. Claude Code installs it to `.claude/skills/` in First Session Setup. Unchanged from v1.0.

**Visual feel:** Corporate minimalism — restraint over decoration. Precise, direct, composed, authoritative. No gradients, no shadows, no rounded corners.

**Key brand rules Claude Code must enforce throughout, including in all four new views:**
- Fonts: Playfair Display (headlines), DM Sans 300 (body), DM Sans 500 (labels and emphasis) — imported from Google Fonts CDN
- Colours: Ink `#000000`, Stone `#B6B09F`, Linen `#EAE4D5`, Chalk `#F2F2F2`, White `#FFFFFF`, Acid Lime `#C8F135`
- Acid Lime: maximum 2 uses per page, always against `#000000`, never directly on a light background. On the landing page these are already committed to the "Supplier Programme 2026" pill and the timeline step numbers — **the new views must not add further Acid Lime to that page.**
- Buttons: square corners (`border-radius: 0`), no shadows
- Cards: square corners, 0.5px Stone border, Linen or White background
- Form inputs must be styled to match: square corners, Stone border, no default browser chrome, no blue focus rings
- No blue links — underline plus Ink colour only
- All copy follows The Corporate voice: short declarative sentences, active voice, no exclamation points, no emoji

**Form density guidance:** the guided questionnaire puts 90 inputs in front of the user. One section per screen, generous vertical spacing, question text at readable width. Do not compress the seven sections into a single scrolling page.

---

## Section 11 — API and Credentials

This tool requires no external services and no API keys.

| Service | What it does in this tool | Key required | Where key is stored |
|---------|--------------------------|-------------|-------------------|
| None | — | — | — |

**Client-side library, not a service:**

| Library | What it does | Key required |
|---------|-------------|-------------|
| SheetJS (`xlsx`), loaded from CDN | Parses the uploaded `.xlsx` workbook in the browser | No — no account, no key, no server call |

**Credentials readiness:** Nothing to prepare before the build session. No environment variables are required for this tool.

> **Security note:** because there is no backend, there is no endpoint to secure and no secret to protect. Claude Code must not introduce a serverless function, a form handler, a Netlify Form, or any third-party embed that would transmit supplier input off the device. Any such addition would silently break the build constraint at the top of this spec.

---

## Section 12 — Out of Scope — Phase 2

| Deferred feature | Reason it is deferred |
|-----------------|----------------------|
| Database persistence — submissions actually reaching The Corporate | The core decision of this build. This version validates the submission experience only. Adding it moves the tool from Tier 1 to Tier 2 (D3 + A1, Netlify + Supabase) and triggers the GDPR framework noted in Section 7. |
| Internal review dashboard for Procurement and EHS | Requires the database above. Becomes a second tool sharing one Supabase project — a stack. |
| Submission tracker showing which Tier 1 suppliers have responded | Requires the database and a supplier roster. |
| Supplier login and saved progress across devices | Moves the tool to Tier 3. |
| Saving answers in the browser between refreshes | **Explicitly declined during the interview.** A supplier who refreshes starts again; the warning in View 3 covers this. |
| PFAS auto-flag review workflow | The workbook notes that "Yes" at row 19 triggers a PFAS Risk review. The tool displays that note as static text and takes no action on it. The workflow needs a reviewer and a database. |
| Automated EcoVadis scorecard validation | Requires EcoVadis API access. The tool validates the issue date only; it does not verify that the scorecard is real or current. |
| Email notification on submission or download | Email arm is not active. Confirmed: no email is sent anywhere. |
| Reference or submission number on the confirmation view | Would imply a stored record exists. Deliberately omitted. |
| Download of the completed submission from the confirmation view | Same reason. |
| EcoVadis bypass branching inside the guided questionnaire | Redundant now that EcoVadis has its own door. See Section 9, Rule 2. |
| Required-field enforcement in the guided questionnaire | No question is mandatory in this version. |

---

## Section 13 — Acceptance Criteria

| # | What to verify | Expected result | Done? |
|---|---------------|-----------------|-------|
| 1 | The v1.0 landing page is preserved | Hero, stats row, Why We Are Asking, What Happens Next timeline, Key Resources, and footer render exactly as in v1.0 with no regression in copy, layout, or brand | [ ] |
| 2 | Two Routes section shows the revised structure | Card 1 has one button; Card 2 has "Fill in the portal", "Upload completed file", and "Download Assessment"; no copy anywhere on the page still instructs suppliers to return the file by email | [ ] |
| 3 | EcoVadis card no longer leaves the site | Clicking "Submit EcoVadis Scorecard" opens View 2 in the portal; `ecovadis.com` is not opened in a new tab | [ ] |
| 4 | EcoVadis form collects the five specified fields | Company legal name, contact name, contact email, scorecard link, scorecard issue date all present and required | [ ] |
| 5 | Scorecard date validation works | A date older than 12 months or in the future blocks submission with an inline message; a date inside the window submits | [ ] |
| 6 | Guided questionnaire contains every question | 7 sections, 30 questions, question text and ESRS references matching Section 8 exactly, in workbook order, no additions or omissions | [ ] |
| 7 | Every question exposes three inputs | Supplier Response, Notes / Evidence, and a Status dropdown with the five options, on all 30 questions — 90 inputs total | [ ] |
| 8 | Dropdown options match the workbook exactly | Row 8 uses the two bypass options; rows 14, 19, 24, 33, 37, 38, 40 use Yes/No; all Status dropdowns use the five-option list | [ ] |
| 9 | Row 12 renders as a number field | Scope 2 emissions accepts a numeric tonnage, not a verification-method dropdown | [ ] |
| 10 | The unsaved-progress warning is present and persistent | Visible on all seven sections plus the declaration step, and not dismissible | [ ] |
| 11 | No EcoVadis branching occurs | Answering "Yes — Scorecard Attached" at row 8 does not skip, hide, or alter S2 to S7 | [ ] |
| 12 | Declaration step is present | Declaration text, signatory name, date, and typed signature field all render before submission | [ ] |
| 13 | Upload accepts a valid workbook | Uploading the unmodified completed template renders all 30 questions with their response, notes, and status values shown read-only for review | [ ] |
| 14 | Upload accepts a valid CSV export | Same result as criterion 13 when the sheet is exported to CSV and uploaded | [ ] |
| 15 | Upload rejects a non-matching file | A file with a missing section, missing question rows, altered headers, or the wrong file type is rejected with exactly "File format doesn't match — Download the Excel file", with no partial import | [ ] |
| 16 | Download button serves the correct file | Clicking "Download Assessment" downloads the complete, unmodified `The_Corporate_Supplier_Questionnaire_2026.xlsx` | [ ] |
| 17 | Confirmation view renders after all three doors | "Successfully submitted" plus a full recap of what was submitted, from the EcoVadis door, the guided door, and the upload door | [ ] |
| 18 | Confirmation view omits what it must omit | No reference number, no download of the submission, no email, no claim that a record has been stored | [ ] |
| 19 | Nothing is transmitted | Browser network inspection during and after submission on all three doors shows no outbound request carrying supplier input; no serverless function, form handler, or third-party endpoint exists in the codebase | [ ] |
| 20 | Brand is applied to the new views | Playfair Display headings, DM Sans body, correct colour tokens, square corners on all inputs and buttons, no shadows, Acid Lime not exceeding two uses on the landing page | [ ] |
| 21 | Responsive on mobile | All five views usable below 768px: cards stack, form inputs are full width, the seven-section stepper is navigable, no horizontal overflow | [ ] |
| 22 | Deploys to Netlify | Live URL loads on desktop and mobile, all five views reachable, Excel downloads correctly from the deployed site | [ ] |

---

## Section 14 — Build Path

**This tool's tier:** Tier 1

---

### Pre-build steps — complete these before opening Claude Code

- [ ] Tool Architect skill — interview complete, this spec is written and confirmed by the builder
- [ ] Project Governor skill — CLAUDE.md and PROGRESS.md produced from this spec
- [ ] GitHub repo created by the builder
- [ ] `product-spec.md` uploaded to the GitHub repo root
- [ ] `CLAUDE.md` uploaded to the GitHub repo root
- [ ] `PROGRESS.md` uploaded to the GitHub repo root
- [ ] `the-corporate-brand` skill file uploaded to the GitHub repo root
- [ ] `The_Corporate_Supplier_Questionnaire_2026.xlsx` placed in `/assets/` in the repo — this is both the download served to suppliers and the reference Claude Code parses to verify the question inventory
- [ ] The existing `supplier_onboarding.html` from v1.0 placed in the repo so the landing page is extended rather than rebuilt
- [ ] Cell E12 corrected in the workbook, or the correction consciously declined (see Section 15)
- [ ] Netlify connected to the GitHub repo — **skip, Netlify MCP is active**
- [ ] No credentials to prepare for this tool

---

### Tier 1 — build session

- [ ] Open Claude Code in the project folder
- [ ] Claude Code runs First Session Setup: creates `docs/`, moves reference files, installs `the-corporate-brand` to `.claude/skills/`
- [ ] Claude Code reads `product-spec.md`, `CLAUDE.md`, and `PROGRESS.md`
- [ ] Claude Code opens `The_Corporate_Supplier_Questionnaire_2026.xlsx` and verifies the 30-question inventory in Section 8 against the file before building the guided form
- [ ] Claude Code extends the existing v1.0 landing page — modifying only the Two Routes section — rather than rebuilding it
- [ ] Claude Code builds Views 2 to 5
- [ ] Test locally before deploying, including: a valid workbook upload, a valid CSV upload, a deliberately broken file, and a full pass through all seven sections
- [ ] Verify criterion 19 specifically — inspect network traffic and confirm nothing leaves the browser
- [ ] **Netlify MCP is active:** Claude Code deploys automatically

---

## Section 15 — Open Questions

| Question | Who answers it | Blocking? |
|----------|---------------|-----------|
| Cell E12 in the workbook carries a verification-method dropdown on the Scope 2 emissions answer, making a tonnage impossible to enter. Should the workbook be corrected, and should a separate verification-method question be added? | Builder — before or during the build session | No — the tool renders E12 as a number field regardless; the workbook itself needs the fix so uploads and downloads stay consistent |
| What is the real URL for the Supplier Code of Conduct document? | Builder | No — carried over unresolved from v1.0; Claude Code leaves as `#` and flags it |
| What is the real URL for the Global Environmental Policy document? | Builder | No — carried over unresolved from v1.0; Claude Code leaves as `#` and flags it |
| Should the typed-signature field in the declaration be kept, or dropped as meaningless without real signature capture? | Builder — before build | No — spec assumes it is kept |
| Card 2's description copy still references returning the file by email in v1.0. What should the revised copy say? | Claude Code drafts in The Corporate voice during the build; builder reviews before deployment | No |
| Should the deployed testing URL be access-restricted (Netlify password protection) to prevent accidental circulation to suppliers? | Builder | No — but strongly recommended given the build constraint at the top of this spec |

---

## Section 16 — Tool Version History

| Version | Date | What changed in the tool |
|---------|------|--------------------------|
| v1.0 | 12 June 2026 | Retroactive spec of the existing supplier onboarding landing page (`supplier_onboarding.html`). Tier 1, D1 + A1. Static page, two route cards, EcoVadis button to an external site, static Excel download, no user input. |
| v2.0 | 4 September 2026 | Both routes become submission doors inside the portal. Data model moves D1 → D2 (session-only user input, still no database; tier unchanged at 1). Four new views added: EcoVadis submission form, guided seven-section questionnaire with 90 inputs plus declaration, file upload with in-browser parsing and read-only review, and a shared confirmation view. Excel download relocated inside the questionnaire card. File match validation rule and scorecard date validation added. Email return removed from all copy. Build constrained to internal testing only — nothing is stored or transmitted. |

---

*This spec is written for Claude Code. It assumes zero prior context. Every decision, rule, and requirement must be explicit enough that the builder can hand this document to Claude Code without a single verbal explanation.*
