import Vue from 'vue';
import Vuex from 'vuex';

// import SocketStore from './modules/SocketStore.js'
import draftStore from './modules/draftStore.js'
import userStore from './modules/UserStore'


Vue.use(Vuex)

export default new Vuex.Store({
    strict: true,
    modules: {
        draftStore,
        userStore
    }
})