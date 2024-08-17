import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

class StompService {
    constructor() {
        this.client = null;
        this.connected = false;
        this.subscriptions = {};
    }

    connect(url) {
        return new Promise((resolve, reject) => {
            this.client = Stomp.over(new SockJS(url));
            this.client.connect({}, () => {
                this.connected = true;
                resolve();
            }, (error) => {
                this.connected = false;
                reject(error);
            });
        });
    }

    disconnect() {
        if (this.client) {
            this.client.disconnect();
            this.connected = false;
            console.log('Disconnected');
        }
    }

    subscribe(destination, callback) {
        if (!this.client || !this.connected) {
            throw new Error('Client is not connected');
        }
        const subscription = this.client.subscribe(destination, callback);
        this.subscriptions[destination] = subscription;
    }

    unsubscribe(destination) {
        if (this.subscriptions[destination]) {
            this.subscriptions[destination].unsubscribe();
            delete this.subscriptions[destination];
        }
    }

    send(destination, message) {
        if (this.client && this.connected) {
            this.client.send(destination, {}, JSON.stringify(message));
        } else {
            console.error('Client is not connected');
        }
    }
}

const stompService = new StompService();
export default stompService;