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
        name: null,
        stonecolor: null,
        firststone: null
    },
    mutations: {
        setUuid(state, payload){
            state.uuid = payload.uuid;
        },
        setName(state, payload){
            state.name = payload.name;
        },
        setColor(state, payload){
            state.stonecolor = payload.stonecolor;
        },
        setFirststone(state, payload){
            state.firststone = payload;
        }

    },
    actions: {
        setupComputerGame(context, payload){
            const setupComputerGameDO = {
                name: payload.name,
                level: payload.level,
                stonecolor: payload.stonecolor,
                firststone: payload.firststone,
            }

            stompService.subscribe('/user/queue/reply', (response) => {
                // Hier die Antwort vom Server verarbeiten
                const data = JSON.parse(response.body);
                console.log("Response received: ", data);
                context.commit("setUuid", data.uuid);
                context.commit("setName", data.name);
                context.commit("setColor", data.stonecolor);
            });

            stompService.send('/manager/setup/computer',setupComputerGameDO)



        }
    },
    getters: {},
    plugins: [consoleLogger]
})

export default store;