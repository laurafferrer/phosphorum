import { webSocket } from 'rxjs/webSocket';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, Optional } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IReply } from 'src/app/model/model.interfaces';
import { ReplyAjaxService } from 'src/app/service/reply.ajax.service.service';

@Component({
  selector: 'app-user-reply-detail-unrouted',
  templateUrl: './user-reply-detail-unrouted.component.html',
  styleUrls: ['./user-reply-detail-unrouted.component.css']
})

export class UserReplyDetailUnroutedComponent implements OnInit {

  @Input() id: number = 1;

  oReply: IReply = { user: {}, thread: {} } as IReply;
  status: HttpErrorResponse | null = null;

  private webSocket!: WebSocket;

  constructor(
    private oReplyAjaxService: ReplyAjaxService,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig
  ) {
    if (config) {
      if (config.data) {
        this.id = config.data.id;
      }
    }
  }

  ngOnInit() {
    this.getOne();
    this.setupWebSocket();
  }

  getOne(): void {
    this.oReplyAjaxService.getOne(this.id).subscribe({
      next: (data: IReply) => {
        this.oReply = data;
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }

    })

  }

  private setupWebSocket(): void {
    const wsUrl = 'ws://localhost:8083/ws';
    this.webSocket = new WebSocket(wsUrl);

    this.webSocket.onopen = (event) => {
      console.log('WebSocket connection opened:', event);
      // You can send a message when the WebSocket connection is opened
      // this.webSocket.send('Hello WebSocket!');
    };

    this.webSocket.onmessage = (event) => {
      console.log('WebSocket message received:', event.data);
      // Handle incoming WebSocket messages here
    };

    this.webSocket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
    };

    this.webSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  ngOnDestroy() {
    // Close WebSocket connection when the component is destroyed
    if (this.webSocket) {
      this.webSocket.close();
    }
  }

}
