# Assessment Management System Test Cases

## Test Case: TC_04 - Assessment Clash Prevention

| Field | Description |
|-------|-------------|
| Test Case ID | TC_04 |
| Title | Prevent multiple assessments on the same day |
| Preconditions | One assessment already exists for a date |
| Test Steps | 1. Open the assessment form<br>2. Try to select a date already used<br>3. Submit form |
| Test Data | Date: 2025-05-10 |
| Expected Result | Admin cannot select the date; a popup is shown with details of the existing assessment on that date |
| Actual Result | (To be filled after test) |
| Status | (Pass/Fail) |

## Testing Instructions

1. **Setup:**
   - Ensure at least one assessment is already created in the system with the date "2025-05-10"
   - Navigate to the Assessment Management page (admin/assessment.html)

2. **Test Procedure:**
   - In the "Schedule a New Assessment" form, enter a course name (e.g., "Computer Science 101")
   - Try to select the date "2025-05-10" in the date picker
   - Observe what happens when selecting this date
   - Attempt to submit the form with this date

3. **Expected Behavior:**
   - When clicking on the date input, a hint should appear showing there are occupied dates
   - The occupied dates list should be visible showing existing assessments
   - When attempting to select "2025-05-10", the date should be rejected
   - A popup modal should appear with a warning message
   - The popup should show details of the existing assessment for that date
   - The form should not submit with an already occupied date

4. **Additional Test Scenarios:**
   - Try selecting a non-occupied date to ensure the form works for valid dates
   - After adding a new assessment, verify the date becomes disabled for future attempts
   - Test the removal of an assessment and verify the date becomes available again

## Notes
- This feature ensures no scheduling conflicts occur for assessments
- The UI provides clear visual feedback about occupied dates
- The system maintains data integrity by preventing duplicate date entries 