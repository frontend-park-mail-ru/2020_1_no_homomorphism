const serverPath = 'http://89.208.199.170:8081';

/**
 * POST
 * @static
 * @param {string} path
 * @param {Object} body
 * return {Promise<Response>}
 */
export let postFetch = (path = '/', body = {}) => {
    return fetch(serverPath + path, {
        method: 'POST',
        mode: 'cors', // no-cors, cors, *same-origin (последнее - значение по умолчанию)
        credentials: 'include', // include, *same-origin, omit (относится к кукам)
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(body),
    });
};

/**
 * GET
 * @static
 * @param {string} path
 * @param {Object} body
 * return {Promise<Response>}
 */
export let getFetch = (path = '/', body = {}) => {
    return fetch(serverPath + path, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
    });
};

/**
 * DELETE
 * @static
 * @param {string} path
 * return {Promise<Response>}
 */
export let deleteFetch = (path = '/') => {
    return fetch(serverPath + path, {
        method: 'DELETE',
        mode: 'cors',
        credentials: 'include',
    });
};

/**
 * PUT
 * @static
 * @param {string} path
 * @param {Object} body
 * return {Promise<Response>}
 */
export let putFetch = (path = '/', body = {}) => {
    return fetch(serverPath + path, {
        method: 'PUT',
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(body),
    });
};

/**
 * POST IMAGE
 * @static
 * @param {string} path
 * @param {Object} body
 * return {Promise<Response>}
 */
export let postImageFetch = (path = '/image', body = {}) => {
    return fetch(serverPath + path, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body: body,
    });
};

/**
 * PATCH
 * @static
 * @param {string} path
 * @param {Object} body
 * return {Promise<Response>}
 */
export let patchFetch = (path = '/', body = {}) => {
    return fetch(serverPath + path, {
        method: 'PATCH',
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(body),
    });
};
