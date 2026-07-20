# NA-Form Flow Architecture Report

## Executive Summary
This report documents the complete flow of the NA (Non-Agricultural) Permission Form in the LandDNH system. The NA-Form is a critical document (Form VII) used for applications seeking permission for Non-Agricultural use of land in Dadra and Nagar Haveli, regulated under the Land Revenue Administration Regulation, 1971.

---

## 1. Frontend Flow Overview

### 1.1 Page Location
- **Path**: `e:\web\landdnh\landdnh\src\app\dashboard\department\na-permission\view\[id]\page.tsx`
- **Component**: `ViewPermission` (Client Component - "use client")
- **Route Parameter**: `[id]` - Encrypted form ID

### 1.2 Page Initialization Flow

```
User Accesses /dashboard/department/na-permission/view/[encrypted-id]
                        ↓
1. Decrypt URL ID → Parse formId
                        ↓
2. Get User Cookie (id, role)
                        ↓
3. Load User Data (GraphQL Query)
                        ↓
4. Load Form Data (GraphQL Query)
                        ↓
Display View Permission Page with Role-Based Actions
```

### 1.3 Data Fetching (React Query)

#### Query 1: Get Current User
```typescript
Query: "getUserById"
Input: userId from cookie
Output: {
  id: number,
  firstName: string,
  lastName: string,
  role: string
}
```

#### Query 2: Get NA Form Data
```typescript
Query: "getNaById"
Input: formId (decrypted)
Output: NaFormResponse {
  id: number
  last_name: string
  q1-q18: form questions/answers
  anx1-anx5: annexure files
  createdById: number
  dept_user_id: number
  dept_status: DepartmentStatus
  seek_report: boolean
  village: { id, name }
  na_applicant: Array<{ firstName, lastName, contact, relation, signature_url }>
  na_survey: Array<{ area, sub_division, survey_no, village }>
}
```

### 1.4 Form Data Structure

#### Main Form Fields (q1-q18):
- **q1**: Boolean - Agriculture/Non-agriculture assessment
- **q2-q3**: String - Non-agricultural purpose details
- **q4-q9**: String - Applicant info & survey details
- **q10-q18**: String - Land details, access, historical info

#### Annexure Files (anx1-anx5):
1. **anx1**: Record of rights documents (7x12 Extract, V.F No.6, V.F No.8-A, Adesh)
2. **anx2**: Site sketch/layout plan (certified site plan, NA proposal plan)
3. **anx3**: Tenant/occupant consent
4. **anx4**: Additional documents (Affidavit, Right of Way, National Highway NOC)
5. **anx5**: Other documents

#### Related Entities:
- **na_applicant**: Multiple applicants with signatures
- **na_survey**: Multiple survey plots/areas

---

## 2. Backend Architecture

### 2.1 GraphQL Resolvers

#### Location: `landdnh_api/src/na/na.resolver.ts`

**Key Mutations:**
```
createNa(createNaInput: CreateNaInput) → Na
updateNa(updateNaInput: UpdateNaInput) → Na
```

**Key Queries:**
```
getNaById(id: Int) → Na
getAllUserNa(id: Int, take: Int, skip: Int) → NaPagination
getAllNa(take: Int, skip: Int) → NaPagination
getAllDepartmentNa(all: Boolean, userid: Int, role: String, take: Int, skip: Int) → NaPagination
```

### 2.2 Service Layer

#### Location: `landdnh_api/src/na/na.service.ts`

**createNa() Method Flow:**

```
1. Destructure surveys & applicants from input
2. Create NA Form record in database
   └─ Set dept_user_id: 10 (default)
   
3. Create Main Applicant (is_main: true)
   └─ Relation: 'self'
   └─ From form fields q4, q5, q6
   
4. Create Main Survey
   └─ From form fields q7, q8, q9
   
5. Create Additional Surveys (if provided)
   └─ Multiple survey records per form
   
6. Create Additional Applicants (if provided)
   └─ Multiple applicant records per form

Return: Created NA Form with nested applicants & surveys
```

