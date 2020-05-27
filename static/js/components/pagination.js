import {PAGINATION} from '@libs/constants';

/**
 * Класс для менеджера страниц
 */
export default class PagesManager {
    /**
     * Конструктор
     * @param {String} url
     * @param {Object} eventBus
     * @param {Function} getData
     * @param {String} resetMessage
     */
    constructor(url, eventBus, getData, resetMessage) {
        this.url = url;
        this.eventBus = eventBus;
        this.getData = getData;
        this.scrollListeningState = 'show';
        this.scrollPreviosPageYOffset = 0;
        this.firstInPage = undefined;
        this.lastInPage = undefined;
        this.askMore = true;
        window.addEventListener('scroll', this.managePages.bind(this));
        this.eventBus.on(resetMessage, this.resetPage.bind(this));
    }

    getFirst() {
        this.rendered = 0;
        this.getData('0', PAGINATION['tracks'].toString());
        this.rendered += PAGINATION['tracks'];
    }

    /**
     * управляет пагинацией
     */
    managePages() {
        if (this.scrollListeningState === 'locked') {
            return;
        }
        if (window.location.pathname.indexOf(this.url) === -1 ||
            window.location.pathname.indexOf('albums') !== -1 ||
            window.location.pathname.indexOf('info') !== -1
        ) {
            this.scrollListeningState = 'locked';
            return;
        }
        if (!this.firstInPage) {
            this.firstInPage = 0;
        }
        if (!this.lastInPage) {
            this.lastInPage = document.getElementsByClassName('l-track-big').length - 1;
        }
        if (document.getElementsByClassName('top-pagination-patch')[0]
            .getBoundingClientRect().bottom > 60 && this.scrollListeningState === 'show'
        ) {
            this.showPreviousPage();
        }
        if (document.getElementsByClassName('l-track-big')[this.firstInPage +
            PAGINATION['tracks']] &&
            document.getElementsByClassName('l-track-big')[this.firstInPage +
            PAGINATION['tracks']].getBoundingClientRect().bottom >
            document.documentElement.clientHeight + 20 &&
            this.scrollPreviosPageYOffset > window.pageYOffset &&
            this.scrollListeningState === 'hide'
        ) {
            this.hideNextPage();
        }
        if (document.getElementsByClassName('bottom-pagination-patch')[0]
            .getBoundingClientRect().top < document.documentElement.clientHeight + 20 &&
            this.scrollListeningState === 'show'
        ) {
            this.showNextPage();
        }
        if (document.getElementsByClassName('l-track-big')[this.firstInPage +
            PAGINATION['tracks']] &&
            document.getElementsByClassName('l-track-big')[this.firstInPage +
            PAGINATION['tracks']].getBoundingClientRect().top < 60 &&
            this.scrollPreviosPageYOffset < window.pageYOffset &&
            this.scrollListeningState === 'hide'
        ) {
            this.hidePreviousPage();
        }
        this.scrollPreviosPageYOffset = window.pageYOffset;
    }

    /**
     * Показывает предыдущую страницу
     */
    showPreviousPage() {
        if (document.getElementsByClassName('top-pagination-patch')[0]
            .getBoundingClientRect().height === 0
        ) {
            return;
        }
        // if (document.getElementsByClassName('top-pagination-patch')[0].getBoundingClientRect().height < 50) {
        //     document.getElementsByClassName('top-pagination-patch')[0].style.height = '0px';
        //     return;
        // }
        // console.log('show previous');
        // console.log(this.firstInPage);
        // console.log(this.lastInPage);
        this.scrollListeningState = 'locked';
        let i = 0;
        let elem = this.firstInPage - 1;
        while (i < PAGINATION['tracks']) {
            document.getElementsByClassName('l-track-big')[elem].classList
                .remove('is-not-displayed');
            elem--;
            i++;
        }
        elem++;
        document.getElementsByClassName('top-pagination-patch')[0].style.height = (
            parseInt(document.getElementsByClassName('top-pagination-patch')[0].style.height
                .slice(0, document.getElementsByClassName('top-pagination-patch')[0].style.height
                    .length - 2)) -
            // Math.abs(document.getElementsByClassName('l-track-big')[elem].getBoundingClientRect().top -
            // document.getElementsByClassName('l-track-big')[this.firstInPage - 1].getBoundingClientRect().bottom)
            166
        ).toString() + 'px';
        this.firstInPage = elem;
        this.scrollListeningState = 'hide';
    }

