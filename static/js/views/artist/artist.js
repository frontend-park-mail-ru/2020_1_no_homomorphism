import artist from '@views/artist/artist.tmpl.xml';
import BaseView from '@libs/base_view';
import TrackListComponent from '@components/track_list/track_list';
import PlaylistsComponent from '@components/playlist_list/playlist_list';
import {GLOBAL, ARTIST, DOM, POPUP, PAGINATION} from '@libs/constants';
import User from '@libs/user';
import PopUp from '@components/pop-up/pop-up';
import {inputSanitize} from '@libs/input_sanitize';
import {globalEventBus} from '@libs/eventBus';

/**
 *  вью для страницы артиста
 */
export default class ArtistView extends BaseView {
    /**
     * Конструктор
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        super(artist);
        this.id = 0;
        this.currentOpen = '';
        this.textSubscribe = '';
        new TrackListComponent(eventBus, ARTIST);
        new PlaylistsComponent(eventBus, ARTIST.RENDER_ALBUMS);
        this.eventBus = eventBus;
        this.eventBus.on(ARTIST.RENDER_DATA, this.renderData.bind(this));
        this.eventBus.on(ARTIST.DRAW_SUBSCRIBE, this.drawSubscribe.bind(this));
        this.eventBus.on(ARTIST.NEW_RECIEVED, this.resetPage.bind(this));
    }

    /**
     * Рендер
     * @param {Object} root
     * @param {string} url
     */
    render(root, url) {
        this.rendered = 0;
        globalEventBus.emit(GLOBAL.COLLAPSE_IF_MOBILE);
        super.render(document.getElementsByClassName(DOM.CONTENT)[0], url);
        this.analizeUrl(url);
        this.eventBus.emit(ARTIST.GET_DATA, this.id);
        this.chooseSection(url);
        this.scrollListeningState = 'show';
        this.scrollPreviosPageYOffset = 0;
        this.firstInPage = undefined;
        this.lastInPage = undefined;
    }

    /**
     * Парсит урл
     * @param {string} url
     */
    analizeUrl(url) {
        this.id = (url.indexOf('/') === -1 ? url : url.slice(0, url.indexOf('/')));
        this.currentOpen = (url.indexOf('/') === -1 ?
            'tracks' :
            url.slice(url.indexOf('/') + 1, url.length));
    }

    /**
     * Определение секции нажатия
     * @param {string} url
     */
    chooseSection(url) {
        const curSection = document.getElementById(`profile-${this.currentOpen}-title`);
        curSection.classList.add(ARTIST.SELECTED_CLASS);
        this.eventBus.emit(`artist-${this.currentOpen}`, '0',
            PAGINATION[this.currentOpen].toString());
        this.rendered += PAGINATION[this.currentOpen];
    }

    /**
     * Рендер
     * @param {Object} data
     */
    renderData(data) {
        super.setData(data);
        this.eventBus.emit(ARTIST.SET_ARTIST_ID, data.id);
        document.getElementsByClassName('m-top-login')[0].innerHTML = inputSanitize(data.name);
        document.getElementsByClassName('m-round-image')[0].src = data.image;
        document.getElementsByClassName('m-top-name')[0].innerHTML = inputSanitize(data.genre);
        document.getElementsByClassName('m-top-section-tracks-ref')[0].href =
            `/artist/${data.id}/tracks`;
        document.getElementsByClassName('m-top-section-albums-ref')[0].href =
            `/artist/${data.id}/albums`;
        document.getElementsByClassName('l-top-section-info-ref')[0]
            .href = `/artist/${data.id}/info`;
        document.getElementById('artist-tracks-title').innerText = data.tracks;
        document.getElementById('artist-albums-title').innerText = data.albums;
        this.setEventListeners.bind(this)();
        this.textSubscribe = 'Subscribe';
        if (data.is_subscribed) {
            this.textSubscribe = 'Unsubscribe';
            document.getElementsByClassName('m-subscribe')[0].classList.toggle('is-subscribed');
        }
        document.getElementsByClassName('m-subscribe')[0].innerHTML =
            inputSanitize(this.textSubscribe);
    }