**getNaById() Method:**
- Retrieves form with all related applicants and surveys
- Uses field selection optimization

### 2.3 Database Schema (Prisma)

#### Primary Table: `na_form`
```prisma
model na_form {
  id                Int
  villageId         Int?
  village           village?
  
  // Form Questions
  last_name         String?
  q1-q18            String?  // Various form fields
  
  // Annexure Files
  anx1-anx5         String?  // File URLs
  
  // Status & Tracking
  status            Status              @default(ACTIVE)
  office_status     Department?
  dept_status       DepartmentStatus    @default(SUBMIT)
  form_status       FormStatus?
  seek_report       Boolean             @default(false)
  dept_user_id      Int?
  
  // Audit Fields
  createdAt         DateTime            @default(now())
  createdById       Int?
  createdBy         user?               @relation("na_form_create", fields: [createdById])
  
  updatedAt         DateTime            @updatedAt
  updatedById       Int?
  updatedBy         user?               @relation("na_form_update")
  
  deletedAt         DateTime?
  deletedById       Int?
  deletedBy         user?               @relation("na_form_delete")
  
  // Relations
  na_applicant      na_applicant[]
  na_survey         na_survey[]
  na_query          na_query[]
  na_fees           na_fees[]
  na_upload         na_upload[]
}
```

#### Related Tables: `na_applicant`
```prisma
model na_applicant {
  id            Int
  na_formId     Int
  na_form       na_form
  villageId     Int?
  village       village?
  
  firstName     String
  lastName      String
  address       String?
  contact       String
  relation      String
  signature_url String?
  is_main       Boolean   @default(false)
  
  createdAt     DateTime  @default(now())
  createdById   Int?
  createdBy     user?     @relation("na_applicant_create")
  
  // Update & Delete tracking
}
```

#### Related Tables: `na_survey`
```prisma
model na_survey {
  id            Int
  na_formId     Int
  na_form       na_form
  villageId     Int?
  village       village?
  
  survey_no     String
  sub_division  String
  area          String
  
  createdAt     DateTime  @default(now())
  createdById   Int?
  createdBy     user?     @relation("na_survey_create")
  
  // Update & Delete tracking
}
```

### 2.4 Department Status Workflow

```
DepartmentStatus Enum:
├── SUBMIT                    // Initial submission
├── SEEK_REPORT               // Waiting for department reports
├── REPORT_VERIFIED           // Reports received and verified
├── NOTING_DRAFT              // Internal notes being prepared
├── ALLOT_HEARING             // Hearing allocated
├── HEARING_SCHEDULED         // Hearing date set
├── HEARING                   // Hearing in progress
├── INTIMATION_DRAFT          // Order intimation draft
├── PAY_FEES                  // Waiting for fees payment
├── FEES_PAID                 // Fees collected
├── APPLY_SANAD               // Ready for Sanad generation
├── ORDER_GENERATE            // Final order generation
└── ORDER_DOWNLOAD            // Order ready for download
```

---

## 3. Role-Based Access Control (RBAC)

### 3.1 Role Hierarchy & Permissions

```
Roles in System:
├── SYSTEM ADMIN           - System level administration
├── SUPTDCOLL              - Superintendent Collector
├── LDCMAMLATDAR           - LDC Mamlatdar (can access most features)
├── MAMLATDAR              - Mamlatdar
├── COLLECTOR              - Collector
├── DEPUTYCOLLECTOR        - Deputy Collector
├── PATOCOLLECTOR          - Pato Collector (preliminary inquiries)
├── TALATHI                - Village revenue officer
├── RAK                    - Record keeper
├── DNHPDA                 - PDA office
├── LAQ/LRO                - Report departments
└── USER                   - Applicant
```

### 3.2 View Permission Page - Action Buttons

