import { NgModule } from '@angular/core';
import { StompConfig } from '@stomp/ng2-stompjs';
import { stompConfig } from './websocket.config';

@NgModule({
    providers: [
        { provide: StompConfig, useValue: stompConfig },
    ],
})
export class WebSocketModule {}