    /**
     * Прячет следующую страницу
     */
    hideNextPage() {
        // console.log('hide next');
        // console.log(this.firstInPage);
        // console.log(this.lastInPage);
        this.scrollListeningState = 'locked';
        document.getElementsByClassName('bottom-pagination-patch')[0].style.height = (
            parseInt(document.getElementsByClassName('bottom-pagination-patch')[0].style.height
                .slice(0, document.getElementsByClassName('bottom-pagination-patch')[0].style.height
                    .length - 2)) +
            // Math.abs(document.getElementsByClassName('l-track-big')[this.lastInPage].getBoundingClientRect().bottom -
            // document.getElementsByClassName('l-track-big')[this.firstInPage + PAGINATION['tracks']].getBoundingClientRect().bottom)
            166
        ).toString() + 'px';
        while (this.lastInPage >= this.firstInPage + PAGINATION['tracks']) {
            document.getElementsByClassName('l-track-big')[this.lastInPage].classList
                .add('is-not-displayed');
            this.lastInPage--;
        }
        this.scrollListeningState = 'show';
    }

    /**
     * Показывает следующую страницу
     */
    showNextPage() {
        if (document.getElementsByClassName('bottom-pagination-patch')[0]
            .getBoundingClientRect().height === 0
        ) {
            if (this.askMore) {
                this.scrollListeningState = 'locked';
                this.getData(this.rendered.toString(),
                    (this.rendered + PAGINATION['tracks']).toString());
                this.rendered += PAGINATION['tracks'];
                // console.log('asking next');
                // console.log(this.firstInPage);
                // console.log(this.lastInPage);
            }
        } else {
            // if (document.getElementsByClassName('bottom-pagination-patch')[0].getBoundingClientRect().height < 50) {
            //     document.getElementsByClassName('bottom-pagination-patch')[0].style.height = '0px';
            //     return;
            // }
            this.scrollListeningState = 'locked';
            // console.log('show next');
            // console.log(this.firstInPage);
            // console.log(this.lastInPage);
            let i = 0;
            let elem = this.lastInPage + 1;
            while (i < PAGINATION['tracks'] && document
                .getElementsByClassName('l-track-big')[elem]
            ) {
                document.getElementsByClassName('l-track-big')[elem].classList
                    .remove('is-not-displayed');
                elem++;
                i++;
            }
            elem--;
            document.getElementsByClassName('bottom-pagination-patch')[0].style.height = (
                parseInt(document.getElementsByClassName('bottom-pagination-patch')[0].style.height
                    .slice(0, document.getElementsByClassName('bottom-pagination-patch')[0].style
                        .height.length - 2)) -
                // Math.abs(document.getElementsByClassName('l-track-big')[this.lastInPage + 1].getBoundingClientRect().top -
                // document.getElementsByClassName('l-track-big')[elem].getBoundingClientRect().bottom)
                166
            ).toString() + 'px';
            this.lastInPage = elem;
            this.scrollListeningState = 'hide';
        }
    }

    /**
     * Прячет предыдущую страницу
     */
    hidePreviousPage() {
        // console.log('hide previous');
        // console.log(this.firstInPage);
        // console.log(this.lastInPage);
        this.scrollListeningState = 'locked';
        document.getElementsByClassName('top-pagination-patch')[0].style.height = (
            parseInt(document.getElementsByClassName('top-pagination-patch')[0].style.height
                .slice(0, document.getElementsByClassName('top-pagination-patch')[0].style.height
                    .length - 2)) +
            // Math.abs(document.getElementsByClassName('l-track-big')[this.firstInPage].getBoundingClientRect().top -
            // document.getElementsByClassName('l-track-big')[this.firstInPage + PAGINATION[this.currentOpen]].getBoundingClientRect().top)
            166
        ).toString() + 'px';
        let i = 0;
        while (i < PAGINATION['tracks']) {
            document.getElementsByClassName('l-track-big')[this.firstInPage].classList
                .add('is-not-displayed');
            i++;
            this.firstInPage++;
        }
        this.scrollListeningState = 'show';
    }

    /**
     * Регистрирует отрендеренные треки только что с бэкенда
     */
    resetPage() {
        // console.log('next recieved');
        if (this.firstInPage === undefined || this.lastInPage === undefined) {
            this.firstInPage = 0;
            this.lastInPage = 0;
            while (document.getElementsByClassName('l-track-big')[this.lastInPage]) {
                this.lastInPage++;
            }
            this.lastInPage--;
            if (this.lastInPage - this.firstInPage + 1 < PAGINATION['tracks']) {
                this.askMore = false;
            }
            this.scrollListeningState = 'show';
        } else {
            while (document.getElementsByClassName('l-track-big')[this.lastInPage]) {
                this.lastInPage++;
            }
            this.lastInPage--;
            if (this.lastInPage - this.firstInPage + 1 < 2 * PAGINATION['tracks']) {
                this.askMore = false;
            }
            this.scrollListeningState = 'hide';
        }
        // console.log(this.firstInPage);
        // console.log(this.lastInPage);
    }
}
