import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PaginatorState } from 'primeng/paginator';
import { IUser, IUserPage } from 'src/app/model/model.interfaces';
import { UserAjaxService } from 'src/app/service/user.ajax.service.service';
import { WebsocketService } from 'src/app/service/websocket.service';

@Component({
  selector: 'app-user-user-featured-unrouted',
  templateUrl: './user-user-featured-unrouted.component.html',
  styleUrls: ['./user-user-featured-unrouted.component.css']
})

export class UserUserFeaturedUnroutedComponent implements OnInit {

  oPage: IUserPage | undefined;
  oPaginatorState: PaginatorState = { first: 0, rows: 100, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  oUserToRemove: IUser | null = null;

  constructor(
    private oWebsocketService: WebsocketService,
  ) { }

  ngOnInit() {
    this.setupWebsocket();
  }


  private setupWebsocket(): void {
    this.oWebsocketService.getMessages().subscribe((message) =>{
      console.log('Mensaje desde el servidor', message);
       // Actualiza la interfaz de usuario
       if (message.type === 'updateUserList') {
        // Actualizar la lista de usuarios
        this.oPage = message.data as IUserPage;
      } else if (message.type === 'removeUser') {
        // Remover un usuario de la lista
        const userIdToRemove = message.data.userId;
        if (this.oPage) {
          this.oPage.content = this.oPage.content.filter(u => u.id !== userIdToRemove);
        }
      }
    });
  }

}
