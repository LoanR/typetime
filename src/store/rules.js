import wordSelection from '../core/wordSelection';

// export const levelRulesMutations = {
//     setLevelRules(state, payload) {
//         console.log('level rules');
//         console.log(payload);
//         state.rules.levelRules = payload.levelRules;
//     },

//     incrementLevel(state) {
//         state.currentLevel += 1;
//     },

//     resetLevel(state) {
//         state.currentLevel = 0;
//     },
// };

export const wordsSelectionRulesMutations = {
    setWordsSelectionRules(state, payload) {
        state.rules.wordsSelectionRules.wordLength = payload.wordsSelectionRules.wordLength;
        state.rules.wordsSelectionRules.wordFrequencyInLanguage = payload.wordsSelectionRules.wordFrequencyInLanguage;
        state.rules.wordsSelectionRules.capitalizeProbability = payload.wordsSelectionRules.capitalizeProbability;
    },
};

export const difficultiesMutations = {
    setDifficulty(state, payload) {
        state.rules.gameDifficulties[payload.settingId] = payload.isChecked;
    },
    // setWordsTheme(state, payload) {
    //     state.wordsContext.wordsTheme = payload.wordsTheme;
    // },
    // setWordsOption(state, payload) {
    //     state.wordsContext.wordsOption = payload.wordsOption;
    // },
};

// action for new level and then level rules mutation

// action for new level and then level rules mutation
export const rulesActions = {
    setCurrentLevelRules({commit}, payload) {
        commit('setLevelRules', {levelRules: wordSelection.getLevelRule(payload.isMasochist, payload.level)}); // useless, directly on app
    },
};
