import wordSelection from '../core/wordSelection';

const API_ENDPOINT = 'https://api.datamuse.com/words?'; // in store or in conf file ?
const FREQUENCY_PARAMETER = '&md=f';

export const wordsMutations = {
    setWordsToType(state, payload) {
        state.wordsRelated.wordsToType = payload.levelWords;
    },
};

export const wordsActions = {
    async requestAndSetWordsToType({commit}, payload) {
        try {
            let jsonWordsData = await requestWords(
                payload.wordAmount,
                payload.queryParameter,
                payload.queryValue,
                payload.queryOption,
            );
            if (payload.filterAgainstRules) {
                jsonWordsData = wordSelection.filterWordsOnRule(
                    jsonWordsData,
                    payload.gameLevel,
                    payload.isMasochist,
                    payload.wordAmount,
                );
            }

            commit('setWordsToType', {
                levelWords: wordSelection.randomlyChangeCase(
                    wordSelection.selectRandomWords(jsonWordsData, payload.wordAmount),
                    payload.capitalizeProbability,
                ),
            });
        } catch (error) {
            window.alert(error);
        }
    },
};

// func ensure minimum words
// if not ensure, new request => how to test ? => mocking the request

async function requestWords(wordAmount, queryParameter, queryValue, queryOption = '') { // generisize and modulize => this func doesnt only request
    try {
        let apiWords = [];
        let i = 1;
        while (apiWords.length < wordAmount) {
            if (i > 1) {
                queryParameter = 'ml=';
                if (i > 2) {
                    queryValue = 'effect'; // need more random than default 'effect' word
                }
            }
            const response = await fetch(API_ENDPOINT + queryParameter + queryValue + queryOption + FREQUENCY_PARAMETER);
            apiWords.unshift(...await response.json());
            i += 1;
        }
        return apiWords;
    } catch (error) {
        throw new Error(error);
    }
};
