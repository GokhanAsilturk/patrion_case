export interface Sensor {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive' | 'maintenance' | 'error';
  companyId: string;
  companyName?: string;
  lastReading?: number;
  lastUpdate?: string;
}

export interface SensorState {
  sensors: Sensor[];
  loading: boolean;
  error: string | null;
}
