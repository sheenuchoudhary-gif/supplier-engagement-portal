# Product Spec — The Corporate Supplier Sustainability Portal 2026

**Version:** 2.1
**Date:** 7 September 2026
**Author:** Zyad Hatquai
**Status:** Confirmed

---

> ⚠ **BUILD CONSTRAINT. READ BEFORE BUILDING ANYTHING.**
>
> This version of the tool **stores nothing and sends nothing**. Every submission path renders an on-screen confirmation and then discards the data when the tab closes. No database, no email, no server-side storage.
>
> This build exists to validate the submission experience with The Corporate's internal EHS and Procurement teams. **It must not be circulated to Tier 1 suppliers.** A supplier who completed it would see "Successfully submitted" and The Corporate would receive nothing.
>
> Claude Code must not describe this build as production ready, must not imply data is retained anywhere in the UI copy, and must not add any storage, email, or persistence capability that is not specified in this document.

---

> ✏️ **GLOBAL COPY RULE. APPLIES TO EVERY STRING IN THE INTERFACE.**
>
> **No em dashes (—) anywhere in portal content.** Not in headings, body copy, button labels, form labels, helper text, validation messages, or placeholder text. Use a comma, a full stop, a colon, or a rewritten sentence instead.
>
> This applies to copy Claude Code drafts itself as well as copy specified in this document. En dashes in numeric ranges are acceptable. Question text quoted from the Excel workbook is reproduced verbatim and is the only exception, since it must match the file.

---

## Section 1 — Tool Summary

**Tool name:** The Corporate Supplier Sustainability Portal 2026

**What it does:** A public page that onboards Tier 1 suppliers into The Corporate's ESRS aligned sustainability assessment programme and lets them submit inside the portal. A single gate question asks whether the supplier holds an EcoVadis scorecard. Suppliers answering Yes go to Plan A and submit their EcoVadis details and scorecard file. Suppliers answering No go to Plan B and choose between completing the assessment directly in the portal or downloading the Excel template, completing it offline, and uploading the finished file for review before submitting.

**Who uses it:** Tier 1 supplier contacts, meaning sustainability managers, EHS leads, and procurement representatives at supplier organisations, who receive the URL directly from The Corporate's Procurement or EHS team. In this version the audience is The Corporate's own internal EHS and Procurement teams testing the flow before it is given to suppliers.

**Why it exists:** V1 routed suppliers to an external site or to a downloadable Excel returned by email. This version proves whether suppliers can complete the assessment inside the portal itself, so that the email exchange can be removed in a later version once persistence is added.

**Build status:** Iteration. Version 1.0 (12 June 2026) is a Tier 1 static single page landing page built as `supplier_onboarding.html`, with hardcoded content, two buttons, one static Excel download, and no user input. Version 2.0 added in portal submission. **This version, 2.1, restructures the submission flow behind a single gate question, regroups the questionnaire into Environment, Social and Governance, and replaces the visual identity entirely.**

---

## Section 2 — Classification

### Data Model

**Decision:** D2

| Label | What it means | This tool? |
|-------|--------------|-----------|
| D1 — Hardcoded | All data is written into the code by the developer. Users cannot input anything that persists. | No |
| D2 — Session | Data enters the tool during use and disappears when the tab closes. No database. Covers both uploaded files and form inputs. | Yes |
| D3 — Persisted | Data is written to a database and survives after the session ends. Supabase is required. | No |

**Reason:** Suppliers type answers and upload files, so the tool takes user input, but nothing is transmitted or retained. All input lives in browser memory for the length of the session and is intentionally discarded when the tab closes or reloads.

**D3 triggers. None apply in this build:**
- [ ] Data must be retrievable after the session ends
- [ ] Multiple sessions contribute to the same dataset
- [ ] An audit trail or history is needed
- [ ] Data submitted by one person must be visible to another
- [ ] Results must be accessible via a URL after the session ends
- [ ] Files uploaded by users must be stored and retrievable later

> Every one of these triggers will apply to the next version of this tool. See Section 12.

---

### Access Model

**Decision:** A1

| Label | What it means | This tool? |
|-------|--------------|-----------|
| A1 — Public | Anyone with the URL can use it. No login, no account required. | Yes |
| A2 — Authentication | Users must log in. All logged in users see the same thing. | No |
| A3 — Authorization | Users must log in and have different roles. | No |

**Reason:** The portal is distributed as a direct link. No account, no login, no identity check. Unchanged from v1.0.

---

### Tier

**Tier:** 1

D2 plus A1 resolves to Tier 1. No database, no accounts, Netlify alone.

---

### Standalone or Stack

**This tool is:** Standalone. It does not share a database with any other tool, because there is no database.

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
| What is exported | `The_Corporate_Supplier_Questionnaire_2026.xlsx`, the pre-formatted Excel workbook, served as a static asset from `/assets/`. The file is not generated, not populated server side, and not modified in any way. |
| Placement | Inside **Plan B, Option 2** as the "Download Template" control. It no longer appears on the landing page. |
| PDF design intent | N/A. Format is XLSX only. |

> The confirmation view does not offer a download of what the supplier submitted. Providing one would imply a record exists.

---

### Email Arm

**Active:** No

