import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IThread, IThreadPage } from '../model/model.interfaces';
import { API_URL } from 'src/environment/environment';
import { WebsocketService } from './websocket.service';

@Injectable({
    providedIn: 'root'
  })
export class ThreadAjaxService {

    sUrl: string = API_URL + "/thread";

    constructor(
        private oHttpClient: HttpClient,
        private websocketService: WebsocketService
    ) { 
    }

    getOne(id: number): Observable<IThread> {
        return this.oHttpClient.get<IThread>(this.sUrl + "/" + id);
    }

    getPage(size: number | undefined, page: number | undefined, orderField: string, orderDirection: string, id_user: number, strFilter?: string): Observable<IThreadPage> {
        if (!size) size = 10;
        if (!page) page = 0;
        let strUrlUser = "";
        if (id_user > 0) {
          strUrlUser = "&user=" + id_user;
        }
      
        let sUrl_filter: string;
        if (strFilter && strFilter.trim().length > 0) {
          sUrl_filter = `&filter=${strFilter}`;
        } else {
          sUrl_filter = "";
        }
      
        return this.oHttpClient.get<IThreadPage>(
          `${this.sUrl}?size=${size}&page=${page}&sort=${orderField},${orderDirection}${strUrlUser}${sUrl_filter}`
        );
      }
      

    removeOne(id: number | undefined): Observable<number> {
        if (id) {
            return this.oHttpClient.delete<number>(this.sUrl + "/" + id);
        } else {
            return new Observable<number>();
        }
    }

    newOne(oThread: IThread): Observable<IThread> {
        return this.oHttpClient.post<IThread>(this.sUrl, oThread);
    }

    updateOne(oThread: IThread): Observable<IThread> {
        return this.oHttpClient.put<IThread>(this.sUrl, oThread);
    }

    generateRandom(amount: number): Observable<number> {
        return this.oHttpClient.post<number>(this.sUrl + "/populate/" + amount, null);
    }

    getPageByRepliesNumberDesc(size: number | undefined, page: number | undefined, id_user: number): Observable<IThreadPage> {
        if (!size) size = 10;
        if (!page) page = 0;
        let strUrlUser = "";
        if (id_user > 0) {
            strUrlUser = "&user=" + id_user;
        }
        return this.oHttpClient.get<IThreadPage>(this.sUrl + "/byRepliesNumberDesc?size=" + size + "&page=" + page + strUrlUser);
    }

    empty(): Observable<number> {
        return this.oHttpClient.delete<number>(this.sUrl + "/empty");
    }

}
