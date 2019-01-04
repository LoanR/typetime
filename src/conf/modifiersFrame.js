import {SNAIL_KEY, ECONOMIST_KEY, RESILIENT_KEY, MASOCHIST_KEY} from './keyCorrespondance';
import {SPANISH} from './wordSeed';
import random from '../core/random';

export const BASE_MODIFIER = {
    id: '',
    label: '',
    values: {},
    isChecked: false,
    modCluster: '',
    description: '',
};

export const DEFAULT_CONSTRAINT = 'ml=';
export const DEFAULT_OPTION = '';

export const MODS_TO_SHOW = 4;

export const EMPTY_MODS = [
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

export const MODIFIERS = [
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
            wordsTheme: random.selectRandomEntity(SPANISH),
            wordsOption: '&v=es',
        },
        isSelected: false,
        isChecked: false,
        modCluster: 'all',
        description: 'Gives a higher probability of Spanish words. With accentuation.',
    },
];

export const DIFFICULTIES = [
    {
        id: 'isSnail',
        label: SNAIL_KEY,
        article: 'a',
        isChecked: false,
        stringOrder: 3,
        description: 'Need more time to type a word? This also mean smaller score combo...',
    },
    {
        id: 'isEconomist',
        label: ECONOMIST_KEY,
        article: 'an',
        isChecked: false,
        stringOrder: 2,
        description: 'Keep time between each words but no time bonus score for you.',
    },
    {
        id: 'isResilient',
        label: RESILIENT_KEY,
        article: 'a',
        isChecked: false,
        stringOrder: 0,
        description: 'No break time between each levels but a really better score multiplier...',
    },
    {
        id: 'isMasochist',
        label: MASOCHIST_KEY,
        article: 'a',
        isChecked: false,
        stringOrder: 1,
        description: 'They say there is more point to do when you\'re in hell...',
    },
];

export const MOD_SELECTION_RULE = {
    wordLength: {min: 3, max: 5},
    wordFrequencyInLanguage: {min: 50, max: 90000},
    capitalizeProbability: 0,
};
