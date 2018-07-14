import {randomNum} from '../src/js/random.js';
const assert = require('chai').assert;

describe('randomNum function', function() {
    it('should return an integer', function() {
        assert.typeOf(randomNum(1), 'number', 'expect an integer');
    });

    it('should return an integer included between values', function() {
        assert.include([0, 1, 2, 3], randomNum(3), 'expect an integer within 0 and 3');
    });

    it('should return an integer included between values and after a given one', function() {
        assert.include([3, 4, 5, 6], randomNum(3, 3), 'expect a number between 3 and 6');
    });
});
