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
        uuid: null,
        player1Name: null,
        player2Name: null,
        stonecolor: null,
        firststone: null,
        index: null,
        board: null
    },
    mutations: {
        setUuid(state, payload){
            state.uuid = payload.uuid;
            console.log(state.uuid)
        },
        setPlayer1Name(state, payload){
            state.player1Name = payload.player1Name;
        },
        setPlayer2Name(state, payload){
            state.player2Name = payload.player2Name;
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
        }
    },
    actions: {
        subscribeToServer(context) {
            stompService.subscribe('/user/queue/reply', (response) => {
                const data = JSON.parse(response.body);
                console.log("Response received: ", data);
                context.commit("setUuid", { uuid: data.uuid }); // Hier wird ein Objekt übergeben
                context.commit("setPlayer1Name", { player1Name: data.player1Name });
                context.commit("setPlayer2Name", { player2Name: data.player2Name });
                context.commit("setColor", { stonecolor: data.stonecolor });
                context.commit("setFirststone", { firststone: data.firststone });
                context.commit("setIndex", { index: data.index });
            });
        },
        setupComputerGame(context, payload){
            context.dispatch('subscribeToServer'); // Subscription wird einmal zentral aufgerufen
            const setupComputerGameDO = {
                name: payload.name,
                level: payload.level,
                stonecolor: payload.stonecolor,
                firststone: payload.firststone,
            }
            stompService.send('/manager/setup/computer', setupComputerGameDO)
        },
        setupLoginGameStart(context, payload){
            context.dispatch('subscribeToServer'); // Subscription wird einmal zentral aufgerufen
            stompService.send('/manager/setup/start', payload)
        },
        sendAction(context, payload){
            stompService.send('/game/action', payload)
        },
        updateBoard(context, payload){
            console.log(payload.board)
            context.commit("setBoard", {board: payload.boardPositionsStates});
        }

    },
    getters: {
        getBoard(state) {
            return state.board;
        }
    },
    plugins: [consoleLogger]
})


export default store;