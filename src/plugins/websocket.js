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
                }
            },

            sendMessage(url, message) {
                if (this.sockets[url] && this.sockets[url].readyState === WebSocket.OPEN) {
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
            },

            removeMessageHandler(url, handler) {
                if (this.messageHandlers[url]) {
                    this.messageHandlers[url] = this.messageHandlers[url].filter(h => h !== handler);
                }
            },

            close(url) {
                if (this.sockets[url]) {
                    this.sockets[url].close();
                    delete this.sockets[url];
                    delete this.messageHandlers[url];
                }
            }
        };

        // Expose WebSocket methods globally
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
