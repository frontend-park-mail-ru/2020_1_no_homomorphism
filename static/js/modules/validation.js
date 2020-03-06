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
            return 'Enter email';
        }
        const regExpr = new RegExp('(.)+@(.)+');
        if (!email.match(regExpr)) {
            return 'Incorrect email syntax';
        }
        return '';
    }

    /**
     * @param {String} login
     * @return {String} error Пустая строчка в случае корректных данных, иначе - текст ошибки
     */
    static login(login = '') {
        const regExpr = new RegExp('^[a-zA-Z0-9_.]{3,}$');
        if (login === '') {
            return 'Enter login';
        }
        if (!login.match(regExpr)) {
            return 'Login must contain at least 3 letters';
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
            return 'Enter password';
        }
        if (pass2 === '' && passConfirm) {
            return 'Repeat the password';
        }
        if (pass1 !== pass2 && passConfirm) {
            return 'Passwords must match';
        }
        const regExpr = new RegExp('^[a-zA-Z0-9]{3,}$');
        if (!pass1.match(regExpr)) {
            return 'Password must contain at least 3 letters or numbers';
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
            console.log('Too big');
            return 'Max allowable size - 1Mb';
        }
        const allowableExtension = ['png', 'jpg', 'gif'];
        if (allowableExtension.indexOf(extension) === -1) {
            console.log('Wrong extension');
            return 'Allowable extensions - png, jpg, gif';
        }
        return '';
    }
}