| Action | Visible To | Condition |
|--------|-----------|-----------|
| **Schedule Hearing** | PATOCOLLECTOR | dept_status == "NOTING_DRAFT" |
| **SANAD** | LDCMAMLATDAR, MAMLATDAR, RAK | dept_status == "APPLY_SANAD" |
| **Payment** | Multiple roles | - |
| **Correspondence** | Admin roles OR dept_user | - |
| **Notings** | Decision makers | Specific roles |
| **Report** | Admin roles OR dept_user OR report seekers | Based on seek_report flag |
| **Hearing** | PATOCOLLECTOR, COLLECTOR | dept_status == "HEARING_SCHEDULED" |

---

## 4. Feature-Specific Flows

### 4.1 Correspondence Module

**Location**: `CorrespondenceProvider` component (within page.tsx)

**GraphQL Queries:**
```
Query: getQueryByType
Input: {
  id: formId,
  querytype: ["QUERY", "CORESPONDENCE", "REPORT", "SUBMITREPORT", "JIMNI"]
}
Output: Array of communications with:
  - id, query, upload_url_1
  - type, request_type
  - from_user, to_user (with firstName, lastName, role)
```

**Mutation: createNaQuery**
```
Input: {
  createdById: userId,
  from_userId: userId,
  to_userId: recipientId,
  query: message text,
  type: QueryType,
  na_formId: formId,
  query_status: "PENDING",
  request_type: RequestType,
  upload_url_1?: fileUrl,
  dept_update: boolean
}
```

**QueryType Enum:**
```
QUERY, CORESPONDENCE, NOTING, UPDATES, REPORT, 
SUBMITREPORT, PRENOTE, HEARING_SCHEDULED, 
RESCHEDULED, JIMNI, SANAD, INTIMATION_DRAFT, 
HEARING_NOTICE, REPORTMAM, REPORTLRO, REPORTLAQ, 
REPORTDNHPDA, REPORTFULL
```

### 4.2 Noting Module

**Component**: `NotingProvider` (accessed via Drawer)

**Accessible By**: Decision-making roles

**Functionality**:
- Prepare internal notes/remarks
- Track form progression
- Document departmental decisions

### 4.3 Report Module

**Component**: Multiple providers based on role & status:
- `SubmitReportProvider` - MAMLATDAR role with SEEK_REPORT status
- `AllotHearingProvider` - COLLECTOR with NOTING_DRAFT status
- `SeekReportDepartmentProvider` - DNHPDA, LAQ, LRO with SEEK_REPORT
- `ReportProvider` - Generic report submission

### 4.4 Payment Module

**Component**: `PaymentHistoryProvider`

**Tracks**:
- Fee payments
- Payment history
- Payment request workflow
- Multiple payment modes (ONLINE, DD, CHALLAN, CASH)

---

## 5. Data Display Flow

### 5.1 Form Display Structure (HTML Output)

```
FORM - VII Header
├── Applicant Information
│   ├── q1: Agriculture/Non-agriculture type
│   ├── q2-q3: Purpose details
│   └── q4-q6: Applicant name & contact
│
├── Annexure Files Section
│   ├── Anx1: Record of Rights (with View File link)
│   ├── Anx2: Site Plan (with View File link)
│   ├── Anx3: Tenant Consent
│   ├── Anx4: Additional Documents
│   └── Anx5: Other Documents
│
├── Additional Applicants Table
│   ├── firstName, lastName, contact, relation
│   └── signature_url (View Signature button)
│
├── Land & Survey Details
│   ├── q7-q9: Survey number, subdivision, area
│   ├── q10: Old survey number
│   └── Survey Details Table (multi-record)
│
└── Land Use & Access Details
    ├── q11-q12: Land use type (Residential/Commercial/Industrial)
    ├── q13-q18: Land conditions & access information
```

### 5.2 File Links

```
Format: ${baseurl}/${file_path}
Examples:
- /public/images/22/document.pdf
- /public/images/9/signature.jpg
```

---

## 6. Complete Request-Response Cycle

### 6.1 Form Submission Cycle (View to Backend)

