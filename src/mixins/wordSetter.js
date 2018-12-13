export const searchForWordsToType = async function(store) {
    store.dispatch(
        'requestAndSetWordsToType',
        {
            wordsContext: store.state.wordsContext,
            levelRules: store.state.rules.levelRules,
            currentLevel: store.state.rules.levelRules.currentLevel,
            wordsSetting: store.state.wordsSetting,
            filterAgainstRules: true,
            wordsSelectionRules: store.state.rules.wordsSelectionRules,
            // wordAmount: this.wordsToTypeCount,
            // wordsConstraint: this.$store.state.wordsContext.wordsConstraint,
            // wordsTheme: this.$store.state.wordsContext.wordsTheme,
            // wordsOption: this.$store.state.wordsContext.wordsOption,
            // gameLevel: this.gameLevel,
            // isMasochist: gameTuning.isMasochist(this.difficulties),
            // capitalizeProbability: wordSelection.getLevelRule(gameTuning.isMasochist(this.difficulties), this.gameLevel).capitalizeProbability,
        }, // all in state level rule
    );
};

export const searchForNextWordsToType = async function(store) {
    store.dispatch(
        'requestAndSetNextWordsToType',
        {
            wordsContext: store.state.wordsContext,
            levelRules: store.state.rules.levelRules,
            currentLevel: store.state.rules.levelRules.currentLevel,
            wordsSetting: store.state.wordsSetting,
            filterAgainstRules: true,
            wordsSelectionRules: store.state.rules.wordsSelectionRules,
            // wordAmount: this.wordsToTypeCount,
            // wordsConstraint: this.$store.state.wordsContext.wordsConstraint,
            // wordsTheme: this.$store.state.wordsContext.wordsTheme,
            // wordsOption: this.$store.state.wordsContext.wordsOption,
            // gameLevel: this.gameLevel,
            // isMasochist: gameTuning.isMasochist(this.difficulties),
            // capitalizeProbability: wordSelection.getLevelRule(gameTuning.isMasochist(this.difficulties), this.gameLevel).capitalizeProbability,
        }, // all in state level rule
    );
};
