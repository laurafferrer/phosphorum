import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { IThread, IThreadPage, IUser } from 'src/app/model/model.interfaces';
import { ThreadAjaxService } from 'src/app/service/thread.ajax.service.service';
import { SessionAjaxService } from 'src/app/service/session.ajax.service.ts.service';
import { WebsocketService } from 'src/app/service/websocket.service';

@Component({
  providers: [ConfirmationService],
  selector: 'app-user-thread-featured-unrouted',
  templateUrl: './user-thread-featured-unrouted.component.html',
  styleUrls: ['./user-thread-featured-unrouted.component.css']
})

export class UserThreadFeaturedUnroutedComponent implements OnInit {

  oPage: IThreadPage | undefined;
  oUser: IUser | null = null; // data of user if id_user is set for filter
  orderField: string = "id";
  orderDirection: string = "desc";
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  oThreadToRemove: IThread | null = null;
  ref: DynamicDialogRef | undefined;

  constructor(
    public oSessionService: SessionAjaxService,
    private oThreadAjaxService: ThreadAjaxService,
    public oDialogService: DialogService,
    private oWebSocketService: WebsocketService
  ) { }

  ngOnInit() {
    this.getPage();

    // Suscríbete a los mensajes del WebSocket
    this.oWebSocketService.getMessages().subscribe((message) => {
      console.log('Mensaje desde el servidor', message);
      // Actualiza la interfaz de usuario según el tipo de mensaje recibido
      if (message.type === 'updateThread') {
        this.handleUpdateThread(message.data);
      } else if (message.type === 'deleteThread') {
        this.handleDeleteThread(message.data.threadId);
      }
    });
  }

  // Método para manejar la actualización de un hilo
  handleUpdateThread(updatedThreadData: IThread): void {
    // Encuentra y actualiza el hilo en la interfaz de usuario
    const updatedThreadIndex = this.oPage?.content.findIndex(t => t.id === updatedThreadData.id);
    if (updatedThreadIndex !== undefined && updatedThreadIndex !== -1) {
      this.oPage!.content[updatedThreadIndex] = { ...this.oPage!.content[updatedThreadIndex], ...updatedThreadData };
    }
  }

  // Método para manejar la eliminación de un hilo
  handleDeleteThread(threadId: number): void {
    // Elimina el hilo de la interfaz de usuario
    this.oPage!.content = this.oPage!.content.filter(t => t.id !== threadId);
  }

  getPage(): void {
    this.oThreadAjaxService.getPageByRepliesNumberDesc(this.oPaginatorState.rows, this.oPaginatorState.page, 0).subscribe({
      next: (data: IThreadPage) => {
        this.oPage = data;
        this.oPaginatorState.pageCount = data.totalPages;
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }
    })
  }





}