/**
 * useSettingsWS — React hook that subscribes to real-time Settings updates
 * over the /ws/settings WebSocket channel.
 *
 * When the backend broadcasts events like SETTINGS_UPDATED, TOKEN_GENERATED,
 * TOKEN_UPDATED, CLEARANCE_UPDATED, ALERT_RULE_SAVED, ALERT_RULE_DELETED,
 * this hook calls the provided onEvent callback so UI can refresh accordingly.
 */

import { useEffect, useRef } from 'react';

const WS_URL = 'ws://localhost:4000/ws/settings';
const RECONNECT_DELAY_MS = 3000;

export type SettingsEvent = {
  type: string;
  data?: any;
  id?: string;
};

type Options = {
  onEvent?: (event: SettingsEvent) => void;
  enabled?: boolean;
};

export function useSettingsWS({ onEvent, enabled = true }: Options = {}) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    if (!enabled) return;
    mountedRef.current = true;

    const connect = () => {
      if (!mountedRef.current) return;
      try {
        const ws = new WebSocket(WS_URL);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('[SettingsWS] Connected');
        };

        ws.onmessage = (evt) => {
          try {
            const msg: SettingsEvent = JSON.parse(evt.data);
            if (msg.type !== 'INFO') {
              onEvent?.(msg);
            }
          } catch (_) {}
        };

        ws.onerror = () => {
          console.warn('[SettingsWS] Error — will reconnect');
        };

        ws.onclose = () => {
          if (!mountedRef.current) return;
          console.log(`[SettingsWS] Closed — reconnecting in ${RECONNECT_DELAY_MS}ms`);
          reconnectTimer.current = setTimeout(connect, RECONNECT_DELAY_MS);
        };
      } catch (err) {
        console.warn('[SettingsWS] Connection failed:', err);
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
  }, [enabled, onEvent]);

  return wsRef;
}
