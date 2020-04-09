const symbols = {
    // '&amp': '&',
    // '&quot': '"',
    // '&apos': '\'',
    // '&lt': '<',
    // '&gt': '>',
    '&': ' &amp ',
    // eslint-disable-next-line no-useless-escape
    '/\"/g': ' &quot ',
    '\'': ' &apos ',
    '/\'/g': ' &apos ',
    '<': ' &lt ',
    '>': ' &gt ',
};

// eslint-disable-next-line valid-jsdoc
/**
 * xss
 * @param {String} input
 */
export const inputSanitize = (input) => {
    let resString = input;
    Object.keys(symbols).map((key) => {
        resString = resString.replace(key, symbols[key]);
    });
    return resString;
};
