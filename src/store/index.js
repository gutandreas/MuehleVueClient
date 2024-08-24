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
        game: {board: null},
        index: null,
        running: false,
        chathistory: "",
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
            state.chathistory += payload.name + ": " + payload.message + "\n";
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
                            context.commit("setGame", {game: data.game});
                            context.commit("setIndex", { index: data.index });
                            context.commit("setRunning", {running: true})
                            resolve(data.game.gameCode);
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
                // Schritt 1: Abonniere und warte auf die Setup-Antwort
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
                    stompService.send('/manager/setup/start', payload);  // Anfrage senden
                });
                await context.dispatch('subscribeForGameUpdate', gameCode);
                await context.dispatch('subscribeForSecondPlayer', gameCode);
                await context.dispatch('subscribeForGameChat', gameCode)
            } catch (error) {
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
                            context.commit("setGame", {game: data.game});
                            context.commit("setIndex", { index: data.index });
                            context.commit("setRunning", {running: true})
                            resolve(data.game.gameCode);
                        } catch (error) {
                            reject(error);
                        }
                    });
                    stompService.send('/manager/setup/join', payload);  // Anfrage senden
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
            return state.game.board;
        },
        getGamecode(state){
            return state.game.gameCode;
        },
        getRound(state){
            return state.game.round;
        },
        getPhase(state){
            return state.index === 1 ? state.game.pairing.player1.currentPhase : state.game.pairing.player2.currentPhase;
        },
        getUuid(state){
            return state.index === 1 ? state.game.pairing.player1.uuid : state.game.pairing.player2.uuid;
        },
        getOwnName(state){
            return state.index === 1 ? state.game.pairing.player1.name : state.game.pairing.player2.name;
        },
        getPlayer1Name(state){
            return state.game.pairing.player1.name;
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
            return state.game.pairing.player2.name;
        },
        getPlayer2Put(state){
            return state.game.pairing.player2.numberOfStonesPut;
        },
        getPlayer2Lost(state){
            return state.game.pairing.player2.numberOfStonesLost;
        },
        getPlayer2Killed(state){
            return state.game.pairing.player2.numberOfStonesKilled;
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
        }
    },
    plugins: [consoleLogger]
})


export default store;