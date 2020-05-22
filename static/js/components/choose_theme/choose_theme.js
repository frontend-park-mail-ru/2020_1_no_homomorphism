import {THEME, THEME_OVERLAY} from '@libs/constants';
import template from '@components/choose_theme/choose_theme.tmpl.xml';

/**
 * Компонент селектор тем
 */
export default class ChooseThemeComponent {
    /**
     * Конструткор
     * @param {function} callback
     */
    constructor(callback) {
        this.callback = callback;
    }

    /**
     * рендер
     */
    render() {
        const data = [];
        for (const i in THEME) {
            if (!{}.hasOwnProperty.call(THEME, i)) {
                continue;
            }
            for (const j in THEME[i]) {
                if (!{}.hasOwnProperty.call(THEME[i], j)) {
                    continue;
                }
                data.push({
                    name: i + ' ' + j,
                    general: THEME_OVERLAY[i],
                    color: THEME[i][j][1][1],
                });
            }
        }
        document.getElementById('theme selector').innerHTML = template(data);
        this.setEventListeners();
    }

    /**
     * set event listeners
     */
    setEventListeners() {
        document.getElementsByClassName('m-theme-big').forEach((elem) => {
            elem.addEventListener('click', (event) => {
                const target = document.getElementsByClassName('m-theme-big').find((elem) => {
                    return elem.contains(event.target);
                });
                if (document.getElementsByClassName('is-current-theme')[0]) {
                    document.getElementsByClassName('is-current-theme')[0].classList
                        .remove('is-current-theme');
                }
                target.classList.add('is-current-theme');
                const split = target.getAttribute('id').split(' ');
                document.documentElement.setAttribute('theme', split[0]);
                THEME[split[0]][split[1]].forEach((prop) => {
                    document.documentElement.style.setProperty(prop[0], prop[1]);
                });
                this.callback();
            });
        });
    }
}
