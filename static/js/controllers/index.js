import {EventBus} from '../eventBus.js';
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
        this.eventBus = new EventBus();
        this.model = new IndexModel(this.eventBus);
        this.view = new IndexView(this.eventBus);
    }
}
