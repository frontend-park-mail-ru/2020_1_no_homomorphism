import {Api} from './api.js'

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
    }

    /* *
     * Новый root
     * */
    setRoot(root) {
        this.root = root;
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
     * Редирект
     */
    redirect(to) {
        this.check(to, true);
    }

    /**
     * Запуск рендеринга
     * @param {string} newPath
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
            Api.coockieFetch()
            .then((res) => {
                if (res.ok) {
                    this.views['/'].render(this.root, true);
                } else {
                    this.views['/'].render(this.root, false);
                }
            })
            .then(() => {
                this.views['/player'].render();
            });
            return;
        }
        this.curPath = newPath;
        if (pushState) {
            window.history.pushState('', {}, newPath);
        }
        Api.coockieFetch()
        .then((res) => {
            if (res.ok) {
                this.views[newPath].render(this.root, true);
            } else {
                this.views[newPath].render(this.root, false);
            }
        })
        .then(() => {
            this.views['/player'].render();
        });
    }

    /**
     * Добавление EventListener'a
     * */
    start() {
        window.addEventListener('popstate', (event) => {
            event.preventDefault();
            this.check(event.target.location.pathname, false);
        });
        window.addEventListener('click', (event) => {
            let current = event.target;
            while (current != window && current != document.body && current != null) {
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
        this.views['/player'].setEventListeners();
    }
}
