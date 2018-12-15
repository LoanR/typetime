import Vue from 'vue';
import Vuex from 'vuex';

import {gameMutations} from './game';
import {wordsMutations, wordsActions} from './words';
import {wordsSelectionRulesMutations, difficultiesMutations} from './rules';
import {contextMutations} from './context';
import {scoreMutations} from './score';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        wordsRelated: {
            wordsToType: [],
            nextWordsToType: [],
        },
        currentlyPlaying: false,
        rules: {
            levelRules: {
                currentLevel: 0,
                wordAmount: 0, // set with rules conf file
                wordsPerMinute: 0,
                allotedWordBaseTime: 0,
                savedWordTime: 0,
            },
            wordsSelectionRules: {
                wordLength: {min: 0, max: 0},
                wordFrequencyInLanguage: {min: 0, max: 0},
                capitalizeProbability: 0,
            },
            gameDifficulties: {
                isSnail: false,
                isEconomist: true,
                isResilient: false,
                isMasochist: false,
            },
        },
        wordsContext: {
            wordsConstraint: '',
            wordsTheme: '',
            wordsOption: '',
        },
        score: {
            gameScore: 0,
            letterCombo: 0,
            difficultyNaming: '',
            nemesisLetter: '',
            stuckWordPart1: '',
            stuckWordPart2: '',
        },
        // score related
    },
    mutations: {
        ...gameMutations,
        ...wordsMutations,
        ...contextMutations,
        // ...levelRulesMutations,
        ...wordsSelectionRulesMutations,
        ...difficultiesMutations,
        ...scoreMutations,
    },
    actions: {
        ...wordsActions,
        // ...rulesActions,
    },
});

export default store;
