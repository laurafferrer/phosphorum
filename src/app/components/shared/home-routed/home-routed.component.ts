import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { IThread } from 'src/app/model/model.interfaces';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';




@Component({
  selector: 'app-home-routed',
  templateUrl: './home-routed.component.html',
  styleUrls: ['./home-routed.component.css']
})

export class HomeRoutedComponent implements OnInit {

  idThread: number = 0;
  reloadThreads: Subject<boolean> = new Subject<boolean>();
  private socket$: WebSocketSubject<any>;

  constructor() {
    this.socket$ = webSocket('ws://localhost:8083/ws');
    this.subscribeToWebSocket();

   }

  ngOnInit() {
  }

  onThreadChange(oThread: IThread) {
    this.idThread = oThread.id;
  }

  onReplyChange(bReply: Boolean) {
    this.reloadThreads.next(true);
    this.socket$.next({
      type: 'replyUpdate',
      data: { replyChanged: bReply }
    });
  }

  // Función para suscribirse a los mensajes WebSocket
  private subscribeToWebSocket(): void {
    this.socket$.subscribe(
      {
        next: (message: WebSocketMessage) => {
          // Manejar mensajes WebSocket entrantes
          console.log('WebSocket message received:', message);
  
          // Recargar los threads cuando se recibe un mensaje
          if (message.type === 'threadUpdate') {
            this.reloadThreads.next(true);
          }
        },
        error: (error: WebSocketErrorEvent) => {
          console.error('WebSocket error:', error);
        },
        complete: () => {
          console.log('WebSocket connection closed');
        }
      }
    );
  }

  ngOnDestroy() {
    // Close the WebSocket connection when the component is destroyed
    this.socket$.complete();
  }
  
}

// Define los tipos para los mensajes WebSocket fuera del constructor
interface WebSocketMessage {
  type: string;
  // Agrega otros campos según la estructura de tus mensajes
}

// Define el tipo para eventos de error WebSocket fuera del constructor
interface WebSocketErrorEvent extends Event {
  error: any;
}