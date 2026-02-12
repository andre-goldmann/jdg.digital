# OELAPA Reservations Management - User Guide

## Getting Started

Welcome to the OELAPA Reservations Management System. This comprehensive guide will help you efficiently manage hotel reservations, from viewing guest bookings to processing check-ins and handling cancellations.

## Table of Contents

1. [Accessing the Reservations System](#accessing-the-reservations-system)
2. [Understanding the Reservations List](#understanding-the-reservations-list)
3. [Searching and Filtering Reservations](#searching-and-filtering-reservations)
4. [Managing Individual Reservations](#managing-individual-reservations)
5. [Bulk Operations](#bulk-operations)
6. [Mobile Usage](#mobile-usage)
7. [Troubleshooting](#troubleshooting)
8. [Best Practices](#best-practices)

## Accessing the Reservations System

### Login and Authentication

1. **Log in** to the OELAPA system using your hotel staff credentials
2. **Navigate** to the reservations section using the sidebar menu
3. **Verify** your access level - different staff roles have different permissions

### System Requirements

- **Modern web browser** (Chrome, Firefox, Safari, Edge)
- **Stable internet connection** for real-time updates
- **Screen resolution** minimum 1024x768 for desktop use
- **Mobile devices** iOS 12+/Android 8+ for mobile access

## Understanding the Reservations List

### Main Interface Overview

The reservations list features the Apoleo PMS design for professional hotel management. Here's what you'll see:

**Visual Reference:**
- Desktop layout: `e2e/task-15-apoleo-layout.spec.ts-snapshots/apoleo-layout-desktop-full-chromium-win32.png`
- Tablet view: `e2e/task-15-apoleo-layout.spec.ts-snapshots/apoleo-responsive-tablet-chromium-win32.png`
- Mobile view: `e2e/task-15-apoleo-layout.spec.ts-snapshots/apoleo-responsive-mobile-chromium-win32.png`

#### Apoleo Header Actions

The top of the page features quick action buttons:
- **New booking** (orange button): Create a new reservation
- **Show group bookings**: View group reservations
- **Export**: Download reservation data
- **Print registration form**: Print guest forms
- **Occupancy**: View occupancy reports
- **Help**: Access help documentation

#### Warning System

If reservations require attention, you'll see:
- **Validation badge**: Shows count (e.g., "4 Warnings") in the header
- **Red-bordered rows**: Reservations with issues
- **Warning icons**: Red error icons in the status column
- **Click to expand**: Tap warning icon to see details

#### Key Interface Elements

**🏷️ Status Indicators**
- **Green (Confirmed)**: Guest has confirmed reservation
- **Blue (Checked In)**: Guest is currently at the property
- **Orange (Pending)**: Awaiting guest confirmation
- **Gray (Checked Out)**: Guest has completed their stay
- **Red (Cancelled)**: Reservation has been cancelled
- **Purple (No Show)**: Guest failed to arrive

**📊 Column Information (Apoleo Layout)**
- **Status Icon**: Visual indicator (home = normal, red error = warning)
- **Reservation ID**: Unique booking reference number
- **Guest Name**: Primary guest contact with guest count (e.g., "2 adults, 2 children")
- **Arrival**: Check-in date and time
- **Departure**: Check-out date and time
- **Created**: When the booking was made
- **Channel**: Booking source (Direct, Booking.com, Expedia, etc.)
- **Unit**: Room number and type (e.g., "402 - Fam Family Room")
- **Guarantee**: Payment guarantee method (Credit Card, Prepaid, etc.)
- **Balance**: Outstanding amount (red = owed, green = credit)
- **Actions**: Three-dot menu and detail chevron

#### Responsive Design

The interface automatically adapts to your device:

- **Desktop**: Full table view with all columns
- **Tablet**: Condensed view with essential information
- **Mobile**: Card-based layout for easy touch navigation

### Reading Reservation Information

Each reservation row contains critical information at a glance:

**Apoleo Format:**
```
[🏠] RES-2024-001 | John Smith (2 adults, 1 children) | Mar 15 3:00 PM | Mar 18 11:00 AM | Direct | Room 402 | Credit Card | $-450.00 | [⋮][›]
```

**Legacy Format:**
```
[✓] John Smith | RES-001 | Mar 15-18 | 2 guests | Standard | $400 | [Actions]
```

**Pro Tip**: Hover over any reservation row to see additional details without clicking.

### Understanding Warnings

The system automatically detects issues that need attention:

#### Warning Types
- **Rate Plan Restrictions**: Minimum/maximum stay violations
- **Payment Issues**: Missing guarantees or expired cards
- **Operational Concerns**: Overbooking or room assignment conflicts

#### Warning Indicators
1. **Red border** on the left side of the row
2. **Red error icon** instead of home icon
3. **Light red background** tint
4. **Warning count badge** in header (e.g., "4 Warnings")

#### Viewing Warning Details
1. **Click** the red error icon in the status column
2. **Read** the warning message that appears
3. **Take action** as needed to resolve the issue
4. **Dismiss** the warning if applicable

#### Filtering by Warnings
1. **Click** the warning count badge in the header
2. **View** only reservations with warnings
3. **Clear filter** to see all reservations again

## Searching and Filtering Reservations

### Quick Search

The search bar at the top allows you to find reservations instantly:

1. **Click** on the search field
2. **Type** any of the following:
   - Guest name (e.g., "John Smith")
   - Reservation ID (e.g., "RES-001")
   - Email address
   - Phone number
   - Check-in date

3. **View** results as you type (search suggestions appear automatically)

#### Search Tips

- **Partial matches work**: Type "john" to find "John Smith"
- **Use reservation IDs**: For exact matches, use the full reservation ID
- **Date search**: Type dates in MM/DD format (e.g., "03/15")
- **Clear search**: Click the X button or delete all text

### Advanced Filtering

Click the **"Filters"** button to access advanced filtering options:

#### Status Filtering
- **Select multiple statuses** to view specific reservation types
- **Status counts** show how many reservations match each status

#### Date Range Filtering
- **Check-in Start/End**: Filter by arrival dates
- **Quick ranges**: Use preset buttons for common date ranges
  - Today's arrivals
  - This week's reservations
  - This month's bookings
  - Next month's arrivals

#### Guest Count Filtering
- **Minimum guests**: Filter for larger parties
- **Maximum guests**: Limit to smaller bookings

#### Amount Filtering
- **Revenue range**: Filter by booking value
- **Minimum/Maximum**: Set spending thresholds

### Saving and Sharing Filters

#### Shareable URLs
1. **Apply** your desired filters
2. **Click** the "Share" button
3. **Copy** the generated URL
4. **Share** with colleagues for consistent views

The URL preserves all your current filters and search terms.

## Managing Individual Reservations

### Viewing Reservation Details

#### Quick View (Hover)
- **Hover** over any reservation row
- **View** additional details in tooltip
- **See** guest contact information and special requests

#### Detailed View (Click)
- **Click** on any reservation row
- **Expand** to see full reservation details
- **View** booking history and modifications

### Common Actions

#### Updating Reservation Status

1. **Locate** the reservation in the list
2. **Click** the status badge or action menu
3. **Select** new status from dropdown:
   - **Check In**: When guest arrives
   - **Check Out**: When guest departs
   - **Cancel**: For cancelled bookings
   - **Confirm**: For pending reservations

#### Modifying Reservation Details

1. **Click** the edit button (pencil icon) in the actions column
2. **Update** guest information, dates, or room type
3. **Save** changes to update the reservation

#### Adding Notes and Comments

1. **Expand** the reservation row
2. **Click** "Add Note" in the details section
3. **Type** your note (e.g., special requests, issues)
4. **Save** for future reference

### Guest Communication

#### Contact Information Access
- **Phone numbers**: Click to call (if browser supports)
- **Email addresses**: Click to send email
- **Emergency contacts**: Available in expanded view

#### Printing Reservation Details
1. **Expand** the reservation
2. **Click** "Print" button
3. **Choose** format (confirmation, receipt, etc.)

## Bulk Operations

### Selecting Multiple Reservations

#### Individual Selection
- **Click** the checkbox next to each reservation
- **Selected count** appears in the toolbar

#### Select All on Page
- **Click** the header checkbox to select all visible reservations
- **Deselect** by clicking the checkbox again

### Bulk Actions

Once you have reservations selected:

#### Bulk Status Updates
1. **Select** multiple reservations
2. **Click** "Bulk Actions" in the toolbar
3. **Choose** "Update Status"
4. **Select** new status for all selected reservations

#### Export Selected Reservations
1. **Select** desired reservations
2. **Click** "Export" button
3. **Choose** format (CSV, PDF, Excel)
4. **Download** the generated file

#### Bulk Modifications
- **Update room assignments** for multiple reservations
- **Apply discounts** to selected bookings
- **Send group communications** to selected guests

### Performance Tips for Large Datasets

When working with many reservations:

- **Use virtual scrolling** for 1000+ reservations (auto-enabled)
- **Apply filters first** to reduce the dataset
- **Use pagination** for better performance
- **Limit bulk operations** to reasonable numbers (50-100 at a time)

## Mobile Usage

### Mobile Interface Features

The mobile version provides optimized touch navigation:

#### Card Layout
- **Swipe** cards for quick actions
- **Tap** to expand details
- **Pull down** to refresh data

#### Touch Gestures
- **Tap**: Select/deselect reservation
- **Long press**: Show action menu
- **Swipe left**: Quick actions (edit, delete)
- **Swipe right**: Mark as complete

#### Mobile-Specific Features
- **Large touch targets** for easy selection
- **Simplified filtering** with essential options
- **Optimized keyboard** for search input
- **Offline viewing** of cached data

### Mobile Best Practices

- **Use landscape mode** for better table viewing
- **Enable auto-refresh** for real-time updates
- **Bookmark** frequently used filter combinations
- **Keep app updated** for best performance

## Troubleshooting

### Common Issues and Solutions

#### "No reservations found"
- **Check your filters** - clear all filters to see all reservations
- **Verify date range** - ensure you're looking at the correct dates
- **Check internet connection** - refresh the page if needed

#### Slow performance
- **Reduce visible data** by applying filters
- **Close other browser tabs** for better performance
- **Enable virtual scrolling** for large datasets
- **Clear browser cache** if problems persist

#### Search not working
- **Check spelling** of search terms
- **Try partial matches** instead of full names
- **Clear search** and try different terms
- **Refresh the page** if search seems stuck

#### Filter not applying
- **Click "Apply Filters"** button if changes don't appear immediately
- **Check for conflicting filters** (e.g., impossible date ranges)
- **Clear all filters** and start over
- **Verify your permissions** for filtered data

### Technical Support

If you encounter persistent issues:

1. **Note the error message** (if any)
2. **Record what you were doing** when the issue occurred
3. **Try in an incognito/private browser window**
4. **Contact IT support** with specific details

## Best Practices

### Daily Workflow Recommendations

#### Morning Routine
1. **Review today's arrivals** using date filters
2. **Check pending confirmations** 
3. **Verify room assignments** for arriving guests
4. **Process any overnight modifications**

#### Throughout the Day
1. **Update statuses** as guests check in/out
2. **Monitor no-shows** for follow-up
3. **Process new bookings** promptly
4. **Respond to special requests** noted in reservations

#### End of Day
1. **Review tomorrow's arrivals** for preparation
2. **Update any outstanding statuses**
3. **Export daily reports** if required
4. **Clear completed tasks** from your view

### Data Management

#### Keep Information Current
- **Update guest contact info** when changes occur
- **Add notes** for special circumstances
- **Maintain accurate status** information
- **Record payment status** changes

#### Regular Maintenance
- **Archive old reservations** per hotel policy
- **Review and clean** cancelled bookings
- **Update room type availability** 
- **Verify pricing accuracy**

### Performance Optimization

#### For Large Properties
- **Use filters actively** to manage large reservation volumes
- **Enable virtual scrolling** for datasets over 1000 reservations
- **Batch process** similar operations together
- **Schedule heavy operations** during off-peak hours

#### For Team Collaboration
- **Use shareable URLs** for consistent team views
- **Establish status update protocols**
- **Coordinate bulk operations** to avoid conflicts
- **Maintain communication** about reservation changes

### Security and Privacy

#### Guest Information Protection
- **Log out** when leaving your workstation
- **Don't share** guest information unnecessarily
- **Use secure networks** for mobile access
- **Report** any suspicious activity immediately

#### System Security
- **Keep passwords secure** and change regularly
- **Don't share login credentials** with colleagues
- **Report lost devices** that had system access
- **Follow hotel data protection policies**

## Advanced Features

### Keyboard Shortcuts

Speed up your workflow with these shortcuts:

- **Ctrl/Cmd + F**: Quick search focus
- **Esc**: Clear search or close dialogs
- **Space**: Toggle reservation selection
- **Enter**: Confirm action or open details
- **Arrow keys**: Navigate between reservations

### Customization Options

#### Personal Preferences
- **Column visibility**: Show/hide specific columns
- **Default page size**: Set preferred number of visible reservations
- **Auto-refresh interval**: Configure update frequency
- **Theme preferences**: Light/dark mode selection

#### Saved Views
- **Create custom views** with specific filters
- **Name and save** frequently used combinations
- **Share views** with team members
- **Set default view** for startup

### Integration Features

#### Calendar Integration
- **Export reservations** to calendar applications
- **Sync availability** with booking systems
- **Set reminders** for important check-ins

#### Reporting Integration
- **Generate occupancy reports** from filtered data
- **Export revenue summaries** by date range
- **Create guest lists** for specific periods

## Getting Help

### In-App Help
- **Hover tooltips**: Information on unfamiliar features
- **Help button**: Context-sensitive assistance
- **Keyboard shortcut guide**: Press F1 for quick reference

### Training Resources
- **Video tutorials**: Available in the help section
- **User documentation**: Comprehensive guides for all features
- **Training sessions**: Contact your manager for group training

### Support Contacts
- **Technical issues**: IT support desk
- **Feature requests**: System administrator
- **Training needs**: Your department manager
- **Urgent problems**: On-call support number

---

**Welcome to efficient reservation management with OELAPA!** 

This guide covers the essential features to get you started. As you become more comfortable with the system, explore the advanced features to further streamline your workflow. Remember, the system is designed to make your job easier – don't hesitate to reach out for help when needed.

*Last updated: November 2024*  
*Version: 1.0*