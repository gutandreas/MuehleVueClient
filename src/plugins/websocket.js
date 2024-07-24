const WebSocketPlugin = {
    install(app, options) {
        const wsService = {
            socket: null,
            messageHandlers: [],

            connect() {
                if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
                    this.socket = new WebSocket(options.url);

                    this.socket.onopen = () => {
                        console.log('WebSocket connection opened.');
                    };

                    this.socket.onmessage = (event) => {
                        this.messageHandlers.forEach(handler => handler(event.data));
                    };

                    this.socket.onclose = () => {
                        console.log('WebSocket connection closed.');
                    };

                    this.socket.onerror = (error) => {
                        console.error('WebSocket error:', error);
                    };
                }
            },

            sendMessage(message) {
                if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                    this.socket.send(message);
                } else {
                    console.error('WebSocket is not open. Unable to send message:', message);
                }
            },

            addMessageHandler(handler) {
                this.messageHandlers.push(handler);
            },

            removeMessageHandler(handler) {
                this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
            },

            close() {
                if (this.socket) {
                    this.socket.close();
                }
            }
        };

        app.config.globalProperties.$initWebSocket = function() {
            console.log("Initializing websocket connection...");
            wsService.connect();
            if (this.handleWebSocketMessage) {
                wsService.addMessageHandler(this.handleWebSocketMessage);
            }
        };

        app.config.globalProperties.$sendMessage = function(message) {
            wsService.sendMessage(message);
        };

        app.config.globalProperties.$closeWebSocket = function() {
            wsService.close();
        };

        app.mixin({
            beforeUnmount() {
                if (this.handleWebSocketMessage) {
                    wsService.removeMessageHandler(this.handleWebSocketMessage);
                }
            }
        });
    }
};

export default WebSocketPlugin;
