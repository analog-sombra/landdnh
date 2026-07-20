# NA-Form Complete Workflow with Status Dimensions

## Four-Dimensional Status Model

The NA-Form system uses 4 interdependent status fields to track the application lifecycle:

### 1. **dept_user_id** (Current Handler)
- **Type**: Foreign Key (user.id)
- **Purpose**: Identifies which department user is currently responsible for the form
- **Default**: Set during form creation (typically to the collector or officer assigned)
- **Changes**: Transfers between departments as the form progresses

### 2. **dept_status** (Department Workflow Stage)
- **Type**: DepartmentStatus Enum (13 stages)
- **Purpose**: Tracks which stage of the administrative workflow the form is in
- **Values**: SUBMIT → SEEK_REPORT → ... → ORDER_DOWNLOAD
- **Owner**: Various departments depending on the stage

### 3. **office_status** (Current Office/Department)
- **Type**: Department Enum (12 departments)
- **Purpose**: Identifies which department office currently has custody of the form
- **Default**: LDCSINGLEWINDOW
- **Values**: MAMLATDAR, LAQ, LRO, PDA, COLLECTOR, etc.
- **Transitions**: Form moves between offices as it progresses

### 4. **form_status** (Applicant Submission Status)
- **Type**: FormStatus Enum (7 states)
- **Purpose**: Tracks whether the form submission itself is complete/approved
- **Values**: DRAFT → SUBMITTED → APPROVED/REJECTED → INPROGRESS → HEARING_SCHEDULED → PAY_FEES
- **Owner**: Primarily driven by applicant actions and initial validation

---

## Complete Multi-Dimensional Workflow

### **STAGE 1: INITIAL SUBMISSION**

```
Event: Applicant creates and submits NA Form

State Matrix:
┌─────────────────────────────────────────────────────────────┐
│ dept_user_id    │ User ID of collector/officer           │
│ office_status   │ LDCSINGLEWINDOW (DEFAULT)              │
│ form_status     │ DRAFT → SUBMITTED                       │
│ dept_status     │ SUBMIT                                  │
└─────────────────────────────────────────────────────────────┘

Actions:
- Applicant fills Form VII with:
  * Personal details (q1-q6)
  * Survey/land details (q7-q10)
  * Land use & access (q11-q18)
  * Uploads annexures (anx1-anx5)
  * Adds applicants & survey plots

Processing:
- Backend: createNa() mutation
  └─ Creates na_form record
  └─ Creates na_applicant records
  └─ Creates na_survey records
  └─ dept_user_id assigned at this point

Transitions:
- form_status: DRAFT → SUBMITTED
- dept_status: SUBMIT (initial state)
```

---

### **STAGE 2: INITIAL VALIDATION**

```
Event: Single Window/LDC validates form completeness

State Matrix:
┌─────────────────────────────────────────────────────────────┐
│ dept_user_id    │ LDC Mamlatdar (single window officer)  │
│ office_status   │ LDCSINGLEWINDOW                         │
│ form_status     │ SUBMITTED → APPROVED or REJECTED        │
│ dept_status     │ SUBMIT (no change yet)                  │
└─────────────────────────────────────────────────────────────┘

Checks Performed:
✓ All required fields filled
✓ All annexures uploaded
✓ Signatures collected
✓ Survey details valid
✓ Applicant information complete

Outcomes:

IF REJECTED:
┌─────────────────────────────────────────────────────────────┐
│ form_status     │ REJECTED                                │
│ dept_status     │ SUBMIT (stays)                          │
│ Action: Notify applicant → Return to DRAFT for correction│
└─────────────────────────────────────────────────────────────┘

IF APPROVED:
┌─────────────────────────────────────────────────────────────┐
│ form_status     │ APPROVED                                │
│ dept_status     │ SUBMIT (ready to move to next stage)   │
│ Action: Proceed to SEEK_REPORT stage                     │
└─────────────────────────────────────────────────────────────┘
```

---

### **STAGE 3: SEEK REPORTS FROM DEPARTMENTS**

```
Event: Form moves to collector/mamlatdar for inter-departmental coordination

State Matrix:
┌─────────────────────────────────────────────────────────────┐
│ dept_user_id    │ Collector or Senior Mamlatdar           │
│ office_status   │ COLLECTOR or MAMLATDAR                  │
│ form_status     │ INPROGRESS                              │
│ dept_status     │ SEEK_REPORT                             │
│ seek_report     │ true (flag set)                         │
└─────────────────────────────────────────────────────────────┘

Process:
1. Form assigned to collector
2. Collector identifies required reports:
   - MAMLATDAR: Land use verification
   - LAQ: Measurement & boundary verification
   - LRO: Revenue records check
   - DNHPDA: Development plan compliance
   - PDA: Town planning approval (if applicable)

3. Queries sent to each department via na_query table
   (QueryType: REPORT)

Database Updates:
- na_form.seek_report = true
- na_form.dept_status = SEEK_REPORT
- na_form.office_status = COLLECTOR
- na_query records created for each report request
- dept_user_id points to collector

Communication Thread:
Collector → Department Heads: "Please submit report on survey XYZ"
  ↓ (File upload via na_query.upload_url_1-5)
Department → Collector: "Report attached - findings XYZ"
```

