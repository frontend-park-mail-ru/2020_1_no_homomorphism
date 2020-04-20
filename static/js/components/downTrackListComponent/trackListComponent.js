import template from '@components/downTrackListComponent/tracks.tmpl.xml';
import {globalEventBus} from '@libs/eventBus';
import ChoosePlaylist from '@components/choosePlaylistComponent/choosePlaylistComponent';
import TrackComponent from '@components/trackComponent/trackComponent';
import PlaylistComponent from '@components/playlistComponent/playlistComponent';

/**
 * Компонент - список треков
 */
export default class TrackListComponent {
    /**
     * Конструткор
     * @param {EventBus} eventBus
     * @param {object} constType
     */
    constructor(eventBus, constType) {
        eventBus.on(constType.RENDER_TRACKS, this.renderTracks.bind(this));
        eventBus.on(constType.SET_PLAYLIST_ID, this.setId.bind(this));
        eventBus.on(constType.SET_ALBUM_ID, this.setId.bind(this));
        eventBus.on(constType.SET_ARTIST_ID, this.setId.bind(this));
        this.choosePlaylist = new ChoosePlaylist(eventBus, constType);
        this.trackComponent = new TrackComponent();
        this.playlistComponent = new PlaylistComponent();
        this.constType = constType;
        this.eventBus = eventBus;
        this.tracklist = [];
        this.id = 0;
        this.type = '';
    }

    /**
     * Отрисовка списка треков
     * @param {Object} data
     */
    renderTracks(data) {
        this.tracklist = data.tracks;
        this.type = data.type;
        const elem = document.getElementsByClassName(data.domItem)[0];
        this.tracklist.type = this.type === 'playlist';
        elem.innerHTML = template(this.tracklist);
        this.setTracksEventListeners();
    }

    /**
     * Set EventListeners
     * @param {number} id
     */
    setId(id) {
        this.id = id;
    }

    /**
     * Set EventListeners
     */
    setTracksEventListeners() {
        document.querySelectorAll('.m-track-image').forEach((track) => {
            track.onclick = (event) => this.playTrack.bind(this)(event);
        });
        document.querySelectorAll('.m-button-track-play').forEach((track) => {
            track.onclick = (event) => this.playTrack.bind(this)(event);
        });
        document.querySelectorAll('.m-big-add-button').forEach((track) => {
            track.onclick = (event) => this.addToPlaylist.bind(this)(event);
        });
        document.querySelectorAll('img.m-big-like-button').forEach((button) => {
            button.onclick = (event) => this.likeClicked(event);
        });
        if (this.tracklist.type) {
            document.querySelectorAll('img.m-big-delete-button').forEach((button) => {
                button.onclick = (event) => this.deleteClicked(event);
            });
        }
    }

    /**
     * Слушает нажатие на play
     * @param {Object} event
     */
    playTrack(event) {
        const trackData = this.getIdByClick(event);
        globalEventBus.emit(`global-play-${this.type}-tracks`,
            this.id,
            trackData.id,
            this.tracklist.length);
    }

    /**
     * Слушает добавление в плейлист
     * @param {Object} event
     */
    addToPlaylist(event) {
        this.choosePlaylist.trackData = this.getIdByClick(event);
        this.getProfilePlaylists();
    }

    /**
     * Получение плейлистов пользователя
     */
    getProfilePlaylists() {
        this.playlistComponent.getProfilePlaylistsApi(this.kek.bind(this));
        // const res = this.playlistComponent.playlists;
        // console.log(res);
        // this.choosePlaylist
        //     .render(this.setTracksEventListeners.bind(this), res);
        // Api.profilePlaylistsGet()
        //     .then((res) => {
        //         switch (res.status) {
        //         case RESPONSE.OK:
        //             res.json()
        //                 .then((list) => {
        //                     this.choosePlaylist
        //                         .render(this.setTracksEventListeners.bind(this), list.playlists);
        //                 });
        //             break;
        //         case RESPONSE.UNAUTH:
        //         case RESPONSE.NO_ACCESS_RIGHT:
        //             globalEventBus.emit(GLOBAL.REDIRECT, URL.SIGN_UP);
        //             break;
        //         case RESPONSE.BAD_REQUEST:
        //         default:
        //             console.log(res);
        //             console.error('I am a teapot');
        //         }
        //     });
    }

    /**
     * @param {Array} kek
     */
    kek(kek) {
        this.choosePlaylist
            .render(this.setTracksEventListeners.bind(this), kek);
    }

    /**
     * Получение id из dom-елемента по нажатию
     * @param {Object} event
     * @return {Object}
     */
    getIdByClick(event) {
        let current = event.target;
        while (current !== window && current !== document.body && current != null) {
            if (current.getAttribute('class') === 'l-track-big' &&
                current.getAttribute('t-id') !== null) {
                this.trackToDelete = current;
                return {
                    'id': current.getAttribute('t-id'),
                    'image': current.getAttribute('t-image'),
                };
            } else {
                current = current.parentNode;
            }
        }
    }

    /** Для хранения
     * Удаление из плейлиста
     * @param {Object} event
     */
    deleteClicked(event) {
        const trackData = this.getIdByClick(event);
        this.trackComponent.trackData = trackData;
        this.trackComponent.delFromPlaylist(this.id);
        this.deleteFromDOM(trackData.id);
    }

    /**
     * Удаление элемента из DOM
     * @param {string} trackID
     */
    deleteFromDOM(trackID) {
        for (let i = this.tracklist.length - 1; i >= 0; i--) {
            if (this.tracklist[i].id === trackID) {
                this.trackToDelete.remove();
                this.tracklist.splice(i, 1);
                break;
            }
        }
    }

    /**
     * Слушает клик мыши по кнопке лайка на треке в плейлисте
     * @param {Object} event
     */
    likeClicked(event) {
        alert('This functionality is not accessible by now');
        // if (event.target.src.indexOf('/static/img/favorite_border.svg') !== -1) {
        //     event.target.src = '/static/img/favorite.svg';
        // } else {
        //     event.target.src = '/static/img/favorite_border.svg';
        // }
    }
}
