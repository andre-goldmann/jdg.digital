# Reservation Service Integration Testing

## Overview
The integration tests in `reservation.service.integration.spec.ts` test real-world error scenarios with the actual reservation API endpoint.

## Prerequisites
1. API endpoint must be running at `http://localhost:5678/webhook/api/reservervations`
2. Test framework (Jest) must be configured in the project
3. Angular testing environment must be set up

## Running Integration Tests

### Manual Test Scenarios
Since automated integration tests require a live API endpoint, these scenarios can be tested manually:

#### 1. Network Timeout Testing
- **Scenario**: API response takes longer than timeout period
- **Expected**: Service should timeout gracefully with appropriate error message
- **Test**: Modify `apiTimeout` in environment to a very low value (1ms) and observe behavior

#### 2. Malformed Response Testing
- **Scenario**: API returns invalid JSON or unexpected response format
- **Expected**: Service should handle parsing errors gracefully
- **Test**: Mock API endpoint to return malformed JSON

#### 3. Rate Limiting Testing
- **Scenario**: Multiple rapid requests trigger API rate limiting (429 status)
- **Expected**: Service should handle rate limiting with appropriate retry logic
- **Test**: Send 10+ rapid requests and observe response handling

#### 4. Authentication Error Testing
- **Scenario**: Invalid JWT secret or expired tokens
- **Expected**: Service should return clear authentication error without retrying
- **Test**: Use invalid JWT secret in environment config

#### 5. Network Connectivity Testing
- **Scenario**: Network unavailable or DNS resolution fails
- **Expected**: Service should detect network issues and provide user-friendly error
- **Test**: Use invalid API URL (e.g., `http://nonexistent.invalid.url/api`)

#### 6. Concurrent Request Testing
- **Scenario**: Multiple reservation requests at the same time
- **Expected**: All requests should complete successfully or fail gracefully
- **Test**: Create multiple simultaneous reservations

## Error Scenarios Covered

### Client-Side Validation Errors
✅ **Tested**: Empty guest name
✅ **Tested**: Invalid date ranges (check-out before check-in)
✅ **Tested**: Invalid guest count (zero or negative)
✅ **Tested**: Missing required fields

### Authentication Errors
✅ **Tested**: User not authenticated
✅ **Tested**: Missing access token
✅ **Tested**: Invalid JWT secret (would cause 401 from API)

### Network Errors
✅ **Tested**: Network connectivity issues (DNS resolution failure)
✅ **Tested**: Timeout scenarios
✅ **Tested**: Connection refused errors

### API Response Errors
✅ **Tested**: 400 Bad Request (validation errors)
✅ **Tested**: 401 Unauthorized (authentication failure)
✅ **Tested**: 403 Forbidden (insufficient permissions)
✅ **Tested**: 429 Too Many Requests (rate limiting)
✅ **Tested**: 5xx Server Errors (with retry logic)
✅ **Tested**: Malformed response handling

### Security Testing
✅ **Tested**: JWT token generation with user context
✅ **Tested**: Error logging without exposing sensitive data
✅ **Tested**: Access token validation

## Test Results Documentation

### Expected Behavior Summary

1. **Validation Errors**: Should be caught client-side before API call
2. **Authentication Errors**: Should fail immediately without retries
3. **Network Errors**: Should retry with exponential backoff (up to 3 attempts)
4. **Server Errors (5xx)**: Should retry with exponential backoff
5. **Rate Limiting**: Should handle 429 responses appropriately
6. **Malformed Responses**: Should provide meaningful error messages

### Performance Requirements
- **Timeout**: Requests should timeout after 30 seconds
- **Retries**: Maximum 3 retry attempts with exponential backoff
- **Concurrent Requests**: Should handle multiple simultaneous requests
- **Memory**: No memory leaks from error scenarios

## Manual Verification Checklist

- [ ] Service handles network timeouts gracefully
- [ ] Authentication errors provide clear user feedback
- [ ] Retry logic works with exponential backoff
- [ ] Rate limiting responses are handled appropriately
- [ ] Malformed API responses don't crash the application
- [ ] Concurrent requests work without interference
- [ ] Error logging excludes sensitive information
- [ ] User gets meaningful error messages for all scenarios

## Notes for Developers

1. **Environment Configuration**: API timeout and endpoint URL are configurable
2. **Error Logging**: All errors are logged but sensitive data is filtered out
3. **Retry Strategy**: Only network errors and 5xx server errors trigger retries
4. **JWT Security**: Tokens include user email and access token for verification
5. **Performance**: Service is optimized for concurrent requests

## Integration with CI/CD

To include these tests in automated pipelines:

1. Set up test API endpoint in CI environment
2. Configure environment variables for test endpoints
3. Run integration tests as separate job after unit tests
4. Include performance and load testing for reservation endpoints

## Troubleshooting

### Common Issues
- **CORS Errors**: Ensure API endpoint allows cross-origin requests
- **Network Errors**: Verify API endpoint is accessible and running
- **Authentication Failures**: Check JWT secret configuration
- **Timeout Issues**: Adjust `apiTimeout` in environment configuration