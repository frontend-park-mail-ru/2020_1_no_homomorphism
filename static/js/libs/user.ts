type dataKeys = 'id' | 'login' | 'email' | 'image';

interface IUser {
    CsrfToken: string;
    user: { [index: string]: any };

    setUserData(input: { [index in dataKeys]: any }): void;

    getUserData(): object;

    clean(): void;

    exists(): boolean
}

export let User: IUser;
User = class User {
    private static instance: User;
    static user: { [index: string]: any } = {};
    static CsrfToken: string;

    static clean(): void {
        delete this.user;
        delete this.CsrfToken;
    }

    /** Проверяет, существует ли пользователь
     */
    public static exists(): boolean {
        if (!User.instance) {
            User.instance = new User();
        }
        if (this.user === undefined) {
            User.user = {email: undefined, id: undefined, login: undefined, image: undefined};
            return false
        }
        return this.user.id !== undefined;
    }

    /** Запись CSRF токена
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
    public static setUserData(input: { [index in dataKeys]: any }) {
        User.user = {email: undefined, id: undefined, login: undefined, image: undefined};
        Object.keys(input)
            .forEach((key: Extract<keyof typeof input, string>) => {
                this.user[key] = input[key]
            })
    }

    /** Получение данных пользователя
     */
    public static getUserData(): object {
        return this.user;
    }
}
