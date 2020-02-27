/**
 * Переход по страничкам
 * @class Router
 */
export class Router {
    /**
     * Конструктор
     * */
    constructor() {
        this.root = document.getElementsByClassName('container')[0];
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
     * @param {string} path
     * @param {string} view
     * */
    addView(name, view) {
        this.views[name] = view;
    }

    redirectToMain() {
        this.check('/');
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
            return;
        }
        this.curPath = newPath;
        window.history.replaceState('', {}, newPath);
        if (newPath === '/player') {
            this.views['/player'].render(this.root, 'main');
        } else {
            this.views[newPath].render(this.root);
            this.views['/player'].render(this.root, 'additional');
        }
    }
    /**
     * Добавление EventListener'a
     * */
    start() {
        window.addEventListener('click', (event) => {
            let current = event.target;
            while (current != window && current != document.body && current != null) {
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
    }
}
