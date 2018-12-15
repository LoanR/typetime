const BASE_WORD_AMOUNT = 5; // maybe no need to increment at beginning but only on next level ?
const BASE_WORD_PER_MINUTE = 30; // maybe no need to increment at beginning but only on next level ?

export const gameMutations = {
    incrementLevel(state) {
        state.rules.levelRules.currentLevel += 1;
        state.rules.levelRules.wordAmount += 1;
        state.rules.levelRules.wordsPerMinute += 1;
        state.rules.levelRules.allotedWordBaseTime = parseInt((6000 / state.rules.levelRules.wordsPerMinute).toFixed());
        // state.rules.levelRules.allotedWordBaseTime = 600; // by hand tests purpose
    },

    resetLevelRules(state) {
        state.rules.levelRules.currentLevel = 1;
        state.rules.levelRules.wordAmount = BASE_WORD_AMOUNT;
        state.rules.levelRules.wordsPerMinute = BASE_WORD_PER_MINUTE;
        state.rules.levelRules.allotedWordBaseTime = parseInt(6000 / BASE_WORD_PER_MINUTE);
        // state.rules.levelRules.allotedWordBaseTime = 600; // by hand tests purpose
        state.rules.levelRules.savedWordTime = 0;
    },

    setSavedWordTime(state, payload) {
        state.rules.levelRules.savedWordTime = payload.savedWordTime;
    },

    startGame(state) {
        state.currentlyPlaying = true;
    },

    stopGame(state) {
        state.currentlyPlaying = false;
    },
};
