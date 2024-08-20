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
                context.commit("setUuid", data.uuid);
                context.commit("setPlayer1Name", data.player1Name);
                context.commit("setPlayer2Name", data.player2Name);
                context.commit("setColor", data.stonecolor);
                context.commit("setIndex", data.index);
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
        }
    },
    getters: {},
    plugins: [consoleLogger]
})


export default store;