import { io, Socket } from 'socket.io-client';
import { SensorData } from '../api/sensorApi';

interface ServerToClientEvents {
  'sensor:data': (data: SensorData) => void;
  'sensor:status': (data: { id: string; status: string }) => void;
  'notification': (data: { id: string; type: string; message: string; createdAt: string }) => void;
}

interface ClientToServerEvents {
  'join:sensor': (sensorId: string) => void;
  'leave:sensor': (sensorId: string) => void;
  'join:company': (companyId: string) => void;
  'leave:company': (companyId: string) => void;
}

class SocketService {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
  private connected = false;
  private token: string | null = null;

  // Singleton instance
  private static instance: SocketService;

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  private constructor() {}

  public init(token: string): void {
    if (this.socket || this.connected) {
      return;
    }

    this.token = token;
    this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      auth: {
        token,
      },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      this.connected = true;
      console.log('Socket connected');
    });

    this.socket.on('disconnect', () => {
      this.connected = false;
      console.log('Socket disconnected');
    });

    this.socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
      // If token is invalid, trigger logout
      if (err.message.includes('authentication')) {
        // Clear token and trigger logout process
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    });
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  public isConnected(): boolean {
    return this.connected;
  }

  // Sensör verileri için abone ol
  public subscribeSensorData(sensorId: string, callback: (data: SensorData) => void): () => void {
    if (!this.socket) {
      console.error('Socket not initialized');
      return () => {};
    }

    // Sensör odasına katıl
    this.socket.emit('join:sensor', sensorId);

    // Sensör veri güncellemelerini dinle
    const handler = (data: SensorData) => {
      if (data.sensorId === sensorId) {
        callback(data);
      }
    };
    
    this.socket.on('sensor:data', handler);

    // Cleanup fonksiyonu
    return () => {
      this.socket?.off('sensor:data', handler);
      this.socket?.emit('leave:sensor', sensorId);
    };
  }

  // Şirket bildirimlerine abone ol
  public subscribeToCompanyNotifications(companyId: string, callback: (notification: any) => void): () => void {
    if (!this.socket) {
      console.error('Socket not initialized');
      return () => {};
    }

    // Şirket odasına katıl
    this.socket.emit('join:company', companyId);

    // Bildirimleri dinle
    const handler = (notification: any) => {
      callback(notification);
    };
    
    this.socket.on('notification', handler);

    // Cleanup fonksiyonu
    return () => {
      this.socket?.off('notification', handler);
      this.socket?.emit('leave:company', companyId);
    };
  }

  // Sensör durumu değişikliklerini dinle
  public subscribeSensorStatus(callback: (data: { id: string; status: string }) => void): () => void {
    if (!this.socket) {
      console.error('Socket not initialized');
      return () => {};
    }

    this.socket.on('sensor:status', callback);

    return () => {
      this.socket?.off('sensor:status', callback);
    };
  }
}

export default SocketService.getInstance(); 