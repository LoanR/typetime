import {WORD_SELECTION_MAPPING} from '../conf/difficultyProgression';
import {MASOCHIST_KEY, DEFAULT_KEY} from '../conf/keyCorrespondance';

export default {
    getLevelRule(isMasochist, level) {
        let rule = WORD_SELECTION_MAPPING[level > 10 ? 10 : level][isMasochist ? MASOCHIST_KEY : DEFAULT_KEY];
        rule.wordAmount = 4 + level; // magic base amount number => need global in conf
        return rule;
    },

    cleanDataWords(dataWords) {
        return dataWords.map(dataWord => dataWord.word);
    },

    randomlyChangeCase(words, probability) {
        return probability === 0 ? words : words.map(function(word) {
            return Math.random() < probability ? word.charAt(0).toUpperCase() + word.slice(1) : word;
        });
    },

    filterWordsOnRule(dataWords, wordAmount, wordsSelectionRules) {
        let filteredWords = dataWords.filter((wordData) => {
            return this._doesWordRespectsSelectionRules(wordData, wordsSelectionRules);
        });
        let i = 1;
        while (filteredWords.length < wordAmount && i < 3) {
            if (i > 1) {
                dataWords = dataWords.map((wordData) => {
                    wordData.word = this.cleanWord(wordData.word);
                    return wordData;
                });
            }
            filteredWords.unshift(...dataWords.filter((wordData) => {
                return this._doesWordRespectsLengths(wordData.word.length, wordsSelectionRules) && !filteredWords.includes(wordData);
            }));
            i += 1;
        }
        return filteredWords;
    },

    cleanWord(word) {
        word = word.trim();
        let badCharIndex = word.indexOf(word.match(/\W/));
        if (badCharIndex > 0) {
            return word.substring(0, badCharIndex);
        }
        return word;
    },

    _doesWordRespectsSelectionRules(wordData, wordsSelectionRules) {
        return this._doesWordRespectsLengths(wordData.word.length, wordsSelectionRules) && this._doesWordRespectsFrequency(wordData, wordsSelectionRules);
    },

    _doesWordRespectsFrequency(wordData, wordsSelectionRules) {
        const wordFreqData = wordData.tags[wordData.tags.length - 1] || [];
        const wordFreq = wordFreqData.length > 0 && wordFreqData.substr(0, 2) === 'f:' ? parseFloat(wordFreqData.substr(2)) : 0;
        return wordFreq >= wordsSelectionRules.wordFrequencyInLanguage.min && wordFreq <= wordsSelectionRules.wordFrequencyInLanguage.max;
    },

    _doesWordRespectsLengths(wordLength, wordsSelectionRules) {
        return wordLength >= wordsSelectionRules.wordLength.min && wordLength <= wordsSelectionRules.wordLength.max;
    },
};
