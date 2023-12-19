import { StompConfig } from '@stomp/ng2-stompjs';

export const stompConfig: StompConfig = {
    url: 'ws://localhost:8083/ws', 
    headers: {},
    heartbeat_in: 0,
    heartbeat_out: 20000,
    reconnect_delay: 5000,
    debug: true,
};
