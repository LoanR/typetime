import wordSelection from '../src/core/wordSelection.js';
const assert = require('chai').assert;

describe('selectRandomWords function', function() {
    it('should return a list', function() {
        assert.typeOf(wordSelection.selectRandomWords([{a: 1}, {b: 2}, {c: 3}, {d: 4}], 3), 'array', 'expect an array');
    });

    it('should return exactly 3 items', function() {
        assert.equal(wordSelection.selectRandomWords([{a: 1}, {b: 2}, {c: 3}, {d: 4}], 3).length, 3, 'expect exactly 3 items');
    });

    it('should return words', function() {
        const jsonData = [
            {'word': 'overawe', 'score': 79693, 'tags': ['syn', 'v', 'f:0.209737']},
            {'word': 'moo-cow', 'score': 76358, 'tags': ['syn', 'n', 'f:0.000000']},
            {'word': 'pig', 'score': 72157, 'tags': ['n', 'f:17.868812']},
            {'word': 'bovine', 'score': 71775, 'tags': ['n', 'f:5.638056']},
        ];
        assert.typeOf(wordSelection.selectRandomWords(jsonData, 2)[0], 'string', 'expect a string');
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