```
1. USER ACCESSES VIEW PAGE
   └─ Encrypted ID in URL
   
2. PAGE COMPONENT LOADS
   ├─ Decrypt URL ID
   ├─ Get user info from cookie
   └─ Initialize React Query
   
3. TWO PARALLEL QUERIES FIRE
   ├─ getUserById (current user details)
   └─ getNaById (form data)
   
4. LOADING STATES
   ├─ If either fails → Show error
   ├─ If loading → Show "Loading..."
   └─ Both succeed → Render form view
   
5. FORM DATA RENDERED
   ├─ Static form fields displayed
   ├─ Applicant list rendered
   ├─ Survey details table shown
   └─ File download links provided
   
6. ACTION BUTTONS RENDERED
   ├─ Role check against user.role
   ├─ Status check against form.dept_status
   ├─ show/hide buttons conditionally
   └─ Each button opens specific drawer
```

### 6.2 Correspondence Action Flow

```
USER CLICKS "CORRESPONDENCE" BUTTON
         ↓
setCorrespondenceBox = true (opens Drawer)
         ↓
CorrespondenceProvider mounts
    ├─ Initialize React Form
    └─ Initialize React Query context
         ↓
Query: getQueryByType fires
    ├─ Fetch previous messages
    └─ Filter by QueryType
         ↓
Query: getUserByRoles fires
    └─ Get list of eligible recipients
         ↓
Display Message Thread
    ├─ Show previous messages
    ├─ "Send Message" button visible
    └─ File upload option available
         ↓
USER TYPES MESSAGE & SUBMITS
         ↓
handleSubmit calls onSubmit
    ├─ Validate form data
    ├─ Upload file if attached
    └─ Prepare mutation payload
         ↓
Mutation: createNaQuery fires
    ├─ Create database record
    └─ Update query status
         ↓
Success: Toast notification
    ├─ "Message Sent Successfully"
    ├─ Refetch getQueryByType
    └─ Redirect to /dashboard/department/na-permission
```

### 6.3 Hearing Action Flow

```
COLLECTOR SEES FORM WITH dept_status = "HEARING_SCHEDULED"
         ↓
CLICKS "HEARING" BUTTON
         ↓
Router.push to /dashboard/department/na-permission/view/[encrypted-id]/hearing
         ↓
[Separate page component loaded]
    └─ Displays hearing details & conduct interface
```

---

## 7. Data Relationships Diagram

```
USER (created by)
  ↓
NA_FORM
  ├─→ VILLAGE (land location)
  ├─→ NA_APPLICANT (1 or more)
  │   └─→ VILLAGE (applicant location)
  ├─→ NA_SURVEY (1 or more)
  │   └─→ VILLAGE (survey location)
  ├─→ NA_QUERY (correspondence)
  │   ├─→ USER (from_user)
  │   ├─→ USER (to_user)
  │   └─→ QueryType
  ├─→ NA_FEES (payment records)
  ├─→ NA_UPLOAD (file uploads)
  └─→ NA_NOTING (internal notes)

VILLAGE
  └─→ MULTIPLE NA_FORM, NA_APPLICANT, NA_SURVEY
```

---

## 8. API Integration

### 8.1 GraphQL Endpoint
- **Base URL**: `${baseurl}/graphql`
- **Method**: POST
- **Headers**: Authorization via cookies

### 8.2 File Upload Service
```typescript
UploadFile(file: File, userId: string)
→ Returns { status: boolean, data: file_path }
```

### 8.3 URL Encryption/Decryption
```typescript
encryptURLData(id: string) → encrypted string
decryptURLData(encrypted: string, router) → original id
```

---

## 9. State Management

### 9.1 Page-Level State
```typescript
const [correspondenceBox, setCorrespondenceBox] = useState(false)
const [notingBox, setNotingBox] = useState(false)
const [reportBox, setReportBox] = useState(false)
const [rescheduleBox, setRescheduleBox] = useState(false)
const [paymentHistoryBox, setPaymentHistoryBox] = useState(false)
const [requestPaymentBox, setRequestPaymentBox] = useState(false)
```

