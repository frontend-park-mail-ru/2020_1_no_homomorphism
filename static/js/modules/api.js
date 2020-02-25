import {postFetch, getFetch} from "./fetch";
/**
 * API object
 * @class
 * @type {Api}
 */
export default class Api {
    /**
     * Логин
     * @param {string} email
     * @param {string} password
     * @returns {Promise<Response>}
     */
    static login({email, password}) {
        return postFetch('/login', {
            email,
            password,
        });
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
    static signup({name, login, sex, email, password}) {
        return postFetch('/signup', {
            name,
            login,
            sex,
            email,
            password,
        });
    }
}