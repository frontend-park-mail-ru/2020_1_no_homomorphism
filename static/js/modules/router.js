/**
 * Переход по страничкам
 * @class Router
 */
export default class Router {
    /**
     * Конструктор
     * */
    constructor() {
        this.root = document.getElementById('application');
        this.curPath = null;
        this.views = {}
    }
    /* *
     * Новый root
     * */
    setRoot(root = '/') {
        this.root = root;
    }
    /**
     * Добавление path с view
     * @param {string} path
     * @param {Object} view
     * */
    addView(path, view) {
        this.views[path] = view
    }
    /**
     * Редирект
     * @param {String} path
     * @param {Object} data
     */
    static redirect ( path, data = {}, ) {
        this.checkAndRend( path, data);
    }
    /**
     * Запуск рендеринга
     * @param {string} newPath
     * @param {Object} data
     * */
    checkAndRend(newPath, data = {}) {
        if (newPath === this.curPath) {
            // Уже на это страничке
            return;
        }
        if (!this.views.has(newPath)) {
            // Нет такого пути, показать ошибку
            return;
        }
        this.curPath = newPath;
        this.views[newPath].render(data);
        //Обращение к ивентбасу
    }
    /**
     * Добавление EventListener'a
     * */
     start() {
        window.addEventListener('click', (event) => {
            if (!(event.target instanceof HTMLAnchorElement)) {
                this.checkAndRend(window.location.pathname);
                return;
            }
            event.preventDefault();
            this.checkAndRend(event.target.pathname);
        })
    }
}
