import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IUser, SessionEvent } from 'src/app/model/model.interfaces';
import { SessionAjaxService } from 'src/app/service/session.ajax.service.ts.service';
import { UserAjaxService } from 'src/app/service/user.ajax.service.service';
import { UserUserDetailUnroutedComponent } from '../../user/user-user-detail-unrouted/user-user-detail-unrouted.component';
import { NavigationEnd, Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { Language } from 'src/app/model/model.interfaces';
import { LanguageService } from 'src/app/service/language.service';
import { WebsocketService } from 'src/app/service/websocket.service';

@Component({
  selector: 'app-menu-unrouted',
  templateUrl: './menu-unrouted.component.html',
  styleUrls: ['./menu-unrouted.component.css']
})
export class MenuUnroutedComponent implements OnInit {

  strUserName: string = "";
  oSessionUser: IUser | null = null;
  strUrl: string = "";
  lang: string = "";
  languages: Language[] = [];
  selectedLanguage: Language | null = null;

  constructor(
    private oSessionService: SessionAjaxService,
    public oDialogService: DialogService,
    private oUserAjaxService: UserAjaxService,
    private oRouter: Router,
    private oTranslocoService: TranslocoService,
    private oLanguageService: LanguageService,
    private oWebSocketService: WebsocketService
  ) {

    this.oRouter.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        this.strUrl = ev.url;
      }
    })

    this.strUserName = oSessionService.getUsername();
    this.oUserAjaxService.getByUsername(this.oSessionService.getUsername()).subscribe({
      next: (oUser: IUser) => {
        this.oSessionUser = oUser;
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    });

    // Suscríbete a los mensajes del WebSocket
    this.oWebSocketService.getMessages().subscribe((message) => {
      console.log('Mensaje desde el servidor', message);

      // Aquí puedes realizar acciones en respuesta a los mensajes del servidor
      if (message.type === 'someMessageType') {
        this.handleSomeMessageType(message.data);
      }
    });
  }

  handleSomeMessageType(data: any): void {
    switch (data.messageType) {
      case 'UpdateUserInfo':
        // Realiza acciones específicas para actualizar la información del usuario
        console.log('Actualizando información del usuario:', data.userData);
        break;
      
      case 'NewNotification':
        // Realiza acciones específicas para manejar una nueva notificación
        console.log('Nueva notificación recibida:', data.notification);
        break;
  
      default:
        // Tipo de mensaje no reconocido
        console.warn('Tipo de mensaje no reconocido:', data);
        break;
    }
  }

  ngOnInit() {
    this.oSessionService.on().subscribe({
      next: (data: SessionEvent) => {
        if (data.type == 'login') {
          this.strUserName = this.oSessionService.getUsername();
          this.oUserAjaxService.getByUsername(this.oSessionService.getUsername()).subscribe({
            next: (oUser: IUser) => {
              this.oSessionUser = oUser;
            },
            error: (error: HttpErrorResponse) => {
              console.log(error);
            }
          });
        }
        if (data.type == 'logout') {
          this.strUserName = "";
        }
      }
    });

    this.oLanguageService.getAllLanguages().subscribe({
      next: (values: Language[]) => {
        this.languages = values;

        const defaultLanguage = this.oLanguageService.getDefaultLanguage();
        this.oTranslocoService.setDefaultLang(defaultLanguage.code);
        this.oTranslocoService.setActiveLang(defaultLanguage.code);
        this.selectedLanguage = defaultLanguage;
      }
    })

    this.lang = this.oTranslocoService.getActiveLang();
    const activeLanguage = this.oLanguageService.getLanguageByCode(this.lang);
    this.selectedLanguage = activeLanguage || this.oLanguageService.getDefaultLanguage();
  }

  doSessionUserView($event: Event) {
    if (this.oSessionUser) {
      let ref: DynamicDialogRef | undefined;
      ref = this.oDialogService.open(UserUserDetailUnroutedComponent, {
        data: {
          id: this.oSessionUser.id
        },
        header: this.oTranslocoService.translate('global.view') + ' ' + this.oTranslocoService.translate('user.lowercase.singular'),
        width: '50%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: false
      });
    }
    return false;
    //$event.preventDefault
  }

  changeSiteLanguage(language: Language): void {
    this.oTranslocoService.setActiveLang(language.code);
  }

}


