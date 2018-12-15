export const scoreMutations = {
    resetScore(state) {
        state.score.gameScore = 0;
        state.score.difficultyNaming = '';
    },

    setScore(state, payload) {
        state.score.gameScore = payload.newScore;
    },

    setLetterCombo(state, payload) {
        state.score.letterCombo = payload.newLetterCombo;
    },

    resetLetterCombo(state) {
        state.score.letterCombo = 0;
    },

    setDifficultyNaming(state, payload) {
        state.score.difficultyNaming = payload.difficultyNaming;
    },

    setGameOverWord(state, payload) {
        state.score.nemesisLetter = payload.nemesisLetter;
        state.score.stuckWordPart1 = payload.stuckWordPart1;
        state.score.stuckWordPart2 = payload.stuckWordPart2;
    },
};
