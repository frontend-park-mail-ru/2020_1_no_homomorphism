import dropdown from '@components/choosePlaylistComponent/choose_playlist.tmpl.xml';
import {DOM} from '@libs/constans';

/**
 * Компонент - выпадающее меню при добавлении трека в плейлист
 */
export default class ChoosePlaylist {
    /**
     * Конструткор
     * @param {EventBus} eventBus
     * @param {object} modelType
     */
    constructor(eventBus, modelType) {
        this.eventBus = eventBus;
        this._modelType = modelType;
        this._state = false; // закрыт
        this._trackID = -1;
        // this.eventBus.on(modelType.DROPDOWN, this.render.bind(this));
    }

    /**
     * Установка текущего айди трека
     * @param {string} id
     */
    set trackID(id) {
        this._trackID = id;
    }

    /**
     * Конструткор
     * @param {function} callback
     */
    render(callback) {
        this.callback = callback;
        document.getElementsByClassName(DOM.CONTENT)[0].innerHTML += dropdown();
        document.getElementsByClassName(DOM.CONTENT)[0]
            .firstChild
            .classList
            .add('is-un-emphasized');
        this._state = true;
        this.setEventListeners();
    }

    /**
     * Set EventListeners
     */
    setEventListeners() {
        document.addEventListener('click', this.closeMenu.bind(this), {once: true});
    }

    /**
     * Закрытие меню
     * @param {Object} event
     */
    closeMenu(event) {
        if (this._state) {
            this._state = false;
            this.setEventListeners.bind(this)();
            return;
        }
        const choosePlaylist = document.getElementsByClassName('m-choose-menu')[0];
        const isClickInside = choosePlaylist.contains(event.target);

        if (!isClickInside) {
            this._state = false;
            document.getElementsByClassName(DOM.CONTENT)[0]
                .removeChild(document.getElementsByClassName(DOM.CONTENT)[0].lastChild);
            document.getElementsByClassName(DOM.CONTENT)[0]
                .firstChild
                .classList
                .remove('is-un-emphasized');
            this.callback();
        } else {
            this.setEventListeners.bind(this)();
        }
    }
}
