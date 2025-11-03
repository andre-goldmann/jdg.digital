// Browser-compatible JWT utility
// Note: This is for demonstration purposes. In production, JWT generation should be done server-side.

export interface JwtHeader {
  alg: string;
  typ: string;
}

export interface JwtPayload {
  email: string;
  accessToken: string;
  iat?: number;
  exp?: number;
}

/**
 * Browser-compatible JWT token generation
 * WARNING: This is for demonstration only. In production, JWT should be generated server-side
 * as the secret would be exposed in the client-side code.
 */
export class BrowserJwtUtil {
  private static base64UrlEncode(str: string): string {
    return btoa(str)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  private static async hmacSha256(message: string, secret: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const key = encoder.encode(secret);

    // Import the secret key
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      key,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    // Sign the message
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, data);

    // Convert to base64url
    const signatureArray = new Uint8Array(signature);
    const signatureString = String.fromCharCode(...signatureArray);
    return this.base64UrlEncode(signatureString);
  }

  /**
   * Generate a JWT token in the browser
   * WARNING: This exposes the secret in client code - only for demo purposes
   */
  static async generateToken(payload: JwtPayload, secret: string): Promise<string> {
    const header: JwtHeader = {
      alg: 'HS256',
      typ: 'JWT'
    };

    // Add issued at and expiration time
    const now = Math.floor(Date.now() / 1000);
    const tokenPayload: JwtPayload = {
      ...payload,
      iat: now,
      exp: now + 3600 // 1 hour expiration
    };

    // Encode header and payload
    const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
    const encodedPayload = this.base64UrlEncode(JSON.stringify(tokenPayload));

    // Create signature
    const message = `${encodedHeader}.${encodedPayload}`;
    const signature = await this.hmacSha256(message, secret);

    // Return the complete JWT
    return `${message}.${signature}`;
  }
}
