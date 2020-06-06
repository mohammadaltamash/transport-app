import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
// import { AppComponent } from './app.component';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Constants } from '../model/constants';
import { AppComponent } from '../app.component';
import { PagedOrders } from '../model/paged-orders';
import { EventMessages } from '../model/event-messages';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './authentication.service';

@Injectable({
    providedIn: 'root'
  })
export class MessageService {
    webSocketEndPoint = environment.MESSAGE_SERVICE_URL;
    topic = '/topic/message';
    stompClient: any;
    // appComponent: AppComponent;
    // constructor(appComponent: AppComponent){
    //     this.appComponent = appComponent;
    // }
    constructor(private apiService: ApiService,
                private authenticationService: AuthenticationService,
                private appComponent: AppComponent) {
        // this.connect();
        // this.authenticationService.currentUser.subscribe(user => {
        //     if (user === null) {
        //         // this._disconnect();
        //     } else {
        //         // this.connect();
        //     }
        // });
        this.connect();
    }
    connect() {
        console.log('Initialize WebSocket Connection');
        const ws = new SockJS(this.webSocketEndPoint);
        this.stompClient = Stomp.over(ws);
        const that = this;
        this.stompClient.connect({}, function (frame) {
            that.stompClient.subscribe(that.topic, function (sdkEvent) {
                that.onMessageReceived(sdkEvent);
            });
            //_this.stompClient.reconnect_delay = 2000;
        }, this.errorCallBack);
    }

    _disconnect() {
        if (this.stompClient !== null && this.stompClient !== undefined) {
            this.stompClient.disconnect();
        }
        console.log('Disconnected');
    }

    // on error, schedule a reconnection attempt
    errorCallBack(error) {
        console.log('errorCallBack -> ' + error)
        setTimeout(() => {
            this.connect();
        }, 5000);
    }

    /**
	 * Send message to sever via web socket
	 * @param {*} message
	 */
    _send(message) {
        console.log('calling logout api via web socket');
        // this.stompClient.send('/app/message', {}, JSON.stringify(message));
        this.stompClient.send('/app/message', {}, message);
    }

    onMessageReceived(message: string) {
        console.log('Message Recieved from Server :: ' + message);
        // this.appComponent.handleMessage(JSON.stringify(message.body));

        // if (message === EventMessages.NEW_ORDER) {
        // if (message.body === 'NEW_ORDER') {
        // alert(message);
        this.appComponent.setSystemMessageValue('NEW_ORDER');
        // this.apiService
        //       .getPagedOrders(0, Constants.ORDERS_PER_PAGE)
        //       // .pipe(takeUntil(this.destroy$))
        //       .subscribe((result: PagedOrders) => {
        //         this.appComponent.setCurrentOrdersValue(result.orders);
        //       });
        // const newCount = this.appComponent.currentNewValue + 1;
        // this.appComponent.setCurrentNewValue(newCount);
        // } else if (message.startsWith(EventMessages.ACCEPTED_COUNT)) {
        //     const acceptedCount = message.split('_')[1];
        //     this.appComponent.setCurrentNewValue(+acceptedCount);
        // }
    }
}