    /**
     * Set event listeners
     */
    setEventListeners() {
        document.getElementsByClassName('m-subscribe')[0]
            .addEventListener('click', this.subscribe.bind(this));
        document.getElementsByClassName('l-button-middle-play')[0]
            .addEventListener('click', this.playArtistTracks.bind(this));
        document.getElementsByClassName('l-button-middle-play')[0]
            .addEventListener('touchend', (event) => {
                event.preventDefault();
                let target = event.target;
                while (!target.classList.contains('l-button-middle-play')) {
                    target = target.parentNode;
                }
                event.target.classList.add('touched');
                setTimeout(() => event.target.classList.remove('touched'), 300);
                event.target.click();
            });
        window.addEventListener('scroll', this.managePages.bind(this));
    }

    /**
     * управляет пагинацией
     */
    managePages() {
        if (this.scrollListeningState === 'locked') {
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
            PAGINATION[this.currentOpen]] &&
            document.getElementsByClassName('l-track-big')[this.firstInPage +
            PAGINATION[this.currentOpen]].getBoundingClientRect().bottom >
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
            PAGINATION[this.currentOpen]] &&
            document.getElementsByClassName('l-track-big')[this.firstInPage +
            PAGINATION[this.currentOpen]].getBoundingClientRect().top < 60 &&
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
        while (i < PAGINATION[this.currentOpen]) {
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
            336
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
            // document.getElementsByClassName('l-track-big')[elem].getBoundingClientRect().bottom)
            336
        ).toString() + 'px';
        while (this.lastInPage >= this.firstInPage + PAGINATION[this.currentOpen]) {
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
            if (this.rendered < this.data.tracks) {
                this.scrollListeningState = 'locked';
                this.eventBus.emit(`artist-${this.currentOpen}`, this.rendered.toString(),
                    (this.rendered + PAGINATION[this.currentOpen]).toString());
                this.rendered += PAGINATION[this.currentOpen];
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
            while (i < PAGINATION[this.currentOpen] && document
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
                336
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
            // document.getElementsByClassName('l-track-big')[this.firstInPage - PAGINATION[this.currentOpen]].getBoundingClientRect().top)
            336
        ).toString() + 'px';
        let i = 0;
        while (i < PAGINATION[this.currentOpen]) {
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
            this.lastInPage = this.rendered - 1;
            this.scrollListeningState = 'show';
        } else {
            const i = 0;
            while (i < PAGINATION[this.currentOpen] && document
                .getElementsByClassName('l-track-big')[this.lastInPage]
            ) {
                this.lastInPage++;
            }
            this.lastInPage--;
            this.scrollListeningState = 'hide';
        }
        // console.log(this.firstInPage);
        // console.log(this.lastInPage);
    }

    /**
     * Проигрование всех треков артиста
     */
    playArtistTracks() {
        if (this._data.tracks === 0) {
            return;
        }
        globalEventBus.emit(GLOBAL.PLAY_ARTIST_TRACKS, this.id,
            document.getElementsByClassName('l-track-big')[0].getAttribute('t-id'),
            this._data.tracks);
    }

    /**
     * Subscribe
     */
    subscribe() {
        this.eventBus.emit(ARTIST.SUBSCRIBE, this.data.id);
    }

    /**
     * Subscribe result
     * @param {Boolean} success
     */
    drawSubscribe(success) {
        if (!success) {
            if (this.textSubscribe === 'Subscribe') {
                new PopUp(POPUP.ARTIST_SUBSCRIPTION_ERROR_MESSAGE + this.data.name, true);
            } else {
                new PopUp(POPUP.ARTIST_UNSUBSCRIPTION_ERROR_MESSAGE + this.data.name, true);
            }
            return;
        }
        if (this.textSubscribe === 'Subscribe') {
            new PopUp(POPUP.ARTIST_SUBSCRIPTION_MESSAGE + this.data.name);
        } else {
            new PopUp(POPUP.ARTIST_UNSUBSCRIPTION_MESSAGE + this.data.name);
        }
        if (User.exists()) {
            const button = document.getElementsByClassName('m-subscribe')[0];
            this.textSubscribe = button.classList.contains('is-subscribed') ?
                'Subscribe' : 'Unsubscribe';
            button.classList.add('is-invisible');
            button.classList.toggle('is-subscribed');
            button.innerText = this.textSubscribe;
            setTimeout(() => {
                button.classList.remove('is-invisible');
            }, 100);
        }
    }
}
