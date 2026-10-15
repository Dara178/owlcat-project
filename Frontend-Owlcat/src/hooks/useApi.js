import { useState, useEffect } from 'react';
import { subscribeBackendStatus, apiClient } from '../services/apiClient';

export function useApiStatus() {
  const [isOnline, setIsOnline] = useState(apiClient.isBackendAvailable());
  const apiUrl = apiClient.getBackendUrl();

  useEffect(() => {
    return subscribeBackendStatus((status) => {
      setIsOnline(status);
    });
  }, []);

  return {
    isOnline,
    apiUrl,
    isMock: isOnline === false
  };
}
