import {BASE_WORD_AMOUNT, BASE_WORDS_PER_MINUTE} from '@/conf/gameSettings';

export const gameMutations = {
    setSafeMode(state, payload) {
        state.safeMode = payload.safeMode;
    },

    incrementLevel(state) {
        state.rules.levelRules.currentLevel += 1;
        state.rules.levelRules.wordAmount += 1;
        state.rules.levelRules.wordsPerMinute += 1;
        state.rules.levelRules.allotedWordBaseTime = parseInt((6000 / state.rules.levelRules.wordsPerMinute).toFixed()); // magic 6000
    },

    resetLevelRules(state) {
        state.rules.levelRules.currentLevel = 1;
        state.rules.levelRules.wordAmount = BASE_WORD_AMOUNT;
        state.rules.levelRules.wordsPerMinute = BASE_WORDS_PER_MINUTE;
        state.rules.levelRules.savedWordTime = 0;
    },

    setAllotedWordBaseTime(state) {
        state.rules.levelRules.allotedWordBaseTime = parseInt((6000 / state.rules.levelRules.wordsPerMinute).toFixed()); // magic 6000
    },

    setSavedWordTime(state, payload) {
        state.rules.levelRules.savedWordTime = payload.savedWordTime;
    },

    setWordsPerMinute(state, payload) {
        state.rules.levelRules.wordsPerMinute = payload.wordsPerMinute;
    },

    startGame(state) {
        state.currentlyPlaying = true;
    },

    stopGame(state) {
        state.currentlyPlaying = false;
    },
};
