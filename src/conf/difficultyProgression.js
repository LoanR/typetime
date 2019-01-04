import {DEFAULT_KEY, MASOCHIST_KEY} from './keyCorrespondance';

export const WORD_SELECTION_MAPPING = {
    1: {
        [DEFAULT_KEY]: {
            wordLength: {min: 1, max: 4},
            wordFrequencyInLanguage: {min: 10, max: 90000},
            capitalizeProbability: 0,
        },
        [MASOCHIST_KEY]: {
            wordLength: {min: 3, max: 6},
            wordFrequencyInLanguage: {min: 1, max: 100},
            capitalizeProbability: 0,
        },
    },
    2: {
        [DEFAULT_KEY]: {
            wordLength: {min: 3, max: 5},
            wordFrequencyInLanguage: {min: 10, max: 90000},
            capitalizeProbability: 0,
        },
        [MASOCHIST_KEY]: {
            wordLength: {min: 4, max: 7},
            wordFrequencyInLanguage: {min: 1, max: 100},
            capitalizeProbability: 0,
        },
    },
    3: {
        [DEFAULT_KEY]: {
            wordLength: {min: 4, max: 7},
            wordFrequencyInLanguage: {min: 10, max: 90000},
            capitalizeProbability: 0,
        },
        [MASOCHIST_KEY]: {
            wordLength: {min: 5, max: 8},
            wordFrequencyInLanguage: {min: 1, max: 100},
            capitalizeProbability: 0.2,
        },
    },
    4: {
        [DEFAULT_KEY]: {
            wordLength: {min: 4, max: 8},
            wordFrequencyInLanguage: {min: 10, max: 90000},
            capitalizeProbability: 0,
        },
        [MASOCHIST_KEY]: {
            wordLength: {min: 6, max: 10},
            wordFrequencyInLanguage: {min: 1, max: 100},
            capitalizeProbability: 0.3,
        },
    },
    5: {
        [DEFAULT_KEY]: {
            wordLength: {min: 5, max: 10},
            wordFrequencyInLanguage: {min: 1, max: 90000},
            capitalizeProbability: 0.2,
        },
        [MASOCHIST_KEY]: {
            wordLength: {min: 7, max: 11},
            wordFrequencyInLanguage: {min: 1, max: 100},
            capitalizeProbability: 0.4,
        },
    },
    6: {
        [DEFAULT_KEY]: {
            wordLength: {min: 6, max: 11},
            wordFrequencyInLanguage: {min: 1, max: 90000},
            capitalizeProbability: 0.2,
        },
        [MASOCHIST_KEY]: {
            wordLength: {min: 8, max: 12},
            wordFrequencyInLanguage: {min: 1, max: 100},
            capitalizeProbability: 0.4,
        },
    },
    7: {
        [DEFAULT_KEY]: {
            wordLength: {min: 7, max: 12},
            wordFrequencyInLanguage: {min: 1, max: 500},
            capitalizeProbability: 0.3,
        },
        [MASOCHIST_KEY]: {
            wordLength: {min: 9, max: 13},
            wordFrequencyInLanguage: {min: 0, max: 50},
            capitalizeProbability: 0.4,
        },
    },
    8: {
        [DEFAULT_KEY]: {
            wordLength: {min: 7, max: 13},
            wordFrequencyInLanguage: {min: 1, max: 500},
            capitalizeProbability: 0.3,
        },
        [MASOCHIST_KEY]: {
            wordLength: {min: 9, max: 14},
            wordFrequencyInLanguage: {min: 0, max: 50},
            capitalizeProbability: 0.5,
        },
    },
    9: {
        [DEFAULT_KEY]: {
            wordLength: {min: 7, max: 14},
            wordFrequencyInLanguage: {min: 1, max: 100},
            capitalizeProbability: 0.3,
        },
        [MASOCHIST_KEY]: {
            wordLength: {min: 9, max: 15},
            wordFrequencyInLanguage: {min: 0, max: 10},
            capitalizeProbability: 0.5,
        },
    },
    10: {
        [DEFAULT_KEY]: {
            wordLength: {min: 7, max: 15},
            wordFrequencyInLanguage: {min: 1, max: 100},
            capitalizeProbability: 0.4,
        },
        [MASOCHIST_KEY]: {
            wordLength: {min: 10, max: 20},
            wordFrequencyInLanguage: {min: 0, max: 1},
            capitalizeProbability: 0.6,
        },
    },
};
