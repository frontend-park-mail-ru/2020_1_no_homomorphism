// type dataKeys = 'id' | 'login' | 'email' | 'image';
//
// interface MyType {
//
//     instanceMethod():void;
// }
//
// interface MyTypeStatic {
//     instance: MyType;
//
//     token: string;
//
//     new(): MyType;
//
//     CsrfToken: string;
//     user: { [index: string]: string };
//
//     setUserData(input: { [index in dataKeys]: string }): void;
//
//     getUserData(): { [index: string]: string };
//
//     clean(): void;
//
//     exists(): boolean
// }
//
// /* class decorator */
// function staticImplements<T>() {
//     return <U extends T>(constructor: U) => {
//         constructor
//     };
// }
// @staticImplements<MyTypeStatic>()   /* this statement implements both normal interface & static interface */
//
// export default class Lol implements MyType{ /* implements MyType { */ /* so this become optional not required */
//
//     static instance: MyType;
//     static user: { [index: string]: any } = {};
//     static CsrfToken: string;
//
//     static clean(): void {
//         delete this.user;
//         delete this.CsrfToken;
//     }
//
//     /** Проверяет, существует ли пользователь
//      */
//     public static exists(): boolean {
//         if (Lol.instance) {
//             Lol.instance = new class implements MyType {
//                 instanceMethod(): void {
//                 }
//             }();
//         }
//         if (this.user === undefined) {
//             Lol.user = {email: undefined, id: undefined, login: undefined, image: undefined};
//             return false
//         }
//         return this.user.id !== undefined;
//     }
//
//     /** Запись CSRF токена
//      */
//     public static set token(input: string) {
//         this.CsrfToken = input;
//     }
//
//     /** Получение CSRF токена
//      */
//     public static get token(): string {
//         return this.CsrfToken;
//     }
//
//     /** Запись данных пользователя
//      */
//     public static setUserData(input: { [index in dataKeys]: any }) {
//         Lol.user = {email: undefined, id: undefined, login: undefined, image: undefined};
//         Object.keys(input)
//             .forEach((key: Extract<keyof typeof input, string>) => {
//                 this.user[key] = input[key]
//             })
//     }
//
//     /** Получение данных пользователя
//      */
//     public static getUserData(): { [index: string]: string } {
//         return this.user;
//     }
//
//     instanceMethod(): void {
//     }
// }