### 9.2 React Query State
```typescript
// Form data
formdata = useQuery({
  queryKey: ["getnaform", formid],
  queryFn: () => ApiCall(getNaById)
})

// User data
userdata = useQuery({
  queryKey: ["naform"],
  queryFn: () => ApiCall(getUserById)
})
```

### 9.3 Form Context (React Hook Form)
```typescript
const methods = useForm<MarkToForm>({
  resolver: valibotResolver(MarkToSchema)
})
```

---

## 10. Error Handling

### 10.1 Frontend Error Handling
```
Query Loading → Show "Loading..."
Query Error → Show Error message with error.message
Query Success → Render content

Mutation Error → Toast.error(error.message)
Mutation Success → Toast.success() + Action (redirect/refetch)
```

### 10.2 Backend Error Handling
```
Validation Fail → BadRequestException
Database Fail → Exception with message
Response Missing → throw Error("Value not found in response")
```

---

## 11. Key Workflows

### 11.1 Complete NA Form Processing Workflow

```
1. USER SUBMITS FORM
   └─ NA Form created with applicants & surveys
   
2. STATUS: SUBMIT
   └─ Awaiting department review
   
3. STATUS: SEEK_REPORT
   └─ Department queries reports from agencies
   └─ Correspondence enables multi-department communication
   
4. STATUS: REPORT_VERIFIED
   └─ All reports received & checked
   
5. STATUS: NOTING_DRAFT
   └─ Collector prepares internal notes
   └─ Decision documented
   
6. STATUS: ALLOT_HEARING
   └─ Hearing slot allocated
   
7. STATUS: HEARING_SCHEDULED
   └─ Specific hearing date/time set
   └─ Applicant notified
   
8. STATUS: HEARING
   └─ Hearing conducted
   └─ Evidence recorded
   
9. STATUS: INTIMATION_DRAFT
   └─ Order draft prepared
   
10. STATUS: PAY_FEES
    └─ Applicant pays required fees
    
11. STATUS: FEES_PAID
    └─ Payment confirmed
    
12. STATUS: APPLY_SANAD
    └─ Ready for Sanad (deed) generation
    
13. STATUS: ORDER_GENERATE
    └─ Final order generated
    
14. STATUS: ORDER_DOWNLOAD
    └─ Applicant downloads permission
```

### 11.2 Communication Flow

```
APPLICANT
    ↓
QUERY/CORRESPONDENCE TO DEPARTMENT
    ↓
Recorded in na_query table
    ↓
DEPARTMENT REVIEWS & RESPONDS
    ↓
Response recorded with opposite user
    ↓
CONVERSATION THREAD VISIBLE TO BOTH PARTIES
    ↓
File attachments tracked via upload_url_1
```

---

## 12. Performance Considerations

### 12.1 Query Optimization
- Uses GraphQL field selection to fetch only needed data
- React Query caching with queryKey strategy
- Refetch on specific mutations

### 12.2 Rendering Optimization
- Conditional rendering based on role/status
- Drawer components lazy-loaded
- Table data mapped efficiently

### 12.3 File Handling
- File URLs stored, not actual files in DB
- Separate upload service endpoint
- baseurl prefix for file access

---

## 13. Security Features

### 13.1 Authentication
- Cookie-based session (userId, role)
- getCookie utility for secure access

### 13.2 Authorization
- Role-based action visibility
- dept_user_id check for ownership
- Specific role requirements for actions

### 13.3 Data Protection
- URL encryption for sensitive IDs
- File upload via secure service
- GraphQL field-level access control

---

## 14. Backend Service Methods

### 14.1 NaService.createNa()
```
Input: CreateNaInput, SelectedFields
Process:
  1. Extract surveys & applicants
  2. Create na_form record
  3. Create main_applicant (is_main: true)
  4. Create main_survey
  5. Create additional surveys (if any)
  6. Create additional applicants (if any)
Output: Created Na record with nested relations
```

### 14.2 NaService.getNaById()
```
Input: id (Int), SelectedFields
Process:
  1. Query database for na_form by id
  2. Include selected related fields
Output: Na record with selected relations
```

