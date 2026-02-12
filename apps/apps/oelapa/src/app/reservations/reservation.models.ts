/**
 * Reservation status enumeration for status management
 */
export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked_in',
  CHECKED_OUT = 'checked_out',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show'
}

/**
 * Core reservation data structure for API communication
 */
export interface ReservationRequest {
  guestName: string;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  roomType?: string;
  specialRequests?: string;
}

/**
 * API response structure for reservation operations
 */
export interface ReservationResponse {
  success: boolean;
  reservationId?: string;
  message?: string;
  error?: string;
}

/**
 * Optimized reservation data structure for list display
 */
export interface ReservationListItem {
  id: string;
  reservationId: string;
  guestName: string;
  checkInDate: string;
  checkOutDate: string;
  roomType: string;
  guestCount: number;
  status: ReservationStatus;
  specialRequests?: string;
  createdAt: string;
  nights: number;
  totalAmount?: number;
  currency?: string;
  guestEmail?: string;
  phoneNumber?: string;

  // Apoleo-specific fields for enhanced layout
  channel: string;              // Booking channel (Direct, Booking.com, etc.)
  unit: string;                 // Room/unit designation (e.g., "402 - Fam Family Room")
  guarantee: string;            // Payment guarantee type (Credit Card, Prepaid, etc.)
  balance: number;              // Financial balance (negative for amounts owed)
  createdDate: string;          // Booking creation timestamp (M/D/YY h:mm A format)
  hasWarnings: boolean;         // Warning indicator flag
  warningMessage?: string;      // Warning message text
  adults?: number;              // Number of adults
  children?: number;            // Number of children
}

/**
 * JWT payload structure for API authentication
 */
export interface JwtPayload {
  email: string;
  accessToken: string;
  iat?: number;
  exp?: number;
}

/**
 * Filtering interface for reservation list search and filtering
 */
export interface ReservationFilters {
  searchQuery?: string;
  statuses?: ReservationStatus[];
  checkInDateFrom?: string;
  checkInDateTo?: string;
  checkOutDateFrom?: string;
  checkOutDateTo?: string;
  roomType?: string;
  guestCount?: number;
  // Additional filter properties for enhanced functionality
  checkInStart?: string;
  checkInEnd?: string;
  minGuests?: number;
  maxGuests?: number;
  minAmount?: number;
  maxAmount?: number;
}

/**
 * Error interface for reservation operations
 */
export interface ReservationError {
  message: string;
  code?: string;
  details?: unknown;
}

/**
 * Mock reservation data for development and testing
 */
