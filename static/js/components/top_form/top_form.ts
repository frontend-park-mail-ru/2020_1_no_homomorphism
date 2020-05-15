import {DOM, GLOBAL, URL} from '@libs/constants';
import EventBus, {globalEventBus} from '@libs/eventBus';

type HTMLElementEvent<T extends HTMLElement> = Event & {
    target: T;
};

export default class TopFormComponent {
    private eventBus: EventBus;

    constructor(eventBus: EventBus, modelType: { [index: string]: string }) {
        this.eventBus = eventBus;
        this.eventBus.on(modelType.INVALID, this.showErrors.bind(this));
        // eslint-disable-next-line @typescript-eslint/unbound-method
        this.eventBus.on(modelType.CLOSE, this.close);
    }

    configure(): void {
        if (document
            .getElementsByClassName(DOM.CONTENT)[0].children.length > 0) {
            document
                .getElementsByClassName(DOM.CONTENT)[0].classList.add('is-un-emphasized');
        }
        document.getElementsByClassName(DOM.NAVBAR)[0]
            .classList
            .add('is-untouchable');
        this.setDynamicEventListeners.bind(this)();
    }

    analyzeTouch(event: HTMLElementEvent<HTMLTextAreaElement>): void {
        const loginArea = document.getElementsByClassName('is-emphasized')[0];
        if (loginArea === undefined) {
            return;
        }
        const isClickInside = loginArea.contains(event.target);
        if (isClickInside) {
            this.setDynamicEventListeners();
            return;
        }
        if (document
            .getElementsByClassName(DOM.CONTENT)[0].firstChild !== null) {
            this.close();
            return;
        }
        this.close();
        globalEventBus.emit(GLOBAL.REDIRECT, URL.MAIN);
    }

    showErrors(errors: { [index: string]: string }): void {
        this.setDynamicEventListeners.bind(this)();
        document.getElementsByClassName('l-form')[0].classList.add('is-error-border');
        // eslint-disable-next-line guard-for-in
        for (const key in errors) {
            if (key === 'global') {
                document.getElementById('global').innerText = errors[key];
                document.getElementById('global').classList.add('is-error-input-duplication');
                break;
            }
            const message = document.getElementById(key).nextElementSibling as HTMLElement;
            message.previousElementSibling.classList.add('is-error-border');
            message.innerText = errors[key];
            message.classList.add('is-error-input-underline');
        }
    }

    hideErrors(): void {
        document.querySelectorAll('.l-form label').forEach((label) => {
            const input = label.children[1] as HTMLElement;
            label.children[0].classList.remove('is-error-border');
            input.innerText = '';
            input.classList.remove('is-error-input-underline');
        });
        document.getElementById('global').classList.remove('is-error-input-duplication');
        document.getElementById('global').innerHTML = '';
    }

    setDynamicEventListeners(): void {
        document.addEventListener('click', this.analyzeTouch.bind(this), {once: true});
    }

    close(): void {
        document.getElementsByClassName(DOM.NAVBAR)[0].classList.remove('is-untouchable');
        document
            .getElementsByClassName(DOM.CONTENT)[0].classList.remove('is-un-emphasized');
        document
            .getElementsByClassName(DOM.TOP_CONTENT)[0].innerHTML = '';
        globalEventBus.emit(GLOBAL.LOGIN_REDIRECT);
    }
}
