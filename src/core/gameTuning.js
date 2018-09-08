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
        label: 'lexical',
        param: 'rel_trg=',
        value: '',
        option: '',
        isChecked: false,
        modCluster: 'parameter',
        description: 'Guide the game towards lexical fields.',
    },
    {
        label: 'semantic',
        param: 'ml=',
        value: '',
        option: '',
        isChecked: false,
        modCluster: 'parameter',
        description: 'The game will try to associate meaning of words.',
    },
    {
        label: 'phonetic',
        param: 'sl=',
        value: '',
        option: '',
        isChecked: false,
        modCluster: 'parameter',
        description: 'The game will search for similar sounds.',
    },
    {
        label: 'rhyme',
        param: 'rel_rhy=',
        value: '',
        option: '',
        isChecked: false,
        modCluster: 'parameter',
        description: 'The game will search for rhymes.',
    },
    {
        label: 'español',
        param: 'ml=',
        value: 'ahora', // need more random
        option: '&v=es',
        isChecked: false,
        modCluster: 'all',
        description: 'Gives a higher probability of Spanish words. With accentuation.',
    },
];

const DIFFICULTIES = [
    {
        label: 'snail',
        article: 'a',
        isChecked: false,
        stringOrder: 3,
        description: 'Need more time to type a word? This also mean smaller score combo...',
    },
    {
        label: 'economist',
        article: 'an',
        isChecked: false,
        stringOrder: 2,
        description: 'Keep time between each words but no time bonus score for you.',
    },
    {
        label: 'resilient',
        article: 'a',
        isChecked: false,
        stringOrder: 0,
        description: 'No break time between each levels but a really better score multiplier...',
    },
    {
        label: 'masochist',
        article: 'a',
        isChecked: false,
        stringOrder: 1,
        description: 'They say there is more point to do when you\'re in hell...',
    },
];

export default {
    getEmptyMods() {
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
};