export const MOCK_RESERVATIONS: ReservationListItem[] = [
  {
    id: '1',
    reservationId: 'RES-2025-001',
    guestName: 'John Smith',
    checkInDate: '2025-11-20',
    checkOutDate: '2025-11-23',
    roomType: 'Deluxe Suite',
    guestCount: 2,
    status: ReservationStatus.CONFIRMED,
    specialRequests: 'Late check-in requested',
    createdAt: '2025-11-10T14:30:00Z',
    nights: 3,
    totalAmount: 450.00,
    currency: 'EUR',
    channel: 'Direct',
    unit: '202 - Fam Family Room',
    guarantee: 'Credit Card',
    balance: -450.00,
    createdDate: '8/29/22 3:23 PM',
    hasWarnings: false,
    adults: 2,
    children: 0
  },
  {
    id: '2',
    reservationId: 'RES-2025-002',
    guestName: 'Sarah Johnson',
    checkInDate: '2025-11-18',
    checkOutDate: '2025-11-20',
    roomType: 'Standard Room',
    guestCount: 1,
    status: ReservationStatus.CHECKED_IN,
    specialRequests: 'Extra pillows',
    createdAt: '2025-11-05T09:15:00Z',
    nights: 2,
    totalAmount: 180.00,
    currency: 'EUR',
    channel: 'Direct',
    unit: '405 - Excute',
    guarantee: 'Credit Card',
    balance: 300.00,
    createdDate: '9/2/22 10:00 AM',
    hasWarnings: false,
    adults: 1,
    children: 0
  },
  {
    id: '3',
    reservationId: 'RES-2025-003',
    guestName: 'Michael Brown',
    checkInDate: '2025-11-15',
    checkOutDate: '2025-11-17',
    roomType: 'Executive Suite',
    guestCount: 3,
    status: ReservationStatus.CHECKED_OUT,
    createdAt: '2025-10-28T16:45:00Z',
    nights: 2,
    totalAmount: 380.00,
    currency: 'EUR',
    channel: 'Direct',
    unit: '303 - Doune',
    guarantee: 'Credit Card',
    balance: -540.00,
    createdDate: '8/29/22 2:57 PM',
    hasWarnings: true,
    warningMessage: 'The restrictions of the rate plan are not considered',
    adults: 2,
    children: 1
  },
  {
    id: '4',
    reservationId: 'RES-2025-004',
    guestName: 'Emma Wilson',
    checkInDate: '2025-11-22',
    checkOutDate: '2025-11-25',
    roomType: 'Standard Room',
    guestCount: 2,
    status: ReservationStatus.PENDING,
    specialRequests: 'Ground floor preferred',
    createdAt: '2025-11-12T11:20:00Z',
    nights: 3,
    totalAmount: 270.00,
    currency: 'EUR',
    channel: 'Booking.com',
    unit: '104 - Deluxe',
    guarantee: 'Credit Card',
    balance: -800.00,
    createdDate: '9/8/22 10:10 AM',
    hasWarnings: false,
    adults: 2,
    children: 0
  },
  {
    id: '5',
    reservationId: 'RES-2025-005',
    guestName: 'David Garcia',
    checkInDate: '2025-11-19',
    checkOutDate: '2025-11-21',
    roomType: 'Deluxe Suite',
    guestCount: 4,
    status: ReservationStatus.CANCELLED,
    specialRequests: 'Accessible room needed',
    createdAt: '2025-11-08T13:10:00Z',
    nights: 2,
    totalAmount: 320.00,
    currency: 'EUR',
    channel: 'Direct',
    unit: '402 - Fam Family Room',
    guarantee: 'Credit Card',
    balance: -1400.00,
    createdDate: '8/29/22 3:27 PM',
    hasWarnings: true,
    warningMessage: 'The restrictions of the rate plan are not considered',
    adults: 2,
    children: 2
  },
  {
    id: '6',
    reservationId: 'RES-2025-006',
    guestName: 'Lisa Anderson',
    checkInDate: '2025-11-16',
    checkOutDate: '2025-11-18',
    roomType: 'Presidential Suite',
    guestCount: 2,
    status: ReservationStatus.NO_SHOW,
    specialRequests: 'Champagne welcome',
    createdAt: '2025-11-01T10:30:00Z',
    nights: 2,
    totalAmount: 800.00,
    currency: 'EUR',
    channel: 'Expedia',
    unit: '206 - Deluxe',
    guarantee: 'Credit Card',
    balance: -360.00,
    createdDate: '8/29/22 2:27 PM',
    hasWarnings: false,
    adults: 2,
    children: 0
  },
  {
    id: '7',
    reservationId: 'RES-2025-007',
    guestName: 'Robert Taylor',
    checkInDate: '2025-11-24',
    checkOutDate: '2025-11-27',
    roomType: 'Standard Room',
    guestCount: 1,
    status: ReservationStatus.CONFIRMED,
    createdAt: '2025-11-13T15:45:00Z',
    nights: 3,
    totalAmount: 225.00,
    currency: 'EUR',
    channel: 'Phone',
    unit: '104 - Deluxe',
    guarantee: 'Credit Card',
    balance: -800.00,
    createdDate: '8/29/22 3:27 PM',
    hasWarnings: false,
    adults: 1,
    children: 0
  },
  {
    id: '8',
    reservationId: 'RES-2025-008',
    guestName: 'Maria Rodriguez',
    checkInDate: '2025-11-21',
    checkOutDate: '2025-11-24',
    roomType: 'Executive Suite',
    guestCount: 2,
    status: ReservationStatus.CONFIRMED,
    specialRequests: 'Baby crib required',
    createdAt: '2025-11-09T12:00:00Z',
    nights: 3,
    totalAmount: 540.00,
    currency: 'EUR',
    channel: 'Direct',
    unit: '303 - Doune',
    guarantee: 'Credit Card',
    balance: -300.00,
    createdDate: '8/26/22 2:57 PM',
    hasWarnings: false,
    adults: 2,
    children: 0
  }
];
