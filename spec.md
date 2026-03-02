# Specification

## Summary
**Goal:** Add one-click job application feature, employer applications view, fix employer header navigation, and apply Indian Rupee salary formatting throughout the app.

**Planned changes:**
- **Backend:** Add a stable `applications` HashMap to store candidate applications per job posting. Implement `applyToJob(jobPostingId)` to record the calling candidate's profile (no duplicates). Implement `getApplicationsForJob(jobPostingId)` returning full candidate profiles, accessible only to the owning employer.
- **Apply Now button:** Add an "Apply Now" button to JobDetailModal for logged-in candidates. Clicking it calls `applyToJob` and shows a success toast. If already applied, show a disabled "Applied" button. Hide the button when an employer is viewing. Show an error toast if the candidate has no saved profile.
- **Employer applications view:** Add an "Applications" tab/section to each job posting card in the Employer Dashboard. It fetches and displays applicant candidate profiles using the existing CandidateCard component. Clicking a card opens CandidateDetailModal with full profile and contact details. Show "No applications yet" if empty.
- **Nav fix:** When an employer is logged in, replace "Browse Jobs" in the header with "Browse Candidates" linking to the PharmSearch page. Non-employer and logged-out users continue to see "Browse Jobs".
- **Indian salary formatting:** Create a `formatINR(amount)` utility function that formats numbers with Indian grouping and ₹ prefix (e.g., 250000 → ₹2,50,000). Apply it to all salary displays in JobListingCard, JobDetailModal, CandidateCard, CandidateDetailModal, and dashboards.

**User-visible outcome:** Candidates can apply to jobs with one click from the job detail modal, employers can see applicant profiles per job posting in their dashboard, the employer header now shows "Browse Candidates" instead of "Browse Jobs", and all salary figures are displayed in proper Indian Rupee format (₹2,50,000 style).
