import {postFetch, getFetch, deleteFetch, putFetch, postImageFetch} from '@libs/fetch.js';
import {API} from '@libs/constans';
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
        console.log('loginFetch');
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
        console.log('logoutFetch');
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
        console.log('signupFetch');
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
        console.log('profileFetch');
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
        console.log('profileEditFetch');
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
        console.log('profilePhotoFetch');
        return postImageFetch('/image', image)
            .catch((error) => console.error(error));
    }

    /**
     * Получение плейлистов пользователя
     * @return {Promise<Response>}
     */
    static profilePlaylistsFetch() {
        console.log('profilePlaylistsFetch');
        return getFetch('/profile/playlists')
            .catch((error) => console.error(error));
    }

    /**
     * Получение треков альбома
     * @param {number} id
     * @return {Promise<Response>}
     */
    static albumFetch(id) {
        console.log('albumFetch');
        return getFetch(`/albums/${id}`)
            .catch((error) => console.error(error));
    }

    /**
     * Получение альбомов пользователя
     * @return {Promise<Response>}
     */
    static profileAlbumFetch() {
        console.log('profileAlbumFetch');
        return getFetch('/profile/albums')
            .catch((error) => console.error(error));
    }

    /**
     * Получение треков плейлиста
     * @param {number} id
     * @return {Promise<Response>}
     */
    static playlistTracksFetch(id) {
        console.log('playlistTracksFetch');
        return getFetch(`/playlists/${id}`)
            .catch((error) => console.error(error));
    }

    /**
     * Получение плейлиста
     * @param {string} name
     * @return {Promise<Response>}
     */
    static playerFetch(name) {
        console.log('playerFetch');
        return getFetch(`/player/${name}`)
            .catch((error) => console.error(error));
    }

    /**
     * Проверка куки
     * @return {Promise<Response>}
     */
    static cookieFetch() {
        console.log('cookieFetch');
        return getFetch('/user')
            .catch((error) => console.error(error));
    }

    /**
     * Получение трека
     * @param {string} id
     * @return {Promise<Response>}
     */
    static trackFetch(id) {
        console.log('trackFetch');
        return getFetch(`/track/${id}`)
            .catch((error) => console.error(error));
    }
}
