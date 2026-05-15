import { useState, useEffect } from 'react';
import * as Network from 'expo-network';

export function useNetwork() {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);

  useEffect(() => {
    const checkNetwork = async () => {
      const state = await Network.getNetworkStateAsync();
      setIsConnected(state.isConnected ?? false);
    };

    checkNetwork();

    // Check periodically or use a listener if available (expo-network doesn't have a listener, 
    // NetInfo would be better for real-time but we'll stick to manual check for now or use intervals)
    const interval = setInterval(checkNetwork, 5000);

    return () => clearInterval(interval);
  }, []);

  return { isConnected };
}
