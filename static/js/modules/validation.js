export default class Validation {

    /**
     * @param {String} email
     * @returns {String} error Пустая строчка в случае корректных данных, иначе - текст ошибки
     */
    validationEmail(email = '') {
        let regExpr = new RegExp('^[a-z0-9_!#$%&+=*\\-]+(\.[a-z0-9_\\-]*)*@([a-z0-9][a-z0-9]+\.)*[a-z]{2,4}(\.[a-z]{2,4})+$');
        if (!email.match(regExpr)) {
            return 'Некорректная почта';
        }
        return '';
    }

    /**
     * @param {String} login
     * @returns {String} error Пустая строчка в случае корректных данных, иначе - текст ошибки
     */
    validationLogin (login = '') {
        let regExpr = new RegExp('^[a-zA-Z][a-zA-Z0-9_.]{4,14}$');
        if (!login.match(regExpr)) {
            return ' Логин может содержать латинские буквы или цифры';
        }
        return '';
    }

    /**
     * @param {String} password1 Пароль
     * @param {String} password2 Повтор пароля
     * @returns {String} error Пустая строчка в случае корректных данных, иначе - текст ошибки
     */

    validationPassword(password1 = '', password2 = '') {
        if (password1 !== password2) {
            return 'Пароли не совпадают';
        }

        let regExpr = new RegExp ('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{7,}$');

        if (!password1.match(regExpr)) {
            return 'Пароль должен содержать 7 символов, как минимум одна заглавная, одна строчная латинская буква и одна цифра ';
        }
        return '';
    }
}
