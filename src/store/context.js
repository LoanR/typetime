export const contextMutations = {
    setWordsContext(state, payload) {
        state.wordsContext.wordsConstraint = payload.wordsContext.wordsConstraint;
        state.wordsContext.wordsTheme = payload.wordsContext.wordsTheme;
        state.wordsContext.wordsOption = payload.wordsContext.wordsOption;
    },

    setWordsThemeContext(state, payload) {
        state.wordsContext.wordsTheme = payload.wordsTheme;
    },
};
