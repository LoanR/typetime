export default {
    shuffleTitle(title) {
        let movableLettersIndices = [1, 2, 3, 5, 6];
        let titleCopy = title.split('');
        const firstLetterIndice = movableLettersIndices.splice(this.randomNum(movableLettersIndices.length, 0), 1);
        const firstLetter = title[firstLetterIndice];
        const secondLetterIndice = movableLettersIndices.splice(this.randomNum(movableLettersIndices.length, 0), 1);
        const secondLetter = titleCopy.splice(secondLetterIndice, 1, firstLetter)[0];
        titleCopy.splice(firstLetterIndice, 1, secondLetter).join('');
        return titleCopy.join('');
    },

    randomNum(range, start) {
        return Math.floor(Math.random() * range) + start;
    },
};
