import { auth0 } from './auth0';

// Server-side function to get access token
export async function GetToken(): Promise<string> {
  try {
    const tokenData = await auth0.getAccessToken();
    return tokenData.token || '';
  } catch (error) {
    console.error('Error getting access token:', error);
    return '';
  }
}

// Client-side function to get access token via API route
export async function getClientAccessToken(): Promise<string> {
  try {
    const response = await fetch('/api/auth/access-token');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.token || '';
  } catch (error) {
    console.error('Error getting client access token:', error);
    return '';
  }
}

// API client for calling .NET API
export class DotNetApiClient {
  private baseUrl: string;
  private accessToken: string | null = null;

  constructor(baseUrl: string = process.env.DOTNET_API_URL || 'http://localhost:5138') {
    this.baseUrl = baseUrl;
  }

  async setAccessToken(token: string) {
    this.accessToken = token;
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>('GET', endpoint);
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>('POST', endpoint, data);
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>('PUT', endpoint, data);
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>('DELETE', endpoint);
  }

  private async request<T>(method: string, endpoint: string, data?: unknown): Promise<T> {
    if (!this.accessToken) {
      throw new Error('Access token not set. Call setAccessToken() first.');
    }

    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    
    const config: RequestInit = {
      method,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    } else {
      return response.text() as unknown as T;
    }
  }
}

// Convenience function to create and configure API client
export async function createDotNetApiClient(): Promise<DotNetApiClient> {
  const client = new DotNetApiClient();
  const token = await getClientAccessToken();
  await client.setAccessToken(token);
  return client;
}

export default GetToken;