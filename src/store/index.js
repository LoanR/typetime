import Vue from 'vue';
import Vuex from 'vuex';

import {wordsMutations, wordsActions} from './words';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        wordsRelated: {
            wordsToType: [],
            nextWordsToType: [],
        },
    },
    mutations: {
        ...wordsMutations,
    },
    actions: {
        ...wordsActions,
    },
});

export default store;