> No email is sent anywhere, by any path, under any condition. The `mailto:` link to the EHS Help Desk in Key Resources is retained. It opens the user's own email client and is not an email sent by the tool.

---

### Scheduled Automation Arm

**Active:** No

---

## Section 4 — Stack and Deployment

| Detail | Answer |
|--------|--------|
| Frontend framework | HTML/CSS/JS. Do not migrate this tool to React. The v1.0 page structure and content are reused; only the stylesheet is replaced. The new views are rendered as show and hide sections within the same page, or as additional static pages sharing one stylesheet. |
| Deployment target | Netlify |
| Netlify MCP | **Active.** Netlify is connected via Claude Desktop Connectors. Claude Code will create or update the site and deploy automatically. |

**Client side library required:**
Reading the uploaded `.xlsx` workbook requires **SheetJS (xlsx)**, loaded from a CDN and run entirely in the browser. No account, no API key, no server. CSV parsing needs no library. No file is ever transmitted off the supplier's device.

**GitHub, pre-build requirement:**
The user creates the GitHub repo before the first Claude Code session. `product-spec.md`, `CLAUDE.md`, and `PROGRESS.md` must be in the repo root before Claude Code opens. Claude Code assumes the repo exists, commits regularly, and pushes to main.

---

### CONDITIONAL: Supabase project

N/A. Tier 1. No Supabase project, no database, no schema.

---

### CONDITIONAL: Stack

N/A. Standalone tool.

---

## Section 5 — Data Architecture

**N/A. Data Model is D2. There is no database and no schema to build.**

What the tool holds in browser memory only, and discards on tab close or refresh:

| What is held | Where it comes from | Fate |
|-------------|--------------------|------|
| Company legal name, contact name, contact email, scorecard issue date | Plan A form | Discarded |
| Uploaded EcoVadis scorecard file | Plan A upload | Discarded, never leaves the device |
| 28 Supplier Response values | Plan B Option 1 | Discarded |
| 28 Notes / Evidence values | Plan B Option 1 | Discarded |
| 28 Status values | Plan B Option 1 | Discarded |
| Signatory name, declaration date, typed signature | Plan B Option 1 declaration | Discarded |
| Parsed contents of an uploaded workbook or CSV | Plan B Option 2 | Discarded, read in the browser only |

**File storage:** No. Uploaded files are read in the browser using the File API and never leave the supplier's device. Nothing is posted to any endpoint.

**Derived or calculated data:** No.

---

## Section 6 — Access and Permissions

**N/A. Access Model is A1.** No authentication, no roles, no RLS.

---

## Section 7 — GDPR

**GDPR outcome: Not applicable. Confirmed.**

The forms collect fields that would ordinarily be personal data: contact name, contact email, company name, authorised signatory name. This build transmits nothing and stores nothing. The data never leaves the supplier's browser, The Corporate never receives it, and no data controller relationship is created. There is nothing to consent to, nothing to hold, and nothing to delete.

> ⚠ **This reverses the moment persistence is added.** The next version, the one that writes submissions to a database, collects contact name, contact email, company legal name, and authorised signatory name through its forms, and additionally stores an uploaded EcoVadis scorecard file. That version's spec must include a consent checkbox, a data statement at the point of collection, and a named deletion contact.

---

## Section 8 — Screen and UI Structure

Six views. View 1 is the v1.0 landing page with two sections modified and the whole page restyled. Views 2 to 6 are new or restructured.

---

### View 1 — Landing Page

- **Purpose:** Communicate The Corporate's programme and lead the supplier into the submission gate.

- **What is visible:** The v1.0 structure and content are retained: navigation bar with The Corporate logo, hero with the "SUPPLIER PROGRAMME 2026" label, H1, body paragraph, and the four figure stats row (690,000 tCO₂e, 71% Scope 3, 2045, 500+), the "Why We Are Asking" section, the Submission section, the four step "What Happens Next" timeline, the three Key Resources cards, and the footer. **Every element is restyled to the new brand in Section 10.** Two sections change in content:

  **Why We Are Asking, revised**
  - H2: "Why We Are Asking"
  - The section must contain this exact sentence: **"We need your cooperation to reduce our Scope 3 emissions."**
  - The sentence beginning "This is driven by" that appears in the current build **must be removed and must not be reinstated.**
  - Remaining body copy is drafted by Claude Code and must cover The Corporate's supply chain Scope 3 exposure (71%, location based, 2023 base year) and the shared responsibility framing of the programme. Regulatory context may be mentioned but must not lead the section. Builder reviews before deployment.

  **Submission section, replaces "Two Routes. One Destination."**
  - The two side by side route cards from v1.0 and v2.0 are **removed.**
  - The section opens with a single gate question as its heading: **"Do you have an EcoVadis scorecard?"**
  - Two options presented as buttons of equal visual weight: **"Yes"** and **"No"**.
  - Short supporting line beneath, noting that a scorecard must have been issued within the last 12 months to qualify.
  - No other buttons appear in this section. The Download Template control is not on the landing page. It lives inside Plan B, Option 2.

- **User actions:** Answer the gate question, open any Key Resource, contact the EHS Help Desk via `mailto:`, scroll.

