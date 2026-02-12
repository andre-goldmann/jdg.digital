# property-management Specification

## Purpose
Provides comprehensive property management capabilities for the OELAPA PMS, enabling hotel operators to create and configure properties with all necessary operational settings including distribution, finance, automation, and inventory management.

## ADDED Requirements

### Requirement: Property Creation and Basic Information Management
The system SHALL provide a complete property creation workflow with validation and core information management.

#### Scenario: Create new property with core information
- **WHEN** a user creates a new property
- **THEN** the system SHALL collect property code (unique identifier), name, address, location details (city, country, timezone, currency), default check-in/out times, and company details (name, register entry, tax ID)
- **AND** the property code SHALL be unique and cannot be changed after creation
- **AND** all required fields must be validated before saving

#### Scenario: Property code uniqueness validation
- **WHEN** a user enters a property code during creation
- **THEN** the system SHALL validate that the property code is unique across all properties
- **AND** provide immediate feedback if the code already exists
- **AND** suggest alternative codes when duplicates are detected

#### Scenario: Location and timezone validation
- **WHEN** a user selects property location details
- **THEN** the system SHALL validate timezone and currency code combinations
- **AND** provide autocomplete suggestions for valid timezone/currency pairs
- **AND** warn users about potential conflicts between location and currency selection

### Requirement: Property Settings and Configuration Management
The system SHALL provide comprehensive property configuration interface organized into logical settings groups.

#### Scenario: Access property-specific settings
- **WHEN** a user selects a property in the context selector
- **THEN** the system SHALL display property-specific settings in organized tabs: General, Distribution, Finance, Automation, and Inventory
- **AND** settings SHALL be scoped to the selected property context
- **AND** changes SHALL be saved independently for each settings category

#### Scenario: Update general property information
- **WHEN** a user modifies property general information
- **THEN** the system SHALL allow updates to name, address, and company details
- **AND** maintain property code immutability after initial creation
- **AND** validate all changes before saving

#### Scenario: Configure distribution settings
- **WHEN** a user configures distribution settings
- **THEN** the system SHALL enable city tax configuration including calculation formula (per person/night or percentage), value, and VAT applicability
- **AND** provide preset templates for common city tax configurations
- **AND** validate tax calculation formulas for mathematical correctness

### Requirement: Finance and Invoice Configuration
The system SHALL provide comprehensive finance settings for invoice generation and payment automation.

#### Scenario: Configure invoice settings
- **WHEN** a user configures invoice settings
- **THEN** the system SHALL allow setup of legal entity details, invoice number templates, and tax breakdown display options
- **AND** provide template validation for invoice number formats
- **AND** ensure compliance with local tax reporting requirements

#### Scenario: Customize invoice styling
- **WHEN** a user customizes invoice appearance
- **THEN** the system SHALL support logo upload and custom text configuration for invoices
- **AND** validate logo file format and size requirements
- **AND** provide preview functionality for invoice styling changes

#### Scenario: Manage custom sub-accounts
- **WHEN** a user creates custom sub-accounts
- **THEN** the system SHALL enable tracking of service revenues linked to specific services for accounting purposes
- **AND** validate sub-account naming and categorization
- **AND** ensure proper accounting integration patterns

### Requirement: Automation Rules and Workflow Management
The system SHALL provide automated action configuration for operational efficiency.

#### Scenario: Configure check-in/out automation
- **WHEN** a user sets up check-in/out automation
- **THEN** the system SHALL enable automated check-in at arrival time and automated check-out at departure time
- **AND** allow customization of automation timing and conditions
- **AND** provide override capabilities for manual intervention

#### Scenario: Configure night audit settings
- **WHEN** a user configures night audit
- **THEN** the system SHALL allow timing configuration and no-show marking rules for guests who haven't checked in
- **AND** validate audit timing against business operational hours
- **AND** provide audit trail for night audit activities

#### Scenario: Set up payment automation rules
- **WHEN** a user configures payment automation (Apaleo Pay integration)
- **THEN** the system SHALL enable payment rule setup after merchant account configuration
- **AND** validate payment automation rules for compliance
- **AND** provide testing capabilities for payment workflows

### Requirement: Inventory and Unit Management
The system SHALL provide comprehensive inventory management for rooms and meeting spaces.

#### Scenario: Define unit groups and room types
- **WHEN** a user defines unit groups
- **THEN** the system SHALL enable creation of room types (e.g., 'SRS' for Single Room Standard) with classification (bedrooms, meeting rooms, etc.)
- **AND** validate unit group codes for uniqueness within property
- **AND** support hierarchical unit group organization

#### Scenario: Configure unit attributes
- **WHEN** a user configures unit attributes
- **THEN** the system SHALL enable definition of attributes like floor number, bed type, or view at account level
- **AND** allow application of attributes to specific units within the property
- **AND** validate attribute consistency and business rule compliance

#### Scenario: Manage unit inventory
- **WHEN** a user manages unit inventory
- **THEN** the system SHALL provide unit assignment, availability tracking, and maintenance status management
- **AND** integrate with reservation system for availability calculations
- **AND** support unit blocking and maintenance scheduling

### Requirement: Property Context and Multi-Property Support
The system SHALL provide property context management for multi-property operations.

#### Scenario: Property context selection
- **WHEN** a user works with multiple properties
- **THEN** the system SHALL provide a context selector in the top navigation
- **AND** maintain property context across all application modules
- **AND** ensure settings and data are properly scoped to selected property

#### Scenario: Property switching and session management
- **WHEN** a user switches between properties
- **THEN** the system SHALL preserve user session while changing property context
- **AND** reload property-specific data and configurations
- **AND** maintain navigation state appropriate to new property context

#### Scenario: Property access control
- **WHEN** a user attempts to access property settings
- **THEN** the system SHALL validate user permissions for property management
- **AND** restrict access based on role-based permissions (integration with authentication system)
- **AND** provide appropriate error messages for access violations

### Requirement: Property Data Validation and Business Rules
The system SHALL ensure data integrity through comprehensive validation and hospitality business rule enforcement.

#### Scenario: Property business rule validation
- **WHEN** property data is entered or modified
- **THEN** the system SHALL validate business rules including check-in/out time logic, tax calculation accuracy, and unit capacity constraints
- **AND** provide clear error messages with guidance for resolution
- **AND** prevent data corruption through client and server-side validation

#### Scenario: Property data consistency checks
- **WHEN** property configuration changes are made
- **THEN** the system SHALL verify data consistency across related settings (e.g., currency and tax configuration alignment)
- **AND** warn users about potential conflicts before saving
- **AND** provide recommendations for resolving consistency issues

#### Scenario: Property audit trail
- **WHEN** property settings are modified
- **THEN** the system SHALL maintain audit trail of changes including user, timestamp, and modified fields
- **AND** enable property change history review
- **AND** support compliance and troubleshooting requirements