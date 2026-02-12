# Property Management Guide

This guide covers the process of creating and configuring properties in Apaleo.

## Phase 1: Creating a Property

To create a new property (which usually represents one hotel):

1. Log in to your Apaleo account
2. In the top-left context selector, choose **Account**
3. Navigate to the **Property** section
4. Enter the required details, including:
   - **Property Code**: A unique identifier that cannot be changed later
   - **Name and Address**
   - **Location details**: city, country, timezone, and currency code
   - **Default check-in and check-out times**
   - **Company details**: company name, commercial register entry, and tax ID
5. Save the information to create your property

## Phase 2: Configuring Property-Level Settings

Once created, you can access specific settings for each property by selecting the desired hotel in the context selector and going to the **Settings** menu:

### Property (General Information)
Update general information like the name and address if needed.

### Distribution
- **Local Charges/City Tax**: Configure city or tourist taxes, including the calculation formula (per person/night or a percentage), value, and if it's subject to VAT.

### Finance
- **Invoice settings**: Set the legal entity details, invoice number templates, and how tax breakdowns should appear on guest invoices
- **Invoice Styling**: Upload a logo and customize default texts for invoices
- **Custom Sub-accounts**: Create sub-accounts to track service revenues and link them to specific services for accounting purposes
- **Payment**: If using Apaleo Pay, set up payment automation rules here after your merchant account is configured by the Apaleo team

### Automation
Configure automated actions such as:
- Automated check-in at arrival time
- Automated check-out at departure time
- Night Audit timing and whether guests who haven't checked in are marked as no-shows

### Inventory
- **Unit Groups**: Define room types (e.g., 'SRS' for Single Room Standard) and specify if they are for bedrooms, meeting rooms, etc.
- **Unit Attributes**: Define attributes like floor number, bed type, or view on the account level and apply them to specific units within the property