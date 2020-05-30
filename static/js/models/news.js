import Api from '@libs/api';
import {MAIN, URL, RESPONSE, GLOBAL} from '@libs/constants';
import {globalEventBus} from '@libs/eventBus';
import {lang} from '@libs/language';
import ArtistListComponent from '@components/artist_list/artist_list';
import TrackListComponent from '@components/track_list/track_list';

/**
 * Модель для главной страницы
 */
export default class NewsModel {
    /**
     * Конструктор
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.artists = [];
        this.subscriptionsListComponent = new ArtistListComponent(eventBus,
            MAIN.RENDER_ARTISTS_LIST);
        this.trackListComponent = new TrackListComponent(eventBus, MAIN);
        this.eventBus.on(MAIN.GET_SUBSCRIPTIONS_DATA, this.cookieFetch.bind(this));
        this.eventBus.on(MAIN.GET_TRACKS_DATA, this.getTracksOfTheDay.bind(this));
        this.eventBus.on(MAIN.GET_ARTISTS_DATA, this.getArtistListData.bind(this));
    }

    /* *
     * Узнаёт, залогинен ли пользователь
     */
    cookieFetch() {
        Api.cookieGet()
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    this.getSubscriptionsData();
                    break;
                case RESPONSE.UNAUTH:
                    document.getElementsByClassName('subscriptions-section')[0]
                        .classList.remove('m-empty-section');
                    break;
                default:
                    console.log(res);
                    console.error('I am a teapot');
                }
            });
    }

    /**
     * Получает список обновлений артистов
     */
    getSubscriptionsData() {
        Api.newsGet()
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    res.json().then((data) => {
                        this.eventBus.emit(MAIN.RENDER_NEWS_SECTION, {
                            domItem: 'subscriptions-section',
                            caption: lang.news.subscriptions,
                            ok: data.length > 0,
                        });
                        this.eventBus.emit(MAIN.RENDER_NEWS_LIST, {
                            domItem: 'subscriptions-section',
                            news: data,
                        });
                    });
                    break;
                case RESPONSE.BAD_REQUEST:
                    globalEventBus.emit(GLOBAL.REDIRECT, URL.MAIN);
                    break;
                case RESPONSE.SERVER_ERROR:
                    globalEventBus.emit(GLOBAL.REDIRECT, URL.MAIN);
                    break;
                default:
                    console.log(res);
                    console.error('I am a teapot');
                }
            });
    }

    /**
     * Получает обновлений мировых артистов
     */
    getWorldNews() {
        Api.newsGet()
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    res.json().then((data) => {
                        this.eventBus.emit(MAIN.RENDER_NEWS_SECTION, {
                            domItem: 'subscriptions-section',
                            caption: lang.news.worldNews,
                            ok: data.length > 0,
                        });
                        this.eventBus.emit(MAIN.RENDER_NEWS_LIST, {
                            domItem: 'subscriptions-section',
                            news: data,
                        });
                    });
                    break;
                case RESPONSE.BAD_REQUEST:
                    globalEventBus.emit(GLOBAL.REDIRECT, URL.MAIN);
                    break;
                case RESPONSE.SERVER_ERROR:
                    globalEventBus.emit(GLOBAL.REDIRECT, URL.MAIN);
                    break;
                default:
                    console.log(res);
                    console.error('I am a teapot');
                }
            });
    }

    /**
     * Получает список треков дня
     */
    getTracksOfTheDay() {
        const promises = [];
        for (let i = 0; i < 10; i++) {
            let p = Math.floor(Math.random() * (37 - 1) + 1);
            while (promises.indexOf(p) !== -1) {
                p = Math.floor(Math.random() * (37 - 1) + 1);
            }
            promises.push(p);
        }
        Promise.all(promises.map((p) => Api.trackGet(p))).then((res) => {
            if (res.every((item) => item.ok)) {
                const data = [];
                Promise.all(res.map((item) => item.json()))
                    .then((res) => res.forEach((item) => data.push(item)))
                    .then(() => {
                        this.eventBus.emit(MAIN.RENDER_TRACKS_LIST, {
                            domItem: 'tracks-section',
                            caption: lang.news.tracks,
                            ok: true,
                        }, this.eventBus);
                        this.eventBus.emit(MAIN.RENDER_TRACKS, {
                            domItem: 'tracks-section',
                            type: 'track',
                            tracks: data,
                        });
                    });
            }
        });
    }

    /**
     * Получает список артистов
     */
    getArtistListData() {
        Api.topArtists().then((res) => {
            switch (res.status) {
            case RESPONSE.OK:
                res.json().then((data) => {
                    this.eventBus.emit(MAIN.RENDER_ARTISTS, {
                        domItem: 'artists-section',
                        caption: lang.news.artists,
                        ok: true,
                    });
                    const temp = [];
                    for (const i of data) { // TODO ВРЕМЕННО!
                        temp.push(i);
                        temp.push(i);
                    }
                    this.eventBus.emit(MAIN.RENDER_ARTISTS_LIST, {
                        domItem: 'artists-section',
                        artists: temp,
                    });
                });
                break;
            case RESPONSE.BAD_REQUEST:
                globalEventBus.emit(GLOBAL.REDIRECT, URL.MAIN);
                break;
            case RESPONSE.SERVER_ERROR:
                globalEventBus.emit(GLOBAL.REDIRECT, URL.MAIN);
                break;
            default:
                console.log(res);
                console.error('I am a teapot');
            }
        });
    }
}