---

### **STAGE 4: REPORT VERIFICATION**

```
Event: Collector receives and verifies all department reports

State Matrix (While collecting):
┌─────────────────────────────────────────────────────────────┐
│ dept_user_id    │ Collector                               │
│ office_status   │ COLLECTOR                               │
│ form_status     │ INPROGRESS (unchanged)                  │
│ dept_status     │ SEEK_REPORT (until all reports ready)  │
└─────────────────────────────────────────────────────────────┘

State Matrix (All reports received):
┌─────────────────────────────────────────────────────────────┐
│ dept_user_id    │ Collector                               │
│ office_status   │ COLLECTOR                               │
│ form_status     │ APPROVED (form data OK)                 │
│ dept_status     │ REPORT_VERIFIED                         │
└─────────────────────────────────────────────────────────────┘

Verification Checklist:
✓ Mamlatdar: Land use complies with regulations
✓ LAQ: Survey measurements correct & boundaries clear
✓ LRO: No disputes in revenue records
✓ DNHPDA: Complies with development plan
✓ PDA: Town planning approved (if applicable)

Internal Notes:
- na_noting table records collector's assessment
- Any discrepancies noted & flagged
- Applicant queried if reports show issues
```

---

### **STAGE 5: NOTING & DECISION DOCUMENTATION**

```
Event: Collector prepares internal noting (administrative decision document)

State Matrix:
┌─────────────────────────────────────────────────────────────┐
│ dept_user_id    │ Collector or Senior Officer             │
│ office_status   │ COLLECTOR                               │
│ form_status     │ INPROGRESS                              │
│ dept_status     │ NOTING_DRAFT                            │
└─────────────────────────────────────────────────────────────┘

Noting Document Contains:
1. Summary of all reports received
2. Analysis of findings
3. Compliance check against regulations
4. Recommendations: Approve/Reject/Conditional
5. Notes on any queries or clarifications needed

Who Can Write Notings:
- MAMLATDAR
- DEPUTYCOLLECTOR
- COLLECTOR
- RAK (Record Keeper)
- LDCMAMLATDAR

UI Button Condition:
```
if (["MAMLATDAR", "DEPUTYCOLLECTOR", "COLLECTOR", "RAK"].includes(role)) 
  → Show "Notings" button
if (form.dept_status === "NOTING_DRAFT") 
  → Enable noting entry
```

Database:
- na_noting table records created
- createdBy: User who wrote the noting
- Supports multiple notings per form (history trail)
```

---

### **STAGE 6: HEARING ALLOCATION & SCHEDULING**

```
Event: Collector schedules hearing with applicant

State Matrix (Allocation):
┌─────────────────────────────────────────────────────────────┐
│ dept_user_id    │ Collector or PaToCollector               │
│ office_status   │ COLLECTOR                               │
│ form_status     │ HEARING_SCHEDULED                       │
│ dept_status     │ ALLOT_HEARING                           │
└─────────────────────────────────────────────────────────────┘

State Matrix (Scheduled):
┌─────────────────────────────────────────────────────────────┐
│ dept_user_id    │ Collector or PaToCollector               │
│ office_status   │ COLLECTOR                               │
│ form_status     │ HEARING_SCHEDULED                       │
│ dept_status     │ HEARING_SCHEDULED                       │
└─────────────────────────────────────────────────────────────┘

Hearing Details Recorded:
- Hearing date & time
- Venue/location
- Hearing officer
- Applicant notified via:
  * na_query (HEARING_SCHEDULED type)
  * Correspondence message
  * Physical intimation notice

UI Button Condition:
```
if (["PATOCOLLECTOR"].includes(role) && 
    form.dept_status === "NOTING_DRAFT")
  → Show "Schedule Hearing" button
  
if (["PATOCOLLECTOR", "COLLECTOR"].includes(role) && 
    form.dept_status === "HEARING_SCHEDULED")
  → Show "Hearing" button (navigate to hearing page)
```

Communication Log:
na_query records created with:
- QueryType: HEARING_SCHEDULED
- From: Collector
- To: Applicant
- With hearing notice document (upload_url_1)
```

---

