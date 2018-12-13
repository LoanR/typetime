import random from './random';
import {requestDataWords} from './wordRequest';

const BASE_MODIFIER = {
    label: '',
    values: {},
    isChecked: false,
    modCluster: '',
    description: '',
};

const DEFAULT_CONSTRAINT = 'ml=';
const DEFAULT_OPTION = '';

const EMPTY_MODS = [
    {
        label: '',
        isChecked: false,
    },
    {
        label: '',
        isChecked: false,
    },
    {
        label: '',
        isChecked: false,
    },
    {
        label: '',
        isChecked: false,
    },
];

const MODIFIERS = [
    {
        id: 'lexical',
        label: 'lexical',
        values: {wordsConstraint: 'rel_trg='},
        isSelected: false,
        isChecked: false,
        modCluster: 'parameter',
        description: 'Guide the game towards lexical fields.',
    },
    {
        id: 'semantic',
        label: 'semantic',
        values: {wordsConstraint: 'ml='},
        isSelected: false,
        isChecked: false,
        modCluster: 'parameter',
        description: 'The game will try to associate meaning of words.',
    },
    {
        id: 'phonetic',
        label: 'phonetic',
        values: {wordsConstraint: 'sl='},
        isSelected: false,
        isChecked: false,
        modCluster: 'parameter',
        description: 'The game will search for similar sounds.',
    },
    {
        id: 'rhyme',
        label: 'rhyme',
        values: {wordsConstraint: 'rel_rhy='},
        isSelected: false,
        isChecked: false,
        modCluster: 'parameter',
        description: 'The game will search for rhymes.',
    },
    {
        id: 'español',
        label: 'español',
        values: {
            wordsConstraint: 'ml=',
            wordsTheme: 'ahora', // need more random
            wordsOption: '&v=es',
        },
        isSelected: false,
        isChecked: false,
        modCluster: 'all',
        description: 'Gives a higher probability of Spanish words. With accentuation.',
    },
];

const DIFFICULTIES = [
    {
        id: 'isSnail',
        label: 'snail',
        article: 'a',
        isChecked: false,
        stringOrder: 3,
        description: 'Need more time to type a word? This also mean smaller score combo...',
    },
    {
        id: 'isEconomist',
        label: 'economist',
        article: 'an',
        isChecked: false,
        stringOrder: 2,
        description: 'Keep time between each words but no time bonus score for you.',
    },
    {
        id: 'isResilient',
        label: 'resilient',
        article: 'a',
        isChecked: false,
        stringOrder: 0,
        description: 'No break time between each levels but a really better score multiplier...',
    },
    {
        id: 'isMasochist',
        label: 'masochist',
        article: 'a',
        isChecked: false,
        stringOrder: 1,
        description: 'They say there is more point to do when you\'re in hell...',
    },
];

export default {
    getEmptyMods() {
        let emptyMods = [];
        for (let i = 4; i > 0; i--) { // magic number '4' should be a global with number of visible modifiers.
            emptyMods.push(BASE_MODIFIER);
        }
        return EMPTY_MODS;
    },

    getModifiers() {
        return MODIFIERS;
    },

    getDifficulties() {
        return DIFFICULTIES;
    },

    isSnail(difficulties) {
        return difficulties.find(dif => dif.label === 'snail').isChecked;
    },

    isEconomist(difficulties) {
        return difficulties.find(dif => dif.label === 'economist').isChecked;
    },

    isResilient(difficulties) {
        return difficulties.find(dif => dif.label === 'resilient').isChecked;
    },

    isMasochist(difficulties) {
        return difficulties.find(dif => dif.label === 'masochist').isChecked;
    },

    getWordsContext(modifiers, selectedModifiers) {
        let wordsContext = {
            wordsConstraint: this.defaultConstraint(),
            wordsTheme: this.defaultTheme(modifiers), // need more random
            wordsOption: this.defaultOption(),
        };
        const checkedModifiers = selectedModifiers.filter(mod => !!mod.isChecked);
        for (let mod of checkedModifiers) {
            for (let param in mod.values) {
                wordsContext[param] = mod.values[param];
            }
        }
        return wordsContext;
    },

    defaultConstraint() {
        return DEFAULT_CONSTRAINT;
    },

    defaultTheme(modifiers) {
        const wordModifiers = modifiers.filter(mod => mod.modCluster === 'word');
        return wordModifiers[random.randomNum(wordModifiers.length)].values.wordsTheme;
    },

    defaultOption() {
        return DEFAULT_OPTION;
    },
    // resposibility to create other modifiers ?

    selectModifiers(modifiers) {
        // this.modifiers.push(...await this.getNewModifiers());
        // for (let i = 4; i > 0; i--) { // same global visible mods
        //     this.selectedModifiers.splice(i, 1, this.modifiers.splice(random.randomNum(this.modifiers.length, 0), 1)[0]);
        // }
        let selectedModifiers = random.selectRandomEntities(4, modifiers);
        selectedModifiers.map(mod => {
            mod.isSelected = true;
            return mod;
        });
        return modifiers;
    },

    async getNewModifiers() {
        const accentValues = ['*é*', '*è*', '*ê*', '*ë*', '*â*', '*ï*'];
        const rareAccentValues = ['*á*', '*å*', '*ë*', '*â*', '*í*', '*ö*', '*ó*', '*ü*', '*ú*'];
        const modWords = [
            {param: 'ml=', value: 'toujours'}, // need more random
            {param: 'ml=', value: 'voiture'}, // need more random
            {param: 'ml=', value: 'live'}, // need more random
            {param: 'ml=', value: 'reason'}, // need more random
            {param: 'sp=', value: accentValues[random.randomNum(accentValues.length, 0)]},
            {param: 'sp=', value: rareAccentValues[random.randomNum(rareAccentValues.length, 0)]},
        ];
        let mods = [];
        for (const modWord of modWords) {
            mods = await this.addWordModifier(mods, modWord.param, modWord.value); // why rewrite mods ?
        }
        const modsToAdd = [];
        for (const mod of mods) {
            modsToAdd.push(
                {
                    label: '"' + mod + '"',
                    values: {wordsTheme: mod},
                    isSelected: false,
                    isChecked: false,
                    modCluster: 'word',
                    description: 'Suggest the game to search for words around "' + mod + '".',
                } // use BASE_MODIFIER
            );
        }
        return modsToAdd;
    },

    async addWordModifier(mods, param, value) {
        try {
            const word = (await requestDataWords(1, param, value, '', false))[0];
            if (mods.indexOf(word) !== -1) {
                return null; // ???
            }
            mods.push(word);
            return mods;
        } catch (error) {
            this.restartGame();
            window.alert('We couldn\'t build consistent modifiers, please launch a new game...');
        }
    },
};
