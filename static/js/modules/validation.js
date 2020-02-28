/**
 * Валидация данных
 * @class Validation
 */
export  class Validation {
    /**
     * @param {String} email
     * @returns {String} error Пустая строчка в случае корректных данных, иначе - текст ошибки
     */
    validationEmail(email = '') {
        if (email === '') {
            return 'Введите почту'
        }
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
        let regExpr = new RegExp('^[a-zA-Z0-9_.]{3,}$');
        if (!login.match(regExpr)) {
            return 'Логин может содержать от 3 латинских букв или цифр';
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

        let regExpr = new RegExp('^[a-zA-Z0-9]{3,}$');

        if (password1 === '') {
            return 'Введите пароль';
        }

        if (!password1.match(regExpr)) {
            return 'Пароль должен содержать не менее 3 заглавных или строчных букв';
        }
        return '';
    }
}
