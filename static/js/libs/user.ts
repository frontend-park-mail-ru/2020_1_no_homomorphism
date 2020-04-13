/** Юзер-синглтон
 */
export default class User {
    private static instance: User;
    private static user: { [index: string]: any } = {};
    private static CsrfToken: string;

    /** Конструктор синглтона
     */
    private constructor() {
        User.CsrfToken = '';
    }

    /** Вылогинивает пользователя
     */
    public static clean() {
        this.user = {};
        this.CsrfToken = '';
    }

    /** Проверяет, существует ли пользователь
     */
    public static get exists(): boolean {
        if (!User.instance) {
            User.instance = new User();
            User.user = {};
        }
        return (JSON.stringify(this.user) !== '{}');
    }

    /** Запись CSRF токена
     *  @param {Object} input
     */
    public static set token(input: string) {
        this.CsrfToken = input;
    }

    /** Получение CSRF токена
     */
    public static get token(): string {
        return this.CsrfToken;
    }

    /** Запись данных пользователя
     */
    public static set userData(input: object) {
        Object.keys(input)
            .forEach((key: Extract<keyof typeof input, string>) => {
                this.user.key = input[key]
            })
        this.user = input;
    }

    /** Получение данных пользователя
     */
    public static get userData(): object {
        return this.user;
    }
}
