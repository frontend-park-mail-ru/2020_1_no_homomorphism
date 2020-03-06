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

    /**
     * Новый root
     *  @param {Element} root
     * */
    setRoot(root) { // TODO Мб убрать метод?
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
     * Редирект послн логаута
     * @param {string} to
     */
    logoutRedirect(to) {
        console.log('logout redirect');
        if (window.location.pathname === '/profile' || window.location.pathname === '/settings') {
            console.log('redirecting...');
            this.check(to);
        }
    }
    /**
     * Редирект на главную
     */
    redirectToMain() {
        this.check('/');
    }

    /**
     * Редирект на профиль
     */
    redirectToProfile() {
        this.check('/profile');
    }

    /**
     * Запуск рендеринга
     * @param {string} newPath
     * */
    check(newPath) {
        if (newPath === this.curPath) {
            // Уже на этой страничке
            return;
        }
        if (!(newPath in this.views)) {
            window.history.replaceState('', {}, '/');
            this.views['/'].render(this.root);
            this.views['/player'].render();
            return;
        }
        this.curPath = newPath;
        window.history.replaceState('', {}, newPath);
        this.views[newPath].render(this.root);
        this.views['/player'].render();
    }

    /**
     * Добавление EventListener'a
     * */
    start() {
        window.addEventListener('click', (event) => {
            let current = event.target;
            while (current !== window && current !== document.body && current != null) {
                if (current instanceof HTMLAnchorElement) {
                    event.preventDefault();
                    this.check(current.pathname);
                    break;
                } else {
                    current = current.parentNode;
                }
            }
        });
        this.check(window.location.pathname);
        this.views['player'].setEventListeners();
        this.views['navbar'].setEventListeners();
    }
}