- **What happens next:** "Yes" opens **View 2, Plan A**. "No" opens **View 3, Plan B**.

---

### View 2 — Plan A: EcoVadis Submission

- **Purpose:** Capture the scorecard details and the scorecard file from a supplier who already holds one.

- **What is visible:**
  - Heading identifying this as the EcoVadis route, and a short line restating the 12 month validity requirement.
  - Four text fields, all required:

    | Field | Type | Notes |
    |-------|------|-------|
    | Company legal name | Text | |
    | Contact name | Text | |
    | Contact email | Email | Format validated |
    | Scorecard issue date | Date | Must fall within the last 12 months. See Section 9. |

  - **Scorecard file upload, required.** Accepts `.pdf`, `.png`, `.jpg`. Shows the selected filename once chosen, with a control to replace it. **There is no scorecard link field.** The URL field from v2.0 is removed and replaced by this upload.
  - A back control returning to the landing page.
  - Submit button.

- **User actions:** Complete four fields, attach the scorecard file, submit, or go back.

- **What happens next:** On valid submission, go to **View 6**. On invalid input, inline field level messages appear and the form does not submit.

---

### View 3 — Plan B: Choose How to Submit

- **Purpose:** Give a supplier without a scorecard the choice between filling in the portal and working offline in Excel.

- **What is visible:**
  - Heading and a short line explaining that the full assessment is required and can be completed either way.
  - **Option 1: Fill in the information directly in the portal.** Description noting that the assessment must be completed in one sitting because progress is not saved. Button opens **View 4**.
  - **Option 2: Download the template, complete it, and upload it.** Description noting that this suits organisations where several colleagues contribute. Two controls:
    - **"Download Template"**, which downloads `The_Corporate_Supplier_Questionnaire_2026.xlsx` from `/assets/`.
    - **"Upload Completed Template"**, which opens **View 5**.
  - Back control returning to the landing page.

- **User actions:** Choose an option, download the template, or go back.

- **What happens next:** Navigation to View 4 or View 5.

---

### View 4 — Fill in the Portal

- **Purpose:** Let the supplier complete the full assessment inside the portal, section by section.

- **What is visible:**
  - **A persistent, prominent warning above the form, visible on every step:** progress is not saved, and refreshing, navigating back, or closing the tab will lose all answers. The assessment must be completed in one sitting. This warning is mandatory and must not be dismissible.
  - A step indicator showing position in the sequence, for example "Step 2 of 5".
  - One section per screen with Back and Next controls. Next does not block on incomplete answers. No field is enforced as required.
  - For every question: its ESRS reference, its full question text, and **three inputs**:
    1. **Supplier Response**, type per the inventory below
    2. **Notes / Evidence**, free text, every question
    3. **Status**, dropdown on every question: `Not Started` / `In Progress` / `Complete` / `N/A` / `EcoVadis Bypass`
  - **Final step, Declaration.** Displays the declaration text from the workbook: *"I confirm that the information provided in this assessment is accurate and complete to the best of my knowledge."* Three fields: Authorised Signatory Name (text), Date (date), Signature (text, a typed name standing in for a signature, since a browser form cannot capture a real one). Submit button.

- **User actions:** Move through the sections, answer any combination of the 84 inputs, complete the declaration, submit.

- **What happens next:** Submit goes to **View 6**.

---

#### Question inventory

**The questionnaire is regrouped into Environment, Social and Governance.** The grouping is derived from the ESRS references already carried in the workbook. Question text is reproduced verbatim from `The_Corporate_Supplier_Questionnaire_2026.xlsx`, sheet `Supplier Assessment 2026`. Row numbers are given so the build can be verified against the file. Claude Code must not invent, reword, reorder, or omit any question.

**Structure: 5 steps, 28 questions, 84 inputs, plus 3 declaration fields.**

| Step | Section | Questions |
|------|---------|-----------|
| 1 | Company Details | 2 |
| 2 | Environment | 21 |
| 3 | Social | 3 |
| 4 | Governance | 2 |
| 5 | Declaration | 3 fields, not questions |

> **Workbook rows 8 and 9 are excluded from the portal form.** Row 8 is the EcoVadis bypass question and row 9 is the scorecard link. Both are made redundant by the gate question on the landing page and by Plan A. They remain in the downloadable workbook, so the file validator in View 5 still expects all 30 rows. See Section 9, Rule 1.

---

**Step 1 — Company Details**

| Row | ESRS ref | Response input type | Question text |
|-----|----------|--------------------|---------------|
| 6 | None | Text (multi-line) | Legal name and registered country of the responding entity. |
| 7 | None | Text (multi-line) | Primary contact name, title, and email address for this assessment. |

---

**Step 2 — Environment**

Rendered as one step with four labelled sub-groups so 21 questions remain navigable. Sub-group headings: Climate and Decarbonisation, Pollution and PFAS, Water and Marine Resources, Circular Economy and Waste, Biodiversity and Ecosystems.

*Climate and Decarbonisation (ESRS E1)*