### **STAGE 7: HEARING CONDUCT**

```
Event: Hearing officer conducts hearing with applicant

State Matrix:
┌─────────────────────────────────────────────────────────────┐
│ dept_user_id    │ Collector or PaToCollector (hearing officer) │
│ office_status   │ COLLECTOR                               │
│ form_status     │ INPROGRESS                              │
│ dept_status     │ HEARING                                 │
└─────────────────────────────────────────────────────────────┘

Hearing Process:
1. Applicant presents case
2. Officer records statements
3. Evidence documented
4. Questions posed by officer
5. Applicant responds
6. Hearing minutes prepared

Hearing Record Includes:
- Attendance register (applicant & officer)
- Statements recorded
- Evidence submitted by applicant
- Officer's observations
- Hearing outcome (provisional)

Post-Hearing:
- Hearing notes stored in na_noting table
- Status transitions recorded
- Applicant may be asked for additional info
- Next action: Prepare intimation order draft
```

---

### **STAGE 8: INTIMATION ORDER DRAFT**

```
Event: Draft order prepared after hearing conclusion

State Matrix:
┌─────────────────────────────────────────────────────────────┐
│ dept_user_id    │ Collector or Senior Officer             │
│ office_status   │ COLLECTOR                               │
│ form_status     │ APPROVED or REJECTED                    │
│ dept_status     │ INTIMATION_DRAFT                        │
└─────────────────────────────────────────────────────────────┘

Draft Order Contains:
1. Formal application reference
2. Details of applicant & property
3. History of proceedings
4. Hearing outcome
5. Final decision (Approve/Reject)
6. Conditions if approved
7. Grounds if rejected

IF REJECTED:
- Form ends here
- form_status = REJECTED
- Applicant notified via intimation

IF APPROVED:
- Proceeds to PAY_FEES stage
- form_status = APPROVED
- Conditions for payment informed
```

---

### **STAGE 9: FEES PAYMENT STAGE**

```
Event: Applicant required to pay fees before Sanad generation

State Matrix:
┌─────────────────────────────────────────────────────────────┐
│ dept_user_id    │ Collector or Finance Officer            │
│ office_status   │ COLLECTOR                               │
│ form_status     │ PAY_FEES                                │
│ dept_status     │ PAY_FEES                                │
└─────────────────────────────────────────────────────────────┘

Payment Types (na_fees.payment_type):
- FEES: Application/processing fees
- PENALTY: Any applicable penalties
- REFUND: Return of fees (if rejected)
- SANAD: Deed registration fees
- OTHER: Administrative charges

Payment Modes (na_fees.payment_mode):
- ONLINE: Credit card, UPI, net banking
- DD: Demand draft
- CHALLAN: Government challan
- CASH: Direct payment
- OTHER: Alternative methods

Payment Tracking (na_fees table):
- amount: Fee amount
- is_paid: Boolean status
- transaction_id: Payment gateway reference
- transaction_date: When paid
- invoice_no: Official receipt
- order_id: Payment gateway order ID

UI Button Condition:
```
if (["COLLECTOR", "MAMLATDAR", "RAK", "LDCMAMLATDAR"].includes(role))
  → Show "Payment" button
  → Access payment history & request payment
```

Database:
- na_fees records created for each payment
- Multiple records possible (partial payments, installments)
- Payment verification before proceeding

Payment Flow:
1. System generates fee notice with amount
2. Applicant receives intimation with fees
3. Applicant makes payment (online or offline)
4. Payment verified by system/officer
5. Receipt issued
6. After verification → FEES_PAID stage
```

---

### **STAGE 10: FEES PAID CONFIRMATION**

```
Event: All required fees collected and verified

State Matrix:
┌─────────────────────────────────────────────────────────────┐
│ dept_user_id    │ Finance Officer or Collector            │
│ office_status   │ COLLECTOR                               │
│ form_status     │ APPROVED (maintained)                   │
│ dept_status     │ FEES_PAID                               │
└─────────────────────────────────────────────────────────────┘

Verification Steps:
1. Payment received & reconciled
2. Amount matches fee notice
3. Transaction validated
4. Receipt generated
5. Audit trail created

Database Update:
- na_fees.is_paid = true
- na_fees.transaction_date filled
- Bank reference stored
- Official invoice generated

Next Transition:
- All conditions met for Sanad generation
- Form ready for APPLY_SANAD stage
```

---

### **STAGE 11: SANAD GENERATION PREPARATION**

