import {postFetch, getFetch, deleteFetch, patchFetch, putFetch} from "./fetch";

/**
 * API object
 * @class
 * @type {Api}
 */
export default class Api {
    /**
     * Логин вход
     * @param {string} email
     * @param {string} password
     * @returns {Promise<Response>}
     */
    static loginFetch({email, password}) {
        return postFetch('/login', {
            email,
            password,
        });
    }

    /**
     * Логаут
     * @returns {Promise<Response>}
     */
    static logoutFetch() {
        return deleteFetch();
    }

    /**
     * Регистрация
     * @param {string} name
     * @param {string} login
     * @param {string} sex
     * @param {string} email
     * @param {string} password
     * @returns {Promise<Response>}
     */
    static signupFetch({name, login, sex, email, password}) {
        return postFetch('/signup', {
            name,
            login,
            sex,
            email,
            password,
        });
    }

    /**
     * Профиль просмотр
     * @returns {Promise<Response>}
     */
    static profileFetch() {
        return getFetch('/profile');
    }

    /**
     * Профиль настройка
     * @param {string} name
     * @param {string} login
     * @param {string} sex
     * @param {string} email
     * @param {string} password
     * @param {string} prevPassword
     * @returns {Promise<Response>}
     */
    static profileEditFetch({name, login, sex, email, password, prevPassword}) {
        return patchFetch('/profile/settings', {
            name,
            login,
            sex,
            email,
            password,
            prevPassword,
        });
    }

    /**
     * Отправка фоточки (отдельно, тк Димуля попросил)
     * @param {string} image
     * @returns {Promise<Response>}
     */
    static profilePhotoFetch(image) {
        return putFetch('/image', {
            image: image,
        })
        //const fileField = document.querySelector('input[type="file"]');
        //return putFetch('/image', {
        //    image: fileField.files[0],
        //})
    }
    /**
     * Получение плейлиста
     * @param {string} name
     * @returns {Promise<Response>}
     */
    static playerFetch(name) {
        return getFetch(`/player/${name}`);
    }
}