'use client';

import GetToken from '@/app/lib/api-client';
import { useState } from 'react';

interface TestResult {
  endpoint: string;
  success: boolean;
  traceId: string;
  response?: unknown;
  error?: string;
  duration: number;
}

export default function ApiTestComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState("NotToken")

  const runAllTests = async () => {
    setIsLoading(true);

    const newToken = await GetToken()

    setAccessToken(newToken)

    setIsLoading(false);
  };


  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">🧪 .NET API Integration Test</h3>
        <div className="flex gap-2">
          <button
            onClick={runAllTests}
            disabled={isLoading}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test API Integration'}
          </button>
        </div>
        <div>
          Got access token: {accessToken}
        </div>
      </div>
    </div>
  );
}