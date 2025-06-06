import api from './axios';

export interface Sensor {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive' | 'maintenance' | 'error';
  companyId: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SensorData {
  id: string;
  sensorId: string;
  value: number;
  unit: string;
  timestamp: string;
}

export interface SensorAnalytics {
  min: number;
  max: number;
  average: number;
  count: number;
  timeRange: {
    start: string;
    end: string;
  };
}

export interface SensorFilters {
  companyId?: string;
  status?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

const sensorApi = {
  getSensors: async (filters?: SensorFilters): Promise<PaginatedResponse<Sensor>> => {
    const response = await api.get<PaginatedResponse<Sensor>>('/sensors', { params: filters });
    return response.data;
  },
  
  getSensorById: async (id: string): Promise<Sensor> => {
    const response = await api.get<Sensor>(`/sensors/${id}`);
    return response.data;
  },
  
  createSensor: async (sensorData: Omit<Sensor, 'id' | 'createdAt' | 'updatedAt'>): Promise<Sensor> => {
    const response = await api.post<Sensor>('/sensors', sensorData);
    return response.data;
  },
  
  updateSensor: async (id: string, sensorData: Partial<Omit<Sensor, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Sensor> => {
    const response = await api.put<Sensor>(`/sensors/${id}`, sensorData);
    return response.data;
  },
  
  deleteSensor: async (id: string): Promise<void> => {
    await api.delete(`/sensors/${id}`);
  },
  
  getSensorData: async (id: string, filters?: { startDate?: string; endDate?: string; limit?: number }): Promise<SensorData[]> => {
    const response = await api.get<SensorData[]>(`/sensors/${id}/data`, { params: filters });
    return response.data;
  },
  
  getSensorAnalytics: async (id: string, filters?: { startDate?: string; endDate?: string }): Promise<SensorAnalytics> => {
    const response = await api.get<SensorAnalytics>(`/sensors/${id}/analytics`, { params: filters });
    return response.data;
  },
  
  exportSensorData: async (id: string, filters?: { startDate?: string; endDate?: string; format?: 'csv' | 'excel' }): Promise<Blob> => {
    const response = await api.get(`/sensors/${id}/export`, { 
      params: filters,
      responseType: 'blob'
    });
    return response.data;
  },
  
  getSensorTimeseries: async (sensorId: string, params?: { startDate?: string; endDate?: string; limit?: number }) => {
    const response = await api.get(`/sensors/${sensorId}/timeseries`, { params });
    return response.data;
  },

  publishSensorData: async (sensorId: string, data: { value: number; timestamp?: string }) => {
    const response = await api.post(`/sensors/${sensorId}/publish`, data);
    return response.data;
  },

  sendNotification: async (notification: { title: string; message: string; userId?: string; companyId?: string }) => {
    const response = await api.post('/notifications/send', notification);
    return response.data;
  },

  // WebSocket bağlantıları için gerekli odaları belirleyecek yardımcı fonksiyon
  getSensorRoomId: (sensorId: string): string => {
    return `sensor:${sensorId}`;
  }
};

export default sensorApi;