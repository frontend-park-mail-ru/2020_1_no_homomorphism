import * as C from '../libs/constans.js';
/**
 * Валидация данных
 * @class Validation
 */
export class Validation {
    /**
     * @param {String} email
     * @return {String} error Пустая строчка в случае корректных данных, иначе - текст ошибки
     */
    static email(email = '') {
        if (email === '') {
            return C.VALID_EMAIL_EMPTY;
        }
        const regExpr = new RegExp(C.REGEX_EMAIL);
        if (!email.match(regExpr)) {
            return C.VALID_EMAIL_INCORRECT;
        }
        return '';
    }
    /**
     * @param {String} login
     * @return {String} error Пустая строчка в случае корректных данных, иначе - текст ошибки
     */
    static login(login = '') {
        const regExpr = new RegExp(C.REGEX_LOGIN);
        if (login === '') {
            return C.VALID_LOGIN_EMPTY;
        }
        if (!login.match(regExpr)) {
            return C.VALID_LOGIN_INCORRECT;
        }
        return '';
    }
    /**
     * @param {String} pass1 Пароль
     * @param {String} pass2 Повтор пароля
     * @param {Boolean} passConfirm Введено ли подтвержение пароля?
     * @return {String} error Пустая строчка / текст ошибки
     */
    static password(pass1 = '', pass2 = '', passConfirm = false) {
        if (pass1 === '') {
            return C.VALID_PASS_EMPTY;
        }
        if (pass2 === '' && passConfirm) {
            return C.VALID_REPEAT_PASS_EMPTY;
        }
        if (pass1 !== pass2 && passConfirm) {
            return C.VALID_PASSES_DIFF;
        }
        const regExpr = new RegExp(C.REGEX_PASSWORD);
        if (!pass1.match(regExpr)) {
            return C.VALID_PASS_INCORRECT;
        }
        return '';
    }
    /**
     * @param {number} size Размер файла
     * @param {String} extension Расширение
     * @return {String} error Пустая строчка / текст ошибки
     */
    static image(size, extension) {
        if (size > 1048576) {
            return C.VALID_IMG_TOO_BIG;
        }
        if (C.ALLOWABLE_EXTENSIONS.indexOf(extension) === -1) {
            return C.VALID_IMG_WRONG_EXT;
        }
        return '';
    }
}
