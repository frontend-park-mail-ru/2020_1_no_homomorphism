/**
 * Переход по страничкам
 * @class Router
 */
export class Router {
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
    setRoot(root) {
        this.root = root;
    }

    /**
     * Добавление path с view
     * @param {string} path
     * @param {string} view
     * */
    addView(path, view) {
        this.views[path] = view
    }
    /**
     * Запуск рендеринга
     * @param {string} newPath
     * */
    check(newPath) {
        if (newPath === this.curPath) {
            // Уже на это страничке
            return;
        }
        if (!this.views.has(newPath)) {
            // Нет такого пути, показать ошибку
            return;
        }
        this.curPath = newPath;
        this.views[newPath].render();
        //Обращение к ивентбасу
    }
    /**
     * Добавление EventListener'a
     * */
    start() {
        window.addEventListener('click', (event) => {
            if (!(event.target instanceof HTMLAnchorElement)) {
                return;
            }
            event.preventDefault();
            this.check(event.target.pathname);
        })
    }
}
