type userDataKeys =
    'id'
    | 'login'
    | 'email'
    | 'image';
type statisticsKeys =
    'user_id'
    | 'tracks'
    | 'albums'
    | 'playlists'
    | 'artists';

interface IUser {
    instanceMethod(): void;
}

interface IUserStatic {
    instance: IUser;
    CsrfToken: string;
    user: { [index: string]: string };
    statistics: { [index: string]: string };
    token: string

    new(): IUser;

    setUserData(input: { [index in userDataKeys]: string }): void;

    getUserData(): { [index: string]: string };

    setStatistics(input: { [index in statisticsKeys]: string }): void;

    getStatistics(): { [index: string]: string };

    clean(): void;

    exists(): boolean;
}

function staticImplements<T>() {
    return <U extends T>(constructor: U) => {
        constructor;
    };
}

@staticImplements<IUserStatic>()
export default class User implements IUser {

    static instance: IUser;
    static user: { [index: string]: string } = {};
    static CsrfToken: string;
    static statistics: { [index: string]: string } = {};

    /** Вылогинивает
     */
    static clean(): void {
        delete this.user;
        delete this.CsrfToken;
        delete this.statistics;
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
            User.statistics = {
                user_id: undefined,
                tracks: undefined,
                albums: undefined,
                playlists: undefined,
                artists: undefined
            };
            return false;
        }
        return this.user.id !== undefined;
    }

    public static set token(input: string) {
        this.CsrfToken = input;
    }

    public static get token(): string {
        return this.CsrfToken;
    }

    public static setUserData(input: { [index in userDataKeys]: string }) {
        this.exists();
        Object.keys(input)
            .forEach((key: Extract<keyof typeof input, string>) => {
                this.user[key] = input[key];
            });
    }

    public static getUserData(): { [index: string]: string } {
        return this.user;
    }

    /** Запись статистики пользователя
     */
    public static setStatistics(input: { [index in statisticsKeys]: string }): void {
        Object.keys(input)
            .forEach((key: Extract<keyof typeof input, string>) => {
                this.statistics[key] = input[key];
            });
    }


    /** Получение статистики пользователя
     */
    public static getStatistics(): { [index: string]: string } {
        return this.statistics;
    }

    instanceMethod(): void {
    }
}