| Row | ESRS ref | Response input type | Question text |
|-----|----------|--------------------|---------------|
| 11 | E1-4 | Number | Total Scope 1 emissions for last fiscal year (metric tonnes CO₂e). Include verification method. |
| 12 | E1-4 | Number | Total Scope 2 emissions for last fiscal year, market-based (metric tonnes CO₂e). |
| 13 | E1-4 | Number | Total Scope 3 emissions for last fiscal year (metric tonnes CO₂e). Specify categories included. |
| 14 | E1-3 | Dropdown: `Yes` / `No` | Does your organisation have a Science-Based Target (SBTi) validated decarbonisation target? |
| 15 | E1-2 | Text (long) | Describe your top three decarbonisation projects currently in progress or planned for the next 24 months. Include estimated tCO₂e reduction and the specific technology being utilised (e.g., electrification of heat, on-site renewables). |
| 16 | E1-2 | Text (long) | What are the primary technical or financial barriers preventing you from reaching a 50% reduction in Scope 1 and 2 emissions by 2030? |

> **Row 12 correction.** In the source workbook, cell E12 carries a dropdown restricted to `Verified by Third Party / Internally Calculated / Estimated / Not Tracked`, which makes it impossible to enter a tonnage. This is a workbook error. The tool renders row 12 as a number field, consistent with rows 11 and 13. See Section 15.

*Pollution and PFAS (ESRS E2)*

| Row | ESRS ref | Response input type | Question text |
|-----|----------|--------------------|---------------|
| 18 | E2-3 | Number | Total weight of substances of concern (REACH, SVHC list) used in production last fiscal year (kg). |
| 19 | E2-3 | Dropdown: `Yes` / `No` | Do any of your products or production processes contain or utilise PFAS compounds ("Forever Chemicals")? |
| 20 | E2-3 | Text (long) | If your products contain PFAS, detail your substitution roadmap. Have you identified viable non-PFAS alternatives? Provide your target date for a complete phase-out. |
| 21 | E2-2 | Text (long) | Describe your industrial wastewater treatment process. What specific measures are in place to ensure zero leakage of hazardous chemicals into local water systems? |

> Row 19 carries a note in the workbook: "AUTO-FLAG: 'Yes' triggers PFAS Risk review". Display this as static helper text beneath the question. No flagging behaviour is built in this version. See Section 12.

*Water and Marine Resources (ESRS E3)*

| Row | ESRS ref | Response input type | Question text |
|-----|----------|--------------------|---------------|
| 23 | E3-1 | Number | Total water withdrawal last fiscal year (m³). Specify source (municipal, groundwater, surface). |
| 24 | E3-1 | Dropdown: `Yes` / `No` | Is your primary production facility located in a high-water-stress region (WRI Aqueduct score ≥3)? |
| 25 | E3-2 | Text (long) | Provide details on any water-saving or closed-loop recycling projects implemented at your facility. How has your total water intensity (litres per unit produced) changed over the last three years? |
| 26 | E3-2 | Text (long) | If your facility is in a high-water-stress region, what is your operational contingency plan for severe drought conditions to ensure supply continuity to The Corporate? |

*Circular Economy and Waste (ESRS E5)*

| Row | ESRS ref | Response input type | Question text |
|-----|----------|--------------------|---------------|
| 28 | E5-2 | Number | Total waste generated last fiscal year (tonnes). Breakdown: landfill / recycled / energy recovery / hazardous. |
| 29 | E5-4 | Number | Percentage of post-consumer recycled (PCR) content in the components supplied to The Corporate (%). |
| 30 | E5-3 | Text (long) | How are you incorporating circularity into the specific components you supply to The Corporate? Examples: design for disassembly, modularity, or increasing PCR content. |
| 31 | E5-2 | Text (long) | Detail your strategy for achieving Zero Waste to Landfill. What are your primary waste streams, and what innovative recycling or upcycling initiatives have you launched recently? |

*Biodiversity and Ecosystems (ESRS E4)*

| Row | ESRS ref | Response input type | Question text |
|-----|----------|--------------------|---------------|
| 33 | E4-2 | Dropdown: `Yes` / `No` | Are any of your production sites located within or adjacent to (within 1 km) a protected area or biodiversity hotspot? |
| 34 | E4-3 | Text (long) | Describe any initiatives taken to minimise the impact of your operations on local biodiversity. Include land-use management, native planting schemes, or light/noise pollution reduction. |
| 35 | E4-5 | Text (long) | Have you undertaken a biodiversity impact assessment (TNFD or equivalent) for your primary production sites? If yes, share key findings. If no, provide your target assessment date. |

---

**Step 3 — Social (ESRS S2)**

| Row | ESRS ref | Response input type | Question text |
|-----|----------|--------------------|---------------|
| 37 | S2-1 | Dropdown: `Yes` / `No` | Does your organisation have a formal Human Rights and Labour Rights Policy, aligned with the UN Guiding Principles on Business and Human Rights? |
| 38 | S2-2 | Dropdown: `Yes` / `No` | Have you conducted a human rights due diligence assessment of your Tier 1 and Tier 2 supply chains in the last 24 months? |
| 39 | S2-4 | Text (long) | Describe the grievance mechanism available to workers in your supply chain. How many grievances were filed and resolved in the last 12 months? |

---

**Step 4 — Governance (ESRS G1)**

