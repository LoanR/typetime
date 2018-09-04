import {randomNum} from '../js/random.js';

const API_ENDPOINT = 'https://api.datamuse.com/words?';
const FREQUENCY_PARAMETER = '&md=f';

export const wordsMutations = {
    setWordsToType(state, payload) {
        state.wordsRelated.wordsToType = payload.selectedWords;
    },
};

export const wordsActions = {
    async requestAndSetWordsToType({commit}, payload) {
        try {
            let rawWords = await requestWords(
                payload.wordAmount,
                payload.queryParameter,
                payload.queryValue,
                payload.queryOption,
            );

            commit('setWordsToType', {
                selectedWords: selectWords(rawWords, payload.wordAmount),
            });
        } catch (error) {
            window.alert(error);
        }
    },
};

async function requestWords(wordCount, queryParameter, queryValue, queryOption = '') {
    try {
        let apiWords = [];
        let i = 1;
        while (apiWords.length < wordCount) {
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

function selectWords(jsonResponse, wordCount, filterAgainstRules = true) {
    let selectedWords = [];
    // const filteredData = filterAgainstRules ? wordSelectionRules.filterWordsOnRule(jsonResponse, this.gameLevel, gameTuning.isMasochist(this.difficulties), wordCount) : jsonResponse;
    const filteredData = jsonResponse; // waiting for vuex rules
    for (let i = 1; i <= wordCount; i++) {
        const wordData = filteredData.splice(randomNum(filteredData.length, 0), 1)[0];
        selectedWords.push(mayMutateCase(wordData.word)); // count here for progress bar
    }
    return selectedWords;
};

function mayMutateCase(word) {
    // const rand = randomNum(3, 0);
    // if (!rand && ((gameTuning.isMasochist(this.difficulties) && this.gameLevel >= 3) || this.gameLevel >= 5)) { // need to be set in game rules and not here
    //     return word.charAt(0).toUpperCase() + word.slice(1);
    // }
    return word;
};
