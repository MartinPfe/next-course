// Example usage of the DotNet API Client with Auth0 access tokens

import { createDotNetApiClient, DotNetApiClient } from './api-client';

// Example 1: Simple GET request
export async function getWeatherForecast() {
  try {
    const apiClient = await createDotNetApiClient();
    const weather = await apiClient.get('/weatherforecast');
    console.log('Weather data:', weather);
    return weather;
  } catch (error) {
    console.error('Failed to fetch weather:', error);
    throw error;
  }
}

// Example 2: POST request with data
export async function createUser(userData: { name: string; email: string }) {
  try {
    const apiClient = await createDotNetApiClient();
    const newUser = await apiClient.post('/api/users', userData);
    console.log('Created user:', newUser);
    return newUser;
  } catch (error) {
    console.error('Failed to create user:', error);
    throw error;
  }
}

// Example 3: Using the client manually
export async function manualApiClientUsage() {
  const apiClient = new DotNetApiClient('http://localhost:5138');
  
  // You'll need to get the token manually
  const response = await fetch('/api/auth/token');
  const { accessToken } = await response.json();
  
  await apiClient.setAccessToken(accessToken);
  
  // Now you can make requests
  const data = await apiClient.get('/api/some-endpoint');
  return data;
}

// Example 4: Server-side usage (in API routes or server components)
import { auth0 } from './auth0';

export async function serverSideApiCall() {
  try {
    // Get token server-side
    const tokenData = await auth0.getAccessToken();
    
    // Create client and set token
    const apiClient = new DotNetApiClient();
    await apiClient.setAccessToken(tokenData.token);
    
    // Make API call
    const result = await apiClient.get('/api/protected-endpoint');
    return result;
  } catch (error) {
    console.error('Server-side API call failed:', error);
    throw error;
  }
}