| Row | ESRS ref | Response input type | Question text |
|-----|----------|--------------------|---------------|
| 40 | G1-1 | Dropdown: `Yes` / `No` | Does your organisation have a verified conflict minerals policy (3TG, tin, tantalum, tungsten, gold) in place, including OECD Due Diligence guidance compliance? |
| 41 | G1-2 | Text (long) | Describe your supplier code of conduct and how compliance is monitored across your own supply chain. Include details of any third-party audits conducted in the last 24 months. |

---

### View 5 — Upload Completed Template

- **Purpose:** Accept the completed workbook back, read it in the browser, and show the supplier what was found before they submit.

- **What is visible, initial state:**
  - Short instruction: upload the completed questionnaire, either the Excel workbook or a CSV export of it.
  - File picker accepting `.xlsx` and `.csv` only. Drag and drop optional.
  - A "Download Template" control, for suppliers who arrive here without the file.
  - Back control to View 3.

- **What is visible, after a file that passes validation:**
  - The parsed answers rendered read only, grouped as **Company Details, Environment, Social, Governance**, matching the in portal structure rather than the workbook's S1 to S7 order, showing for each question its text, the Supplier Response, the Notes / Evidence, and the Status found in the file. Empty cells display as blank rather than being hidden, so the supplier can see what they left out.
  - **Workbook rows 8 and 9 are read during validation but are not displayed in the review.**
  - The declaration values if present in the file.
  - A "Replace file" control.
  - Submit button beneath the review.

- **What is visible, after a file that fails validation:**
  - The exact message: **"File format doesn't match. Download the Excel file"**, with the download control alongside it.
  - No partial import, no preview, no list of what was missing. The view returns to its initial state.

- **User actions:** Select a file, review what was read, replace the file, submit, or go back.

- **What happens next:** Submit goes to **View 6**.

---

### View 6 — Confirmation

- **Purpose:** Confirm to the supplier that their submission was received, and show what was submitted.

- **What is visible:**
  - Heading: **"Successfully submitted"**
  - A recap of what was submitted, rendered read only. From Plan A, the four field values plus the attached filename. From either Plan B option, the answers grouped as Company Details, Environment, Social, Governance with all three values per question, plus the declaration.
  - A control returning to the landing page.
  - **Not present:** no reference or submission number, no download of the submission, no claim that anyone will respond, no email confirmation. A reference number would imply a stored record exists.

- **User actions:** Read the recap, return to the landing page.

- **What happens next:** Nothing. The data is discarded when the tab closes or the page reloads. No transmission occurs at any point.

---

## Section 9 — Logic and Calculations

No scoring, no calculation, no conditional rendering based on any supplier answer. Four rules govern behaviour.

### Rule 1 — File match validation (View 5)

An uploaded file is **accepted** only if all of the following are true:

1. It is a `.xlsx` workbook or a `.csv` file.
2. All seven column headers are present and intact: `SECTION`, `ESRS REF`, `TYPE`, `QUESTION / METRIC`, `SUPPLIER RESPONSE`, `NOTES / EVIDENCE`, `STATUS`.
3. All seven section headings are present: S1 General Information & EcoVadis Bypass, S2 Climate & Decarbonisation, S3 Pollution & PFAS, S4 Water & Marine Resources, S5 Circular Economy & Waste, S6 Biodiversity & Ecosystems, S7 Social, Labour & Governance.
4. All **thirty** question rows are present, in workbook order, matched on question text.

> **Important.** The downloadable workbook is unchanged and still uses the S1 to S7 structure with 30 questions. The regrouping into Environment, Social and Governance applies to the portal interface only. Validation therefore checks the workbook's own structure, not the portal's. Rows 8 and 9 must be present in the file for it to validate, but are not shown in the review.

If any condition fails the file is rejected outright with the message "File format doesn't match. Download the Excel file". There is no partial import and no attempt to salvage matched rows. The same rule applies identically to the CSV export.

**Rationale, recorded so it is not softened during the build:** suppliers routinely insert rows, rename sheets, merge cells, or delete sections that do not apply to them. A lenient parser silently drops answers, which is worse than a clear rejection.

### Rule 2 — The gate is the only branch

The gate question on the landing page is the single branching point in the tool. Yes goes to Plan A, No goes to Plan B. There is no other conditional logic anywhere. The bypass instruction inside the workbook, which tells a scorecard holder to skip S2 to S7, is handled entirely by the gate. Claude Code must not add skip logic inside the questionnaire form.

The gate answer is not stored, not carried into any form as a hidden value, and not shown in the confirmation recap.

### Rule 3 — Scorecard date validation (View 2)

The scorecard issue date must fall within the 12 months preceding today's date. A date outside that window, or in the future, produces an inline validation message and blocks submission.

### Rule 4 — Scorecard file validation (View 2)

The uploaded scorecard must be `.pdf`, `.png`, or `.jpg`, and under 10 MB. Anything else produces an inline message and blocks submission. The file is read for name and size only. It is never parsed, never previewed beyond its filename, and never transmitted.

### Edge cases

