import scoreCalculator from '../src/core/scoreCalculator.js';
const assert = require('chai').assert;

// describe('_getLetterScoreMapping function', function() {
//     it('should return default defined value', function() {
//         assert.strictEqual(scoreCalculator._getLetterScoreMapping(), '', 'expects strictly equal to default'); // waiting for conf file
//     });
// });

describe('_getCurrentCombo function', function() {
    it('should return a combo', function() {
        assert.isNumber(scoreCalculator._getCurrentCombo(37, false, false), 'expects a number');
    });
    it('should be greater according to difficulty', function() {
        assert.isAbove(
            scoreCalculator._getCurrentCombo(100, false, false),
            scoreCalculator._getCurrentCombo(10, false, false),
            'expects greater letter combo to result on greater global combo'
        );
        assert.isAbove(
            scoreCalculator._getCurrentCombo(100, false, false),
            scoreCalculator._getCurrentCombo(100, true, false),
            'expects greater default difficulty to result on greater global combo'
        );
        assert.isAbove(
            scoreCalculator._getCurrentCombo(100, false, true),
            scoreCalculator._getCurrentCombo(100, false, false),
            'expects greater maso difficulty to result on greater global combo'
        );
    });
});

describe('getFinalMultiplier function', function() {
    it('should return the corresponding multiplier', function() {
        assert.strictEqual(scoreCalculator.getFinalMultiplier(10, true, false, false, 1), 1, 'expects a multiplier of 1');
        assert.strictEqual(scoreCalculator.getFinalMultiplier(9, false, false, false, 1), 1, 'expects a multiplier of 1');
        assert.strictEqual(scoreCalculator.getFinalMultiplier(10, false, false, false, 1), 2, 'expects a multiplier of 2');
        assert.strictEqual(scoreCalculator.getFinalMultiplier(11, false, false, false, 1), 2, 'expects a multiplier of 2');
        assert.strictEqual(scoreCalculator.getFinalMultiplier(100, false, false, false, 25), 40, 'expects a multiplier of 40');
        assert.strictEqual(scoreCalculator.getFinalMultiplier(100, false, false, true, 25), 64, 'expects a multiplier of 64');
    });
});

describe('getLetterScore function', function() {
    it('should return a number', function() {
        assert.isNumber(scoreCalculator.getLetterScore(5, 'a'), 'expects a number');
    });
    it('should return right letter score', function() {
        assert.strictEqual(scoreCalculator.getLetterScore(2, 'a'), 2, 'expects small score for frequent letters');
        assert.strictEqual(scoreCalculator.getLetterScore(2, 's'), 2, 'expects small score for frequent letters');
        assert.strictEqual(scoreCalculator.getLetterScore(5, '$'), 15, 'expects a score even with unexistant letter');
        assert.isAbove(scoreCalculator.getLetterScore(5, 'J'), scoreCalculator.getLetterScore(5, 'j'), 'expects uppercases to give a better score');
        assert.strictEqual(scoreCalculator.getLetterScore(5, 'x'), 15, 'expects a big score for non-frequent letters');
        assert.strictEqual(scoreCalculator.getLetterScore(5, 'X'), 20, 'expects an even big score for non-frequent uppercase letters');
    });
});
