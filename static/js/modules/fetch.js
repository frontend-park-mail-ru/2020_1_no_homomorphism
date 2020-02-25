/**
 * Получение урла сервера
 * return {string}
 */
const getServerUrl = () => {
    return '/serverurl'
};
/**
 * POST
 * @static
 * @param {string} path
 * @param {Object} body
 * return {Promise<Response>}
 */
export function postFetch(path = '/', body = {}) {
    return fetch(getServerUrl() + path, {
        method: 'POST',
        mode: 'cors', // no-cors, cors, *same-origin (последнее - значение оп умолчанию)
        credentials: 'include', // include, *same-origin, omit (относится к кукам)
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
    });
}
/**
 * GET
 * @static
 * @param {string} path
 * @param {Object} body
 * return {Promise<Response>}
 */
export function getFetch(path = '/', body = {}) {
    return fetch(getServerUrl() + path, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
    });
}
/**
 * DELETE
 * @static
 * @param {string} path
 * return {Promise<Response>}
 */
export function deleteFetch(path = '/') {
    return fetch(getServerUrl() + path, {
        method: 'DELETE',
        mode: 'cors',
        credentials: 'include',
    });
}
/**
 * PUT
 * @static
 * @param {string} path
 * @param {Object} body
 * return {Promise<Response>}
 */
function putFetch(path = '/', body = {}) {
    return fetch(getServerUrl() + path, {
        method: 'PUT',
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
    });
}
/**
 * PATCH
 * @static
 * @param {string} path
 * @param {Object} body
 * return {Promise<Response>}
 */
function patchFetch(path = '/', body = {}) {
    return fetch(getServerUrl() + path, {
        method: 'DELETE',
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
    });
}