```
Event: System prepares for final deed (Sanad) generation

State Matrix:
┌─────────────────────────────────────────────────────────────┐
│ dept_user_id    │ Collector or RDC (Revenue)              │
│ office_status   │ COLLECTOR or RDC                        │
│ form_status     │ APPROVED                                │
│ dept_status     │ APPLY_SANAD                             │
└─────────────────────────────────────────────────────────────┘

UI Button Condition:
```
if (["LDCMAMLATDAR", "MAMLATDAR", "RAK"].includes(role) && 
    form.dept_status === "APPLY_SANAD")
  → Show "SANAD" button (navigate to sanad generation page)
```

Sanad Preparation:
1. Final form data verified
2. All annexures checked
3. Applicant details confirmed
4. Property details finalized
5. Conditions incorporated
6. Legal templates applied
7. System readies deed generation

Checks Before Sanad:
✓ Form APPROVED
✓ All fees PAID
✓ No legal disputes
✓ All departments cleared
✓ Hearing completed
✓ Order issued

Sanad Generation Page (/sanad):
- Displays deed preview
- Option to edit conditions
- Review before final generation
- Digital signature capability
- Preview as PDF
```

---

### **STAGE 12: ORDER GENERATION**

```
Event: Final order document generated and ready

State Matrix:
┌─────────────────────────────────────────────────────────────┐
│ dept_user_id    │ Collector (Record Keeper)               │
│ office_status   │ COLLECTOR                               │
│ form_status     │ APPROVED                                │
│ dept_status     │ ORDER_GENERATE                          │
└─────────────────────────────────────────────────────────────┘

Order Contains:
1. Official order number & date
2. Applicant name & details
3. Property details & boundaries
4. Grant of permission for NA use
5. Conditions & restrictions
6. Validity period
7. Officer signature & seal
8. Department stamp

Document Generation:
- Server-side rendering using template
- PDF generation with digital signatures
- Audit trail: who generated, when
- Version control if regenerated
- Digital storage with metadata

Order Format:
- Formal letterhead
- Date: Issued date
- Reference: Application number
- Content: Formal permission grant
- Signatures: Authorized officer
- Seals: Department & government
- Footer: Receipt instructions
```

---

### **STAGE 13: ORDER READY FOR DOWNLOAD**

```
Event: Final order available for applicant download & collection

State Matrix:
┌─────────────────────────────────────────────────────────────┐
│ dept_user_id    │ Collector or Record Keeper              │
│ office_status   │ COLLECTOR                               │
│ form_status     │ APPROVED                                │
│ dept_status     │ ORDER_DOWNLOAD                          │
└─────────────────────────────────────────────────────────────┘

Download Access:
- Applicant receives notification
- Link to download page provided
- Authentication: userId match required
- One-time download or unlimited?
- PDF download option
- Print from web interface option

Order Components Available:
1. Permission Order (main document)
2. Conditions & Restrictions (attachment 1)
3. Site Plan with marked area (attachment 2)
4. Survey details (attachment 3)
5. Fee receipt (attachment 4)
6. Reference documents (attachment 5)

Physical Collection:
- Applicant can collect physical copy from office
- Requires identification
- Receipt issued
- Original retained in archives

Digital Records:
- Stored in secure server
- Encrypted storage
- Backup maintained
- Access logged
- Retention policy: 30 years minimum

Final Status:
- Form lifecycle complete
- Applicant has permission
- Records archived
- Process closed
```

---

## Status Transition Matrix

```
┌────────────────┬────────────────────────────────────┬──────────────────────┬────────────────────┐
│ dept_status    │ form_status                        │ office_status        │ dept_user_id       │
├────────────────┼────────────────────────────────────┼──────────────────────┼────────────────────┤
│ SUBMIT         │ DRAFT→SUBMITTED→APPROVED           │ LDCSINGLEWINDOW      │ LDC Officer        │
│ SEEK_REPORT    │ INPROGRESS                         │ COLLECTOR            │ Collector          │
│ REPORT_VERIFIED│ APPROVED                           │ COLLECTOR            │ Collector          │
│ NOTING_DRAFT   │ INPROGRESS                         │ COLLECTOR            │ Officer            │
│ ALLOT_HEARING  │ HEARING_SCHEDULED                  │ COLLECTOR            │ PATOCOLLECTOR      │
│ HEARING_SCHD   │ HEARING_SCHEDULED                  │ COLLECTOR            │ PATOCOLLECTOR      │
│ HEARING        │ INPROGRESS                         │ COLLECTOR            │ PATOCOLLECTOR      │
│ INTIMATION_DFT │ APPROVED/REJECTED                  │ COLLECTOR            │ Officer            │
│ PAY_FEES       │ PAY_FEES                           │ COLLECTOR            │ Finance Officer    │
│ FEES_PAID      │ APPROVED                           │ COLLECTOR            │ Finance Officer    │
│ APPLY_SANAD    │ APPROVED                           │ COLLECTOR/RDC        │ RDC/Collector      │
│ ORDER_GENERATE │ APPROVED                           │ COLLECTOR            │ Record Keeper      │
│ ORDER_DOWNLOAD │ APPROVED                           │ COLLECTOR            │ Record Keeper      │
└────────────────┴────────────────────────────────────┴──────────────────────┴────────────────────┘
```

