import wordSelection from '../src/core/wordSelection.js';
import random from '../src/core/random.js';
const assert = require('chai').assert;

describe('cleanDataWords function', function() {
    const dataWords = [
        {word: 'overawe', thing: 1},
        {word: 'moo-cow', thing: 1},
        {word: 'pig', thing: 1},
        {word: 'bovine', thing: 1},
    ];
    it('should return a list of words', function() {
        assert.isArray(wordSelection.cleanDataWords(dataWords), 'expect an array');
        assert.isString(random.selectRandomEntity(wordSelection.cleanDataWords(dataWords)), 'expect an array of strings');
    });
});

describe('randomlyChangeCase function', function() {
    const words = ['overawe', 'moo-cow', 'pig', 'bovine'];
    it('should let words untouched if ratio is 0', function() {
        assert.deepEqual(wordSelection.randomlyChangeCase(words, 0), words, 'expect exactly same values');
    });
    it('should change first letter case of each word if ratio is 1', function() {
        const capWords = ['Overawe', 'Moo-cow', 'Pig', 'Bovine'];
        assert.deepEqual(wordSelection.randomlyChangeCase(words, 1), capWords, 'expect capital first letter on each word');
    });
});

describe('_doesWordRespectsFrequency function', function() {
    const wordData1 = {tags: ['f:100']};
    const wordData2 = {tags: ['']};
    const wordData3 = {tags: []};
    const wordsSelectionRules1 = {wordFrequencyInLanguage: {min: 99, max: 101}};
    const wordsSelectionRules2 = {wordFrequencyInLanguage: {min: 99, max: 100}};
    const wordsSelectionRules3 = {wordFrequencyInLanguage: {min: 100, max: 101}};
    const wordsSelectionRules4 = {wordFrequencyInLanguage: {min: 98, max: 99}};
    const wordsSelectionRules5 = {wordFrequencyInLanguage: {min: 0, max: 10}};
    it('should return a boolean', function() {
        assert.isBoolean(wordSelection._doesWordRespectsFrequency(wordData1, wordsSelectionRules1), 'expect a bool');
    });
    it('should return the corresponding boolean', function() {
        assert.isTrue(wordSelection._doesWordRespectsFrequency(wordData1, wordsSelectionRules1), 'expect data to respect rules');
        assert.isTrue(wordSelection._doesWordRespectsFrequency(wordData1, wordsSelectionRules2), 'expect data to respect max rules');
        assert.isTrue(wordSelection._doesWordRespectsFrequency(wordData1, wordsSelectionRules3), 'expect data to respect min rules');
        assert.isFalse(wordSelection._doesWordRespectsFrequency(wordData1, wordsSelectionRules4), 'expect data to differ from rules');
        assert.isFalse(wordSelection._doesWordRespectsFrequency(wordData2, wordsSelectionRules1), 'expect data to differ from rules even without frequency tag');
        assert.isTrue(wordSelection._doesWordRespectsFrequency(wordData2, wordsSelectionRules5), 'expect data to respect rules even without frequency tag');
        assert.isTrue(wordSelection._doesWordRespectsFrequency(wordData3, wordsSelectionRules5), 'expect data to respect rules even without frequency tag');
    });
});

describe('_doesWordRespectsLengths function', function() {
    const wordsSelectionRules = {wordLength: {min: 3, max: 5}};
    it('should return a boolean', function() {
        assert.isBoolean(wordSelection._doesWordRespectsLengths(4, wordsSelectionRules), 'expect a bool');
    });
    it('should return the corresponding boolean', function() {
        assert.isTrue(wordSelection._doesWordRespectsLengths(4, wordsSelectionRules), 'expect data to respect rules');
        assert.isTrue(wordSelection._doesWordRespectsLengths(3, wordsSelectionRules), 'expect data to respect min rules');
        assert.isTrue(wordSelection._doesWordRespectsLengths(5, wordsSelectionRules), 'expect data to respect max rules');
        assert.isFalse(wordSelection._doesWordRespectsLengths(6, wordsSelectionRules), 'expect data to differ from rules');
    });
});

