import wordSelection from '../core/wordSelection';
import random from '@/core/random';
import {requestDataWords} from '../core/wordRequest';

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
            const words = await requestAndSelectWords(payload);
            commit('setWordsToType', {levelWords: words});
        } catch (error) {
            throw new Error(error);
        }
    },

    async requestAndSetNextWordsToType({commit}, payload) {
        try {
            const words = await requestAndSelectWords(payload);
            commit('setNextWordsToType', {nextLevelWords: words});
        } catch (error) {
            throw new Error(error);
        }
    },
};

async function requestAndSelectWords(payload) {
    try {
        let dataWords = await requestDataWords(
            payload.levelRules.wordAmount,
            payload.wordsContext.wordsConstraint,
            payload.wordsContext.wordsTheme,
            payload.wordsContext.wordsOption,
        );
        if (payload.filterAgainstRules) {
            dataWords = wordSelection.filterWordsOnRule(
                dataWords,
                payload.levelRules,
                payload.wordsSelectionRules,
                null,
            );
        }

        const randomSelectedDataWords = random.selectRandomEntities(payload.levelRules.wordAmount, dataWords);

        const words = wordSelection.cleanDataWords(randomSelectedDataWords);

        const changedWords = wordSelection.randomlyChangeCase(words, payload.wordsSelectionRules.capitalizeProbability);

        return changedWords;
    } catch (error) {
        throw new Error(error);
    }
}
