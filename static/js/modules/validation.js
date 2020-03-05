/**
 * Валидация данных
 * @class Validation
 */
export class Validation {
    /**
     * @param {String} email
     * @returns {String} error Пустая строчка в случае корректных данных, иначе - текст ошибки
     */
    validationEmail(email = '') {
        if (email === '') {
            return 'Enter email';
        }
        let regExpr = new RegExp('(.)+@(.)+');
        if (!email.match(regExpr)) {
            return 'Incorrect email syntax';
        }
        return '';
    }

    /**
     * @param {String} login
     * @returns {String} error Пустая строчка в случае корректных данных, иначе - текст ошибки
     */
    validationLogin(login = '') {
        let regExpr = new RegExp('^[a-zA-Z0-9_.]{3,}$');
        if (login === '') {
            return 'Enter login';
        }
        if (!login.match(regExpr)) {
            return 'Login must contain at least 3 letters';
        }
        return '';
    }

    /**
     * @param {String} password1 Пароль
     * @param {String} password2 Повтор пароля
     * @param {Boolean} signUp Валидация из регистрации?
     * @returns {String} error Пустая строчка в случае корректных данных, иначе - текст ошибки
     */
    validationPassword(password1 = '', password2 = '', passwordConfirm = false) {
        if (password1 === '') {
            return 'Enter password';
        }
        if (password2 === '' && passwordConfirm) {
            return 'Repeat the password';
        }
        if (password1 !== password2 && passwordConfirm) {
            return 'Passwords must match';
        }
        let regExpr = new RegExp('^[a-zA-Z0-9]{3,}$');
        if (!password1.match(regExpr)) {
            return 'Password must contain at least 3 letters or numbers';
        }
        return '';
    }

    validationImage(size, extension) {
        console.log('File size: ' + size);
        console.log('File extension: ' + extension);

        if (size > 1048576) {
            console.log('too big');
            return 'Max allowable size - 1Mb';
        }
        let allowableExtension = ['png', 'jpg', 'gif'];
        if (allowableExtension.indexOf(extension) === -1) {
            console.log('wrong extension');
            return 'Allowable extensions - png, jpg, gif';
        }
        return '';
    }
}
