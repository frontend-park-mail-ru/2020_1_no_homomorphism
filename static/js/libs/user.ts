type dataKeys = 'id' | 'login' | 'email' | 'image';

interface IUser {
    instanceMethod(): void;
}

interface IUserStatic {
    instance: IUser;
    CsrfToken: string;
    user: { [index: string]: string };
    token: string;

    new(): IUser;

    setUserData(input: { [index in dataKeys]: string }): void;

    getUserData(): { [index: string]: string };

    clean(): void;

    exists(): boolean
}

function staticImplements<T>() {
    return <U extends T>(constructor: U) => {
        constructor
    };
}

@staticImplements<IUserStatic>()
export default class User implements IUser {

    static instance: IUser;
    static user: { [index: string]: string } = {};
    static CsrfToken: string;

    /** Вылогинивает
     */
    static clean(): void {
        delete this.user;
        delete this.CsrfToken;
    }

    /** Проверяет, существует ли пользователь
     */
    public static exists(): boolean {
        if (User.instance) {
            User.instance = new class implements IUser {
                instanceMethod(): void {
                }
            }();
        }
        if (this.user === undefined) {
            User.user = {
                email: undefined,
                id: undefined,
                login: undefined,
                image: undefined
            };
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
    public static setUserData(input: { [index in dataKeys]: string }) {
        User.user = {
            email: undefined,
            id: undefined,
            login: undefined,
            image: undefined
        };
        Object.keys(input)
            .forEach((key: Extract<keyof typeof input, string>) => {
                this.user[key] = input[key]
            })
    }

    /** Получение данных пользователя
     */
    public static getUserData(): { [index: string]: string } {
        return this.user;
    }

    instanceMethod(): void {
    }
}
