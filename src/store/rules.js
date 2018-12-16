export const wordsSelectionRulesMutations = {
    setWordsSelectionRules(state, payload) {
        state.rules.wordsSelectionRules.wordLength = payload.wordsSelectionRules.wordLength;
        state.rules.wordsSelectionRules.wordFrequencyInLanguage = payload.wordsSelectionRules.wordFrequencyInLanguage;
        state.rules.wordsSelectionRules.capitalizeProbability = payload.wordsSelectionRules.capitalizeProbability;
    },
};

export const difficultiesMutations = {
    setDifficulty(state, payload) {
        state.rules.gameDifficulties[payload.settingId] = payload.isChecked;
    },
};
