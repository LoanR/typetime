import gameTuning from '../src/core/gameTuning.js';
const assert = require('chai').assert;

describe('isSnail function', function() {
    it('should return boolean', function() {
        assert.isBoolean(gameTuning.isSnail([{label: 'snail', isChecked: false}]), 'expect bool');
    });

    it('should return true if checked', function() {
        assert.isTrue(gameTuning.isSnail([{label: 'snail', isChecked: true}]), 'expect true');
    });

    it('should return false if not checked', function() {
        assert.isFalse(gameTuning.isSnail([{label: 'snail', isChecked: false}]), 'expect false');
    });
});

describe('isEconomist function', function() {
    it('should return boolean', function() {
        assert.isBoolean(gameTuning.isEconomist([{label: 'economist', isChecked: false}]), 'expect bool');
    });

    it('should return true if checked', function() {
        assert.isTrue(gameTuning.isEconomist([{label: 'economist', isChecked: true}]), 'expect true');
    });

    it('should return false if not checked', function() {
        assert.isFalse(gameTuning.isEconomist([{label: 'economist', isChecked: false}]), 'expect false');
    });
});

describe('isResilient function', function() {
    it('should return boolean', function() {
        assert.isBoolean(gameTuning.isResilient([{label: 'resilient', isChecked: false}]), 'expect bool');
    });

    it('should return true if checked', function() {
        assert.isTrue(gameTuning.isResilient([{label: 'resilient', isChecked: true}]), 'expect true');
    });

    it('should return false if not checked', function() {
        assert.isFalse(gameTuning.isResilient([{label: 'resilient', isChecked: false}]), 'expect false');
    });
});

describe('isMasochist function', function() {
    it('should return boolean', function() {
        assert.isBoolean(gameTuning.isMasochist([{label: 'masochist', isChecked: false}]), 'expect bool');
    });

    it('should return true if checked', function() {
        assert.isTrue(gameTuning.isMasochist([{label: 'masochist', isChecked: true}]), 'expect true');
    });

    it('should return false if not checked', function() {
        assert.isFalse(gameTuning.isMasochist([{label: 'masochist', isChecked: false}]), 'expect false');
    });
});
