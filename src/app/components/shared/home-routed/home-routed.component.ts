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

    this.socket$.subscribe(
      (message: WebSocketMessage) => {
        // Handle incoming WebSocket messages
        console.log('WebSocket message received:', message);
    
        // Example: Trigger a thread reload when a message is received
        if (message.type === 'threadUpdate') {
          this.reloadThreads.next(true);
        }
      },
      (error: WebSocketErrorEvent) => {
        console.error('WebSocket error:', error);
      },
      () => {
        console.log('WebSocket connection closed');
      }
    );

    // Define los tipos para los mensajes WebSocket
    interface WebSocketMessage {
      type: string;
      // Agrega otros campos según la estructura de tus mensajes
    }

    // Define el tipo para eventos de error WebSocket
    interface WebSocketErrorEvent extends Event {
      error: any;
    }
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

  ngOnDestroy() {
    // Close the WebSocket connection when the component is destroyed
    this.socket$.complete();
  }

}