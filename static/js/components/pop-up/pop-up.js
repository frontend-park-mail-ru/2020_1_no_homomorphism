import {POPUP} from '@libs/constants';
import template from '@components/pop-up/pop-up.tmpl.xml';

/**
 * Компонент поп-ап
 */
export default class PopUpComponent {
    /**
     * Конструткор
     * @param {String} message
     * @param {Boolean} error
     */
    constructor(message, error = false) {
        this.container = document.getElementsByClassName('l-pop-up-container')[0];
        for (let i = 0; i <= this.container.children.length; i++) {
            if (!this.container.children.find((child) => {
                return child.getAttribute('p-id') === i.toString();
            })) {
                this.id = i;
                break;
            }
        }
        this.element = document.createElement('div');
        this.element.innerHTML = template({
            message: message,
            error: error,
            id: this.id,
        });
        this.element = this.element.firstChild;
        this.container.appendChild(this.element);
        this.container.children.forEach((popUp) => {
            popUp.style.bottom = (
                parseInt(popUp.style.bottom.slice(0, popUp.style.bottom.length - 2)) + 75
            ).toString() + 'px';
        });
        setTimeout(this.dissolve.bind(this), POPUP.LIFETIME);
        this.setEventListeners();
    }

    /**
     * sets EventListeners
     */
    setEventListeners() {
        this.element.getElementsByClassName('m-pop-up-close')[0]
            .addEventListener('click', this.close.bind(this));
        this.element.addEventListener('mouseenter', (event) => {
            this.mouseX = event.clientX;
            this.mouseY = event.clientY;
        });
        this.element.addEventListener('mouseleave', () => {
            this.mouseX = undefined;
            this.mouseY = undefined;
        });
    }

    /*
     * растворяет и удаляет из DOM поп-ап
     */
    dissolve() {
        if (this.mouseX || this.mouseY) {
            setTimeout(this.dissolve.bind(this), 500);
            return;
        }
        new Promise((r) => setTimeout(r, 1000)).then(() => {
            if (this.mouseX || this.mouseY) {
                setTimeout(this.dissolve.bind(this), 500);
                return;
            }
            this.element.style.opacity = 0;
            setTimeout(this.close.bind(this), POPUP.DISSOLUTIONTIME);
        });
    }

    /*
     * удаляет из DOM поп-ап
     */
    close() {
        const previous = this.container.children.slice(0,
            this.container.children.indexOf(this.element));
        previous.forEach((popUp) => {
            popUp.style.bottom = (
                parseInt(popUp.style.bottom.slice(0, popUp.style.bottom.length - 2)) - 75
            ).toString() + 'px';
        });
        this.element.remove();
    }
}
