import {IndexModel} from '../models/index.js';
import {IndexView} from '../views/index.js';
/**
 * Контроллер для главной страницы
 */
export class IndexController {
    /**
     * Конструктор
     */
    constructor() {
        this.model = new IndexModel();
        this.view = new IndexView();
    }
}
