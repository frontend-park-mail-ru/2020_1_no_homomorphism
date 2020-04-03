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
        return postFetch(API + '/users/login', {
            'login': login,
            'password': password,
        }).catch((error) => console.error(error));
    }

    /**
     * Логаут
     * @return {Promise<Response>}
     */
    static logoutFetch() {
        return deleteFetch(API + '/users/logout').catch((error) => console.error(error));
    }

    /**
     * Проверка куки
     * @return {Promise<Response>}
     */
    static cookieFetch() {
        return getFetch(API + '/users')
            .catch((error) => console.error(error));
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
        return postFetch(API + '/users/signup', {
            'name': name,
            'login': login,
            'sex': 'yes',
            'email': email,
            'password': password,
        }).catch((error) => console.error(error));
    }

    /**
     * Артист просмотр
     * @return {Promise<Response>}
     */
    static artistFetch() {
        return getFetch(API + '').catch((error) => console.error(error));
    }

    /**
     * Профиль просмотр
     * @return {Promise<Response>}
     */
    static profileFetch() {
        return getFetch(API + '/users/me').catch((error) => console.error(error));
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
        return putFetch(API + '/users/settings', {
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
    static profilePhotoFetch(image) { // TODO узнать у бэка, что не так
        return postImageFetch(API + '/users/images', image)
            .catch((error) => console.error(error));
    }

    /**
     * Получение плейлистов пользователя
     * @return {Promise<Response>}
     */
    static profilePlaylistsFetch() {
        return getFetch(API + '/users/playlists')
            .catch((error) => console.error(error));
    }

    /**
     * Получение треков плейлиста
     * @param {number} id
     * @return {Promise<Response>}
     */
    static playlistTracksFetch(id) {
        return getFetch(API + `/playlists/${id}`)
            .catch((error) => console.error(error));
    }

    /**
     * Получение треков альбома
     * @param {number} id
     * @return {Promise<Response>}
     */
    static albumFetch(id) {
        return getFetch(API + `/albums/${id}`)
            .catch((error) => console.error(error));
    }

    /**
     * Получение альбомов пользователя
     * @return {Promise<Response>}
     */
    static profileAlbumsFetch() {
        return getFetch(API + '/users/albums')
            .catch((error) => console.error(error));
    }

    /**
     * Получение трека
     * @param {string} id
     * @return {Promise<Response>}
     */
    static trackFetch(id) {
        return getFetch(API + `/tracks/${id}`)
            .catch((error) => console.error(error));
    }
}
