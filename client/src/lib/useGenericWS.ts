import { useEffect, useRef } from 'react';

const RECONNECT_DELAY_MS = 3000;

export function useGenericWS(url: string, onEvent: (event: any) => void) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);
  
  // Keep the latest callback in a ref to prevent reconnection cycles
  const onEventRef = useRef(onEvent);
  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  useEffect(() => {
    mountedRef.current = true;

    const connect = () => {
      if (!mountedRef.current) return;
      try {
        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log(`[WS] Connected to ${url}`);
        };

        ws.onmessage = (evt) => {
          try {
            const msg = JSON.parse(evt.data);
            if (msg.type !== 'INFO') {
              onEventRef.current(msg);
            }
          } catch (_) {}
        };

        ws.onerror = () => {
          console.warn(`[WS] Error on ${url} — will reconnect`);
        };

        ws.onclose = () => {
          if (!mountedRef.current) return;
          console.log(`[WS] Closed ${url} — reconnecting in ${RECONNECT_DELAY_MS}ms`);
          reconnectTimer.current = setTimeout(connect, RECONNECT_DELAY_MS);
        };
      } catch (err) {
        console.warn(`[WS] Connection failed for ${url}:`, err);
        reconnectTimer.current = setTimeout(connect, RECONNECT_DELAY_MS);
      }
    };

    connect();

    return () => {
      mountedRef.current = false;
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [url]);

  return wsRef;
}
