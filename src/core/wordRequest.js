import random from './random';
import wordSelection from './wordSelection';
import {EMERGENCY, ALL_WORDS} from '../conf/wordSeed';
import {DEFAULT_CONSTRAINT} from '../conf/modifiersFrame';

import {API_ENDPOINT, FREQUENCY_PARAMETER} from '../conf/requestUrl';

export const requestAndSelectWords = async function(wordAmount, wordsContext, wordsSelectionRules, isExternalRequest = true) {
    try {
        let dataWords = await _requestMinimumDataWords(wordAmount, wordsContext, wordsSelectionRules, isExternalRequest);

        const randomSelectedDataWords = random.spliceRandomEntities(wordAmount, dataWords);

        const words = wordSelection.cleanDataWords(randomSelectedDataWords);

        const changedWords = wordSelection.randomlyChangeCase(words, wordsSelectionRules.capitalizeProbability);
        return changedWords;
    } catch (error) {
        throw new Error(error);
    }
};

async function _requestMinimumDataWords(wordAmount, wordsContext, wordsSelectionRules, isExternalRequest) {
    try {
        let dataWords = [];
        let i = 1;
        while (dataWords.length < wordAmount) {
            let wordsTheme = i > 1 ? random.selectRandomEntity(EMERGENCY) : wordsContext.wordsTheme;
            dataWords.unshift(...await _requestDataWords(
                isExternalRequest,
                wordAmount,
                wordsContext.wordsConstraint,
                wordsTheme,
                wordsContext.wordsOption,
            ));
            dataWords = wordSelection.filterWordsOnRule(
                dataWords,
                wordAmount,
                wordsSelectionRules,
            );
            i += 1;
        }
        return dataWords;
    } catch (error) {
        throw new Error(error);
    }
};

async function _requestDataWords(isExternalRequest, wordAmount, queryParameter, queryValue, queryOption = '') {
    try {
        let apiWords = [];
        let i = 1;
        while (apiWords.length < wordAmount) {
            if (i > 1) {
                if (queryParameter !== DEFAULT_CONSTRAINT) {
                    queryParameter = DEFAULT_CONSTRAINT;
                } else {
                    queryValue = random.selectRandomEntity(EMERGENCY);
                }
            }
            apiWords.unshift(...await _datamuseWordsRequest(queryParameter, queryValue, queryOption, isExternalRequest));
            i += 1;
        }
        return apiWords;
    } catch (error) {
        throw new Error(error);
    }
};

async function _datamuseWordsRequest(queryParameter, queryValue, queryOption, isExternalRequest) {
    try {
        if (!isExternalRequest) {
            return await _mockRequest();
        }
        return await (await fetch(API_ENDPOINT + queryParameter + queryValue + queryOption + FREQUENCY_PARAMETER)).json();
    } catch (error) {
        throw new Error(error);
    }
};

function _mockRequest() { // how to use in default dev ?
    return new Promise((resolve) => {
        let words = [...ALL_WORDS];
        let dataWordsMock = words.map(w => {
            return {word: w, tags: ['f:' + random.randomNum(100)]};
        });
        resolve(dataWordsMock);
    });
};
