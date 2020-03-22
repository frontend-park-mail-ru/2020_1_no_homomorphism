import {postFetch, getFetch, deleteFetch, putFetch, postImageFetch} from './fetch.js';

/**
 * API object
 * @class
 * @type {Api}
 */
export default class Api {
    /**
     * Логин вход
     * @param {string} login
     * @param {string} password
     * @return {Promise<Response>}
     */
    static loginFetch(login, password) {
        return postFetch('/login', {
            'login': login,
            'password': password,
        }).catch((error) => console.error(error));
    }

    /**
     * Логаут
     * @return {Promise<Response>}
     */
    static logoutFetch() {
        return deleteFetch('/logout').catch((error) => console.error(error));
    }

    /**
     * Регистрация
     * @param {string} name
     * @param {string} login
     * @param {string} sex
     * @param {string} email
     * @param {string} password
     * @return {Promise<Response>}
     */
    static signupFetch(name = '', login, sex = '', email = '', password) {
        return postFetch('/signup', {
            'name': name,
            'login': login,
            'sex': 'yes',
            'email': email,
            'password': password,
        }).catch((error) => console.error(error));
    }

    /**
     * Профиль просмотр
     * @return {Promise<Response>}
     */
    static profileFetch() {
        return getFetch('/profile/me').catch((error) => console.error(error));
    }

    /**
     * Профиль настройка
     * @param {string} name
     * @param {string} email
     * @param {string} password
     * @param {string} newPassword
     * @return {Promise<Response>}
     */
    static profileEditFetch(name, email, password, newPassword) {
        return putFetch('/profile/settings', {
            name,
            email,
            password,
            newPassword,
        }).catch((error) => console.error(error));
    }

    /**
     * Отправка фоточки
     * @param {Object} image
     * @return {Promise<Response>}
     */
    static profilePhotoFetch(image) {
        return postImageFetch('/image', image)
            .catch((error) => console.error(error));
    }

    /**
     * Получение плейлиста
     * @param {string} name
     * @return {Promise<Response>}
     */
    static playerFetch(name) {
        return getFetch(`/player/${name}`)
            .catch((error) => console.error(error));
    }

    /**
     * Проверка куки
     * @return {Promise<Response>}
     */
    static cookieFetch() {
        return getFetch('/user')
            .catch((error) => console.error(error));
    }

    /**
     * Получение трека
     * @param {string} id
     * @return {Promise<Response>}
     */
    static trackFetch(id) {
        return getFetch(`/track/${id}`)
            .catch((error) => console.error(error));
    }
}
