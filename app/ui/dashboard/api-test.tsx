'use client';

import { createDotNetApiClient, getClientAccessToken } from '@/app/lib/api-client';
import { useState, useEffect } from 'react';

interface TestResult {
  endpoint: string;
  success: boolean;
  response?: unknown;
  error?: string;
  duration: number;
}

export default function ApiTestComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string>('');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated by trying to get profile
    fetch('/auth/profile')
      .then(res => setIsAuthenticated(res.ok))
      .catch(() => setIsAuthenticated(false));
  }, []);

  const runTokenTest = async () => {
    setIsLoading(true);
    try {
      const token = await getClientAccessToken();
      setAccessToken(token);
    } catch (error) {
      console.error('Token test failed:', error);
      setAccessToken('Failed to get token');
    }
    setIsLoading(false);
  };

  const runApiTests = async () => {
    if (!isAuthenticated) {
      alert('Please log in first');
      return;
    }

    setIsLoading(true);
    const results: TestResult[] = [];

    try {
      const apiClient = await createDotNetApiClient();
      
      // Test 1: GET /weatherforecast
      const startTime = Date.now();
      try {
        const response = await fetch('/api/client1');
        results.push({
          endpoint: 'GET /api/client1',
          success: true,
          response,
          duration: Date.now() - startTime
        });
      } catch (error) {
        results.push({
          endpoint: 'GET /api/client1',
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          duration: Date.now() - startTime
        });
      }

      // Test 2: GET /api/values (common .NET API endpoint)
      const startTime2 = Date.now();
      try {
        const response = await fetch('/api/client2');
        results.push({
          endpoint: 'GET /api/client2',
          success: true,
          response,
          duration: Date.now() - startTime2
        });
      } catch (error) {
        results.push({
          endpoint: 'GET /api/client2',
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          duration: Date.now() - startTime2
        });
      }

    } catch (error) {
      results.push({
        endpoint: 'API Client Setup',
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create API client',
        duration: 0
      });
    }

    setTestResults(results);
    setIsLoading(false);
  };

  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">🧪 .NET API Integration Test</h3>
        <div className="flex gap-2">
          {!isAuthenticated ? (
            <a 
              href="/auth/login"
              className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
            >
              Login with Auth0
            </a>
          ) : (
            <>
              <button
                onClick={runTokenTest}
                disabled={isLoading}
                className="rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 disabled:opacity-50"
              >
                {isLoading ? 'Getting Token...' : 'Test Token'}
              </button>
              <button
                onClick={runApiTests}
                disabled={isLoading}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50"
              >
                {isLoading ? 'Testing APIs...' : 'Test .NET API'}
              </button>
              <a 
                href="/auth/logout"
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
              >
                Logout
              </a>
            </>
          )}
        </div>
      </div>

      {isAuthenticated && (
        <div className="mb-4 p-3 bg-green-100 rounded-md">
          <p className="text-sm">
            👋 Hello! You are authenticated.
          </p>
        </div>
      )}

      {accessToken && (
        <div className="mb-4 p-3 bg-blue-100 rounded-md">
          <p className="text-sm font-mono break-all">
            🔑 Access Token: {accessToken.substring(0, 50)}...
          </p>
        </div>
      )}

      {testResults.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Test Results:</h4>
          <div className="space-y-2">
            {testResults.map((result, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-md ${result.success ? 'bg-green-100' : 'bg-red-100'}`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-medium">{result.endpoint}</span>
                  <span className="text-sm text-gray-500">{result.duration}ms</span>
                </div>
                {result.success ? (
                  <pre className="text-xs mt-1 text-green-700 overflow-x-auto">
                    {JSON.stringify(result.response, null, 2)}
                  </pre>
                ) : (
                  <p className="text-xs mt-1 text-red-700">{result.error}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}