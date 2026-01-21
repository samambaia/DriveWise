# **App Name**: DriveWise

## Core Features:

- Period Management: Define financial goal periods with start date, end date, initial balance, and target balance; support for only one active period at a time using Firestore.
- Revenue Logging: Modal for logging trip revenue, including amount, ride app selection (from Firestore), and trip count; all data saved to Firestore.
- Expense Logging: Modal for logging expenses, including amount, expense category selection (from Firestore), and description; stored in Firestore.
- Current Balance Calculation: Calculate and display the current balance based on the initial balance of the active period, plus total revenue, minus total expenses; use Firestore data.
- Progress Tracking: Display a progress bar that visually tracks progress toward the financial goal, based on current balance, initial balance, and target balance; update in real time via Firestore.
- Settings Customization: Manage expense categories and ride apps with the ability to add, edit, and delete; persist data to Firestore.
- Historical Reporting: Display a list of all transactions for a selected period (Revenue/Expense) and calculate key performance indicators.

## Style Guidelines (Material Design 3):

### Color System:
- **Primary**: Teal (#00897B / hsl(174, 76%, 35%)) - Convey trust and professionalism
- **Primary Container**: Light Teal (#B2DFDB / hsl(174, 76%, 90%))
- **Secondary**: Blue (#1976D2 / hsl(207, 89%, 54%)) - For secondary actions
- **Secondary Container**: Light Blue (#BBDEFB / hsl(207, 89%, 92%))
- **Tertiary**: Amber (#FFA000 / hsl(35, 100%, 50%)) - For highlights and goals
- **Tertiary Container**: Light Amber (#FFE0B2 / hsl(35, 100%, 92%))
- **Success**: Emerald (#10B981 / hsl(159, 84%, 39%)) - For revenue and positive indicators
- **Error**: Rose (#F43F5E / hsl(349, 89%, 60%)) - For expenses and negative indicators
- **Warning**: Amber (#FFA000 / hsl(35, 100%, 50%)) - For warnings and alerts
- **Background**: Dark Slate (#0F172A / hsl(222, 47%, 7%)) - Dark mode default
- **Surface**: Darker (#1E293B / hsl(222, 47%, 11%))

### Typography:
- **Font Family**: 'Inter' (Google Fonts) - Modern, clean sans-serif
- **Weights**: 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold), 800 (ExtraBold)
- **Scale**: 
  - Display: text-6xl (60px)
  - Headline: text-5xl (48px)
  - Title: text-4xl (36px)
  - Subtitle: text-2xl (24px)
  - Body: text-base (16px)
  - Caption: text-sm (14px)

### Shape & Elevation:
- **Border Radius**: 16px (lg), 24px (xl) for cards, 12px (md) for buttons
- **Elevation Levels**:
  - Level 1: `0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)`
  - Level 2: `0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12)`
  - Level 3: `0 10px 20px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.10)`

### Components:
- **Cards**: Rounded corners (xl-2xl), subtle elevation, optional gradients
- **Buttons**: 
  - Primary: Teal gradient with elevation-2
  - Revenue: Emerald gradient
  - Expense: Rose gradient
  - Outline/Secondary: Transparent with border
- **Progress Indicators**: Circular progress for goals, linear for smaller metrics
- **Inputs**: Rounded-xl with focus states using primary color ring
- **Dialogs**: Rounded-2xl with elevation-3

### Icons:
- **Icon Library**: Lucide React (consistent with Radix UI)
- **Sizes**: 16px, 20px, 24px (default), 32px, 48px
- **Usage**: White for dark backgrounds, primary/secondary/accent colors for light backgrounds

### Layout:
- **Mobile-First**: Responsive design with Tailwind CSS grid and flexbox
- **Spacing**: Consistent 4px (0.25rem) base unit
- **Sections**: Dashboard, History, Settings with clear visual hierarchy
- **Navigation**: Tab-based navigation for easy mobile access

### Animations:
- **Duration**: 200-300ms for standard transitions
- **Easing**: ease-out for most interactions
- **Hover**: Subtle elevation increase and color changes
- **Focus**: Primary color ring for accessibility

### Dark Mode:
- **Default**: Dark mode enabled by default
- **Contrast**: WCAG AA/AAA compliant
- **Colors**: Adjusted for optimal readability in low-light conditions
- **Theme Toggle**: Available in settings with smooth transition