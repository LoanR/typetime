import random from '@/core/random';
import wordSelection from '@/core/wordSelection';

const API_ENDPOINT = 'https://api.datamuse.com/words?'; // in store or in conf file ?
const FREQUENCY_PARAMETER = '&md=f';
const EMERGENCY_THEMES = [
    'effect',
    'cow',
    'vegetables',
    'car',
    'tree',
    'cat',
    'zebra',
    'book',
    'bread',
    'shoes',
    'belt',
    'helmet',
    'bulb',
    'potato',
    'rock',
    'door',
    'key',
    'dungeon',
    'space',
    'plane',
    'letter',
    'coast',
    'town',
    'house',
    'garden',
    'sand',
    'fire',
    'alarm',
    'dice',
    'officer',
    'king',
    'water',
    'hour',
    'art',
    'song',
    'radio',
    'pot',
    'dishes',
    'idea',
    'economy',
    'customer',
    'power',
    'walk',
    'think',
    'eat',
    'earth',
    'way',
    'take',
    'through',
    'inside',
    'stairs',
    'deal',
    'camera',
    'cast',
    'island',
    'hard',
    'travel',
    'hunger',
    'liberty',
    'very',
    'when',
    'for',
    'eleven',
    'habit',
    'daily',
];

// func ensure minimum words
// if not ensure, new request => how to test ? => mocking the request

export const requestAndSelectWords = async function(wordAmount, wordsContext, wordsSelectionRules, filterAgainstRules) {
    try {
        let dataWords = [];
        let i = 1;
        while (dataWords.length < wordAmount) {
            let wordsTheme = i > 1 ? random.selectRandomEntity(EMERGENCY_THEMES) : wordsContext.wordsTheme;
            dataWords.unshift(...await requestDataWords(
                wordAmount,
                wordsContext.wordsConstraint,
                wordsTheme,
                wordsContext.wordsOption,
            ));
            if (filterAgainstRules) { // words are always filtered, yes?
                dataWords = wordSelection.filterWordsOnRule( // never add too big words
                    dataWords,
                    wordAmount, // just word amount needed
                    wordsSelectionRules,
                );
            }
            i += 1;
        }

        const randomSelectedDataWords = random.spliceRandomEntities(wordAmount, dataWords);

        const words = wordSelection.cleanDataWords(randomSelectedDataWords);

        const changedWords = wordSelection.randomlyChangeCase(words, wordsSelectionRules.capitalizeProbability);

        return changedWords;
    } catch (error) {
        throw new Error(error);
    }
};

export const requestDataWords = async function(wordAmount, queryParameter, queryValue, queryOption = '') { // generisize and modulize => this func doesnt only request
    try {
        let apiWords = [];
        let i = 1;
        while (apiWords.length < wordAmount) {
            if (i > 1) {
                if (queryParameter !== 'ml=') { // magic
                    queryParameter = 'ml='; // magic
                } else {
                    queryValue = random.selectRandomEntity(EMERGENCY_THEMES);
                }
            }
            apiWords.unshift(...await _datamuseWordsRequest(queryParameter, queryValue, queryOption));
            i += 1;
        }
        return apiWords;
    } catch (error) {
        throw new Error(error);
    }
};

async function _datamuseWordsRequest(queryParameter, queryValue, queryOption) {
    try {
        return await (await fetch(API_ENDPOINT + queryParameter + queryValue + queryOption + FREQUENCY_PARAMETER)).json();
    } catch (error) {
        throw new Error(error);
    }
};
