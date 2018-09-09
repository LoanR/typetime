import Vue from 'vue';
import Vuex from 'vuex';

import {wordsMutations, wordsActions} from './words';
import {rulesMutations} from './rules';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        wordsRelated: {
            wordsToType: [],
            nextWordsToType: [],
        },
        currentLevel: 0,
        levelRules: {
            wordAmount: 0, // set with rules conf file
            wordLength: {min: 0, max: 0},
            frequency: {min: 0, max: 0},
            capitalizeProbability: 0,
        },
        wordsContext: {
            wordsConstraint: '',
            wordsTheme: '',
            wordsOption: '',
        },
        wordsSetting: {
            isSnail: false,
            isEconomist: false,
            isResilient: false,
            isMasochist: false,
        },
        // score related
    },
    mutations: {
        ...wordsMutations,
        ...rulesMutations,
    },
    actions: {
        ...wordsActions,
    },
});

export default store;