---

## Key Dependencies Between Status Fields

### 1. **dept_status** → **office_status** (Department Assignment)
```
dept_status = SUBMIT        → office_status = LDCSINGLEWINDOW
dept_status = SEEK_REPORT   → office_status = COLLECTOR
dept_status = NOTINGS_DRAFT → office_status = COLLECTOR
dept_status = APPLY_SANAD   → office_status = RDC or COLLECTOR
```

### 2. **dept_status** → **form_status** (Validity of Submission)
```
form_status = REJECTED  → Cannot progress (stays at SUBMIT)
form_status = APPROVED  → Can proceed to next dept_status
form_status = DRAFT     → Applicant must complete & resubmit
```

### 3. **dept_user_id** → **Visible Actions** (Permission Check)
```
dept_user_id = X
  ↓
User.id = X checks form for:
  - "Correspondence" button (accessible to dept_user OR specific roles)
  - "Noting" button (specific roles only)
  - "Report" button (depends on seek_report flag)
  - "Payment" button (specific roles only)
```

### 4. **seek_report** Flag (Dependency)
```
seek_report = false → "Report" button NOT visible
              → Status: SUBMIT or APPROVED or REJECTED

seek_report = true  → "Report" button visible to:
              → TALATHI, DNHPDA, LAQ, LRO roles
              → OR dept_user (form creator)
              → Status: SEEK_REPORT, REPORT_VERIFIED
```

---

## Data Flow During Status Transitions

### Example: SEEK_REPORT → REPORT_VERIFIED

**Before Transition:**
```
na_form {
  id: 1001,
  dept_user_id: 5 (Collector),
  office_status: "COLLECTOR",
  form_status: "INPROGRESS",
  dept_status: "SEEK_REPORT",
  seek_report: true
}

na_query records (referencing form 1001):
- From: Collector (5) → To: Mamlatdar (8)    | QueryType: REPORT | Status: REPLIED
- From: Collector (5) → To: LAQ Officer (12) | QueryType: REPORT | Status: REPLIED
- From: Collector (5) → To: LRO Officer (15) | QueryType: REPORT | Status: REPLIED
- From: Collector (5) → To: DNHPDA (18)      | QueryType: REPORT | Status: REPLIED
```

**During Transition:**
```
1. Collector reviews all na_query records
2. Checks that query_status = "REPLIED" for all REPORT queries
3. Verifies content of responses
4. Records notes in na_noting table
```

**After Transition:**
```
UPDATE na_form SET
  dept_status = 'REPORT_VERIFIED',
  form_status = 'APPROVED',
  updatedAt = NOW(),
  updatedById = 5
WHERE id = 1001;

na_query status update:
- All REPORT queries: query_status = 'CLOSED'
```

---

## Special Status Combinations

### Combination 1: Rejected Form
```
form_status = REJECTED
dept_status = SUBMIT (stays same)
action: Form cannot progress, return to applicant
```

### Combination 2: Conditional Approval
```
form_status = APPROVED
dept_status = APPLY_SANAD
Conditions: Sanad generation with specific restrictions on land use
```

### Combination 3: Payment Pending
```
form_status = PAY_FEES
dept_status = PAY_FEES
action: Payment gateway integration, multiple payment attempts allowed
```

### Combination 4: Multi-Department Coordination
```
dept_status = SEEK_REPORT
seek_report = true
office_status = COLLECTOR
Multiple na_query records to:
  - MAMLATDAR, LAQ, LRO, DNHPDA, PDA
Collector waits for all to respond before advancing
```

---

## Query Building Based on Status

### Finding Forms Awaiting Specific Department Response
```sql
SELECT * FROM na_form
WHERE dept_status = 'SEEK_REPORT'
AND seek_report = true
AND id IN (
  SELECT na_formId FROM na_query
  WHERE type = 'REPORT'
  AND query_status = 'PENDING'
  AND to_userId = {current_user_id}
);
```

### Finding Forms Ready for Action by Role
```sql
-- Forms ready for Collector's noting
SELECT * FROM na_form
WHERE dept_status = 'NOTING_DRAFT'
AND office_status = 'COLLECTOR'
AND form_status = 'APPROVED';

-- Forms ready for hearing
SELECT * FROM na_form
WHERE dept_status = 'HEARING_SCHEDULED'
AND form_status = 'HEARING_SCHEDULED'
AND office_status = 'COLLECTOR';

-- Forms ready for Sanad generation
SELECT * FROM na_form
WHERE dept_status = 'APPLY_SANAD'
AND form_status = 'APPROVED'
AND office_status IN ('COLLECTOR', 'RDC');
```

