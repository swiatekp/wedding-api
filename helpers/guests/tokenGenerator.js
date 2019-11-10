const getRandomValues = require('get-random-values');
const secureMathRandom = (max) => {
    //Returns a cryptographically secure integer from 1 to 9
    //Takes the maximal expected value as the parameter
    return Math.floor(getRandomValues(new Uint8Array(1))[0] / 255 * max); //Max 8 bit int value is 255
}

module.exports.getToken = () => {
    const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'q', 'p', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    let token = "";

    while (token.length < 6) {
        if (secureMathRandom(9) % 2 === 0) {
            //if a random number is even, pick a random letter
            token += alphabet[secureMathRandom(alphabet.length - 1)];
        }
        else {
            token += secureMathRandom(8) + 1;
        }
    }
    return token;
}
