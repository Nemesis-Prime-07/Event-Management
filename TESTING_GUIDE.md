# Inter-College Event Management System - Testing Guide

## Quick Start

The application is a fully functional frontend-only prototype with no backend dependencies. All data is stored in localStorage and persists across sessions.

### Demo Credentials

The following department codes and passwords are pre-configured for testing:

| Department | Code | Password |
|------------|------|----------|
| Computer Science | CS | 1234 |
| Electrical Engineering | EE | 5678 |
| Mechanical Engineering | ME | 9012 |
| Civil Engineering | CIVIL | 3456 |
| Electronics & Communication | ECE | 7890 |

## Application Features

### 1. Login Page (`index.html`)
- **Location**: Entry point of the application
- **Features**:
  - Professional college-themed design with gradient background
  - Department code and password input fields
  - Demo credentials displayed for easy access
  - Smooth error animations for invalid login attempts
  - "Forgot Password" link with informational tooltip
  - Responsive design (works on mobile, tablet, desktop)

### 2. Events Dashboard (`events.html`)
- **Access**: Only accessible after successful login
- **Features**:
  - Personalized greeting with department name
  - Department-specific data isolation (each HOD sees only their events)
  - Three main sections:

#### Upcoming Events Tab
- Displays events scheduled for future dates
- Vibrant event cards with media preview
- Shows event details: title, date, time, venue, description
- "View Details" button for modal popup
- "Edit" button for quick edit access
- Empty state message when no upcoming events exist

#### Past Events Tab
- Displays events with past dates
- Visually distinct (faded/grayscale appearance)
- Same functionality as upcoming events
- Helps HODs track completed events

#### Add New Event Tab
- Form to create new events
- Fields: Title, Date, Time, Venue, Description
- Optional image and video file uploads
- Real-time file preview functionality
- Validation ensures all required fields are filled
- Success notification after event creation
- Form reset after successful submission

### 3. Event Modal
- **Triggered By**: "View Details" button on event cards
- **Features**:
  - Full event information display
  - Media preview (image or video if available)
  - "Edit Event" button to switch to edit mode
  - "Delete Event" button with confirmation dialog
  - "Close" button to dismiss modal
  - Smooth animations when opening/closing

### 4. Edit Mode
- **Access**: Via "Edit Event" button in modal
- **Features**:
  - Pre-populated form with current event data
  - Ability to update all event fields
  - Option to change image or video
  - "Save Changes" button to commit updates
  - "Cancel" button to discard changes and return to view mode
  - Success notification after changes are saved

## Data Management

### Storage Location
- All event data stored in browser's localStorage
- Key: `departments_data`
- Format: JSON object with department codes as keys

### Data Persistence
- Data persists across browser sessions
- Data survives page refreshes
- Data cleared only when browser cache is cleared
- Each browser/device has separate data storage

### Sample Events
Pre-loaded with sample events for all departments:
- **CS**: TechFest 2025, Web Development Workshop, AI/ML Summit
- **EE**: Power Systems Seminar, Circuit Design Competition
- **ME**: Mechanical Design Workshop
- **CIVIL**: Structural Engineering Expo
- **ECE**: Embedded Systems Bootcamp

## Testing Scenarios

### Scenario 1: Login Flow
1. Open the application
2. Enter "CS" in Department Code field
3. Enter "1234" in Password field
4. Click Login
5. Should redirect to events.html showing CS department events

### Scenario 2: View Events
1. Log in with any department credentials
2. Click "Upcoming Events" tab
3. View event cards with titles, dates, times, venues
4. Hover over cards to see lift effect
5. Past events should appear faded

### Scenario 3: Create Event
1. Log in as CS department
2. Click "Add New Event" tab
3. Fill in all form fields
4. Optionally upload image or video
5. Click "Save Event"
6. Success notification should appear
7. Switch to "Upcoming Events" to see new event
8. Repeat with different department - new event only appears for CS

### Scenario 4: Edit Event
1. Log in as any department
2. Find an event card
3. Click "Edit" button
4. Modify event details
5. Click "Save Changes"
6. Event details should update immediately
7. Success notification confirms save

### Scenario 5: Delete Event
1. Log in as any department
2. Click "View Details" on an event
3. Click "Delete Event" button
4. Confirm deletion in dialog
5. Event should disappear from list
6. Success notification confirms deletion

### Scenario 6: Department Isolation
1. Log in as CS department
2. Create a new event
3. Log out (click Logout button)
4. Log in as EE department
5. Verify the new event does NOT appear in EE's events
6. Switch back to CS - verify event is still there

### Scenario 7: Logout and Session Management
1. Log in to any department
2. Click "Logout" button in header
3. Should redirect to login page
4. Session cleared from localStorage
5. Previous department data should not be accessible

### Scenario 8: Responsive Design
1. Test on desktop (1920x1080)
2. Test on tablet (768px width)
3. Test on mobile (375px width)
4. Verify layout adapts properly
5. Test navigation tabs scroll on small screens
6. Test form layout adjusts for mobile

### Scenario 9: File Upload
1. Log in and navigate to "Add New Event"
2. Upload an image file
3. Image preview should appear below upload field
4. Upload a video file
5. Video player preview should appear
6. Submit form - media should be stored as base64
7. View event - media should display correctly

### Scenario 10: Error Handling
1. Try login with incorrect password
2. Verify error message appears with smooth animation
3. Try creating event without filling required fields
4. Verify validation prevents submission
5. Try uploading non-MP4 video
6. Verify error notification appears

## Performance Notes

- Application loads instantly as it's purely frontend
- No network requests (except asset loading)
- Smooth animations and transitions (CSS-based)
- Efficient event rendering with virtual scrolling principles
- localStorage has ~10MB limit per domain - adequate for thousands of events

## Browser Compatibility

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Technical Implementation

### Architecture
- Pure vanilla JavaScript (no frameworks)
- Modular code organization with clear separation of concerns
- StorageManager for data persistence
- AuthManager for authentication
- EventsPageManager for UI management
- Utils for common functions

### Security Considerations
- XSS protection through HTML escaping
- No sensitive data stored in localStorage (only department codes)
- File uploads converted to base64 (no server-side processing)
- Input validation on all forms

### Key Technologies
- HTML5 for semantic structure
- CSS3 with CSS variables for theming
- Vanilla JavaScript (ES6+)
- FileReader API for file handling
- localStorage Web API for data persistence

## Customization Options

### Add New Department
Edit `AuthManager.credentials` and `StorageManager.setSession()` in script.js

### Change Colors
Modify CSS variables in `:root` section of style.css

### Add More Demo Events
Extend the `defaultData` object in `StorageManager.initializeDepartments()`

### Adjust Form Validation
Modify validation logic in `EventsPageManager.handleEventFormSubmit()`

## Known Limitations (Frontend Only)

- No real user authentication (hardcoded credentials for demo)
- Media files stored as base64 (size limited by localStorage)
- No multi-device synchronization
- No backup or export functionality beyond browser storage
- No email notifications or reminders

These limitations would be addressed in a production backend implementation.

## Support

For issues or questions during testing, verify:
1. JavaScript is enabled in browser
2. localStorage is not disabled
3. Browser is not in private/incognito mode (localStorage may be cleared)
4. Try clearing browser cache if experiencing stale data
5. Ensure all files (index.html, events.html, script.js, style.css) are accessible
