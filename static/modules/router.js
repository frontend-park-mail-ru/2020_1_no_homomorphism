/**
 * Роутер. Переход по страничкам
 * @class Router
 */

export class Router {


    /**
     * Конструктор
     * */
    constructor() {
        this.root = document.getElementById('application');
        this.views = {}
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
        this.views[name] = view
    }


    /**
     * Добавление обработки касания
     * */
    start() {
        window.addEventListener('click', (event) => {
            if (!(event.target instanceof HTMLAnchorElement)) {
                return;
            }
            event.preventDefault();
            this.views[event.target.pathname].render();
        })
        //Обращение к ивентбасу
    }

}