---

## Workflow Duration Estimates

```
┌────────────────────────┬──────────────────┬─────────────────────┐
│ Stage                  │ Typical Duration │ dept_status Period  │
├────────────────────────┼──────────────────┼─────────────────────┤
│ 1. Initial Submission  │ 1 day            │ SUBMIT              │
│ 2. Validation          │ 2-3 days         │ SUBMIT              │
│ 3. Report Seeking      │ 7-15 days        │ SEEK_REPORT         │
│ 4. Report Verification │ 2-3 days         │ REPORT_VERIFIED     │
│ 5. Noting & Decision   │ 3-5 days         │ NOTING_DRAFT        │
│ 6. Hearing Allotment   │ 1-2 days         │ ALLOT_HEARING       │
│ 7. Hearing Scheduling  │ 3-7 days         │ HEARING_SCHEDULED   │
│ 8. Hearing Conduct     │ 1 day            │ HEARING             │
│ 9. Order Drafting      │ 2-3 days         │ INTIMATION_DRAFT    │
│ 10. Fees Payment       │ 7-14 days        │ PAY_FEES            │
│ 11. Fee Verification   │ 1-2 days         │ FEES_PAID           │
│ 12. Sanad Prep         │ 2-3 days         │ APPLY_SANAD         │
│ 13. Order Generation   │ 1 day            │ ORDER_GENERATE      │
│ 14. Download Ready     │ 0 days           │ ORDER_DOWNLOAD      │
├────────────────────────┼──────────────────┼─────────────────────┤
│ TOTAL                  │ 35-60 days       │ Full Workflow       │
└────────────────────────┴──────────────────┴─────────────────────┘
```

---

## Role Responsibilities by Status

```
┌──────────────────────┬──────────────────────────────────────────────┐
│ dept_status          │ Responsible Roles & Actions                  │
├──────────────────────┼──────────────────────────────────────────────┤
│ SUBMIT               │ - LDC Mamlatdar: Validate form completeness  │
│                      │ - Single Window: Check documentation         │
│                      │                                              │
│ SEEK_REPORT          │ - Collector: Coordinate department queries  │
│                      │ - Mamlatdar: Land use assessment             │
│                      │ - LAQ: Measurement verification              │
│                      │ - LRO: Revenue record check                  │
│                      │ - DNHPDA: Development plan check             │
│                      │ - PDA: Town planning check                   │
│                      │                                              │
│ REPORT_VERIFIED      │ - Collector: Analyze all reports             │
│                      │ - Senior Officer: Cross-reference findings   │
│                      │                                              │
│ NOTING_DRAFT         │ - Collector: Prepare administrative notes    │
│                      │ - Mamlatdar: Provide recommendations         │
│                      │ - RAK: Record official notings               │
│                      │                                              │
│ ALLOT_HEARING        │ - Collector: Schedule hearing date           │
│                      │ - PaToCollector: Notify applicant            │
│                      │                                              │
│ HEARING_SCHEDULED    │ - PaToCollector: Prepare hearing notice      │
│                      │ - Applicant: Attend hearing                  │
│                      │                                              │
│ HEARING              │ - PaToCollector: Conduct hearing             │
│                      │ - Collector: Supervise proceedings           │
│                      │ - Applicant: Present case                    │
│                      │                                              │
│ INTIMATION_DRAFT     │ - Collector: Prepare intimation order        │
│                      │ - Senior Officer: Review draft               │
│                      │                                              │
│ PAY_FEES             │ - Finance Officer: Generate fee notice       │
│                      │ - Applicant: Make payment                    │
│                      │ - Collector: Track payment status            │
│                      │                                              │
│ FEES_PAID            │ - Finance: Verify payment                    │
│                      │ - Collector: Issue receipt                   │
│                      │                                              │
│ APPLY_SANAD          │ - RDC/Collector: Initiate Sanad generation   │
│                      │ - Mamlatdar: Prepare deed                    │
│                      │ - RAK: Record in official registry           │
│                      │                                              │
│ ORDER_GENERATE       │ - Record Keeper: Generate final order        │
│                      │ - Collector: Authorize & sign                │
│                      │ - System: Digital signature                  │
│                      │                                              │
│ ORDER_DOWNLOAD       │ - Applicant: Download order                  │
│                      │ - Collector: Physical issuance option        │
│                      │ - Archive: Store original records            │
└──────────────────────┴──────────────────────────────────────────────┘
```

---

