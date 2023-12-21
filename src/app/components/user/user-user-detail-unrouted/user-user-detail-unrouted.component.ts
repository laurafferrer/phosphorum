import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, Optional } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IUser } from 'src/app/model/model.interfaces';
import { UserAjaxService } from '../../../service/user.ajax.service.service';
import { WebsocketService } from '../../../service/websocket.service';

@Component({
  selector: 'app-user-user-detail-unrouted',
  templateUrl: './user-user-detail-unrouted.component.html',
  styleUrls: ['./user-user-detail-unrouted.component.css']
})
export class UserUserDetailUnroutedComponent implements OnInit {

  @Input() id: number = 1;

  oUser: IUser = {} as IUser;
  status: HttpErrorResponse | null = null;

  constructor(
    private oWebSocketService: WebsocketService,
    @Optional() public ref:DynamicDialogRef,
    @Optional() public config:DynamicDialogConfig
  ) {     
    if (config){
      if (config.data){
        this.id = config.data.id;
      }
    }    
  }

  ngOnInit() {
    console.log(this.id);

     // Suscribirse a los mensajes del WebSocket
    this.oWebSocketService.getMessages().subscribe((message) => {
      console.log('Mensaje desde el servidor', message);
      // Actualiza la interfaz de usuario según el tipo de mensaje recibido
      if (message.type === 'updateUser') {
        this.updateUser(message.data);
      } else if (message.type === 'userDeleted') {
        this.handleUserDeleted(message.data.userId);
      }
    });
  }

  // Método para actualizar información del usuario
  updateUser(updatedUserData: IUser): void {
    // Encuentra y actualiza el usuario en la interfaz de usuario
    this.oUser = { ...this.oUser, ...updatedUserData };
  }

  // Método para manejar la eliminación de un usuario
  handleUserDeleted(userId: number): void {
    // Si el usuario eliminado es el usuario actual, puedes cerrar el componente o realizar alguna otra acción
    if (this.oUser.id === userId) {
      this.ref?.close();
    }
  }
}