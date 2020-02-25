/**
 * Получение урла сервера
 * return {string}
 */
const getServerPath = () => {
    return 'https://kek.ru'
};
/**
 * POST
 * @static
 * @param {string} path
 * @param {Object} body
 * return {Promise<Response>}
 */
export let postFetch = (path = '/', body = {}) => {
    return fetch(getServerPath() + path, {
        method: 'POST',
        mode: 'cors', // no-cors, cors, *same-origin (последнее - значение оп умолчанию)
        credentials: 'include', // include, *same-origin, omit (относится к кукам)
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(body),

    }).then(response => response.json());
};
/**
 * GET
 * @static
 * @param {string} path
 * @param {Object} body
 * return {Promise<Response>}
 */
export let getFetch = (path = '/', body = {}) => {
    return fetch(getServerPath() + path, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
    }).then(response => response.json());
};
/**
 * DELETE
 * @static
 * @param {string} path
 * return {Promise<Response>}
 */
export let deleteFetch = (path = '/') => {
    return fetch(getServerPath() + path, {
        method: 'DELETE',
        mode: 'cors',
        credentials: 'include',
    }).then(response => response.json());
};
/**
 * PUT
 * @static
 * @param {string} path
 * @param {Object} body
 * return {Promise<Response>}
 */
export let putFetch = (path = '/', body = {}) => {
    return fetch(getServerPath() + path, {
        method: 'PUT',
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(body),
    }).then(response => response.json());
};
/**
 * PATCH
 * @static
 * @param {string} path
 * @param {Object} body
 * return {Promise<Response>}
 */
export let patchFetch = (path = '/', body = {}) => {
    return fetch(getServerPath() + path, {
        method: 'PATCH',
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(body),
    }).then(response => response.json());
};
