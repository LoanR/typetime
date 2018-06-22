const levelMapping = {
    1: {
        default: {
            wordLength: [0, 4],
            frequency: [10, 90000],
        },
        occultist: {
            wordLength: [3, 6],
            frequency: [1, 100],
        },
    },
    2: {
        default: {
            wordLength: [0, 5],
            frequency: [10, 90000],
        },
        occultist: {
            wordLength: [4, 7],
            frequency: [1, 100],
        },
    },
    3: {
        default: {
            wordLength: [3, 7],
            frequency: [10, 90000],
        },
        occultist: {
            wordLength: [5, 8],
            frequency: [1, 100],
        },
    },
    4: {
        default: {
            wordLength: [4, 8],
            frequency: [10, 90000],
        },
        occultist: {
            wordLength: [6, 10],
            frequency: [1, 100],
        },
    },
    5: {
        default: {
            wordLength: [5, 10],
            frequency: [1, 90000],
        },
        occultist: {
            wordLength: [7, 11],
            frequency: [1, 100],
        },
    },
    6: {
        default: {
            wordLength: [6, 11],
            frequency: [10, 90000],
        },
        occultist: {
            wordLength: [8, 12],
            frequency: [1, 100],
        },
    },
    7: {
        default: {
            wordLength: [7, 12],
            frequency: 90000,
        },
        occultist: {
            wordLength: [9, 13],
            frequency: [0, 50],
        },
    },
    8: {
        default: {
            wordLength: [7, 13],
            frequency: [10, 500],
        },
        occultist: {
            wordLength: [9, 14],
            frequency: [0, 50],
        },
    },
    9: {
        default: {
            wordLength: [7, 14],
            frequency: [10, 500],
        },
        occultist: {
            wordLength: [9, 15],
            frequency: [0, 10],
        },
    },
    10: {
        default: {
            wordLength: [7, 15],
            frequency: [1, 100],
        },
        occultist: {
            wordLength: [10, 25],
            frequency: [0, 1],
        },
    },
};

export default {
    filterWordsOnRule(wordDatas, level, isOccultist, wordCount) {
        const ruleName = isOccultist ? 'occultist' : 'default';
        const currentLevel = level > 10 ? 10 : level;
        const rule = levelMapping[currentLevel][ruleName];
        let filteredWords = wordDatas.filter((wordData) => {
            return this.doesWordRespectsRules(wordData, rule);
        });
        if (filteredWords.length < wordCount) {
            console.log('not enough words');
            const remainingWords = wordCount - filteredWords.length;
            if (isOccultist) {
                filteredWords.push(...wordDatas.slice(0, remainingWords));
            } else {
                filteredWords.push(...wordDatas.slice(-remainingWords));
            }
        }
        return filteredWords;
    },

    doesWordRespectsRules(wordData, rule) {
        const wordFreqData = wordData.tags[wordData.tags.length - 1];
        const wordFreq = wordFreqData.substr(0, 2) === 'f:' ? parseFloat(wordFreqData.substr(2)) : 0;
        const wordLength = wordData.word.length;
        return wordLength >= rule.wordLength[0] &&
            wordLength <= rule.wordLength[1] &&
            wordFreq >= rule.frequency[0] &&
            wordFreq <= rule.frequency[1];
    },

    frequencyComparison(a, b) {
        function getWordFrequency(wordData) {
            const wordFreqData = wordData.tags[wordData.tags.length - 1];
            return wordFreqData.substr(0, 2) === 'f:' ? parseFloat(wordFreqData.substr(2)) : 0;
        }
        return getWordFrequency(a) - getWordFrequency(b);
    },

};
