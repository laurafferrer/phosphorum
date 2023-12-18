import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { IThread } from 'src/app/model/model.interfaces';
import { WebsocketService } from 'src/app/service/websocket.service';




@Component({
  selector: 'app-home-routed',
  templateUrl: './home-routed.component.html',
  styleUrls: ['./home-routed.component.css']
})

export class HomeRoutedComponent implements OnInit {

  idThread: number = 0;
  reloadThreads: Subject<boolean> = new Subject<boolean>();

  constructor(private websocketService: WebsocketService) { }

  ngOnInit() {
    // Suscríbete a los mensajes del WebSocket
    this.websocketService.getMessages().subscribe((message) => {
      console.log('Mensaje desde el servidor', message);

      // Aquí puedes realizar acciones en respuesta a los mensajes del servidor
      if (message.type === 'threadChange') {
        this.handleThreadChange(message.data);
      } else if (message.type === 'replyChange') {
        this.handleReplyChange();
      }
    });
  }

  // Método para manejar el cambio de hilo
  handleThreadChange(threadId: number): void {
    this.idThread = threadId;
  }

  // Método para manejar el cambio de respuesta
  handleReplyChange(): void {
    this.reloadThreads.next(true);
  }

  onThreadChange(oThread: IThread) {
    this.idThread = oThread.id;
  }

  onReplyChange(bReply: Boolean) {
    this.reloadThreads.next(true);
  }
}





