# **App Name**: DriveWise

## Core Features:

- Period Management: Define financial goal periods with start date, end date, initial balance, and target balance; support for only one active period at a time using Firestore.
- Revenue Logging: Modal for logging trip revenue, including amount, ride app selection (from Firestore), and trip count; all data saved to Firestore.
- Expense Logging: Modal for logging expenses, including amount, expense category selection (from Firestore), and description; stored in Firestore.
- Current Balance Calculation: Calculate and display the current balance based on the initial balance of the active period, plus total revenue, minus total expenses; use Firestore data.
- Progress Tracking: Display a progress bar that visually tracks progress toward the financial goal, based on current balance, initial balance, and target balance; update in real time via Firestore.
- Settings Customization: Manage expense categories and ride apps with the ability to add, edit, and delete; persist data to Firestore.
- Historical Reporting: Display a list of all transactions for a selected period (Revenue/Expense) and calculate key performance indicators.

## Style Guidelines:

- Primary color: A vibrant, attention-getting blue (#4285F4).
- Background color: Dark, almost black background (#121212) to minimize distractions and prevent eye strain, following a dark color scheme.
- Accent color: Yellow-orange (#FFAB40) for interactive elements like buttons and progress bar highlights. It is contrasting with the blue in hue, and lighter in brightness.
- Body and headline font: 'Inter', a sans-serif font, for a clean, modern interface.
- Use consistent, clear icons from a library like Remix Icon or Material Design Icons, in white or the accent color (#FFAB40).
- Mobile-first, single-page application layout with clear sections for dashboard, settings, and history, using Tailwind CSS grid and flexbox.
- Subtle transition animations for modals and page navigation to provide smooth user experience.