describe('_doesWordRespectsSelectionRules function', function() {
    const wordData = {word: 'spaceship', tags: ['', 'f:100']};
    const wordsSelectionRules1 = {wordLength: {min: 8, max: 10}, wordFrequencyInLanguage: {min: 99, max: 101}};
    const wordsSelectionRules2 = {wordLength: {min: 8, max: 8}, wordFrequencyInLanguage: {min: 99, max: 101}};
    const wordsSelectionRules3 = {wordLength: {min: 8, max: 10}, wordFrequencyInLanguage: {min: 99, max: 99}};
    const wordsSelectionRules4 = {wordLength: {min: 8, max: 8}, wordFrequencyInLanguage: {min: 99, max: 99}};
    it('should return a boolean', function() {
        assert.isBoolean(wordSelection._doesWordRespectsSelectionRules(wordData, wordsSelectionRules1), 'expect a bool');
    });
    it('should return the corresponding boolean', function() {
        assert.isTrue(wordSelection._doesWordRespectsSelectionRules(wordData, wordsSelectionRules1), 'expect data to respect rules');
        assert.isFalse(wordSelection._doesWordRespectsSelectionRules(wordData, wordsSelectionRules2), 'expect data to differ from rules');
        assert.isFalse(wordSelection._doesWordRespectsSelectionRules(wordData, wordsSelectionRules3), 'expect data to differ from rules');
        assert.isFalse(wordSelection._doesWordRespectsSelectionRules(wordData, wordsSelectionRules4), 'expect data to differ from rules');
    });
});

describe('_frequencyComparison function', function() {
    const a = {tags: ['f:50']};
    const b = {tags: ['f:100']};
    const c = {tags: ['f:100']};
    it('should return a number', function() {
        assert.isNumber(wordSelection._frequencyComparison(a, b), 'expect a number');
    });
    it('should return the corresponding number', function() {
        assert.isAbove(wordSelection._frequencyComparison(b, a), 0, 'expect a positive number');
        assert.isBelow(wordSelection._frequencyComparison(a, b), 0, 'expect a negative number');
        assert.equal(wordSelection._frequencyComparison(b, c), 0, 'expect 0');
    });
});

describe('_doesWordRespectsSelectionRules function', function() {
    const dataWords = [
        {word: 'spaceship', tags: ['', 'f:100']},
        {word: 'this', tags: ['', 'f:1000']},
        {word: 'plane', tags: ['', 'f:100']},
        {word: 'tomato', tags: ['', 'f:1000']},
        {word: 'crystal', tags: ['', 'f:10']},
        {word: 'planets', tags: ['', 'f:10']},
    ];
    const wordsSelectionRules1 = {wordLength: {min: 5, max: 9}, wordFrequencyInLanguage: {min: 99, max: 101}};
    it('should return a list', function() {
        assert.isArray(wordSelection.filterWordsOnRule(dataWords, 2, wordsSelectionRules1), 'expect an array');
    });
    it('should return a list of objects', function() {
        assert.typeOf(random.selectRandomEntity(wordSelection.filterWordsOnRule(dataWords, 2, wordsSelectionRules1)), 'object', 'expect an array of objects');
        assert.equal(Object.keys(random.selectRandomEntity(wordSelection.filterWordsOnRule(dataWords, 2, wordsSelectionRules1))).length, 2, 'expect an array of objects with 2 keys');
    });
    it('should return a specific list of objects', function() {
        assert.equal(wordSelection.filterWordsOnRule(dataWords, 2, wordsSelectionRules1).length, 2, 'expect an array of 2 objects');
        assert.equal(wordSelection.filterWordsOnRule(dataWords, 4, wordsSelectionRules1).length, 4, 'expect an array of 4 objects, even if it does not respects rules');
    });
});

describe('cleanWordContext function', function() {
    it('should return a string', function() {
        assert.isString(wordSelection.cleanWordContext('whale'), 'expect a string');
    });
    it('should return the given string if already clean', function() {
        assert.equal(wordSelection.cleanWordContext('whale'), 'whale', 'expect the same string');
    });
    it('should return a trimed string', function() {
        assert.equal(wordSelection.cleanWordContext('        whale '), 'whale', 'expect the trimed string');
    });
    it('should return a cleaned string', function() {
        assert.equal(wordSelection.cleanWordContext('blue whale'), 'blue', 'expect a substring');
        assert.equal(wordSelection.cleanWordContext('blue-whale'), 'blue', 'expect a substring');
        assert.equal(wordSelection.cleanWordContext('blue@whale'), 'blue', 'expect a substring');
        assert.equal(wordSelection.cleanWordContext('bluewhale'), 'bluewhale', 'expect the same string');
    });
});
