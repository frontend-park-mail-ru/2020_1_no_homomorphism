/**
 * Переход по страничкам
 * @class Router
 */
export class Router {
    /**
     * Конструктор
     * */
    constructor() {
        this.root = document.getElementsByClassName('container')[0].children[0];
        this.views = {};
        this.profileUrl = ['/profile', '/profile/tracks', '/profile/albums',
            '/profile/playlists', '/profile/artists'];
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
        if (['/profile', '/settings'].includes(window.location.pathname)) {
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
     * Запуск рендеринга
     * @param {string} newPath
     * @param {boolean} pushState
     * */
    check(newPath, pushState) {
        if (newPath === this.curPath) {
            // Уже на этой страничке
            return;
        }
        if (!(newPath in this.views)) {
            if (pushState) {
                window.history.pushState('', {}, '/');
            }
            this.views['/'].render(this.root);
            this.views['player'].render();
            return;
        }
        newPath = newPath === '/profile' ? '/profile/tracks' : newPath;
        this.curPath = newPath;
        if (pushState) {
            window.history.pushState('', {}, newPath);
        }
        if (this.profileUrl.indexOf(newPath) !== -1) {
            this.views[newPath].render(this.root, newPath);
            this.views['player'].render();
        } else {
            this.views[newPath].render(this.root);
            this.views['player'].render();
        }
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
        this.check(window.location.pathname, true);
        this.views['player'].setEventListeners();
        this.views['navbar'].setEventListeners();
    }
}
