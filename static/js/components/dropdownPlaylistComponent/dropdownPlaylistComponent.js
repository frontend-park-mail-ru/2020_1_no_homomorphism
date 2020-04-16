import dropdown from '@components/dropdownPlaylistComponent/dropdown_playlist.tmpl.xml';
import {DOM} from '@libs/constans';

/**
 * Компонент - выпадающее меню при добавлении трека в плейлист
 */
export default class DropdownPlaylist {
    /**
     * Конструткор
     * @param {EventBus} eventBus
     * @param {object} modelType
     */
    constructor(eventBus, modelType) {
        this.eventBus = eventBus;
        this.modelType = modelType;
        this.state = false; // закрыт
        this.eventBus.on(modelType.DROPDOWN, this.render.bind(this));
    }

    /**
     * Установка состояния менюшки
     * @param {boolean} state
     */
    setState(state) {
        this.state = state;
    }

    /**
     * Конструткор
     * @param {Object} event
     */
    unRender(event) {
        this.currentElem.innerHTML = '';
    }

    /**
     * Конструткор
     * @param {Object} event
     */
    render(event) {
        this.currentElem = event.target.parentNode.nextSibling;
        document.getElementsByClassName(DOM.CONTENT)[0].innerHTML += dropdown();
        document.getElementsByClassName(DOM.CONTENT)[0].firstChild
            .classList.add('is-un-emphasized');

        // this.currentElem.innerHTML = dropdown();
        this.state = true;
        // console.log(current.parentNode.nextSibling).;
        // console.log('kek');
    }
}
