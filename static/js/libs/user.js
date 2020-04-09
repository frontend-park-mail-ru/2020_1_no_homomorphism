export let CSRF_TOKEN = '';

export const setToken = (token) => {
    CSRF_TOKEN = token;
};
