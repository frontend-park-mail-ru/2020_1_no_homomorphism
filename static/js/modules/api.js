'use strict';
import {postFetch, getFetch, deleteFetch, patchFetch, putFetch, putImageFetch} from "./fetch.js";

/**
 * API object
 * @class
 * @type {Api}
 */
export class Api {
    /**
     * Логин вход
     * @param {string} email
     * @param {string} password
     * @returns {Promise<Response>}
     */
    static loginFetch(email, password) {
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
        return deleteFetch('/logout').catch(error => console.error(error))
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
    static signupFetch(name, login, email, password) {
        console.log('SIGNUP FETCH');
        return postFetch('/signup', {
            name,
            login,
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
     * @param {string} newPassword
     * @returns {Promise<Response>}
     */
    static profileEditFetch(name, email, password, newPassword) {
        return patchFetch('/profile/settings', {
            name,
            email,
            password,
            newPassword,
        }).catch(error => console.error(error))
    }
    /**
     * Отправка фоточки
     * @param image
     * @returns {Promise<Response>}
     */
    static profilePhotoFetch(image) {

        return putImageFetch('/api/avatar', formData)
            .catch(error => console.error(error))
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