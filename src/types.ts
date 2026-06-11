export interface Settings {
  notificationLevel: 'silent' | 'alert' | 'critical';
  autoSaveEnabled: boolean;
  theme: 'dark' | 'light';
}

export interface Clearance {
  id: string;
  level: 'Operator' | 'Supervisor' | 'Director' | 'Administrator';
  description: string;
}

export interface Token {
  id: string;
  name: string;
  createdAt: string;
}

export interface Telemetry {
  stability: number;
  cpuUsage: number;
  networkLatency: number;
}

export interface Protocol {
  id: string;
  name: string;
  active: boolean;
}
