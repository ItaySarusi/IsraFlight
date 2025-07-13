import * as signalR from '@microsoft/signalr';
import { store } from '../store';
import { setConnectionStatus } from '../store/slices/connectionSlice';

class SignalRService {
  private connection: signalR.HubConnection;

  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5000/flightHub')
      .withAutomaticReconnect()
      .build();

    this.connection.onreconnecting(() => {
      store.dispatch(setConnectionStatus(false));
    });

    this.connection.onreconnected(() => {
      store.dispatch(setConnectionStatus(true));
    });

    this.connection.onclose(() => {
      store.dispatch(setConnectionStatus(false));
    });
  }

  public async startConnection() {
    try {
      await this.connection.start();
      store.dispatch(setConnectionStatus(true));
    } catch (error) {
      console.error('Error starting SignalR connection:', error);
      store.dispatch(setConnectionStatus(false));
    }
  }

  public async stopConnection() {
    try {
      await this.connection.stop();
      store.dispatch(setConnectionStatus(false));
    } catch (error) {
      console.error('Error stopping SignalR connection:', error);
    }
  }

  public onFlightStatusUpdated(callback: (flightId: string, newStatus: string) => void) {
    this.connection.on('FlightStatusUpdated', callback);
  }
}

export const signalRService = new SignalRService(); 