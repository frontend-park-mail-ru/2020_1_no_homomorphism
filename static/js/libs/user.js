export let CSRF_TOKEN = '';

export const setToken = (token) => {
    CSRF_TOKEN = token;
};
/** Юзер-синглтон
 */
export default class User {
    /** Конструктор синглтона
     */
    constructor() {
        if (typeof User.instance === 'object') {
            return User.instance;
        }
        this.user = {};
        User.instance = this;
        return this;
    }

    /** Вылогинивает пользователя
     */
    clean() {
        this.user = {};
        this.CSRFtoken = '';
    }

    /** Проверяет, существует ли пользователь
     */
    get exists() {
        return (JSON.stringify(this.user) !== '{}');
    }

    /** Рендеринг
     *  @param {Object} input
     */
    set token(input) {
        this.CSRFtoken = input;
    }

    /** Рендеринг
     */
    get token() {
        return this.CSRFtoken;
    }

    /** Рендеринг
     *  @param {Object} input
     */
    set userData(input) {
        this.user = input;
        // eslint-disable-next-line guard-for-in
        // for (const key in input) {
        //     this.key = input[key];
        // }
    }

    /** Рендеринг
     */
    get userData() {
        return this.user;
    }

    /** Рендеринг
     *  @param {Object} set
     */
    setter(set) {
        this.sett = set;
    }

    /** Рендеринг
     */
    printt() {
        console.log(this.sett);
    }
}