| Case | Behaviour |
|------|-----------|
| Supplier leaves questionnaire fields blank | Allowed. No question in View 4 is required. Blanks appear as blank in the confirmation recap. |
| Supplier refreshes, navigates back, or closes the tab mid form | All answers are lost. By design, and warned about on every step of View 4. |
| Uploaded template matches but every answer cell is empty | Accepted. The review renders all questions with blank values. The supplier may still submit. |
| Uploaded template is over 10 MB or is not a real workbook despite its extension | Rejected with the standard message. |
| Supplier answers the gate, then uses the browser back button to change the answer | Allowed. The other plan opens with an empty form. No state carries across. |
| Supplier opens a submission view directly by URL without passing the gate | The view loads normally with an empty form. No state is expected to carry over. |

---

## Section 10 — Brand and Visual Direction

**Brand reference:** Defined in full below. **The `the-corporate-brand` skill is not used in this build and must not be applied.** Playfair Display, DM Sans, the Ink / Stone / Linen / Chalk palette, and the Acid Lime accent are all removed. Every element on every view, including the retained v1.0 landing page sections, is restyled to the system below.

**Visual feel:** Clean, modern, editorial. Notion-like clarity with tight typographic rhythm. Restrained use of a single accent colour.

### Typeface

**Inter**, loaded from Google Fonts. If unavailable, fall back to a close neutral grotesk: Helvetica Neue, Arial, system-ui, sans-serif.

### Type scale

| Role | Weight | Letter spacing | Line height |
|------|--------|---------------|-------------|
| Main heading (page H1) | 700 | -4% | 1.0 |
| Section headings (H2, view titles) | 700 | -3% | 1.05 |
| Taglines and subheadings | 400 to 500 | -1% | 1.25 to 1.3 |
| Bullet headings and form group labels | 600 to 700 | -1.5% | 1.15 |
| Supporting text, body, helper text | 400 | Normal | 1.35 to 1.4 |

Main headings are large with tight tracking and compact line height. Section headings are medium-large. Supporting text is smaller and set for easy reading.

### Colour

| Token | Hex | Use |
|-------|-----|-----|
| Text | `#111111` | All primary text, headings, body |
| Secondary text | `#555555` | Helper text, captions, supporting lines, disabled states |
| Accent | `#BC2D2E` | Primary buttons, active states, focus rings, key emphasis |
| Background | `#FFFFFF` | Page background |

The accent is maroon and used sparingly. It carries primary actions and emphasis, not large filled areas. Secondary and back controls are text or outline styles in `#111111`, not maroon.

### Spacing rhythm

Tight within a text group, generous between separate groups.

| Relationship | Gap |
|-------------|-----|
| Heading to its tagline or subheading | 8 to 12 px |
| Bullet heading to its supporting text | 5 to 8 px |
| Between separate bullet groups | 20 to 24 px |
| Between page sections | Generous, at least 64 px on desktop |

### Copy rules

- **No em dashes anywhere.** See the global copy rule at the top of this document.
- Short declarative sentences. Active voice.
- No exclamation points, no emoji.

### Form density guidance

View 4 places 84 inputs in front of the user. One step per screen, generous vertical spacing, question text at readable width. The Environment step carries 21 questions and must use its five labelled sub-groups with clear visual separation. Do not compress all sections into a single scrolling page.

---

## Section 11 — API and Credentials

No external services and no API keys.

| Service | What it does in this tool | Key required | Where key is stored |
|---------|--------------------------|-------------|-------------------|
| None | Not applicable | None | Not applicable |

**Client side library, not a service:**

| Library | What it does | Key required |
|---------|-------------|-------------|
| SheetJS (`xlsx`), loaded from CDN | Parses the uploaded `.xlsx` workbook in the browser | No |
| Inter, loaded from Google Fonts CDN | Typeface | No |

**Credentials readiness:** Nothing to prepare before the build session. No environment variables are required.

> **Security note.** Because there is no backend, there is no endpoint to secure and no secret to protect. Claude Code must not introduce a serverless function, a form handler, a Netlify Form, or any third party embed that would transmit supplier input off the device. Any such addition would silently break the build constraint at the top of this spec.

---

## Section 12 — Out of Scope — Phase 2

| Deferred feature | Reason it is deferred |
|-----------------|----------------------|
| Database persistence, submissions actually reaching The Corporate | The core decision of this build. This version validates the submission experience only. Adding it moves the tool to Tier 2 (D3 plus A1, Netlify plus Supabase) and triggers the GDPR framework in Section 7. |
| Storage of the uploaded EcoVadis scorecard file | Requires the database and Supabase file storage. The file is currently read for name and size only. |
| Internal review dashboard for Procurement and EHS | Requires the database. Becomes a second tool sharing one Supabase project, meaning a stack. |
| Submission tracker showing which Tier 1 suppliers have responded | Requires the database and a supplier roster. |
| Supplier login and saved progress across devices | Moves the tool to Tier 3. |
| Saving answers in the browser between refreshes | Explicitly declined by the builder. |
| Reorganising the downloadable Excel workbook into Environment, Social and Governance | The workbook keeps its S1 to S7 structure in this build. The portal regroups on screen only. See Section 15. |
| PFAS auto-flag review workflow | The workbook notes that "Yes" at row 19 triggers a PFAS Risk review. The tool displays that note as static text and takes no action on it. |
| Automated EcoVadis scorecard validation | Requires EcoVadis API access. The tool validates the issue date and the file type only. It does not verify that the scorecard is real or current. |
| Parsing or reading the uploaded EcoVadis scorecard file | Filename and size only. No content extraction. |
| Email notification on submission or download | Email arm is not active. |
| Reference or submission number on the confirmation view | Would imply a stored record exists. Deliberately omitted. |
| Download of the completed submission from the confirmation view | Same reason. |
| Required field enforcement in the questionnaire | No question is mandatory in this version. |

