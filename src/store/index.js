import { createStore } from "vuex";
import stompService from "@/stomp/stompService";


const store = createStore({
    state: {
        uuid: null,
        name: null,
        color: null
    },
    mutations: {
        setUuid(state, payload){
            state.uuid = payload.uuid;
            state.name = payload.name;
            state.color = payload.color;
        }

    },
    actions: {
        setupGame(context, payload){
            const setupDO = {
                name: payload.name,
                modus: payload.modus,
                level: payload.level,
                join: payload.join,
                color: payload.color,
                firststone: payload.firststone,
                gamecode: payload.gamecode
            }
            if (setupDO.modus === "c"){
                stompService.send("/manager/setup/computer", setupDO)
            } else if (setupDO.modus === "l"){
                if (setupDO.join === "s"){
                    stompService.send("/manager/setup/start", setupDO)
                }
                else {
                    stompService.send("/manager/setup/join", setupDO)
                }

            } else {
                console.log(+"Ungültiger Modus / ungültiges Join")
            }
        }
    },
    getters: {}
})

export default store;