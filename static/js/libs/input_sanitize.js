const symbols = {
    '&amp': /&/g,
    '&quot': /"/g,
    '&apos': /'/g,
    '&lt': /</g,
    '&gt': />/g,
    ' ': /(\w+\s*)=(\s*".*?")/g,
};

// eslint-disable-next-line valid-jsdoc
/**
 * xss
 * @param {String} input
 */
export const inputSanitize = (input) => {
    let resString = input;
    Object.keys(symbols).map((key) => {
        resString = resString.replace(symbols[key], key);
    });
    return resString;
};
