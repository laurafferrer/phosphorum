import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  connect() {
      throw new Error('Method not implemented.');
  }
  private socket$: WebSocketSubject<any> | undefined;
  private messagesSubject = new Subject<any>();

  constructor() {
    this.setupWebSocket();
  }

  private setupWebSocket(): void {
    this.socket$ = webSocket('ws://localhost:8080');

    this.socket$.subscribe(
      (message) => this.messagesSubject.next(message),
      (error) => console.error('WebSocket Error:', error),
      () => {
        console.warn('WebSocket closed unexpectedly. Reconnecting...');
        this.setupWebSocket(); // Reconnect on close
      }
    );
  }

  public getMessages(): Observable<any> {
    return this.messagesSubject.asObservable();
  }

  public sendMessage(message: any): void {
    if (this.socket$) {
      this.socket$.next(message);
    } else {
      console.error('WebSocket is not connected.');
    }
  }

  public disconnect(): void {
    if (this.socket$) {
      this.socket$.complete();
    }
  }
}
