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
        gamecode: null,
        round: 0,
        uuid: null,
        phase: null,
        player1Name: null,
        player1Put: 0,
        player1Lost: 0,
        player1Killed: 0,
        player2Name: null,
        player2Put: 0,
        player2Lost: 0,
        player2Killed: 0,
        stonecolor: null,
        firststone: null,
        index: null,
        board: null,
        running: false,
        chathistory: "",
    },
    mutations: {
        setGamecode(state, payload) {
            state.gamecode = payload.gameCode;
        },
        setRound(state, payload) {
            state.round = payload.round;
        },
        setUuid(state, payload){
            state.uuid = payload.uuid;
            console.log(state.uuid)
        },
        setPhase(state, payload) {
            state.phase = payload.phase;
        },
        setPlayer1Name(state, payload){
            state.player1Name = payload.player1Name;
        },
        setPlayer1Put(state, payload){
            state.player1Put = payload.player1Put;
        },
        setPlayer1Lost(state, payload){
            state.player1Lost = payload.player1Lost;
        },
        setPlayer1Killed(state, payload){
            state.player1Killed = payload.player1Killed;
        },
        setPlayer2Name(state, payload){
            state.player2Name = payload.player2Name;
        },
        setPlayer2Put(state, payload){
            state.player2Put = payload.player2Put;
        },
        setPlayer2Lost(state, payload){
            state.player2Lost = payload.player2Lost;
        },
        setPlayer2Killed(state, payload){
            state.player2Killed = payload.player2Killed;
        },
        setColor(state, payload){
            state.stonecolor = payload.stonecolor;
        },
        setFirststone(state, payload){
            state.firststone = payload.firststone;
        },
        setIndex(state, payload){
            state.index = payload.index;
        },
        setBoard(state, payload){
            state.board = payload.board;
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
                context.commit("setGamecode", {gameCode: data.gameCode});
                context.commit("setUuid", { uuid: data.uuid });
                context.commit("setPlayer1Name", { player1Name: data.player1Name });
                context.commit("setPlayer2Name", { player2Name: data.player2Name });
                context.commit("setColor", { stonecolor: data.stonecolor });
                context.commit("setFirststone", { firststone: data.firststone });
                context.commit("setIndex", { index: data.index });
                context.commit("setRunning", {running: true})
            });

        },
        subscribeForGameUpdate(context, gameCode){
            stompService.subscribe('/topic/game/'.concat(gameCode).concat('/gameupdate'), (response) => {
                const data = JSON.parse(response.body);
                console.log("Gameupdate: ", data);
            })
        },
        subscribeForSecondPlayer(context, gameCode){
            stompService.subscribe(`/topic/game/${gameCode}/secondplayer`, (response) => {
                const data = JSON.parse(response.body);
                console.log("Second Player: ", data);
                context.commit("setRunning", {running: true});
            });

            console.log(`Subscribed to /topic/game/${gameCode}/secondplayer`); // Log hinzufügen
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
                            context.commit("setGamecode", { gameCode: data.gameCode });
                            context.commit("setUuid", { uuid: data.uuid });
                            context.commit("setPlayer1Name", { player1Name: data.player1Name });
                            context.commit("setPlayer2Name", { player2Name: data.player2Name });
                            context.commit("setColor", { stonecolor: data.stonecolor });
                            context.commit("setFirststone", { firststone: data.firststone });
                            context.commit("setIndex", { index: data.index });
                            context.commit("setRunning", { running: true });
                            resolve(data.gameCode);  // Hier wird das Promise aufgelöst und der gameCode zurückgegeben
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
                            context.commit("setGamecode", { gameCode: data.gameCode });
                            context.commit("setUuid", { uuid: data.uuid });
                            context.commit("setPlayer1Name", { player1Name: data.player1Name });
                            context.commit("setPlayer2Name", { player2Name: data.player2Name });
                            context.commit("setColor", { stonecolor: data.stonecolor });
                            context.commit("setFirststone", { firststone: data.firststone });
                            context.commit("setIndex", { index: data.index });
                            context.commit("setRunning", { running: true });
                            resolve(data.gameCode);  // Hier wird das Promise aufgelöst und der gameCode zurückgegeben
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
                            context.commit("setGamecode", { gameCode: data.gameCode });
                            context.commit("setUuid", { uuid: data.uuid });
                            context.commit("setPlayer1Name", { player1Name: data.player1Name });
                            context.commit("setPlayer2Name", { player2Name: data.player2Name });
                            context.commit("setColor", { stonecolor: data.stonecolor });
                            context.commit("setFirststone", { firststone: data.firststone });
                            context.commit("setIndex", { index: data.index });
                            context.commit("setRunning", { running: true });
                            resolve(data.gameCode);  // Hier wird das Promise aufgelöst und der gameCode zurückgegeben
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
        updateGame(context, payload){
            console.log(payload)
            context.commit("setBoard", {board: payload.board.boardPositionsStates});
            context.commit("setPlayer1Put", {player1Put: payload.player1.numberOfStonesPut});
            context.commit("setPlayer1Lost", {player1Lost: payload.player1.numberOfStonesLost})
            context.commit("setPlayer1Killed", {player1Killed: payload.player1.numberOfStonesKilled})
            context.commit("setPlayer2Put", {player2Put: payload.player2.numberOfStonesPut});
            context.commit("setPlayer2Lost", {player2Lost: payload.player2.numberOfStonesLost})
            context.commit("setPlayer2Killed", {player2Killed: payload.player2.numberOfStonesKilled})
            context.commit("setRound", {round: payload.round})
        },


    },
    getters: {
        getBoard(state) {
            return state.board;
        },
        getGamecode(state){
            return state.gamecode
        },
        getRound(state){
            return state.round;
        },
        getUuid(state){
            return state.uuid;
        },
        getPlayer1Name(state){
            return state.player1Name;
        },
        getPlayer1Put(state){
            return state.player1Put;
        },
        getPlayer1Lost(state){
            return state.player1Lost;
        },
        getPlayer1Killed(state){
            return state.player1Killed;
        },
        getPlayer2Name(state){
            return state.player2Name;
        },
        getPlayer2Put(state){
            return state.player2Put;
        },
        getPlayer2Lost(state){
            return state.player2Lost;
        },
        getPlayer2Killed(state){
            return state.player2Killed;
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