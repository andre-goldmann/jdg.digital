# Keycloak Authentication Setup Guide

## Overview

This guide provides step-by-step instructions for setting up Keycloak authentication in the OELAPA Property Management System. The system uses Keycloak 26.0.0 for Identity and Access Management (IAM) with OAuth2/OpenID Connect protocols and the `angular-oauth2-oidc` library.

## Prerequisites

- Node.js 18+ and npm
- Nx CLI (`npm install -g nx`)
- Docker and Docker Compose (for running Keycloak server)
- Basic understanding of OAuth2/OIDC

## Keycloak Server Setup

### Option 1: Docker Compose (Recommended for Development)

1. Create a `docker-compose.yml` file in your project root:

```yaml
version: '3.8'
services:
  keycloak:
    image: quay.io/keycloak/keycloak:26.0.0
    container_name: oelapa-keycloak
    environment:
      - KEYCLOAK_ADMIN=admin
      - KEYCLOAK_ADMIN_PASSWORD=admin
      - KC_DB=postgres
      - KC_DB_URL=jdbc:postgresql://postgres:5432/keycloak
      - KC_DB_USERNAME=keycloak
      - KC_DB_PASSWORD=keycloak
    ports:
      - "18080:8080"  # Note: Changed to port 18080 to match app config
    command: start-dev
    depends_on:
      - postgres
    volumes:
      - ./keycloak-data:/opt/keycloak/data

  postgres:
    image: postgres:15
    container_name: oelapa-keycloak-db
    environment:
      - POSTGRES_DB=keycloak
      - POSTGRES_USER=keycloak
      - POSTGRES_PASSWORD=keycloak
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

2. Start the Keycloak server:

```bash
docker-compose up -d
```

3. Wait for the services to start (usually 1-2 minutes)

4. Access Keycloak admin console at `http://localhost:18080`
   - Username: `admin`
   - Password: `admin`

### Option 2: Manual Installation

