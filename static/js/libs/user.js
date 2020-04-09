export let CSRF_TOKEN = '';

export const setToken = (token) => {
    console.log(token);
    CSRF_TOKEN = token;
};
