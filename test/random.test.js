import random from '../src/core/random.js';
const assert = require('chai').assert;

describe('randomNum function', function() {
    it('should return an integer', function() {
        assert.typeOf(random.randomNum(1), 'number', 'expect an integer');
    });

    it('should return an integer included between values', function() {
        assert.include([0, 1, 2, 3], random.randomNum(3), 'expect an integer within 0 and 3');
    });

    it('should return an integer included between values and after a given one', function() {
        assert.include([3, 4, 5, 6], random.randomNum(3, 3), 'expect a number between 3 and 6');
    });
});

describe('selectRandomEntity function', function() {
    it('should return one of list', function() {
        assert.isString(random.selectRandomEntity(['a', 'z', 'e', 'r', 't', 'y']), 'expect a string');
        assert.isNumber(random.selectRandomEntity([1, 2, 3, 4, 5, 6]), 'expect a number');
    });
});

describe('spliceRandomEntities function', function() {
    it('should return a list', function() {
        assert.typeOf(random.spliceRandomEntities(2, ['a', 'z', 'e', 'r', 't', 'y']), 'array', 'expect an array');
    });

    it('should return a given number of elements', function() {
        assert.equal(random.spliceRandomEntities(5, ['a', 'z', 'e', 'r', 't', 'y']).length, 5, 'expect 5 elements');
    });

    it('should return a list of elements included in the given one', function() {
        assert.includeMembers(['a', 'z', 'e', 'r', 't', 'y'], random.spliceRandomEntities(4, ['a', 'z', 'e', 'r', 't', 'y']), 'expect result to be in given list');
    });
});
