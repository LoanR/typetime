import {requestAndSelectWords} from '../core/wordRequest';

export const wordsMutations = {
    setWordsToType(state, payload) {
        state.wordsRelated.wordsToType = payload.levelWords;
    },

    setNextWordsToType(state, payload) {
        state.wordsRelated.nextWordsToType = payload.nextLevelWords;
    },

    setNewLevelWords(state) {
        state.wordsRelated.wordsToType = state.wordsRelated.nextWordsToType;
    },
};

export const wordsActions = {
    async requestAndSetWordsToType({commit}, payload) {
        try {
            const words = await requestAndSelectWords(
                payload.wordAmount,
                payload.wordsContext,
                payload.wordsSelectionRules,
            );
            commit('setWordsToType', {levelWords: words});
        } catch (error) {
            throw new Error(error);
        }
    },

    async requestAndSetNextWordsToType({commit}, payload) {
        try {
            const words = await requestAndSelectWords(
                payload.wordAmount,
                payload.wordsContext,
                payload.wordsSelectionRules,
            );
            commit('setNextWordsToType', {nextLevelWords: words});
        } catch (error) {
            throw new Error(error);
        }
    },
};