## Error States & Rollback Scenarios

### Scenario 1: Report Shows Dispute
```
Current: dept_status = SEEK_REPORT, form_status = INPROGRESS
Report Content: "Land ownership disputed with neighbor"

Action:
1. LRO sends query back to Collector
2. na_query type: "QUERY" (not REPORT)
3. Collector communicates with applicant
4. Applicant provides settlement proof
5. Reopened: dept_status reverts or paused
6. Resolution documented in na_noting
7. Proceeds when dispute cleared
```

### Scenario 2: Hearing Postponed
```
Current: dept_status = HEARING_SCHEDULED, form_status = HEARING_SCHEDULED

Reason: Applicant emergency, no notice

Action:
1. PaToCollector reschedules hearing
2. dept_status stays HEARING_SCHEDULED (no change)
3. form_status stays HEARING_SCHEDULED
4. New hearing date communicated
5. na_query updated with new notice
```

### Scenario 3: Payment Failed/Incomplete
```
Current: dept_status = PAY_FEES, form_status = PAY_FEES

Issue: Online payment failed/timeout

Action:
1. Payment remains: is_paid = false
2. System allows retry
3. Applicant attempts again
4. Upon success: is_paid = true
5. dept_status advances to FEES_PAID
```

---

## Summary Table: What Each Status Field Means

```
╔═══════════════════════════════════════════════════════════════════╗
║                    STATUS FIELD MEANINGS                          ║
╠════════════════════════════════╦════════════════════════════════╣
║ FIELD                          ║ REPRESENTS                     ║
╠════════════════════════════════╬════════════════════════════════╣
║ dept_user_id                   ║ WHO is currently responsible   ║
║ (User.id)                      ║ for handling this form         ║
║                                ║ • Changes as ownership moves   ║
║                                ║   between departments         ║
║                                ║ • Filters what's visible to   ║
║                                ║   whom in the UI              ║
╠════════════════════════════════╬════════════════════════════════╣
║ dept_status                    ║ WHERE in the workflow is the   ║
║ (DepartmentStatus)             ║ form right now?               ║
║ 13 states                      ║ • SUBMIT through ORDER_DOWNLOAD║
║                                ║ • Primary progression tracker ║
║                                ║ • Determines available actions║
║                                ║ • Enables role-based buttons  ║
╠════════════════════════════════╬════════════════════════════════╣
║ office_status                  ║ WHICH office/department       ║
║ (Department)                   ║ currently has custody?        ║
║ 12 departments                 ║ • LDCSINGLEWINDOW, COLLECTOR, ║
║                                ║   RDC, MAMLATDAR, etc.        ║
║                                ║ • Determines where form is    ║
║                                ║   physically located          ║
║                                ║ • Routing for inter-office    ║
║                                ║   communication               ║
╠════════════════════════════════╬════════════════════════════════╣
║ form_status                    ║ IS the form itself valid &    ║
║ (FormStatus)                   ║ complete for current stage?   ║
║ 7 states                       ║ • DRAFT, SUBMITTED, APPROVED, ║
║                                ║   REJECTED, INPROGRESS        ║
║                                ║ • Applicant submission status ║
║                                ║ • Gates progression in workflow║
║                                ║ • Indicates if data is sound  ║
╚════════════════════════════════╩════════════════════════════════╝
```

---

## Practical Example: Complete Workflow Trace

