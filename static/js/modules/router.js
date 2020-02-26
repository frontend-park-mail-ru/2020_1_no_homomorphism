/**
 * Роутер. Переход по страничкам
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
     * Добавление view
     * @param {string} name
     * @param {string} view
     * */
    addView(name, view) {
        this.views[name] = view;
        this.views[name].eventBus.on('redirect to main', this.redirectToMain.bind(this));
    }

    redirectToMain() {
        this.views['/'].render(this.root);
    }

    /**
     * Добавление обработки касания
     * */
    start() {
        window.addEventListener('click', (event) => {
            let current = event.target;
            while (current != document.body) {
                if (current instanceof HTMLAnchorElement) {
                    event.preventDefault();
                    this.views[current.pathname].render(this.root);
                    break;
                } else {
                    current = current.parentNode;
                }
            }
        });
        if (this.views['/']) {
            this.views['/'].render(this.root);
        }
    }
}
