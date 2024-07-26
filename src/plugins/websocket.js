const WebSocketPlugin = {
    install(app) {
        const wsService = {
            sockets: {},
            messageHandlers: {},

            connect(url) {
                if (!this.sockets[url] || this.sockets[url].readyState === WebSocket.CLOSED) {
                    this.sockets[url] = new WebSocket(url);

                    this.sockets[url].onopen = () => {
                        console.log(`WebSocket connection opened for ${url}.`);
                    };

                    this.sockets[url].onmessage = (event) => {
                        console.log(`Message received from ${url}:`, event.data);
                        if (this.messageHandlers[url]) {
                            this.messageHandlers[url].forEach(handler => handler(event.data));
                        }
                    };

                    this.sockets[url].onclose = () => {
                        console.log(`WebSocket connection closed for ${url}.`);
                    };

                    this.sockets[url].onerror = (error) => {
                        console.error(`WebSocket error for ${url}:`, error);
                    };
                } else {
                    console.log(`WebSocket connection already exists for ${url}.`);
                }
            },

            sendMessage(url, message) {
                if (this.sockets[url] && this.sockets[url].readyState === WebSocket.OPEN) {
                    console.log(`Sending message to ${url}:`, message);
                    this.sockets[url].send(message);
                } else {
                    console.error(`WebSocket for ${url} is not open. Unable to send message:`, message);
                }
            },

            addMessageHandler(url, handler) {
                if (!this.messageHandlers[url]) {
                    this.messageHandlers[url] = [];
                }
                this.messageHandlers[url].push(handler);
                console.log(`Message handler added for ${url}.`);
            },

            removeMessageHandler(url, handler) {
                if (this.messageHandlers[url]) {
                    this.messageHandlers[url] = this.messageHandlers[url].filter(h => h !== handler);
                    console.log(`Message handler removed for ${url}.`);
                }
            },

            close(url) {
                if (this.sockets[url]) {
                    console.log(`Closing WebSocket connection for ${url}.`);
                    this.sockets[url].close();
                    delete this.sockets[url];
                    delete this.messageHandlers[url];
                }
            }
        };

        app.config.globalProperties.$initWebSocket = function(url) {
            console.log(`Initializing WebSocket connection for ${url}...`);
            wsService.connect(url);
        };

        app.config.globalProperties.$sendMessage = function(url, message) {
            wsService.sendMessage(url, message);
        };

        app.config.globalProperties.$closeWebSocket = function(url) {
            wsService.close(url);
        };

        app.config.globalProperties.$addMessageHandler = function(url, handler) {
            wsService.addMessageHandler(url, handler);
        };

        app.config.globalProperties.$removeMessageHandler = function(url, handler) {
            wsService.removeMessageHandler(url, handler);
        };

        app.mixin({
            beforeUnmount() {
                if (this.handleWebSocketMessage) {
                    Object.keys(wsService.messageHandlers).forEach(url => {
                        wsService.removeMessageHandler(url, this.handleWebSocketMessage);
                    });
                }
            }
        });
    }
};

export default WebSocketPlugin;