### 14.3 NaService.getAllDepartmentNa()
```
Input: all (Boolean), userId, role, take, skip, SelectedFields
Process:
  1. Filter based on user role
  2. Apply pagination
  3. Return paginated results
Output: NaPagination { data: Na[], total: Int }
```

---

## 15. Frontend Component Hierarchy

```
ViewPermission (Page Component)
├── Page Header with Title & Action Buttons
├── Form Display Section
│   ├── Form Header (FORM - VII)
│   ├── Applicant Details
│   ├── Annexure Files (with View links)
│   ├── Additional Applicants Table
│   ├── Survey Details Table
│   └── Land Use & Access Details
│
├── Correspondence Drawer
│   └── CorrespondenceProvider
│       └── CorrespondencePage
│           ├── Message Thread (UserChat components)
│           └── Compose Message Form
│
├── Noting Drawer
│   └── NotingProvider
│
├── Report Drawer
│   └── Conditional Report Providers
│       ├─ SubmitReportProvider
│       ├─ AllotHearingProvider
│       ├─ SeekReportDepartmentProvider
│       └─ ReportProvider
│
└── Payment Drawer
    └── PaymentHistoryProvider
```

---

## 16. File Upload Integration

### 16.1 Upload Process
```
1. User selects file from input
2. handleFileChange triggered
3. Call UploadFile(file, userId)
4. File sent to upload service
5. Service returns file_path
6. Path stored in form field (setValue)
7. Path included in mutation payload
```

### 16.2 File Storage
- Base URL: `${baseurl}`
- Path stored in database: File paths (anx1-anx5, signature_url, upload_url_1)
- Access via: Link component with target="_blank"

---

## 17. Known Limitations & Notes

### 17.1 Observations
1. **Hard-coded Values**: `dept_user_id: 10` set on form creation (should be configurable)
2. **Role-based Logic**: Complex conditional rendering for different user types
3. **Status-driven UI**: Many components only appear at specific form statuses
4. **File Management**: Relies on external upload service, no direct file storage
5. **Pagination**: Uses take/skip model for listing operations

### 17.2 Potential Improvements
1. Extract role constants to enum
2. Centralize department status workflows
3. Implement caching strategy for user roles
4. Add transaction support for multi-record creation
5. Implement soft delete for audit trail

---

## 18. Testing Scenarios

### 18.1 Component Testing
- [ ] Verify form loads with encrypted ID
- [ ] Test role-based button visibility
- [ ] Verify correspondence form submission
- [ ] Test file upload for annexures
- [ ] Verify applicant/survey table rendering

### 18.2 Integration Testing
- [ ] Create NA form with multiple applicants
- [ ] Submit correspondence with file attachment
- [ ] Verify status transitions
- [ ] Test role-based access control
- [ ] Verify data persistence

### 18.3 End-to-End Testing
- [ ] Complete workflow from submission to order download
- [ ] Multi-department communication flow
- [ ] Payment processing
- [ ] Hearing scheduling and conduct
- [ ] Sanad generation and download

---

## Appendix: Related Files

### Frontend Files
- Main Page: `src/app/dashboard/department/na-permission/view/[id]/page.tsx`
- Form Schemas: `src/schema/forms/query.ts`
- API Service: `src/services/api.ts`
- Utilities: `src/utils/methods.ts`, `src/utils/const.ts`

### Backend Files
- Resolver: `landdnh_api/src/na/na.resolver.ts`
- Service: `landdnh_api/src/na/na.service.ts`
- Entity: `landdnh_api/src/na/entities/na.entity.ts`
- DTOs: `landdnh_api/src/na/dto/create-na.input.ts`, `update-na.input.ts`
- Schema: `landdnh_api/prisma/schema.prisma`
- Sub-modules: `na_applicant/`, `na_survey/`, `na_query/`, `na_fees/`, `na_upload/`

---

**Report Generated**: 2026-07-19
**System**: LandDNH - NA Permission Management System