---

## Section 13 — Acceptance Criteria

| # | What to verify | Expected result | Done? |
|---|---------------|-----------------|-------|
| 1 | Landing page structure is preserved | Hero, stats row, Why We Are Asking, Submission section, What Happens Next timeline, Key Resources, and footer all render in order with no layout breaks | [ ] |
| 2 | Why We Are Asking copy is correct | The sentence "We need your cooperation to reduce our Scope 3 emissions." is present; no sentence beginning "This is driven by" appears anywhere on the page | [ ] |
| 3 | No em dashes anywhere in the interface | A search of all rendered copy, including headings, labels, buttons, helper text, and validation messages, returns zero em dash characters. Verbatim workbook question text is the only exception | [ ] |
| 4 | Gate question replaces the two route cards | The Submission section shows "Do you have an EcoVadis scorecard?" with Yes and No options only. The v1.0 side by side route cards are gone. No Download Template control appears on the landing page | [ ] |
| 5 | Gate routes correctly | Yes opens Plan A. No opens Plan B. Neither leaves the site, and `ecovadis.com` is never opened | [ ] |
| 6 | Plan A collects four fields plus a file | Company legal name, contact name, contact email, scorecard issue date, and a required scorecard file upload. No scorecard link field exists | [ ] |
| 7 | Scorecard date validation works | A date older than 12 months or in the future blocks submission with an inline message. A date inside the window submits | [ ] |
| 8 | Scorecard file validation works | PDF, PNG and JPG under 10 MB accepted. Any other type or an oversized file blocks submission with an inline message | [ ] |
| 9 | Plan B presents both options | Option 1 opens the in portal form. Option 2 shows both a Download Template control and an Upload Completed Template control | [ ] |
| 10 | Questionnaire uses the ESG structure | 5 steps: Company Details, Environment, Social, Governance, Declaration. Environment shows its five labelled sub-groups | [ ] |
| 11 | Question inventory is complete and correct | 28 questions, text and ESRS references matching Section 8 exactly. Workbook rows 8 and 9 do not appear in the form | [ ] |
| 12 | Every question exposes three inputs | Supplier Response, Notes / Evidence, and a Status dropdown with the five options, on all 28 questions, meaning 84 inputs | [ ] |
| 13 | Dropdown options match the workbook | Rows 14, 19, 24, 33, 37, 38 and 40 use Yes/No. All Status dropdowns use the five option list | [ ] |
| 14 | Row 12 renders as a number field | Scope 2 emissions accepts a numeric tonnage, not a verification method dropdown | [ ] |
| 15 | The unsaved progress warning is present and persistent | Visible on all steps of View 4 and not dismissible | [ ] |
| 16 | Declaration step is present | Declaration text, signatory name, date, and typed signature field all render before submission | [ ] |
| 17 | Upload accepts a valid workbook | Uploading the unmodified completed template renders the answers grouped as Company Details, Environment, Social, Governance, read only, with response, notes and status shown | [ ] |
| 18 | Upload accepts a valid CSV export | Same result as criterion 17 when the sheet is exported to CSV and uploaded | [ ] |
| 19 | Upload rejects a non matching file | A file with a missing section, missing question rows, altered headers, or the wrong file type is rejected with exactly "File format doesn't match. Download the Excel file", with no partial import | [ ] |
| 20 | Download serves the correct file | Clicking Download Template downloads the complete, unmodified `The_Corporate_Supplier_Questionnaire_2026.xlsx` | [ ] |
| 21 | Confirmation renders after all three paths | "Successfully submitted" plus a full recap, from Plan A, Plan B Option 1, and Plan B Option 2 | [ ] |
| 22 | Confirmation omits what it must omit | No reference number, no download of the submission, no email, no claim that a record has been stored | [ ] |
| 23 | Nothing is transmitted | Browser network inspection during and after submission on all three paths shows no outbound request carrying supplier input or uploaded files. No serverless function, form handler, or third party endpoint exists in the codebase | [ ] |
| 24 | New brand is applied throughout | Inter loaded and used everywhere. Type scale, weights, letter spacing and line heights match Section 10. Text `#111111`, secondary `#555555`, accent `#BC2D2E`. No Playfair Display, no DM Sans, no Acid Lime, no Ink, Stone, Linen or Chalk tokens anywhere in the codebase | [ ] |
| 25 | Spacing rhythm is applied | Tight within text groups, generous between sections, matching the gap table in Section 10 | [ ] |
| 26 | Responsive on mobile | All six views usable below 768px. Form inputs full width, the step navigation works, the 21 question Environment step is navigable, no horizontal overflow | [ ] |
| 27 | Deploys to Netlify | Live URL loads on desktop and mobile, all six views reachable, Excel downloads correctly from the deployed site | [ ] |

