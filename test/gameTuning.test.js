import gameTuning from '../src/core/gameTuning.js';
import random from '../src/core/random.js';
const assert = require('chai').assert;

describe('defaultConstraint function', function() {
    it('should return default defined value', function() {
        assert.strictEqual(gameTuning.defaultConstraint(), 'ml=', 'expects strictly equal to default'); // waiting for conf file
    });
});

describe('defaultOption function', function() {
    it('should return default defined value', function() {
        assert.strictEqual(gameTuning.defaultOption(), '', 'expects strictly equal to default'); // waiting for conf file
    });
});

describe('defaultTheme function', function() {
    const modifiers = [
        {
            modCluster: 'word',
            values: {wordsTheme: 'theme1'},
        },
        {
            modCluster: 'word',
            values: {wordsTheme: 'theme2'},
        },
        {
            modCluster: 'other',
            values: {wordsTheme: 2},
        },
        {
            modCluster: 'thing',
        },
    ];
    it('should return a string', function() {
        assert.isString(gameTuning.defaultTheme(modifiers), 'expects a string');
    });
    it('should return one value of the selected ones', function() {
        assert.include(['theme1', 'theme2'], gameTuning.defaultTheme(modifiers), 'expects result to be included in list');
    });
});

describe('getSpecificModifierSearchValues function', function() {
    it('should return a list', function() {
        assert.isArray(gameTuning.getSpecificModifierSearchValues(), 'expects an array');
    });
    it('should return a list of objects', function() {
        assert.typeOf(gameTuning.getSpecificModifierSearchValues()[0], 'object', 'expects an array of objects');
    });
    it('should return a list of objects containing 2 keys', function() {
        assert.equal(Object.keys(random.selectRandomEntity(gameTuning.getSpecificModifierSearchValues())).length, 2, 'expects an array of objects with 2 keys');
    });
    it('should return a list of objects containing specific keys', function() {
        assert.strictEqual(Object.keys(random.selectRandomEntity(gameTuning.getSpecificModifierSearchValues()))[0], 'param', 'expects an array of objects with "param" key');
        assert.strictEqual(Object.keys(random.selectRandomEntity(gameTuning.getSpecificModifierSearchValues()))[1], 'value', 'expects an array of objects with "value" key');
    });
});

describe('buildNewModifiers function', function() {
    const modWords = ['a', 'z', 'e'];
    it('should return an array', function() {
        assert.isArray(gameTuning.buildNewModifiers(modWords), 'expects an array');
    });
    it('should return an array of objects', function() {
        assert.typeOf(random.selectRandomEntity(gameTuning.buildNewModifiers(modWords)), 'object', 'expects an array of objects');
    });
    it('should return an array of objects containing 6 keys', function() {
        assert.equal(Object.keys(random.selectRandomEntity(gameTuning.buildNewModifiers(modWords))).length, 6, 'expects an array of objects with 6 keys');
    });
    it('should return an array of objects containing specific keys', function() {
        assert.strictEqual(Object.keys(random.selectRandomEntity(gameTuning.buildNewModifiers(modWords)))[0], 'id', 'expects an array of objects with "id" key');
        assert.strictEqual(Object.keys(random.selectRandomEntity(gameTuning.buildNewModifiers(modWords)))[1], 'label', 'expects an array of objects with "label" key');
        assert.strictEqual(Object.keys(random.selectRandomEntity(gameTuning.buildNewModifiers(modWords)))[2], 'values', 'expects an array of objects with "values" key');
        assert.strictEqual(Object.keys(random.selectRandomEntity(gameTuning.buildNewModifiers(modWords)))[3], 'isChecked', 'expects an array of objects with "isChecked" key');
        assert.strictEqual(Object.keys(random.selectRandomEntity(gameTuning.buildNewModifiers(modWords)))[4], 'modCluster', 'expects an array of objects with "modCluster" key');
        assert.strictEqual(Object.keys(random.selectRandomEntity(gameTuning.buildNewModifiers(modWords)))[5], 'description', 'expects an array of objects with "description" key');
    });
});

describe('buildDifficultyNaming function', function() {
    const checkedDifficulties = [
        {
            stringOrder: 2,
            article: 'a',
            label: 'cat',
        },
        {
            stringOrder: 0,
            article: 'an',
            label: 'exceptional',
        },
        {
            stringOrder: 1,
            article: 'a',
            label: 'stray',
        },
    ];
    it('should return a string', function() {
        assert.isString(gameTuning.buildDifficultyNaming(checkedDifficulties), 'expects a string');
    });
    it('should return a specific string', function() {
        assert.equal(gameTuning.buildDifficultyNaming(checkedDifficulties), 'as an "exceptional stray cat"', 'excepts a certain string');
    });
});
