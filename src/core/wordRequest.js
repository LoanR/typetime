const API_ENDPOINT = 'https://api.datamuse.com/words?'; // in store or in conf file ?
const FREQUENCY_PARAMETER = '&md=f';

// func ensure minimum words
// if not ensure, new request => how to test ? => mocking the request

export const requestDataWords = async function(wordAmount, queryParameter, queryValue, queryOption = '') { // generisize and modulize => this func doesnt only request
    try {
        let apiWords = [];
        let i = 1;
        // while (apiWords.length < wordAmount) {
        while (i === 1) {
            if (i > 1) {
                queryParameter = 'ml=';
                if (i > 2) {
                    queryValue = 'effect'; // need more random than default 'effect' word
                }
            }
            apiWords.unshift(...await datamuseWordsRequest(queryParameter, queryValue, queryOption));
            i += 1;
        }
        return apiWords;
    } catch (error) {
        throw new Error(error);
    }
};

async function datamuseWordsRequest(queryParameter, queryValue, queryOption) {
    try {
        // let truc = await fetch(API_ENDPOINT + queryParameter + queryValue + queryOption + FREQUENCY_PARAMETER).json();
        // let truc = await (await fetch(API_ENDPOINT + queryParameter + queryValue + queryOption + FREQUENCY_PARAMETER)).json();
        // console.log(truc);
        return await (await fetch(API_ENDPOINT + queryParameter + queryValue + queryOption + FREQUENCY_PARAMETER)).json();
    } catch (error) {
        throw new Error(error);
    }
}
