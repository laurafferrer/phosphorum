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
import { webSocket, WebSocketSubject } from 'rxjs/webSocket'; // Import WebSocket-related modules

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

  private socket$: WebSocketSubject<SessionEvent>; // WebSocket subject

  constructor(
    private oSessionService: SessionAjaxService,
    public oDialogService: DialogService,
    private oUserAjaxService: UserAjaxService,
    private oRouter: Router,
    private oTranslocoService: TranslocoService,
    private oLanguageService: LanguageService
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

    // Initialize WebSocket connection
    this.socket$ = webSocket('ws://localhost:8083/ws'); 
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
      this.socket$.next({ type: 'custom-event'});
    }
    return false;
  }

  changeSiteLanguage(language: Language): void {
    this.oTranslocoService.setActiveLang(language.code);
  }

  ngOnDestroy() {
    this.socket$.complete(); 
  }

}