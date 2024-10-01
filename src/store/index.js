import { createStore } from "vuex";
import stompService from "@/stomp/stompService";

const consoleLogger = (store) => {
    store.subscribe((mutation, state) => {
        console.log('Mutation:', mutation.type);
        console.log('Neuer State:', state);
    });
};


const store = createStore({
    state: {
        game: {board: {boardPositionsStates: null}, complete: false},
        index: null,
        running: false,
        chathistory: "",
        waitingForSecondPlayer: false
    },
    mutations: {
        setGame(state, payload) {
            state.game = payload.game;
        },
        setIndex(state, payload){
            state.index = payload.index;
        },
        setRunning(state, payload){
            state.running = payload.running;
        },
        addMessageToChatHistory(state, payload){
            if (state.chathistory !== ""){
                state.chathistory += "\n"
            }
            state.chathistory += payload.name + ": " + payload.message;
        },
        setWaitingForSecondPlayer(state, payload){
            state.waitingForSecondPlayer = payload.waitingForSecondPlayer;
        }
    },
    actions: {
        subscribeForSetupAnswer(context) {
            stompService.subscribe('/user/queue/reply', (response) => {
                const data = JSON.parse(response.body);
                console.log("Response received: ", data);
                context.commit("setGame", {game: data.game});
                context.commit("setIndex", { index: data.index });
                context.commit("setRunning", {running: true})
            });

        },
        subscribeForGameUpdate(context, gameCode){
            stompService.subscribe('/topic/game/'.concat(gameCode).concat('/gameupdate'), (response) => {
                const data = JSON.parse(response.body);
                console.log("Gameupdate: ", data);
                context.commit("setGame", {game: data.game});
                context.commit("setRunning", { running: data.game.pairing.player2 != null });

                const winnerIndex = data.game.gameState.winnerIndex;
                const playerIndex = context.state.index;

                if (winnerIndex !== 0) {
                    if (winnerIndex === playerIndex) {
                        alert("Gratuliere, du hast das Spiel gewonnen!");
                    } else {
                        alert("Du hast das Spiel leider verloren...");
                    }
                }

            })
        },
        subscribeForGameChat(context, gameCode){
            stompService.subscribe(`/topic/chat/${gameCode}/messages`, (response) => {
                const data = JSON.parse(response.body);
                console.log("Message ", data);
                context.commit('addMessageToChatHistory', data)

            });
        },
        async setupComputerGame(context, payload){
            try {
                const gameCode = await new Promise((resolve, reject) => {
                    stompService.subscribe('/user/queue/reply', (response) => {
                        try {
                            const data = JSON.parse(response.body);
                            console.log("Response received: ", data);
                            if (data.success){
                                context.commit("setGame", {game: data.game});
                                context.commit("setIndex", { index: data.index });
                                context.commit("setRunning", {running: true})
                                resolve(data.game.gameCode);} else {
                                reject(new Error(data.message || "Das Spiel konnte nicht eröffnet werden! Überprüfe deine Angaben..."));
                            }

                        } catch (error) {
                            reject(error);
                        }
                    });
                    stompService.send('/manager/setup/computer', payload);  // Anfrage senden
                });
                await context.dispatch('subscribeForGameUpdate', gameCode);
                await context.dispatch('subscribeForGameChat', gameCode)
            } catch (error) {
                console.log("Fehler bei der Verarbeitung:", error);
            }
        },
        async setupLoginGameStart(context, payload) {
            try {
                const gameCode = await new Promise((resolve, reject) => {
                    stompService.subscribe('/user/queue/reply', (response) => {
                        try {
                            const data = JSON.parse(response.body);
                            console.log("Response received: ", data);
                            if (data.success){
                                context.commit("setGame", {game: data.game});
                                context.commit("setIndex", { index: data.index });
                                context.commit("setWaitingForSecondPlayer", {waitingForSecondPlayer: true});

                                resolve(data.game.gameCode);
                            } else {
                                reject(new Error(data.errorMessage || "Das Spiel konnte nicht eröffnet werden! Überprüfe deine Angaben..."));
                            }

                        } catch (error) {
                            reject(error);
                        }
                    });
                    stompService.send('/manager/setup/start', payload);  // Anfrage senden
                });
                await context.dispatch('subscribeForGameUpdate', gameCode);
                await context.dispatch('subscribeForGameChat', gameCode)
            } catch (error) {
                alert(error.message)
                console.log("Fehler bei der Verarbeitung:", error);
            }
        },
        async setupLoginGameJoin(context, payload){
            try {
                const gameCode = await new Promise((resolve, reject) => {
                    stompService.subscribe('/user/queue/reply', (response) => {
                        try {
                            const data = JSON.parse(response.body);
                            console.log("Response received: ", data);
                            if (data.success){
                                context.commit("setGame", {game: data.game});
                                context.commit("setIndex", { index: data.index });
                                context.commit("setRunning", {running: true})
                                resolve(data.game.gameCode);
                            } else {
                                reject(new Error(data.errorMessage || "Dem Spiel konnte nicht beigetreten werden! Überprüfe deine Angaben..."));
                            }

                        } catch (error) {
                            reject(error);
                        }
                    });
                    stompService.send('/manager/setup/join', payload);  // Anfrage senden
                });
                await context.dispatch('subscribeForGameUpdate', gameCode);
                await context.dispatch('subscribeForGameChat', gameCode)
            } catch (error) {
                alert(error.message)
                console.log("Fehler bei der Verarbeitung:", error);
            }
        },
        async setupWatch(context, payload){
            try {
                const gameCode = await new Promise((resolve, reject) => {
                    stompService.subscribe('/user/queue/reply', (response) => {
                        try {
                            const data = JSON.parse(response.body);
                            console.log("Response received: ", data);
                            context.commit("setGame", {game: data.game});
                            context.commit("setIndex", { index: data.index });
                            context.commit("setRunning", {running: true})
                            resolve(data.game.gameCode);
                        } catch (error) {
                            reject(error);
                        }
                    });
                    stompService.send('/manager/setup/watch', payload);  // Anfrage senden
                });
                await context.dispatch('subscribeForGameUpdate', gameCode);
                await context.dispatch('subscribeForGameChat', gameCode)
            } catch (error) {
                console.log("Fehler bei der Verarbeitung:", error);
            }
        },
        sendAction(context, payload){
            stompService.send('/game/action', payload)
        },


    },
    getters: {
        getBoard(state) {
            return state.game.board.boardPositionsStates;
        },
        getGamecode(state){
            return state.game.gameCode;
        },
        getRound(state){
            return state.game.gameState.round;
        },
        getPhase(state){
            return state.index === 1 ? state.game.pairing.player1.currentPhase : state.game.pairing.player2.currentPhase;
        },
        getUuid(state){
            return state.index === 1 ? state.game.pairing.player1.uuid : state.game.pairing.player2.uuid;
        },
        getOwnName(state){
            if (state.index ===1){
                return state.game.pairing.player1.name
            } else if (state.index === 2){
                return state.game.pairing.player2.name
            } else {
                return "Zuschauer"
                //TODO: Eigenen Namen finden und zurückgeben
            }
        },
        getPlayer1Name(state){
            return state.game.pairing.player1.name;
        },
        getPlayer1Phase(state){
            return state.game.pairing.player1.currentPhase;
        },
        getPlayer1Color(state){
            return state.game.pairing.player1.stonecolor;
        },
        getPlayer1Put(state){
            return state.game.pairing.player1.numberOfStonesPut;
        },
        getPlayer1Lost(state){
            return state.game.pairing.player1.numberOfStonesLost;
        },
        getPlayer1Killed(state){
            return state.game.pairing.player1.numberOfStonesKilled;
        },
        getPlayer2Name(state){
            return state.game.pairing.player2?.name || "---";
        },
        getPlayer2Phase(state){
            return state.game.pairing.player2.currentPhase;
        },
        getPlayer2Color(state){
            return state.game.pairing.player2.stonecolor;
        },
        getPlayer2Put(state){
            return state.game.pairing.player2?.numberOfStonesPut || 0;
        },
        getPlayer2Lost(state){
            return state.game.pairing.player2?.numberOfStonesLost || 0;
        },
        getPlayer2Killed(state){
            return state.game.pairing.player2?.numberOfStonesKilled || 0;
        },
        getIndex(state){
            return state.index;
        },
        getCurrentIndex(state) {
            return state.game.pairing.currentPlayerIndex;
        },
        getRunning(state){
            return state.running;
        },
        getChathistory(state) {
            return state.chathistory;
        },
        getStateOnPosition: (state) => (ring, field) => {
            if (!state.game.board.boardPositionsStates) return null;
            if (
                ring >= 0 && ring < state.game.board.boardPositionsStates.length &&
                field >= 0 && field < state.game.board.boardPositionsStates[ring].length
            ) {
                return state.game.board.boardPositionsStates[ring][field];
            } else {
                return null;
            }
        },
        isFinished(state){
            return state.game.gameState.finished;
        },
        getSpectators(state){
            return state.game.spectators;
        },
        isWaitingForSecondPlayer(state){
            return state.waitingForSecondPlayer;
        }
    },
    plugins: [consoleLogger]
})


export default store;