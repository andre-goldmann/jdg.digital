Generate Angular components for a cryptocurrency dashboard UI based on the provided image. The design is clean, minimalist, and data-focused, utilizing significant whitespace and a clear visual hierarchy. Use Angular material for the design of the UI.
Angular material is already installed.

I. Overall Layout:


Main Structure: A two-column primary layout.
Left Sidebar: A very narrow, fixed vertical navigation bar on the far left.
Main Content Area: Occupies the rest of the screen width to the right of the sidebar.

Main Content Area Layout: Uses a grid or flexbox system.
Row 1 (Header-like): Spans the width of the main content area. Contains the "Balance" section title and portfolio dropdown on the left, and user profile/actions (avatar, search icon, menu icon) on the right.
Row 2 (Content Grid): Below Row 1. Contains two main columns:
Left Column (Wider): Contains the "Balance" card (with amount, chart) stacked above the "Exchange" card.
Right Column (Narrower): Contains the "Accounts" card stacked above the "Recommended to you" section.

Responsiveness: While the image shows a desktop view, assume the layout should adapt gracefully to smaller screens (e.g., stacking columns).

II. Color Scheme:


Background (Main): White (#FFFFFF).

Background (Cards/Modules): Very light gray (e.g., #F8F9FA or #FFFFFF with subtle shadows).

Primary Accent: Deep Blue (e.g., #1A237E) used for the highlighted "Recommended" card, some chart elements, and potentially button hover states.

Secondary Accents (Chart): Various shades used in the stacked bar chart: Light Blue (e.g., #81D4FA), Medium Blue (e.g., #29B6F6), Dark Blue (e.g., #0277BD), Red/Orange (e.g., #FF8A65), Pink/Purple (e.g., #BA68C8).

Text (Primary): Dark Gray/Black (e.g., #212529 or #333333).

Text (Secondary/Labels): Medium Gray (e.g., #6c757d or #888888).

Text (On Dark Background): White (#FFFFFF).

Positive Indicator: Green (e.g., #4CAF50 or #28a745) for the balance increase.

Borders/Dividers: Light Gray (e.g., #E0E0E0 or #DEE2E6).

Icons: Medium to Dark Gray (e.g., #6c757d or #495057).

III. Typography:


Font Family: Clean, modern sans-serif (e.g., Inter, Roboto, Segoe UI, SF Pro Display). Specify one and use consistently.

Headings (Section Titles like "Balance", "Accounts"): Medium weight, moderate size (e.g., 16-18px). Dark Gray.

Large Display Text (Balance Amount): Bold weight, very large size (e.g., 36-42px). Dark Gray/Black. Decimal part slightly smaller/lighter weight.

Body Text (List items, general text): Regular weight, standard size (e.g., 14-16px). Dark Gray.

Labels/Sub-text (e.g., "Total balance in", crypto amount subt_ext, chart labels): Regular or Light weight, smaller size (e.g., 12-14px). Medium Gray.

Button Text: Medium weight, standard size (e.g., 14px). Color depends on button style (see V. Components).

IV. Spacing & Sizing:


General: Generous whitespace between all elements and sections. Consistent padding within cards and consistent margins between cards.

Sidebar: Very narrow width (e.g., 60-80px). Icons centered vertically and horizontally. Significant vertical space between icons.

Main Content Padding: Add padding around the entire main content area (e.g., 24-32px).

Card Padding: Consistent internal padding for all cards (e.g., 20-24px).

Inter-Card Margin: Consistent margin between cards stacked vertically or adjacent horizontally (e.g., 24-32px).

Intra-Component Spacing: Use consistent spacing between elements within cards (e.g., title and content: 16px; list items: 12px; form elements: 8-12px).

V. Components Breakdown:


Left Sidebar:
Top: Abstract square logo icon.
Middle Icons: Bar chart icon, Lines icon (equalizer?), Filter icon, Sliders icon. One icon (Bar chart) has a highlighted background indicating the active state. Use simple, outlined icons.
Hover/Active State: Background highlight (light gray or primary blue subtle shade) and potentially icon color change.

Main Content Header Row:
Left: "Balance" H2 title, "Main portfolio" dropdown button (light gray background, dark text, dropdown arrow).
Right: User Avatar (circular image), Search Icon button, Hamburger Menu Icon button. Icons should be simple, gray, with adequate spacing.

Balance Card:
Label: "Total balance in" (small, gray).
Dropdown: "1 year" (styled like a link or subtle button with dropdown arrow).
Balance Amount: Large "$ 10,554" (bold, dark), ".88" (slightly smaller, less bold).
Change Indicator: "+ $ 231.5" (small, green text, slightly offset to the right).
Chart: Large stacked bar chart below the amount.
X-axis: Month labels ("jan", "mar", "may", "jul", "sep", "nov") - small, gray text.
Y-axis: No explicit labels shown, implies value based on height.
Bars: Stacked segments with different colors (red/orange, pink/purple, light blue, medium blue, dark blue). Thin bars with generous spacing between them.

Accounts Card:
Header: "Accounts" H2 title (left), "Add funds" text button with "+" icon (right, bold text, dark gray).
List: Vertical list of crypto accounts.
Each Item: Horizontal layout - Crypto logo (small, styled square/circle), Crypto Name (e.g., "Bitcoin", bold, dark gray), Amount (e.g., "2.55462 BTC", regular, medium gray), "+" Icon button on the far right (for adding/action?).
Dividers: Subtle light gray horizontal lines between items.
Pagination: Below the list - "< 1 / 5 >" controls (small, gray text and icons).

Exchange Card:
Header: "Exchange" H2 title.
Input 1 ("You spend"): Label (small, gray), Amount input field ("3110.00", large dark text), Currency selector dropdown ("USD", dark text, dropdown arrow). Input fields should have subtle borders and padding.
Input 2 ("You get"): Label (small, gray), Amount output field ("0.673321", large dark text), Currency selector dropdown ("BTC", dark text, dropdown arrow).
Rate Info: Small gray text below inputs (e.g., "1 Bitcoin = 6,893.06 US Dollar") with a small info icon.
Button: "Exchange" button at the bottom. Outlined style (light gray border, dark gray text) or very light gray background. Centered or full-width within the card padding.

Recommended to You Section:
Header: "Recommended to you" H2 title.
Cards Area: Horizontal row of small recommendation cards (appears scrollable or paginated as suggests more than shown).
Individual Cards:
Style: Mostly light gray background, rounded corners, subtle shadow/border.
Highlight Card (First one): Deep blue background (#1A237E), white text, more prominent shadow.
Content: Crypto logo/symbol (top left), Value (e.g., "€ 1.8533", large white/dark text), Crypto Name ("1 Monero", small white/gray text), small line chart visualization below text, "Buy" and "Sell" buttons at the bottom (small text buttons, potentially different styles - e.g., Buy=filled/primary, Sell=outlined/secondary).

VI. Interactivity:


Hover States: Apply subtle hover effects to buttons, links, icons, list items, and recommendation cards (e.g., background color change, slight shadow increase, text underline).

Dropdowns: Ensure "Main portfolio", timeframe selector, and currency selectors function as dropdown menus.

Buttons: All buttons ("Add funds", "+", "Exchange", "Buy", "Sell", icon buttons) should have clear clickable states (e.g., pointer cursor, potential background/border change on click).

Inputs: Standard text input behavior.

Chart: Consider adding tooltips on hover for the bar chart segments showing values.

Pagination: Controls should be functional.

VII. Assets:


Provide placeholders or specify sources for:
Abstract Logo
Navigation Icons (bar chart, lines, filter, sliders)
User Avatar image
Search Icon
Menu Icon
Dropdown Arrow Icon
Plus Icon
Info Icon
Pagination Arrow Icons (<, >)
Cryptocurrency Logos/Symbols (Bitcoin, ZCash, Litecoin, Ripple, Monero, Dogecoin)

Final Instruction: Generate clean, well-structured, and commented HTML and CSS code (or framework-specific components) that accurately implements this UI design, paying close attention to layout, colors, typography, and spacing as described. Prioritize visual fidelity to the provided image.