1. Download Keycloak 26.0.0 from [https://www.keycloak.org/downloads](https://www.keycloak.org/downloads)
2. Extract and configure according to Keycloak documentation
3. Start with: `./bin/kc.sh start-dev --http-port=18080`

## Keycloak Configuration

### 1. Create Realm

1. Log into Keycloak admin console at `http://localhost:18080`
2. Click "Create Realm" 
3. Set realm name: `oelapa`
4. Click "Create"

### 2. Create Client

1. Navigate to "Clients" in the `oelapa` realm
2. Click "Create client"
3. Configure client settings:
   - **Client ID**: `oelapa-frontend`
   - **Client Type**: `OpenID Connect`
   - **Client authentication**: `Off` (public client)
4. Click "Next"
5. Configure capability settings:
   - **Standard flow**: `On` (Authorization Code Flow)
   - **Direct access grants**: `Off` (not needed for SPA)
   - **Implicit flow**: `Off` (deprecated, using Code Flow + PKCE)
   - **Service accounts roles**: `Off`
   - **Authorization**: `Off`
6. Click "Next"
7. Configure login settings:
   - **Root URL**: `http://localhost:4200`
   - **Home URL**: `http://localhost:4200`
   - **Valid redirect URIs**: 
     - `http://localhost:4200/*`
     - `http://localhost:4200/auth/callback`
   - **Valid post logout redirect URIs**: `http://localhost:4200/*`
   - **Web origins**: `http://localhost:4200`
8. Click "Save"

### 3. Configure Client Advanced Settings

1. Go to the `oelapa-frontend` client settings
2. Navigate to the "Advanced" tab
3. Configure:
   - **Proof Key for Code Exchange Code Challenge Method**: `S256` (this enables PKCE)
   - **OAuth 2.0 Device Authorization Grant**: `Off`
   - **OIDC CIBA Grant**: `Off`
4. Click "Save"

### 4. Configure Client Scopes (Optional)

1. Navigate to "Client scopes" in the realm
2. The default scopes (`openid`, `profile`, `email`, `offline_access`) should be sufficient
3. If needed, you can create custom scopes for your application

### 5. Create Test User

1. Navigate to "Users" in the `oelapa` realm
2. Click "Create new user"
3. Set username: `testuser`
4. Set email: `test@oelapa.com`
5. Set first name: `Test`
6. Set last name: `User`
7. Set email verified: `Yes`
8. Set enabled: `Yes`
9. Click "Create"
10. Go to "Credentials" tab
11. Click "Set password"
12. Set password: `password123`
13. Turn off "Temporary" toggle
14. Click "Save"

### 6. Configure Realm Settings (Optional)

1. Navigate to "Realm settings"
2. Go to "Login" tab
3. Configure as needed:
   - **User registration**: `On` (if you want self-registration)
   - **Forgot password**: `On`
   - **Remember me**: `On`
   - **Login with email**: `On`

## Frontend Application Configuration

The application is already configured with the following settings in `src/app/auth/auth.config.ts`:

```typescript
export const authCodeFlowConfig: AuthConfig = {
  // Url of the Identity Provider (Keycloak)
  issuer: 'http://localhost:18080/realms/oelapa',
  
  // URL of the SPA to redirect the user to after login
  redirectUri: window.location.origin + '/',
  
  // The SPA's id registered with Keycloak
  clientId: 'oelapa-frontend',
  
  // Use the authorization code flow with PKCE
  responseType: 'code',
  
  // Requested scopes
  scope: 'openid profile email offline_access',
  
  // Enable development debugging
  showDebugInformation: true,
  
  // Development settings
  skipIssuerCheck: true,
  disableAtHashCheck: true,
};
```

## Required Files

Ensure the silent refresh file exists at `public/assets/silent-check-sso.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Silent Check SSO</title>
</head>
<body>
    <script>
        // This page is used for silent token refresh
        // It must be served from the same origin as your app
        parent.postMessage(location.hash || location.search, location.origin);
    </script>
</body>
</html>
```

## Running the Application

### 1. Start Keycloak

```bash
# Using Docker Compose
docker-compose up -d

# Verify Keycloak is running
curl http://localhost:18080/realms/oelapa/.well-known/openid-configuration
```

### 2. Start the Angular Application

```bash
# Navigate to the app directory
cd apps/oelapa

# Start the development server
nx serve oelapa
```

### 3. Test the Authentication Flow

1. Navigate to `http://localhost:4200`
2. The app will redirect to the dashboard
3. Since you're not authenticated, the auth guard will trigger the OAuth flow
4. You'll be redirected to Keycloak login page
5. Use test credentials:
   - Username: `testuser`
   - Password: `password123`
6. After successful login, you'll be redirected back to the dashboard

## Authentication Flow Explanation

The application uses the **Authorization Code Flow with PKCE**, which is the recommended flow for SPAs:

1. **Initial Request**: User accesses a protected route
2. **Auth Guard**: Checks if user has valid tokens
3. **Redirect**: If not authenticated, redirects to Keycloak
4. **Authorization**: User authenticates with Keycloak
5. **Callback**: Keycloak redirects back with authorization code
6. **Token Exchange**: App exchanges code for tokens (handled by angular-oauth2-oidc)
7. **Access Granted**: User can access protected resources

## Testing

### Manual Testing Checklist

- [ ] Accessing protected route redirects to Keycloak
- [ ] Successful login redirects back to app
- [ ] Invalid credentials show Keycloak error page
- [ ] JWT token is automatically attached to API requests
- [ ] Logout clears authentication state and redirects to Keycloak logout
- [ ] Token refresh works automatically (test by waiting for token expiration)
- [ ] Authentication state persists across browser tabs
- [ ] Direct navigation to login page works

### Debug Information

With `showDebugInformation: true` in the config, you can monitor authentication events in the browser console:

```javascript
// Check current authentication state
console.log('Has valid access token:', oauthService.hasValidAccessToken());
console.log('Has valid ID token:', oauthService.hasValidIdToken());
console.log('Identity claims:', oauthService.getIdentityClaims());
```

## Troubleshooting

### Common Issues

#### 1. CORS Errors

**Problem**: Browser shows CORS policy errors

**Solution**: 
- Ensure Keycloak client has `http://localhost:4200` in Web origins
- Check that redirect URIs include your development URL
- Restart Keycloak after configuration changes

#### 2. Invalid Redirect URI

**Problem**: Keycloak shows "Invalid redirect_uri" error

**Solution**:
- Verify the redirect URIs in Keycloak client configuration match your app URL
- Check that the `redirectUri` in `auth.config.ts` matches the Keycloak configuration
- Ensure the URL format is exact (including trailing slashes)

#### 3. Discovery Document Not Found

**Problem**: Console shows errors about discovery document

**Solution**:
- Verify Keycloak is running on the correct port (18080)
- Check the issuer URL in `auth.config.ts` matches your Keycloak realm
- Test the discovery endpoint: `http://localhost:18080/realms/oelapa/.well-known/openid-configuration`

#### 4. Token Not Attached to Requests

**Problem**: API requests don't include authorization header

**Solution**:
- Verify the auth interceptor is configured in `app.config.ts`
- Check that your API URLs start with `/api` (as configured in the interceptor)
- Ensure the authentication service has valid tokens

#### 5. Silent Refresh Issues

**Problem**: Token refresh fails or causes errors

**Solution**:
- Ensure `silent-check-sso.html` exists in `public/assets/`
- Check that the file is accessible at `http://localhost:4200/assets/silent-check-sso.html`
- Verify CORS settings allow iframe access

### Development Tips

1. **Browser DevTools**: Use Network tab to monitor OAuth flows
2. **JWT Inspection**: Use [jwt.io](https://jwt.io) to decode and inspect tokens
3. **Keycloak Logs**: Monitor Keycloak admin console events
4. **Console Debugging**: Use browser console to check authentication state

## Security Considerations

### Development vs Production

**Development Settings** (current):
- `skipIssuerCheck: true` - allows HTTP instead of HTTPS
- `showDebugInformation: true` - logs debug info to console

**Production Settings** (update these for production):
```typescript
export const authCodeFlowConfig: AuthConfig = {
  issuer: 'https://your-keycloak-domain.com/realms/oelapa',
  redirectUri: 'https://your-app-domain.com/',
  silentRefreshRedirectUri: 'https://your-app-domain.com/assets/silent-check-sso.html',
  clientId: 'oelapa-frontend',
  responseType: 'code',
  scope: 'openid profile email offline_access',
  showDebugInformation: false,
  skipIssuerCheck: false,
  disableAtHashCheck: false,
};
```

### Security Best Practices

1. **Use HTTPS**: Always use HTTPS in production
2. **PKCE**: Enabled by default (don't disable)
3. **Token Storage**: Tokens are stored in memory only (secure)
4. **CORS**: Properly configure CORS in both Keycloak and your backend APIs
5. **Token Expiration**: Configure appropriate token lifetimes in Keycloak

## Next Steps

After authentication is working:

1. **Role-Based Access Control**: Configure user roles in Keycloak and implement in the app
2. **API Integration**: Secure your backend APIs with JWT validation
3. **User Profile Management**: Implement user profile editing features
4. **Error Handling**: Add comprehensive error handling for auth failures
5. **Testing**: Write unit and integration tests for authentication flows

## Support

For issues and questions:
- Keycloak documentation: [https://www.keycloak.org/documentation](https://www.keycloak.org/documentation)
- angular-oauth2-oidc documentation: [https://github.com/manfredsteyer/angular-oauth2-oidc](https://github.com/manfredsteyer/angular-oauth2-oidc)
- OAuth2/OIDC specifications: [https://oauth.net/2/](https://oauth.net/2/)