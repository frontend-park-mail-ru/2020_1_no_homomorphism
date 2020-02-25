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
        }).catch(error => console.error(error))
    }
    /**
     * Логаут
     * @returns {Promise<Response>}
     */
    static logoutFetch() {
        return deleteFetch().catch(error => console.error(error))
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
        }).catch(error => console.error(error))
    }
    /**
     * Профиль просмотр
     * @returns {Promise<Response>}
     */
    static profileFetch() {
        return getFetch('/profile').catch(error => console.error(error))
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
        }).catch(error => console.error(error))
    }
    /**
     * Отправка фоточки (отдельно, тк Димуля попросил)
     * @param {string} image
     * @returns {Promise<Response>}
     */
    static profilePhotoFetch(image) {
        return putFetch('/image', {
            image: image,
        }).catch(error => console.error(error))
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
        return getFetch(`/player/${name}`)
            .catch(error => console.error(error))
    }
}
