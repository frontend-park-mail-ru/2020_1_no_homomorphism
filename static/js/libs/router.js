import {URL, DOM} from '@libs/constans.js';

/**
 * Переход по страничкам
 * @class Router
 */
export default class Router {
    /**
     * Конструктор
     * */
    constructor() {
        this.root = document.getElementsByClassName(DOM.CONTENT)[0];
        this.views = {};
        this.regexUrl = [URL.ALBUM, URL.PLAYLIST, URL.ARTIST];
        this.profileUrl = [URL.PROFILE, URL.PROFILE_TRACKS, URL.PROFILE_PLAYLISTS,
            URL.PROFILE_ARTISTS, URL.PROFILE_ALBUMS];
        this.forbiddenForLogout = [URL.PROFILE, URL.PROFILE_TRACKS, URL.PROFILE_PLAYLISTS,
            URL.PROFILE_ARTISTS, URL.PROFILE_ALBUMS, URL.SETTINGS];
    }

    /**
     * Добавление path с view
     * @param {string} name
     * @param {Object} view
     * */
    addView(name, view) {
        this.views[name] = view;
    }

    /**
     * Редирект после логаута
     * @param {string} to
     */
    logoutRedirect(to) {
        if (this.forbiddenForLogout.includes(window.location.pathname)) {
            this.check(to, true);
        }
    }

    /**
     * Редирект
     * @param {string} to
     */
    redirect(to) {
        this.check(to, true);
    }

    /**
     * Проверка регулярки
     * @param {string} newPath
     * @return {string}
     */
    checkReg(newPath) {
        let res = '';
        this.regexUrl.map(function(url) {
            if (newPath.match(url)) {
                res = url;
            }
        });
        console.log(res);
        return res === '' ? newPath : res;
    }

    /**
     * Запуск рендеринга
     * @param {string} newPath
     * @param {boolean} pushState
     * */
    check(newPath, pushState) {
        if (newPath === this.curPath) {
            return;
        }
        const isRegUrl = this.checkReg(newPath);
        if (!(newPath in this.views) && isRegUrl === newPath) {
            if (pushState) {
                window.history.pushState('', {}, URL.MAIN);
            }
            this.redirect(URL.MAIN); // TODO добавить вывод пользователю
            return;
        }
        if (newPath === URL.PROFILE) {
            this.redirect(URL.PROFILE_TRACKS);
        }
        this.curPath = newPath;
        if (pushState) {
            window.history.pushState('', {}, newPath);
        }
        if (this.profileUrl.indexOf(newPath) !== -1) {
            this.views[newPath].render(this.root, newPath);
            return;
        }
        if (isRegUrl !== newPath) {
            this.views[isRegUrl].render(this.root,
                newPath.slice(newPath.lastIndexOf('/') + 1, newPath.length));
        } else {
            this.views[isRegUrl].render(this.root);
        }
        this.views[newPath].render(this.root);
    }

    /**
     * Добавление EventListener'a
     * */
    start() {
        window.addEventListener('popstate', (event) => {
            this.check(event.target.location.pathname, false);
        });
        window.addEventListener('click', (event) => {
            let current = event.target;
            while (current !== window && current !== document.body && current != null) {
                if (current instanceof HTMLAnchorElement) {
                    event.preventDefault();
                    this.check(current.pathname, true);
                    break;
                } else {
                    current = current.parentNode;
                }
            }
        });
        this.check(window.location.pathname, false);
    }
}
