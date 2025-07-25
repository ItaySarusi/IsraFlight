import * as signalR from '@microsoft/signalr';
// Removed: import { setConnectionStatus } from '../store/slices/connectionSlice';

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private isConnecting = false;
  protected static instance: SignalRService | null = null;

  public static getInstance(): SignalRService {
    if (!SignalRService.instance) {
      SignalRService.instance = new SignalRService();
    }
    return SignalRService.instance;
  }

  constructor() {
    if (SignalRService.instance) {
      return SignalRService.instance;
    }
    SignalRService.instance = this;
    this.initializeConnection();
  }

  private initializeConnection() {
    console.log('SignalR: Initializing connection...');
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5001/flightHub')
      .withAutomaticReconnect([0, 2000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Information) // Reduce logging noise
      .build();

    this.connection.onreconnecting(() => {
      console.log('SignalR: Reconnecting...');
      // Removed: store.dispatch(setConnectionStatus(false));
    });

    this.connection.onreconnected(() => {
      console.log('SignalR: Reconnected');
      // Removed: store.dispatch(setConnectionStatus(true));
    });

    this.connection.onclose(() => {
      console.log('SignalR: Connection closed');
      // Removed: store.dispatch(setConnectionStatus(false));
    });
  }

  public async startConnection() {
    if (!this.connection) {
      this.initializeConnection();
    }

    if (this.isConnecting) {
      console.log('SignalR: Already connecting, skipping...');
      return;
    }

    if (this.connection!.state === signalR.HubConnectionState.Connected) {
      console.log('SignalR: Already connected');
      return;
    }

    if (this.connection!.state === signalR.HubConnectionState.Connecting) {
      console.log('SignalR: Already in connecting state, skipping...');
      return;
    }

    try {
      this.isConnecting = true;
      console.log('SignalR: Starting connection...');
      
      // Add a small delay to prevent race conditions
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Check if backend is available first
      const response = await fetch('http://localhost:5001/flightHub/negotiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Backend not available: ${response.status}`);
      }
      
      await this.connection!.start();
      console.log('SignalR: Connection started successfully');
      // Removed: store.dispatch(setConnectionStatus(true));
    } catch (error) {
      console.error('Error starting SignalR connection:', error);
      // Removed: store.dispatch(setConnectionStatus(false));
    } finally {
      this.isConnecting = false;
    }
  }

  public async stopConnection() {
    if (!this.connection) {
      return;
    }

    try {
      this.isConnecting = false;
      await this.connection.stop();
      console.log('SignalR: Connection stopped');
      // Removed: store.dispatch(setConnectionStatus(false));
    } catch (error) {
      console.error('Error stopping SignalR connection:', error);
    }
  }

  public onFlightStatusUpdated(callback: (flightId: string, newStatus: string) => void) {
    if (this.connection) {
      this.connection.on('FlightStatusUpdated', callback);
    }
  }

  public onFlightStatusesUpdated(callback: (statusChanges: any[]) => void) {
    if (this.connection) {
      this.connection.on('FlightStatusesUpdated', callback);
    }
  }

  public onFlightAdded(callback: (flight: any) => void) {
    if (this.connection) {
      this.connection.on('FlightAdded', callback);
    }
  }

  public onFlightDeleted(callback: (flightId: string) => void) {
    if (this.connection) {
      this.connection.on('FlightDeleted', callback);
    }
  }

  public async joinFlightBoard() {
    if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
      await this.connection.invoke('JoinFlightBoard');
    }
  }

  public getConnectionState() {
    return this.connection?.state || signalR.HubConnectionState.Disconnected;
  }

  public async testConnection() {
    try {
      const response = await fetch('http://localhost:5001/flightHub/negotiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('SignalR: Negotiation successful:', data);
        return true;
      } else {
        console.error('SignalR: Negotiation failed:', response.status, response.statusText);
        return false;
      }
    } catch (error) {
      console.error('SignalR: Connection test failed:', error);
      return false;
    }
  }
}

export const signalRService = SignalRService.getInstance(); 