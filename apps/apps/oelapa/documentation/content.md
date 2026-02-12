# Detailed Migration Plan to Apaleo

## Phase 1: Pre-Migration Preparation

### Weeks 1-2: Assessment & Planning

- Audit current data sources (Guesty, Smoobu, Charge Automation, Notion)
- Define migration scope: only future check-ins from go-live forward
- Clean data: remove duplicates and validate guest/contact info
- Assemble team: migration lead, property managers, IT, and finance

### Weeks 3-4: Apaleo Configuration

- Set up properties in Apaleo (unique Property Code, name, address, location, company/tax details)
- Configure rate plans and pricing
- Define services and extras for booking automation
- Implement user roles for staff
- Set up basic accounting and VAT categories

## Phase 2: Integration Development

### Website Integration

- Use compatible booking engine or plugin with Apaleo's APIs
- Connect WordPress/Elementor forms to Apaleo for reservations
- Ensure real-time availability sync

### Key Integrations

- **Accounting Export**: Automate invoice/data flow from Apaleo to your accounting tool via API
- **Notion**: Use automation tools (e.g., Make.com, Zapier) for reservation data export
- **Payment Automation**: Use Apaleo Pay for payment collection rules and automated charging
- **Channel Management**: Replace legacy channel managers using Apaleo's built-in distribution APIs

### Data Migration Prep

- Export all upcoming reservations from legacy PMS (CSV/UTF-8)
- Map fields: property, guest details, rate codes, dates, prices
- Test sample migration in staging

## Phase 3: Testing & Validation

### Sandbox Testing

- Full booking flow: website to check-in/check-out and payment
- Validate integration flows (Notion, accounting, payments)
- Test automatic invoice generation and financial records

### User Acceptance Testing

- Conduct staff training and walkthroughs
- Create documentation and quick-reference guides

## Phase 4: Migration Execution

### Go-Live Preparation

- Notify future guests about migration if needed
- Turn off automated guest communication before import
- Final data backup from all systems

### Cutover Steps

- Stop new bookings in old system
- Export and process all pending reservations/invoices
- Import reservations to Apaleo
- Enable integrations and live test booking
- Support staff during switching period

### War Room

- Track any real-time migration or integration errors for rapid response

## Phase 5: Post-Migration Optimization

- Monitor system performance and staff feedback
- Reconcile financial reporting
- Refine automation/integration workflows as needed
- Decommission old systems and subscriptions
- Track and document migration ROI