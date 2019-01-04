import {LETTER_SCORE_MAPPING, LETTER_COMBO_MAPPING} from '../conf/letterScores';
import {DEFAULT_KEY, SNAIL_KEY, MASOCHIST_KEY} from '../conf/keyCorrespondance';

export default {
    getFinalMultiplier(letterCombo, isSnail, isMasochist, isResilient, level) {
        const combo = this._getCurrentCombo(letterCombo, isSnail, isMasochist);
        return isResilient ? combo + (level - 1) * 2 : combo + level - 1; // magic
    },

    _getCurrentCombo(letterCombo, isSnail, isMasochist) {
        const mappingKey = Object.keys(LETTER_COMBO_MAPPING).reduce((prev, current) => {
            return letterCombo >= current ? current : prev;
        });
        let comboDifficulty = DEFAULT_KEY;
        if (isSnail && !isMasochist) {
            comboDifficulty = SNAIL_KEY;
        } else if (isMasochist && !isSnail) {
            comboDifficulty = MASOCHIST_KEY;
        }
        return LETTER_COMBO_MAPPING[mappingKey][comboDifficulty];
    },

    getLetterScore(combo, letter) {
        const lsMapping = LETTER_SCORE_MAPPING;
        if (letter.toLowerCase() === letter) {
            return lsMapping[letter] ? lsMapping[letter] * combo : 3 * combo; // magic
        }
        return lsMapping[letter.toLowerCase()] ? (lsMapping[letter.toLowerCase()] + 1) * combo : 3 * combo; // magic
    },
};
