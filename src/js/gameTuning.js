const modifiers = [
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
        value: 'ahora',
        option: '&v=es',
        isChecked: false,
        modCluster: 'all',
        description: 'Gives a higher probability of Spanish words. With accentuation.',
    },
];

const difficulties = [
    {
        label: 'snail',
        isChecked: false,
        stringOrder: 3,
        description: 'Need more time to type a word? This also mean smaller score combo...',
    },
    {
        label: 'economist',
        isChecked: false,
        stringOrder: 2,
        description: 'Keep time between each words but no time bonus score for you.',
    },
    {
        label: 'resilient',
        isChecked: false,
        stringOrder: 0,
        description: 'No break time between each levels but a really better score multiplier...',
    },
    {
        label: 'masochist',
        isChecked: false,
        stringOrder: 1,
        description: 'They say there is more point to do when you\'re in hell...',
    },
];

export default {
    getModifiers() {
        return modifiers;
    },

    getDifficulties() {
        return difficulties;
    },
};
