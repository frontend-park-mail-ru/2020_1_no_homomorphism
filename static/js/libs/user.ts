type userDataKeys =
    'id'
    | 'login'
    | 'email'
    | 'image'
    | 'theme'
    | 'lang';

type statisticsKeys =
    'userID'
    | 'tracks'
    | 'albums'
    | 'playlists'
    | 'artists';

interface StaticUser {
    instanceMethod(): void;
}

interface AbstractUser {
    instance: StaticUser;
    CsrfToken: string;
    user: { [index: string]: string };
    statistics: { [index: string]: string };
    token: string;

    new(): StaticUser;

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

@staticImplements<AbstractUser>()
export default class User implements StaticUser {
    static instance: StaticUser;
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
     * @return {boolean}
     */
    public static exists(): boolean {
        if (User.instance) {
            User.instance = new class implements StaticUser {
                instanceMethod(): void {
                    return;
                }
            }();
        }
        if (this.user === undefined) {
            User.user = {
                email: undefined,
                id: undefined,
                login: undefined,
                image: undefined,
                theme: undefined,
                lang: undefined,
            };
            User.statistics = {
                userID: undefined,
                tracks: undefined,
                albums: undefined,
                playlists: undefined,
                artists: undefined,
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

    public static setUserData(input: { [index in userDataKeys]: string }): void {
        this.exists();
        Object.keys(input)
            .forEach((key: Extract<keyof typeof input, string>) => {
                this.user[key] = input[key];
            });
    }

    public static getUserData(): { [index: string]: string } {
        return this.user;
    }

    public static setStatistics(input: { [index in statisticsKeys]: string }): void {
        Object.keys(input)
            .forEach((key: Extract<keyof typeof input, string>) => {
                this.statistics[key] = input[key];
            });
    }

    /** Получение статистики пользователя
     * @return {Object}
     */
    public static getStatistics(): { [index: string]: string } {
        return this.statistics;
    }

    instanceMethod(): void {
        return;
    }
}