```
Day 1 - APPLICANT SUBMITS:
┌────────────────────────────────────────────────────────────┐
│ dept_user_id: 5 (Auto-assigned collector)                 │
│ office_status: LDCSINGLEWINDOW                            │
│ form_status: SUBMITTED                                    │
│ dept_status: SUBMIT                                       │
│ Applicant uploads Form VII, annexures, applicants        │
└────────────────────────────────────────────────────────────┘

Day 3 - LDC VALIDATES:
┌────────────────────────────────────────────────────────────┐
│ dept_user_id: 5 (remains)                                 │
│ office_status: LDCSINGLEWINDOW                            │
│ form_status: APPROVED (validation passed)                │
│ dept_status: SUBMIT (no change)                           │
│ ✓ All docs present, signature valid, survey data OK      │
└────────────────────────────────────────────────────────────┘

Day 4 - COLLECTOR COORDINATES REPORTS:
┌────────────────────────────────────────────────────────────┐
│ dept_user_id: 5 (Collector ID)                            │
│ office_status: COLLECTOR                                 │
│ form_status: INPROGRESS                                  │
│ dept_status: SEEK_REPORT                                 │
│ seek_report: true                                        │
│ Queries sent to 5 departments via na_query table        │
└────────────────────────────────────────────────────────────┘

Day 15 - ALL REPORTS RECEIVED:
┌────────────────────────────────────────────────────────────┐
│ dept_user_id: 5 (Collector)                               │
│ office_status: COLLECTOR                                 │
│ form_status: APPROVED (data still valid)                │
│ dept_status: REPORT_VERIFIED                             │
│ All na_query records with type=REPORT have status=REPLIED│
└────────────────────────────────────────────────────────────┘

Day 18 - NOTINGS PREPARED:
┌────────────────────────────────────────────────────────────┐
│ dept_user_id: 5 (Collector)                               │
│ office_status: COLLECTOR                                 │
│ form_status: INPROGRESS                                  │
│ dept_status: NOTING_DRAFT                                │
│ na_noting records created with recommendations           │
└────────────────────────────────────────────────────────────┘

Day 20 - HEARING SCHEDULED:
┌────────────────────────────────────────────────────────────┐
│ dept_user_id: 5 (Collector) / or 8 (PATOCOLLECTOR)        │
│ office_status: COLLECTOR                                 │
│ form_status: HEARING_SCHEDULED                           │
│ dept_status: HEARING_SCHEDULED                           │
│ Hearing notice created, applicant notified              │
└────────────────────────────────────────────────────────────┘

Day 22 - HEARING DAY:
┌────────────────────────────────────────────────────────────┐
│ dept_user_id: 8 (PATOCOLLECTOR conducting)               │
│ office_status: COLLECTOR                                 │
│ form_status: INPROGRESS                                  │
│ dept_status: HEARING                                     │
│ Hearing conducted, minutes recorded in na_noting        │
└────────────────────────────────────────────────────────────┘

Day 25 - ORDER DRAFT PREPARED:
┌────────────────────────────────────────────────────────────┐
│ dept_user_id: 5 (Collector)                               │
│ office_status: COLLECTOR                                 │
│ form_status: APPROVED (decision: grant permission)      │
│ dept_status: INTIMATION_DRAFT                            │
│ Formal order prepared, ready for execution              │
└────────────────────────────────────────────────────────────┘

Day 28 - PAYMENT NOTICE ISSUED:
┌────────────────────────────────────────────────────────────┐
│ dept_user_id: 10 (Finance Officer)                        │
│ office_status: COLLECTOR                                 │
│ form_status: PAY_FEES                                    │
│ dept_status: PAY_FEES                                    │
│ Fee notice sent to applicant (10,000 rupees example)     │
│ na_fees record created: is_paid=false                   │
└────────────────────────────────────────────────────────────┘

Day 35 - PAYMENT RECEIVED:
┌────────────────────────────────────────────────────────────┐
│ dept_user_id: 10 (Finance Officer)                        │
│ office_status: COLLECTOR                                 │
│ form_status: APPROVED                                    │
│ dept_status: FEES_PAID                                   │
│ Payment verified, receipt issued                         │
│ na_fees record: is_paid=true, transaction_id filled    │
└────────────────────────────────────────────────────────────┘

Day 37 - READY FOR SANAD:
┌────────────────────────────────────────────────────────────┐
│ dept_user_id: 15 (RDC or Senior)                          │
│ office_status: RDC or COLLECTOR                          │
│ form_status: APPROVED                                    │
│ dept_status: APPLY_SANAD                                 │
│ Sanad page accessible, user reviews deed template       │
└────────────────────────────────────────────────────────────┘

Day 40 - SANAD GENERATED:
┌────────────────────────────────────────────────────────────┐
│ dept_user_id: 15 (RDC/Record Keeper)                      │
│ office_status: RDC or COLLECTOR                          │
│ form_status: APPROVED                                    │
│ dept_status: ORDER_GENERATE                              │
│ Deed finalized, digitally signed, ready for distribution│
└────────────────────────────────────────────────────────────┘

Day 41 - DOWNLOAD AVAILABLE:
┌────────────────────────────────────────────────────────────┐
│ dept_user_id: 15 (Record Keeper)                          │
│ office_status: RDC or COLLECTOR                          │
│ form_status: APPROVED                                    │
│ dept_status: ORDER_DOWNLOAD                              │
│ Applicant receives download link, collects digital copy │
│ WORKFLOW COMPLETE - 41 days total                        │
└────────────────────────────────────────────────────────────┘
```

---

## Conclusion

The four-dimensional status model provides granular tracking of NA forms:
- **dept_user_id**: Controls WHO can see and act on a form
- **dept_status**: Drives WHAT stage the form is in (primary workflow progression)
- **office_status**: Tracks WHICH department has physical custody
- **form_status**: Validates IF the form's data is acceptable to progress

Together, they create a comprehensive audit trail and enable intelligent routing, role-based access control, and robust workflow management across multiple departments and stakeholders.
