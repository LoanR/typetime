export const randomNum = (range, start = 0) => {
    return Math.floor(Math.random() * range) + start;
};
