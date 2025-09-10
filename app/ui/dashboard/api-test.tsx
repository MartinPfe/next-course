'use client';

import { createDotNetApiClient, getClientAccessToken } from '@/app/lib/api-client';
import { useState, useEffect } from 'react';
import { Button } from '../button';
import Loading from '@/app/dashboard/(overview)/loading';
import { POST } from '@/app/api/auth/access-token/route';

interface TestResult {
  endpoint: string;
  success: boolean;
  response?: unknown;
  error?: string;
  duration: number;
}

export default function ApiTestComponent()  {
  const [state, setState] = useState({ isLoading: false, response: undefined, error: undefined });

  const callApi = async () => {
    setState(previous => ({ ...previous, isLoading: true }));

    try {
      const response = await fetch('/api/shows', {method: 'POST'});
      const data = await response.json();

      setState(previous => ({ ...previous, response: data, error: undefined }));
    } catch (error) {
      setState(previous => ({ ...previous, response: undefined, error }));
    } finally {
      setState(previous => ({ ...previous, isLoading: false }));
    }
  };

  const handle = (event, fn) => {
    event.preventDefault();
    fn();
  };

  const { isLoading, response, error } = state;

  return (
    <>
      <div className="mb-5" data-testid="external">
        <h1 data-testid="external-title">External API</h1>
        <div data-testid="external-text">
          <p className="lead">Ping an external API by clicking the button below</p>
          <p>
            This will call a local API on port 3001 that would have been started if you run <code>npm run dev</code>.
          </p>
          <p>
            An access token is sent as part of the request's <code>Authorization</code> header and the API will validate
            it using the API's audience value. The audience is the identifier of the API that you want to call (see{' '}
            <a href="https://auth0.com/docs/get-started/dashboard/tenant-settings#api-authorization-settings">
              API Authorization Settings
            </a>{' '}
            for more info).
          </p>
        </div>
        <Button color="primary" className="mt-5" onClick={e => handle(e, callApi)} data-testid="external-action">
          Ping API
        </Button>
      </div>
      <div className="result-block-container">
        {isLoading && <Loading />}
        {(error || response) && (
          <div className="result-block" data-testid="external-result">
            <h6 className="muted">Result</h6>
            {error && <div>{error}</div>}
            {response && <div>{JSON.stringify(response, null, 2)}</div>}
          </div>
        )}
      </div>
    </>
  );
}
