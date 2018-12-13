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
            const words = await requestAndSelectWords(
                payload.levelRules,
                payload.wordsContext,
                payload.wordsSelectionRules,
                payload.filterAgainstRules,
            );
            commit('setWordsToType', {levelWords: words});
        } catch (error) {
            throw new Error(error);
        }
    },

    async requestAndSetNextWordsToType({commit}, payload) {
        try {
            const words = await requestAndSelectWords(
                payload.levelRules,
                payload.wordsContext,
                payload.wordsSelectionRules,
                payload.filterAgainstRules,
            );
            commit('setNextWordsToType', {nextLevelWords: words});
        } catch (error) {
            throw new Error(error);
        }
    },
};

async function requestAndSelectWords(levelRules, wordsContext, wordsSelectionRules, filterAgainstRules) {
    try {
        let dataWords = await requestDataWords(
            levelRules.wordAmount,
            wordsContext.wordsConstraint,
            wordsContext.wordsTheme,
            wordsContext.wordsOption,
        );
        if (filterAgainstRules) {
            dataWords = wordSelection.filterWordsOnRule(
                dataWords,
                levelRules,
                wordsSelectionRules,
            );
        }

        const randomSelectedDataWords = random.selectRandomEntities(levelRules.wordAmount, dataWords);

        const words = wordSelection.cleanDataWords(randomSelectedDataWords);

        const changedWords = wordSelection.randomlyChangeCase(words, wordsSelectionRules.capitalizeProbability);

        return changedWords;
    } catch (error) {
        throw new Error(error);
    }
}
