# Assessment Clash Prevention Test Case

| Field | Description |
|-------|-------------|
| Test Case ID | TC_04 |
| Title | Prevent multiple assessments on the same day |
| Preconditions | One assessment already exists for a date |
| Test Steps | 1. Open the assessment form<br>2. Try to select a date already used<br>3. Submit form |
| Test Data | Date: 2025-05-10 |
| Expected Result | Admin cannot select the date; a popup is shown |
| Actual Result | (To be filled after test) |
| Status | (Pass/Fail) |

## Detailed Test Instructions

1. **Setup Environment:**
   - Ensure the University Management System is running
   - Login as an admin user
   - Navigate to Assessment Management page

2. **Pre-test Configuration:**
   - Add at least one assessment with the date "2025-05-10"
   - Verify the assessment is visible in the list

3. **Test Execution:**
   - Try to create a new assessment
   - Fill in course name and select assessment type
   - Attempt to select "2025-05-10" as the date
   - Observe system behavior
   - Attempt to submit the form with a duplicate date (if possible)

4. **Expected Results:**
   - Date picker should prevent selection of "2025-05-10"
   - A modal popup should appear with "Date Clash Detected" message
   - System should not allow form submission with a duplicate date
   - No database error should occur

5. **Verification Criteria:**
   - Error message is clear and understandable
   - UI remains responsive throughout the test
   - Selecting a different, available date works correctly
   - After removing an assessment from a date, that date becomes available again 