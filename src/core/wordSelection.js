import random from './random.js';

// globale de correspondance settings et rule key

const WORD_SELECTION_MAPPING = {
    1: {
        default: {
            wordLength: {min: 0, max: 4},
            wordFrequencyInLanguage: {min: 10, max: 90000},
            capitalizeProbability: 0,
        },
        masochist: {
            wordLength: {min: 3, max: 6},
            wordFrequencyInLanguage: {min: 1, max: 100},
            capitalizeProbability: 0,
        },
    },
    2: {
        default: {
            wordLength: {min: 3, max: 5},
            wordFrequencyInLanguage: {min: 10, max: 90000},
            capitalizeProbability: 0,
        },
        masochist: {
            wordLength: {min: 4, max: 7},
            wordFrequencyInLanguage: {min: 1, max: 100},
            capitalizeProbability: 0,
        },
    },
    3: {
        default: {
            wordLength: {min: 4, max: 7},
            wordFrequencyInLanguage: {min: 10, max: 90000},
            capitalizeProbability: 0,
        },
        masochist: {
            wordLength: {min: 5, max: 8},
            wordFrequencyInLanguage: {min: 1, max: 100},
            capitalizeProbability: 0.2,
        },
    },
    4: {
        default: {
            wordLength: {min: 4, max: 8},
            wordFrequencyInLanguage: {min: 10, max: 90000},
            capitalizeProbability: 0,
        },
        masochist: {
            wordLength: {min: 6, max: 10},
            wordFrequencyInLanguage: {min: 1, max: 100},
            capitalizeProbability: 0.3,
        },
    },
    5: {
        default: {
            wordLength: {min: 5, max: 10},
            wordFrequencyInLanguage: {min: 1, max: 90000},
            capitalizeProbability: 0.2,
        },
        masochist: {
            wordLength: {min: 7, max: 11},
            wordFrequencyInLanguage: {min: 1, max: 100},
            capitalizeProbability: 0.4,
        },
    },
    6: {
        default: {
            wordLength: {min: 6, max: 11},
            wordFrequencyInLanguage: {min: 1, max: 90000},
            capitalizeProbability: 0.2,
        },
        masochist: {
            wordLength: {min: 8, max: 12},
            wordFrequencyInLanguage: {min: 1, max: 100},
            capitalizeProbability: 0.4,
        },
    },
    7: {
        default: {
            wordLength: {min: 7, max: 12},
            wordFrequencyInLanguage: {min: 1, max: 500},
            capitalizeProbability: 0.3,
        },
        masochist: {
            wordLength: {min: 9, max: 13},
            wordFrequencyInLanguage: {min: 0, max: 50},
            capitalizeProbability: 0.4,
        },
    },
    8: {
        default: {
            wordLength: {min: 7, max: 13},
            wordFrequencyInLanguage: {min: 1, max: 500},
            capitalizeProbability: 0.3,
        },
        masochist: {
            wordLength: {min: 9, max: 14},
            wordFrequencyInLanguage: {min: 0, max: 50},
            capitalizeProbability: 0.5,
        },
    },
    9: {
        default: {
            wordLength: {min: 7, max: 14},
            wordFrequencyInLanguage: {min: 1, max: 100},
            capitalizeProbability: 0.3,
        },
        masochist: {
            wordLength: {min: 9, max: 15},
            wordFrequencyInLanguage: {min: 0, max: 10},
            capitalizeProbability: 0.5,
        },
    },
    10: {
        default: {
            wordLength: {min: 7, max: 15},
            wordFrequencyInLanguage: {min: 1, max: 100},
            capitalizeProbability: 0.4,
        },
        masochist: {
            wordLength: {min: 10, max: 20},
            wordFrequencyInLanguage: {min: 0, max: 1},
            capitalizeProbability: 0.6,
        },
    },
};

export default {
    getLevelRule(isMasochist, level) { // temporary func while waiting for level rule state
        // const ruleName = isMasochist ? 'masochist' : 'default';
        // const currentLevel = level > 10 ? 10 : level;
        let rule = WORD_SELECTION_MAPPING[level > 10 ? 10 : level][isMasochist ? 'masochist' : 'default']; // magic string
        rule.wordAmount = 4 + level; // magic base amount number => need global in conf
        return rule;
    },

    selectRandomWords(jsonWordsData, wordAmount) { // useless, see random
        let selectedWords = [];
        for (let i = 1; i <= wordAmount; i++) {
            selectedWords.push(jsonWordsData.splice(random.randomNum(jsonWordsData.length, 0), 1)[0].word); // count somewhere for progress bar
        }
        return selectedWords;
    },

    cleanDataWords(dataWords) {
        return dataWords.map(dataWord => dataWord.word);
    },

    randomlyChangeCase(words, probability) {
        return probability === 0 ? words : words.map(function(word) {
            return Math.random() < probability ? word.charAt(0).toUpperCase() + word.slice(1) : word;
        });
    },

    filterWordsOnRule(dataWords, levelRules, wordsSelectionRules) {
        // const ruleName = isMasochist ? 'masochist' : 'default';
        // const currentLevel = level > 10 ? 10 : level;
        // const rule = WORD_SELECTION_MAPPING[currentLevel][ruleName];
        let filteredWords = dataWords.filter((wordData) => {
            return this.doesWordRespectsSelectionRules(wordData, wordsSelectionRules);
        });
        if (filteredWords.length < levelRules.wordAmount) {
            filteredWords = filteredWords.filter((wordData) => {
                return this.doesWordRespectsLengths(wordData.word.length, wordsSelectionRules) && !filteredWords.includes(wordData);
            });
        }
        if (filteredWords.length < levelRules.wordAmount) {
            const remainingWords = levelRules.wordAmount - filteredWords.length;
            dataWords.sort(this.frequencyComparison);
            if (dataWords === false) {
                filteredWords.unshift(...dataWords.slice(0, remainingWords));
            } else {
                filteredWords.unshift(...dataWords.slice(-remainingWords));
            }
        }
        return filteredWords;
    },

    doesWordRespectsSelectionRules(wordData, wordsSelectionRules) {
        return this.doesWordRespectsLengths(wordData.word.length, wordsSelectionRules) && this.doesWordRespectsFrequency(wordData, wordsSelectionRules);
    },

    doesWordRespectsFrequency(wordData, wordsSelectionRules) {
        const wordFreqData = wordData.tags[wordData.tags.length - 1];
        const wordFreq = wordFreqData.substr(0, 2) === 'f:' ? parseFloat(wordFreqData.substr(2)) : 0;
        return wordFreq >= wordsSelectionRules.wordFrequencyInLanguage.min && wordFreq <= wordsSelectionRules.wordFrequencyInLanguage.max;
    },

    doesWordRespectsLengths(wordLength, wordsSelectionRules) {
        return wordLength >= wordsSelectionRules.wordLength.min && wordLength <= wordsSelectionRules.wordLength.max;
    },

    frequencyComparison(a, b) {
        function getWordFrequency(wordData) {
            const wordFreqData = wordData.tags[wordData.tags.length - 1];
            return wordFreqData.substr(0, 2) === 'f:' ? parseFloat(wordFreqData.substr(2)) : 0;
        }
        return getWordFrequency(a) - getWordFrequency(b);
    },
};
