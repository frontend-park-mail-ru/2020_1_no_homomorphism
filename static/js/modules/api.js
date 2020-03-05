'use strict';
import {postFetch, getFetch, deleteFetch, patchFetch, putFetch, postImageFetch} from "./fetch.js";

/**
 * API object
 * @class
 * @type {Api}
 */
export class Api {
    /**
     * Логин вход
     * @param {string} login
     * @param {string} password
     * @returns {Promise<Response>}
     */
    static loginFetch(login, password) {
        return postFetch('/login', {
            'login': login,
            'password': password,
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
     * @param {string} image
     * @returns {Promise<Response>}
     */
    static signupFetch(name = '', login, sex = '', email = '', password ) {
        //console.log('SIGNUP FETCH');
        return postFetch('/signup', {
            'name': name,
            'login': login,
            'sex': '',
            'email': email,
            'password': password,
        }).catch(error => console.error(error))
    }

    /**
     * Профиль просмотр
     * @returns {Promise<Response>}
     */
    static profileFetch() {
        return getFetch('/profile/me').catch(error => console.error(error))
    }

    /**
     * Профиль настройка
     * @param {string} name
     * @param {string} email
     * @param {string} password
     * @param {string} newPassword
     * @returns {Promise<Response>}
     */
    static profileEditFetch(name, email, password, newPassword) {
        return putFetch('/profile/settings', {
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
        console.log('PHOTO');
        return postImageFetch('/image', image)
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

    /**
     * Проверка куки
     * @returns {Promise<Response>}
     */
    static cookieFetch() {
        return getFetch(`/user`)
            .catch(error => console.error(error))
    }

    /**
     * Получение трека
     * @param {string} id
     * @returns {Promise<Response>}
     */
    static trackFetch(id) {
        return getFetch(`/track/${id}`)
            .catch(error => console.error(error))
    }
}
