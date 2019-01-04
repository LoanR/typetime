import random from './random';
import {ACCENTS, RARE_ACCENTS, THINGS, PLACES, IDEAS, THINGS_FR, OTHERS_FR} from '../conf/wordSeed';
import {MODS_TO_SHOW, BASE_MODIFIER, MODIFIERS, DIFFICULTIES, DEFAULT_CONSTRAINT, DEFAULT_OPTION, MOD_SELECTION_RULE} from '../conf/modifiersFrame';
import {requestAndSelectWords} from './wordRequest';

export default {
    getEmptyMods() {
        let emptyMods = [];
        for (let i = MODS_TO_SHOW; i > 0; i--) {
            emptyMods.push(BASE_MODIFIER);
        }
        return emptyMods;
    },

    getModifiers() { // usefull?
        return MODIFIERS;
    },

    getDifficulties() { // usefull?
        return DIFFICULTIES;
    },

    getWordsContext(modifiers, selectedModifiers) {
        let wordsContext = {
            wordsConstraint: this.defaultConstraint(),
            wordsTheme: this.defaultTheme(modifiers),
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

    defaultConstraint() { // usefull?
        return DEFAULT_CONSTRAINT;
    },

    defaultTheme(modifiers) {
        const wordModifiers = modifiers.filter(mod => mod.modCluster === 'word');
        return random.selectRandomEntity(wordModifiers).values.wordsTheme;
    },

    defaultOption() { // usefull?
        return DEFAULT_OPTION;
    },

    getSpecificModifierSearchValues() {
        return [
            {wordsConstraint: 'ml=', wordsTheme: random.selectRandomEntity(THINGS_FR), wordsOption: ''},
            {wordsConstraint: 'ml=', wordsTheme: random.selectRandomEntity(OTHERS_FR), wordsOption: ''},
            {wordsConstraint: 'ml=', wordsTheme: random.selectRandomEntity(THINGS), wordsOption: ''},
            {wordsConstraint: 'ml=', wordsTheme: random.selectRandomEntity(PLACES), wordsOption: ''},
            {wordsConstraint: 'ml=', wordsTheme: random.selectRandomEntity(IDEAS), wordsOption: ''},
            {wordsConstraint: 'sp=', wordsTheme: random.selectRandomEntity(ACCENTS), wordsOption: ''},
            {wordsConstraint: 'sp=', wordsTheme: random.selectRandomEntity(RARE_ACCENTS), wordsOption: ''},
        ];
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
                }
            );
        }
        return modsToAdd;
    },

    buildDifficultyNaming(checkedDifficulties) {
        checkedDifficulties.sort((d1, d2) => d1.stringOrder - d2.stringOrder);
        return checkedDifficulties.length ? ('as ' + checkedDifficulties[0].article + ' "' + checkedDifficulties.map(d => d.label).join(' ') + '", ') : '';
    },

    async getNewModifiers(isExternalRequest = true) {
        try {
            const modSearchValues = this.getSpecificModifierSearchValues();
            const pSelectedModWords = modSearchValues.map(async(modTheme) => this._addWordModifier(modTheme, isExternalRequest));
            const selectedModWords = await Promise.all(pSelectedModWords);
            return this.buildNewModifiers(selectedModWords);
        } catch (error) {
            throw new Error(error);
        }
    },

    async _addWordModifier(modTheme, isExternalRequest) {
        try {
            return random.selectRandomEntity(await requestAndSelectWords(1, modTheme, MOD_SELECTION_RULE, isExternalRequest));
        } catch (error) {
            throw new Error(error);
        }
    },
};
