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
        }, (error) => {
            console.log(error.toString());
        });
    }

    /**
     * Логаут
     * @return {Promise<Response>}
     */
    static logoutFetch() {
        return deleteFetch(API + '/users/logout', (error) => {
            console.log(error.toString());
        });
    }

    /**
     * Проверка куки
     * @return {Promise<Response>}
     */
    static cookieFetch() {
        return getFetch(API + '/users', (error) => {
            console.log(error.toString());
        });
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
        }, (error) => {
            console.log(error.toString());
        });
    }

    /**
     * Артист просмотр
     * @param {string} id
     * @return {Promise<Response>}
     */
    static artistFetch(id) {
        return getFetch(API + '/artists/' + id).catch((error) => console.error(error));
    }

    /**
     * Артист просмотр статистики
     * @param {string} id
     * @return {Promise<Response>}
     */
    static artistStatFetch(id) {
        return getFetch(API + '/artists/' + id + '/stat').catch((error) => console.error(error));
    }

    /**
     * Артист просмотр альбомов
     * @param {string} id
     * @param {string} start
     * @param {string} end
     * @return {Promise<Response>}
     */
    static artistAlbumsFetch(id, start, end) {
        return getFetch(API + '/artists/' + id + '/albums/' + start + '/' + end)
            .catch((error) => console.error(error));
    }

    /**
     * Артист просмотр треков
     * @param {string} id
     * @param {string} start
     * @param {string} end
     * @return {Promise<Response>}
     */
    static artistTracksFetch(id, start, end) {
        return getFetch(API + '/artists/' + id + '/tracks/' + start + '/' + end)
            .catch((error) => console.error(error));
    }

    /**
     * Профиль просмотр
     * @return {Promise<Response>}
     */
    static profileFetch() {
        return getFetch(API + '/users/me', (error) => {
            console.log(error.toString());
            throw new Error(error);
        });
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
            // user: [
            name,
            email,
            password,
            new_password: newPassword,
        }, (error) => {
            console.log(error.toString());
        });
    }

    /**
     * Отправка фоточки
     * @param {Object} image
     * @return {Promise<Response>}
     */
    static profilePhotoFetch(image) {
        return postImageFetch(API + '/users/images', image, (error) => {
            console.log(error.toString());
        });
    }

    /**
     * Получение плейлистов пользователя
     * @return {Promise<Response>}
     */
    static profilePlaylistsFetch() {
        return getFetch(API + '/users/playlists', (error) => {
            console.log(error.toString());
        });
    }

    /**
     * Получение треков плейлиста
     * @param {number} id
     * @return {Promise<Response>}
     */
    static playlistAllTracksFetch(id) {
        return getFetch(API + `/playlists/${id}`, (error) => {
            console.log(error.toString());
        });
    }

    /**
     * Получение треков плейлиста
     * @param {number} id
     * @param {string} start
     * @param {string} end
     * @return {Promise<Response>}
     */
    static playlistTracksFetch(id, start, end) {
        return getFetch(API + `/playlists/${id}/tracks/${start}/${end}`, (error) => {
            console.log(error.toString());
        });
    }

    /**
     * Получение треков альбома
     * @param {number} id
     * @return {Promise<Response>}
     */
    static albumAllTracksFetch(id) {
        return getFetch(API + `/albums/${id}`, (error) => {
            console.log(error.toString());
        });
    }

    /**
     * Получение треков плейлиста
     * @param {number} id
     * @param {string} start
     * @param {string} end
     * @return {Promise<Response>}
     */
    static albumTracksFetch(id, start, end) {
        return getFetch(API + `/albums/${id}/tracks/${start}/${end}`, (error) => {
            console.log(error.toString());
        });
    }

    /**
     * Получение альбомов пользователя
     * @return {Promise<Response>}
     */
    static profileAlbumsFetch() {
        return getFetch(API + '/users/albums', (error) => {
            console.log(error.toString());
        });
    }

    /**
     * Получение трека
     * @param {string} id
     * @return {Promise<Response>}
     */
    static trackFetch(id) {
        return getFetch(API + `/tracks/${id}`, (error) => {
            console.log(error.toString());
        });
    }
}
