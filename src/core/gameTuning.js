import random from './random';

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
        return random.selectRandomEntity(wordModifiers).values.wordsTheme;
    },

    defaultOption() {
        return DEFAULT_OPTION;
    },

    getSpecificModifierSearchValues() {
        const accentValues = ['*é*', '*è*', '*ê*', '*ë*', '*â*', '*ï*']; // conf
        const rareAccentValues = ['*á*', '*å*', '*ë*', '*â*', '*í*', '*ö*', '*ó*', '*ü*', '*ú*']; // conf
        const modWords = [
            {param: 'ml=', value: 'toujours'}, // need more random conf
            {param: 'ml=', value: 'voiture'}, // need more random conf
            {param: 'ml=', value: 'live'}, // need more random conf
            {param: 'ml=', value: 'reason'}, // need more random conf
            {param: 'sp=', value: random.selectRandomEntity(accentValues)},
            {param: 'sp=', value: random.selectRandomEntity(rareAccentValues)},
        ];
        return modWords;
    },

    buildNewModifiers(modWords) {
        const modsToAdd = [];
        for (const mod of modWords) {
            modsToAdd.push(
                {
                    id: '"' + mod + '"',
                    label: '"' + mod + '"',
                    values: {wordsTheme: mod},
                    isChecked: false,
                    modCluster: 'word',
                    description: 'Suggest the game to search for words around "' + mod + '".',
                } // use BASE_MODIFIER
            );
        }
        return modsToAdd;
    },

    buildDifficultyNaming(checkedDifficulties) {
        checkedDifficulties.sort((d1, d2) => d1.stringOrder - d2.stringOrder);
        return checkedDifficulties.length ? ('as ' + checkedDifficulties[0].article + ' "' + checkedDifficulties.map(d => d.label).join(' ') + '", ') : '';
    },
};
