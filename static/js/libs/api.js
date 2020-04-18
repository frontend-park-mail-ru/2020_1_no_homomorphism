import {postFetch, getFetch, deleteFetch, putFetch, postImageFetch} from '@libs/fetch';
import {API, RESPONSE} from '@libs/constans';
import {inputSanitize} from '@libs/input_sanitize';

/**
 * API object
 * @class
 * @type {Api}
 */
export default class Api {
    // ------------- SMTH ---------------
    /**
     * Логин вход
     * @param {string} login
     * @param {string} password
     * @return {Promise<Response>}
     */
    static loginPost(login, password) {
        return postFetch(API + '/users/login', {
            'login': inputSanitize(login),
            'password': inputSanitize(password),
        }, (error) => {
            console.log(error.toString());
        });
    }

    /**
     * Логаут
     * @return {Promise<Response>}
     */
    static logoutFetch() { // TODO переименовать, когда бэк придумает
        return deleteFetch(API + '/users/logout', (error) => {
            console.log(error.toString());
        });
    }

    /**
     * Проверка куки
     * @return {Promise<Response>}
     */
    static cookieGet() {
        return getFetch(API + '/users', (error) => {
            console.log(error.toString());
        });
    }

    /**
     * Получение csrf-токена
     * @return {Promise<Response>}
     */
    static csrfTokenGet() {
        return getFetch(API + '/users/token', (error) => {
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
    static signupPost(name = '', login, sex = '', email = '', password) {
        return postFetch(API + '/users/signup', {
            'name': inputSanitize(name),
            'login': inputSanitize(login),
            'sex': 'yes',
            'email': inputSanitize(email),
            'password': inputSanitize(password),
        }, (error) => {
            console.log(error.toString());
        });
    }

    // ------------- PROFILE ---------------


    /**
     * Профиль просмотр
     * @return {Promise<Response>}
     */
    static profileGet() {
        return getFetch(API + '/users/me', (error) => {
            console.log(error.toString());
            throw new Error(error);
        });
    }

    /**
     * Профиль просмотр статистики
     * @param {string} id
     * @return {Promise<Response>}
     */
    static profileStatGet(id) {
        return getFetch(API + '/users/' + id + '/stat', (error) => {
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
    static profilePut(name, email, password, newPassword) {
        return putFetch(API + '/users/settings', {
            name: inputSanitize(name),
            email: inputSanitize(email),
            password: inputSanitize(password),
            new_password: inputSanitize(newPassword),
        }, (error) => {
            console.log(error.toString());
        });
    }

    /**
     * Отправка фоточки
     * @param {Object} image
     * @return {Promise<Response>}
     */
    static profileAvatarPost(image) {
        return postImageFetch(API + '/users/images', image, (error) => {
            console.log(error.toString());
        });
    }

    /**
     * Получение плейлистов пользователя
     * @return {Promise<Response>}
     */
    static profilePlaylistsGet() {
        return getFetch(API + '/users/playlists', (error) => {
            console.log(error.toString());
        });
    }

    /**
     * Получение альбомов пользователя
     * @return {Promise<Response>}
     */
    static profileAlbumsGet() {
        return getFetch(API + '/users/albums', (error) => {
            console.log(error.toString());
        });
    }

    // ------------- ARTIST  ---------------

    /**
     * Артист просмотр списка
     * @param {string} start
     * @param {string} end
     * @return {Promise<Response>}
     */
    static artistListGet(start, end) {
        return getFetch(API + `/artists/${start}/${end}`).catch((error) => console.error(error));
    }

    /**
     * Артист просмотр
     * @param {string} id
     * @return {Promise<Response>}
     */
    static artistGet(id) {
        return getFetch(API + `/artists/${id}`).catch((error) => console.error(error));
    }

    /**
     * Артист просмотр статистики
     * @param {string} id
     * @return {Promise<Response>}
     */
    static artistStatFetch(id) {
        return getFetch(API + `/artists/${id}/stat`).catch((error) => console.error(error));
    }

    /**
     * Артист просмотр альбомов
     * @param {string} id
     * @param {string} start
     * @param {string} end
     * @return {Promise<Response>}
     */
    static artistAlbumsGet(id, start, end) {
        return getFetch(API + `/artists/${id}/albums/${start}/${end}`)
            .catch((error) => console.error(error));
    }

    /**
     * Артист просмотр треков
     * @param {string} id
     * @param {string} start
     * @param {string} end
     * @return {Promise<Response>}
     */
    static artistTracksGet(id, start, end) {
        return getFetch(API + `/artists/${id}/tracks/${start}/${end}`)
            .catch((error) => console.error(error));
    }

    // ------------- ALBUM  ---------------

    /**
     * Получение альбома
     * @param {number} id
     * @return {Promise<Response>}
     */
    static albumGet(id) {
        return getFetch(API + `/albums/${id}`, (error) => {
            console.log(error.toString());
        });
    }

    /**
     * Получение треков альбома
     * @param {number} id
     * @param {string} start
     * @param {string} end
     * @return {Promise<Response>}
     */
    static albumTracksGet(id, start, end) {
        return getFetch(API + `/albums/${id}/tracks/${start}/${end}`, (error) => {
            console.log(error.toString());
        });
    }

    // ------------- PLAYLIST  ---------------

    /**
     * Получение треков плейлиста
     * @param {number} id
     * @return {Promise<Response>}
     */
    static playlistGet(id) {
        const res = getFetch(API + `/playlists/${id}`, (error) => {
            console.log(error.toString());
        });

        return res.then((elem) => {
            if (elem.status !== RESPONSE.OK) {
                return {status: elem.status};
            }
            try {
                return elem.json();
            } catch (error) {
                console.log(error.toString());
            }
        });
    }

    /**
     * Получение треков плейлиста
     * @param {string} id
     * @param {string} start
     * @param {string} end
     * @return {Promise<Response>}
     */
    static playlistTracksGet(id, start, end) {
        return getFetch(API + `/playlists/${id}/tracks/${start}/${end}`, (error) => {
            console.log(error.toString());
        });
    }

    /**
     * Создание плейлиста
     * @param {string} name
     * @return {Promise<Response>}
     */
    static playlistPost(name) {
        return postFetch(API + `/playlists/new/${name}`, (error) => {
            console.log(error.toString());
        });
    }

    /**
     * Добавление трека в плейлист
     * @param {Object} data
     * @return {Promise<Response>}
     */
    static playlistTrackPost(data) {
        return postFetch(API + '/playlists/tracks', data, (error) => {
            console.log(error.toString());
        });
    }
}
