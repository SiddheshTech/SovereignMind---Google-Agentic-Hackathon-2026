import { create } from 'zustand';
import { Settings, Clearance, Token, Telemetry, Protocol } from '../types';
import api from '../api/client';

interface AppState {
  settings: Settings;
  clearances: Clearance[];
  tokens: Token[];
  telemetry: Telemetry;
  protocols: Protocol[];
  
  fetchSettings: () => Promise<void>;
  updateSettings: (settings: Settings) => Promise<void>;
  // ... سایر توابع
}

export const useAppStore = create<AppState>((set) => ({
  settings: { notificationLevel: 'alert', autoSaveEnabled: true, theme: 'dark' },
  clearances: [],
  tokens: [],
  telemetry: { stability: 100, cpuUsage: 0, networkLatency: 0 },
  protocols: [],
  
  fetchSettings: async () => {
    const { data } = await api.get('/settings');
    set({ settings: data });
  },
  updateSettings: async (settings) => {
    await api.put('/settings', settings);
    set({ settings });
  },
  
  setSettings: (settings) => set({ settings }),
  setClearances: (clearances) => set({ clearances }),
  setTokens: (tokens) => set({ tokens }),
  setTelemetry: (telemetry) => set({ telemetry }),
  setProtocols: (protocols) => set({ protocols }),
}));
