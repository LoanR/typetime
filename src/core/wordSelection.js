import {randomNum} from './random.js';

const LEVEL_MAPPING = {
    1: {
        default: {
            wordLength: {min: 0, max: 4},
            frequency: {min: 10, max: 90000},
            capitalizeProbability: 0,
        },
        masochist: {
            wordLength: {min: 3, max: 6},
            frequency: {min: 1, max: 100},
            capitalizeProbability: 0,
        },
    },
    2: {
        default: {
            wordLength: {min: 3, max: 5},
            frequency: {min: 10, max: 90000},
            capitalizeProbability: 0,
        },
        masochist: {
            wordLength: {min: 4, max: 7},
            frequency: {min: 1, max: 100},
            capitalizeProbability: 0,
        },
    },
    3: {
        default: {
            wordLength: {min: 4, max: 7},
            frequency: {min: 10, max: 90000},
            capitalizeProbability: 0,
        },
        masochist: {
            wordLength: {min: 5, max: 8},
            frequency: {min: 1, max: 100},
            capitalizeProbability: 0.2,
        },
    },
    4: {
        default: {
            wordLength: {min: 4, max: 8},
            frequency: {min: 10, max: 90000},
            capitalizeProbability: 0,
        },
        masochist: {
            wordLength: {min: 6, max: 10},
            frequency: {min: 1, max: 100},
            capitalizeProbability: 0.3,
        },
    },
    5: {
        default: {
            wordLength: {min: 5, max: 10},
            frequency: {min: 1, max: 90000},
            capitalizeProbability: 0.2,
        },
        masochist: {
            wordLength: {min: 7, max: 11},
            frequency: {min: 1, max: 100},
            capitalizeProbability: 0.4,
        },
    },
    6: {
        default: {
            wordLength: {min: 6, max: 11},
            frequency: {min: 1, max: 90000},
            capitalizeProbability: 0.2,
        },
        masochist: {
            wordLength: {min: 8, max: 12},
            frequency: {min: 1, max: 100},
            capitalizeProbability: 0.4,
        },
    },
    7: {
        default: {
            wordLength: {min: 7, max: 12},
            frequency: {min: 1, max: 500},
            capitalizeProbability: 0.3,
        },
        masochist: {
            wordLength: {min: 9, max: 13},
            frequency: {min: 0, max: 50},
            capitalizeProbability: 0.4,
        },
    },
    8: {
        default: {
            wordLength: {min: 7, max: 13},
            frequency: {min: 1, max: 500},
            capitalizeProbability: 0.3,
        },
        masochist: {
            wordLength: {min: 9, max: 14},
            frequency: {min: 0, max: 50},
            capitalizeProbability: 0.5,
        },
    },
    9: {
        default: {
            wordLength: {min: 7, max: 14},
            frequency: {min: 1, max: 100},
            capitalizeProbability: 0.3,
        },
        masochist: {
            wordLength: {min: 9, max: 15},
            frequency: {min: 0, max: 10},
            capitalizeProbability: 0.5,
        },
    },
    10: {
        default: {
            wordLength: {min: 7, max: 15},
            frequency: {min: 1, max: 100},
            capitalizeProbability: 0.4,
        },
        masochist: {
            wordLength: {min: 10, max: 20},
            frequency: {min: 0, max: 1},
            capitalizeProbability: 0.6,
        },
    },
};

export default {
    getLevelRule(ismasochist, level) { // temporary func while waiting for level rule state
        const ruleName = ismasochist ? 'masochist' : 'default';
        const currentLevel = level > 10 ? 10 : level;
        return LEVEL_MAPPING[currentLevel][ruleName];
    },

    selectRandomWords(jsonWordsData, wordAmount) {
        let selectedWords = [];
        for (let i = 1; i <= wordAmount; i++) {
            selectedWords.push(jsonWordsData.splice(randomNum(jsonWordsData.length, 0), 1)[0].word); // count somewhere for progress bar
        }
        return selectedWords;
    },

    randomlyChangeCase(words, probability) {
        return probability === 0 ? words : words.map(function(word) {
            return Math.random() < probability ? word.charAt(0).toUpperCase() + word.slice(1) : word;
        });
    },

    filterWordsOnRule(jsonWordsData, level, ismasochist, wordAmount) {
        const ruleName = ismasochist ? 'masochist' : 'default';
        const currentLevel = level > 10 ? 10 : level;
        const rule = LEVEL_MAPPING[currentLevel][ruleName];
        let filteredWords = jsonWordsData.filter((wordData) => {
            return this.doesWordRespectsRules(wordData, rule);
        });
        if (filteredWords.length < wordAmount) {
            filteredWords = filteredWords.filter((wordData) => {
                return this.doesWordRespectsLengths(wordData.word.length, rule) && !filteredWords.includes(wordData);
            });
        }
        if (filteredWords.length < wordAmount) {
            const remainingWords = wordAmount - filteredWords.length;
            jsonWordsData.sort(this.frequencyComparison);
            if (ismasochist) {
                filteredWords.unshift(...jsonWordsData.slice(0, remainingWords));
            } else {
                filteredWords.unshift(...jsonWordsData.slice(-remainingWords));
            }
        }
        return filteredWords;
    },

    doesWordRespectsRules(wordData, rule) {
        const wordFreqData = wordData.tags[wordData.tags.length - 1];
        const wordFreq = wordFreqData.substr(0, 2) === 'f:' ? parseFloat(wordFreqData.substr(2)) : 0;
        const wordLength = wordData.word.length;
        return this.doesWordRespectsLengths(wordLength, rule) &&
            wordFreq >= rule.frequency.min &&
            wordFreq <= rule.frequency.max;
    },

    doesWordRespectsLengths(wordLength, rule) {
        return wordLength >= rule.wordLength.min && wordLength <= rule.wordLength.max;
    },

    frequencyComparison(a, b) {
        function getWordFrequency(wordData) {
            const wordFreqData = wordData.tags[wordData.tags.length - 1];
            return wordFreqData.substr(0, 2) === 'f:' ? parseFloat(wordFreqData.substr(2)) : 0;
        }
        return getWordFrequency(a) - getWordFrequency(b);
    },
};
