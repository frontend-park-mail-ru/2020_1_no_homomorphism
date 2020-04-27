import {VALIDATION} from '@libs/constans';
/**
 * Валидация данных
 * @class Validation
 */
export default class Validation {
    /**
     * @param {String} email
     * @return {String} error Пустая строчка в случае корректных данных, иначе - текст ошибки
     */
    static email(email = '') {
        if (email === '') {
            return VALIDATION.EMAIL_EMPTY;
        }
        const regExpr = new RegExp(VALIDATION.REGEX_EMAIL);
        if (!email.match(regExpr)) {
            return VALIDATION.EMAIL_INCORRECT;
        }
        return '';
    }
    /**
     * @param {String} login
     * @return {String} error Пустая строчка в случае корректных данных, иначе - текст ошибки
     */
    static login(login = '') {
        const regExpr = new RegExp(VALIDATION.REGEX_LOGIN);
        if (login === '') {
            return VALIDATION.LOGIN_EMPTY;
        }
        if (!login.match(regExpr)) {
            return VALIDATION.LOGIN_INCORRECT;
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
            return VALIDATION.PASS_EMPTY;
        }
        if (pass2 === '' && passConfirm) {
            return VALIDATION.REPEAT_PASS_EMPTY;
        }
        if (pass1 !== pass2 && passConfirm) {
            return VALIDATION.PASSES_DIFF;
        }
        const regExpr = new RegExp(VALIDATION.REGEX_PASSWORD);
        if (!pass1.match(regExpr)) {
            return VALIDATION.PASS_INCORRECT;
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
            return VALIDATION.IMG_TOO_BIG;
        }
        if (VALIDATION.ALLOWABLE_EXTENSIONS.indexOf(extension) === -1) {
            return VALIDATION.IMG_WRONG_EXT;
        }
        return '';
    }
}