---

## Section 14 — Build Path

**This tool's tier:** Tier 1

### Pre-build steps

- [ ] Tool Architect skill, interview complete, this spec written and confirmed by the builder
- [ ] Project Governor skill, CLAUDE.md and PROGRESS.md produced from this spec
- [ ] GitHub repo created by the builder
- [ ] `product-spec.md` uploaded to the repo root
- [ ] `CLAUDE.md` uploaded to the repo root
- [ ] `PROGRESS.md` uploaded to the repo root
- [ ] `The_Corporate_Supplier_Questionnaire_2026.xlsx` placed in `/assets/`. This is both the file served for download and the reference Claude Code parses to verify the question inventory
- [ ] The existing `supplier_onboarding.html` from v1.0 placed in the repo, so page structure and content are reused. **Its stylesheet is replaced, not preserved**
- [ ] Cell E12 corrected in the workbook, or the correction consciously declined. See Section 15
- [ ] **No brand skill file.** The brand is defined in Section 10 of this spec. Do not upload `the-corporate-brand`
- [ ] Netlify connected to the GitHub repo. **Skip, Netlify MCP is active**
- [ ] No credentials to prepare

### Tier 1 build session

- [ ] Open Claude Code in the project folder
- [ ] Claude Code runs First Session Setup, creates `docs/`, moves reference files. **No brand skill to install**
- [ ] Claude Code reads `product-spec.md`, `CLAUDE.md`, and `PROGRESS.md`
- [ ] Claude Code opens the workbook and verifies the 28 question inventory in Section 8 against the file before building the form
- [ ] Claude Code reuses the v1.0 page structure and content, replaces the stylesheet entirely, and rewrites the Why We Are Asking and Submission sections
- [ ] Claude Code builds Views 2 to 6
- [ ] Test locally, including a valid workbook upload, a valid CSV upload, a deliberately broken file, a full pass through all five steps, and both gate answers
- [ ] Run the em dash sweep, criterion 3
- [ ] Verify criterion 23 specifically, inspecting network traffic to confirm nothing leaves the browser
- [ ] **Netlify MCP is active:** Claude Code deploys automatically

---

## Section 15 — Open Questions

| Question | Who answers it | Blocking? |
|----------|---------------|-----------|
| The downloadable workbook still uses the S1 to S7 structure while the portal now presents Environment, Social and Governance. Should the workbook be reorganised to match in a later version? | Builder | No. The two structures coexist in this build and the mapping is handled by the parser |
| Cell E12 carries a verification method dropdown on the Scope 2 emissions answer, making a tonnage impossible to enter. Should the workbook be corrected, and should a separate verification method question be added? | Builder | No. The tool renders E12 as a number field regardless. The workbook itself needs the fix so downloads and uploads stay consistent |
| What is the real URL for the Supplier Code of Conduct document? | Builder | No. Carried over unresolved from v1.0. Claude Code leaves as `#` and flags it |
| What is the real URL for the Global Environmental Policy document? | Builder | No. Carried over unresolved from v1.0. Claude Code leaves as `#` and flags it |
| Should the typed signature field in the declaration be kept, or dropped as meaningless without real signature capture? | Builder | No. Spec assumes it is kept |
| Should The Corporate logo in the navigation bar be restyled or replaced now that the brand has changed? | Builder | No. Claude Code retains the existing logo and flags it for review |
| Should the deployed testing URL be access restricted with Netlify password protection, to prevent accidental circulation to suppliers? | Builder | No, but strongly recommended given the build constraint at the top of this spec |

---

## Section 16 — Tool Version History

| Version | Date | What changed in the tool |
|---------|------|--------------------------|
| v1.0 | 12 June 2026 | Retroactive spec of the existing supplier onboarding landing page. Tier 1, D1 plus A1. Static page, two route cards, EcoVadis button to an external site, static Excel download, no user input. |
| v2.0 | 4 September 2026 | Both routes became submission doors inside the portal. Data model moved D1 to D2, session only input, still no database, tier unchanged at 1. Four new views added: EcoVadis form, guided seven section questionnaire, file upload with in browser parsing and review, and a shared confirmation view. File match validation and scorecard date validation added. Email return removed from all copy. Build constrained to internal testing only. |
| v2.1 | 7 September 2026 | Submission restructured behind a single gate question, "Do you have an EcoVadis scorecard?", replacing the two side by side route cards. Yes opens Plan A, No opens Plan B. Plan A now takes a scorecard file upload instead of a scorecard link. Questionnaire regrouped from S1 to S7 into Company Details, Environment, Social, Governance and Declaration; workbook rows 8 and 9 dropped from the form as redundant, reducing the form from 30 questions and 90 inputs to 28 questions and 84 inputs. Download Template moved from the landing page into Plan B Option 2. Why We Are Asking copy fixed. Global no em dash rule added across all interface copy. **Visual identity replaced entirely: the-corporate-brand removed, Inter typeface with maroon `#BC2D2E` accent adopted.** |

---

*This spec is written for Claude Code. It assumes zero prior context. Every decision, rule, and requirement must be explicit enough that the builder can hand this document to Claude Code without a single verbal explanation.*
