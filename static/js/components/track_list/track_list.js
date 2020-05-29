import template from '@components/track_list/tracks.tmpl.xml';
import emptyTemplate from '@components/empty_block/empty.tmpl.xml';
import {globalEventBus} from '@libs/eventBus';
import ChoosePlaylist from '@components/choose_playlist/choose_playlist';
import TrackComponent from '@components/track/track';
import PlaylistComponent from '@components/playlist/playlist';
import {PLAYLIST, GLOBAL, RESPONSE, PROFILE, POPUP, LAYOUT} from '@libs/constants';
import User from '@libs/user';
import Api from '@libs/api';
import PopUp from '@components/pop-up/pop-up';

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
        this._choosePlaylist = new ChoosePlaylist(eventBus, constType);
        this._trackComponent = new TrackComponent();
        this._playlistComponent = new PlaylistComponent(this.setTracksEventListeners.bind(this));
        this.eventBus = eventBus;
        this._tracklist = [];
        this._id = 0;
        this._type = '';
        this._baseDom = '';
        this._subscribe.bind(this)(constType);
        this.constType = constType;
    }

    /**
     * Конструткор
     * @param {object} constType
     */
    _subscribe(constType) {
        this.eventBus.on(constType.RENDER_TRACKS, this.render.bind(this));
        if (constType.SET_PLAYLIST_ID !== undefined) {
            this.eventBus.on(constType.SET_PLAYLIST_ID, this.setId.bind(this));
        }
        if (constType.SET_ALBUM_ID !== undefined) {
            this.eventBus.on(constType.SET_ALBUM_ID, this.setId.bind(this));
        }
        if (constType.SET_ARTIST_ID !== undefined) {
            this.eventBus.on(constType.SET_ARTIST_ID, this.setId.bind(this));
        }
    }

    /**
     * Установка айди (альбома или плейлиста)
     * @param {number} id
     */
    setId(id) {
        this._id = id;
    }

    /**
     * Отрисовка списка треков
     * @param {Object} data
     * @param {Boolean} save
     */
    render(data, save = false) {
        data.startIndex = data.startIndex ? parseInt(data.startIndex) : 0;
        let i = 1;
        data.tracks.map((track) => {
            track.index = i + data.startIndex;
            i++;
        });
        if (save) {
            Array.prototype.push.apply(this._tracklist, data.tracks);
        } else {
            this._tracklist = data.tracks;
        }
        this._type = data.type;
        this._tracklist.type = this._type === 'playlist';
        this._baseDom = data.domItem;
        if (this._type === 'search' && this._tracklist.length === 0) {
            return;
        }
        const elem = document.getElementsByClassName(data.domItem)[0];
        if (elem.lastChild && elem.lastChild.previousSibling && elem.lastChild.previousSibling
            .classList.contains('is-empty-track')
        ) {
            elem.lastChild.previousSibling.remove();
        }
        if (elem.lastChild && elem.lastChild && elem.lastChild.classList.contains('m-empty-list')) {
            elem.lastChild.remove();
        }
        if (!elem.firstChild) {
            elem.innerHTML = '<div class="top-pagination-patch" style="height: 0px"></div>';
        }
        elem.innerHTML += template(data.tracks);
        const patch = elem.getElementsByClassName('bottom-pagination-patch')[0];
        if (!patch) {
            elem.innerHTML += '<div class="bottom-pagination-patch" style="height: 0px"></div>';
        } else {
            elem.insertAdjacentElement('beforeend', patch);
        }
        this.eventBus.emit(this.constType.NEW_RECIEVED);
        if (this._tracklist.length !== 0) {
            this.setTracksEventListeners();
        }
    }

    /**
     * Set EventListeners
     */
    setTracksEventListeners() {
        document.querySelectorAll('.l-track-big .m-track-image').forEach((track) => {
            track.onclick = (event) => this.playTrack.bind(this)(event);
        });
        document.querySelectorAll('.l-track-big .m-button-track-play').forEach((track) => {
            track.onclick = (event) => this.playTrack.bind(this)(event);
        });
        document.querySelectorAll('.l-track-big .m-big-add-button').forEach((track) => {
            track.onclick = (event) => this.addToPlaylist.bind(this)(event);
        });
        document.querySelectorAll('.l-track-big img.m-big-like-button').forEach((button) => {
            button.onclick = (event) => this.likeClicked(event);
        });
        if (this._tracklist.type) {
            document.querySelectorAll('.l-track-big img.m-big-delete-button').forEach((button) => {
                button.onclick = (event) => this.deleteClicked(event);
            });
        }
        if (window.matchMedia(LAYOUT.MOBILE).matches || window.matchMedia(LAYOUT.TABLET).matches) {
            document.querySelectorAll('.l-track-big .more-button').forEach((button) => {
                button.ontouchstart = (event) => {
                    event.preventDefault();
                    event.target.classList.add('touched');
                    setTimeout(() => event.target.classList.remove('touched'), 200);
                    event.target.click();
                };
                button.onclick = (event) => this.moreClicked(event);
            });
            document.querySelectorAll('.l-track-big .add-button').forEach((track) => {
                track.ontouchstart = (event) => {
                    event.preventDefault();
                    if (event.target.tagName == 'BUTTON') {
                        event.target.classList.add('touched');
                        setTimeout(() => event.target.classList.remove('touched'), 100);
                    } else {
                        event.target.parentNode.classList.add('touched');
                        setTimeout(() => event.target.parentNode.classList.remove('touched'), 100);
                    }
                    event.target.click();
                };
                track.onclick = (event) => this.addToPlaylist.bind(this)(event);
            });
            document.querySelectorAll('.l-track-big .like-button').forEach((button) => {
                button.ontouchstart = (event) => {
                    event.preventDefault();
                    if (event.target.tagName == 'BUTTON') {
                        event.target.classList.add('touched');
                        setTimeout(() => event.target.classList.remove('touched'), 100);
                    } else {
                        event.target.parentNode.classList.add('touched');
                        setTimeout(() => event.target.parentNode.classList.remove('touched'), 100);
                    }
                    event.target.click();
                };
                button.onclick = (event) => this.likeClicked(event);
            });
            document.querySelectorAll('.l-track-big .add-player-button').forEach((button) => {
                button.ontouchstart = (event) => {
                    event.preventDefault();
                    if (event.target.tagName == 'BUTTON') {
                        event.target.classList.add('touched');
                        setTimeout(() => event.target.classList.remove('touched'), 100);
                    } else {
                        event.target.parentNode.classList.add('touched');
                        setTimeout(() => event.target.parentNode.classList.remove('touched'), 100);
                    }
                    event.target.click();
                };
                button.onclick = (event) => this.addToPlayerQueue(event);
            });
            document.querySelectorAll('.l-track-big .album-button').forEach((button) => {
                button.ontouchstart = (event) => {
                    event.preventDefault();
                    if (event.target.tagName == 'BUTTON') {
                        event.target.classList.add('touched');
                        setTimeout(() => event.target.classList.remove('touched'), 100);
                    } else {
                        event.target.parentNode.classList.add('touched');
                        setTimeout(() => event.target.parentNode.classList.remove('touched'), 100);
                    }
                    event.target.click();
                };
            });
            document.querySelectorAll('.l-track-big .artist-button').forEach((button) => {
                button.ontouchstart = (event) => {
                    event.preventDefault();
                    if (event.target.tagName == 'BUTTON') {
                        event.target.classList.add('touched');
                        setTimeout(() => event.target.classList.remove('touched'), 100);
                    } else {
                        event.target.parentNode.classList.add('touched');
                        setTimeout(() => event.target.parentNode.classList.remove('touched'), 100);
                    }
                    event.target.click();
                };
                button.onclick = (event) => this.artistClicked(event);
            });
            if (this._tracklist.type) {
                document.querySelectorAll('.l-track-big .remove-button').forEach((button) => {
                    button.ontouchstart = (event) => {
                        event.preventDefault();
                        if (event.target.tagName == 'BUTTON') {
                            event.target.classList.add('touched');
                            setTimeout(() => event.target.classList.remove('touched'), 100);
                        } else {
                            event.target.parentNode.classList.add('touched');
                            setTimeout(() => event.target.parentNode.classList.remove('touched'),
                                100);
                        }
                        event.target.click();
                    };
                    button.onclick = (event) => this.deleteClicked(event);
                });
            }
        }
    }

    /**
     * Слушает нажатие на play
     * @param {Object} event
     */
    playTrack(event) {
        const trackData = this.getIdByClick(event);
        switch (this._type) {
        case 'search':
            this.getTrackInfo(trackData.id);
            break;
        case 'track':
            delete this._tracklist.type;
            globalEventBus.emit(`global-play-${this._type}-tracks`,
                {'tracks': this._tracklist}, trackData.id);
            break;
        case 'liked':
            delete this._tracklist.type;
            globalEventBus.emit(GLOBAL.PLAY_TRACKS,
                {'tracks': this._tracklist}, trackData.id);
            break;
        default:
            globalEventBus.emit(`global-play-${this._type}-tracks`,
                this._id,
                trackData.id,
                this._tracklist.length);
            return;
        }
    }

    /**
     * Слушает добавление в плейлист
     * @param {Object} event
     */
    addToPlaylist(event) {
        if (!User.exists()) {
            new PopUp(POPUP.LOGIN_ERROR, true);
            // globalEventBus.emit(GLOBAL.REDIRECT, URL.LOGIN);
            return;
        }
        this._choosePlaylist.trackData = this.getIdByClick(event);
        this.getProfilePlaylists();
    }

    /**
     * Получение плейлистов пользователя
     */
    getProfilePlaylists() {
        this._playlistComponent.getProfilePlaylistsApi(this.callChoosePlaylist.bind(this));
    }

    /**
     * Вызов компоненты choosePlaylist
     * @param {Array} playlistList
     */
    callChoosePlaylist(playlistList) {
        this._choosePlaylist
            .render(this.setTracksEventListeners.bind(this), playlistList);
    }

    /**
     * Получение id из dom-елемента по нажатию
     * @param {Object} event
     * @return {Object}
     */
    getIdByClick(event) {
        let current = event.target;
        while (!current.classList.contains('l-down-card')) {
            if (current.classList.contains('l-track-big') &&
                current.getAttribute('t-id') !== null) {
                this.trackToDelete = current;
                return {
                    'id': current.getAttribute('t-id'),
                    'image': current.getAttribute('t-image'),
                };
            }
            current = current.parentNode;
        }
    }

    /**
     * Get track from db
     * @param {String} id
     */
    getTrackInfo(id) {
        Api.trackGet(id).then((res) => {
            switch (res.status) {
            case RESPONSE.OK:
                res.json().then((elem) => {
                    globalEventBus.emit(GLOBAL.PLAY_TRACKS, {
                        tracks: [elem],
                    }, elem.id);
                });
                break;
            default:
                console.log(res);
                console.error('I am a teapot');
            }
        });
    }

    /**
     * Открытие нужного меню
     * @param {Object} event
     */
    moreClicked(event) {
        event.stopImmediatePropagation();
        document.getElementsByClassName('m-dropdown').forEach((dropdown) => {
            if (dropdown != event.target.parentNode.parentNode.parentNode.lastChild) {
                dropdown.classList.remove('is-expanded');
            }
        });
        const dropdown = event.target.parentNode.parentNode.parentNode.lastChild;
        const tbcr = event.target.getBoundingClientRect();
        dropdown.classList.toggle('is-expanded');
        const dbcr = dropdown.getBoundingClientRect();
        dropdown.style.right = (document.documentElement.clientWidth - tbcr.right + 20)
            .toString() + 'px';
        if (tbcr.bottom + dbcr.height > document.documentElement.clientHeight) {
            dropdown.style.top = (document.documentElement.clientHeight + window.pageYOffset -
                dbcr.height - 20).toString() + 'px';
        } else {
            dropdown.style.top = (tbcr.top + window.pageYOffset - 10).toString() + 'px';
        }
    }

    /**
     * Удаление трека из плейлиста
     * @param {Object} event
     */
    deleteClicked(event) {
        const trackData = this.getIdByClick(event);
        this._trackComponent.trackData = trackData;
        this._trackComponent.delFromPlaylist(this._id);
        this.deleteFromDOM(trackData.id);
    }

    /**
     * Удаление элемента из DOM
     * @param {string} trackID
     */
    deleteFromDOM(trackID) {
        for (let i = this._tracklist.length - 1; i >= 0; i--) {
            if (this._tracklist[i].id === trackID) {
                this.trackToDelete.remove();
                this._tracklist.splice(i, 1);
                this._changeNumbers(i);
                break;
            }
        }
        if (this._tracklist.length < 1) {
            this._setEmpty();
        }
        if (this._type === 'playlist') {
            this.eventBus.emit(PLAYLIST.CHANGE_TRACK_AMOUNT, -1);
        }
        if (this._type === 'liked') {
            this.eventBus.emit(PROFILE.CHANGE_TRACK_AMOUNT, this._tracklist.length);
        }
    }

    /**
     * Change track number after deleting
     * @param {number} index
     */
    _changeNumbers(index) {
        document.querySelectorAll('.m-index').forEach((elem) => {
            if (elem.innerHTML > index) {
                elem.innerHTML--;
            }
        });
    }

    /**
     * Слушает клик мыши по кнопке лайка на треке в плейлисте
     * @param {Object} event
     */
    likeClicked(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (!User.exists()) {
            new PopUp(POPUP.LOGIN_ERROR, true);
            // globalEventBus.emit(GLOBAL.REDIRECT, URL.LOGIN);
            return;
        }
        const likedTrack = this.getIdByClick(event);
        this._tracklist.forEach((elem) => {
            if (elem.id === likedTrack.id) {
                elem.is_liked = !elem.is_liked;
            }
        });
        this._doLike(likedTrack.id, event.target);
    }

    /**
     * Change liked\dislike image in track or delete
     * @param {number} id
     * @param {Object} domItem
     */
    _changeImage(id, domItem) {
        if (this._type === 'liked') {
            this.deleteFromDOM(id.toString());
            return;
        }
        domItem.classList.toggle('is-liked');
        domItem.classList.toggle('is-not-liked');
        if (window.matchMedia(LAYOUT.MOBILE).matches || window.matchMedia(LAYOUT.TABLET).matches) {
            while (!domItem.classList.contains('m-dropdown-button')) {
                domItem = domItem.parentNode;
            }
            if (domItem.firstChild.src.indexOf('/static/img/icons/favorite.svg') !== -1) {
                domItem.firstChild.src = '/static/img/icons/favorite_border.svg';
                domItem.children[1].innerText = 'like';
            } else {
                domItem.firstChild.src = '/static/img/icons/favorite.svg';
                domItem.children[1].innerText = 'unlike';
            }
        } else {
            if (domItem.src.indexOf('/static/img/icons/favorite.svg') !== -1) {
                domItem.src = '/static/img/icons/favorite_border.svg';
            } else {
                domItem.src = '/static/img/icons/favorite.svg';
            }
        }
    }

    /**
     * Установка заглушки после удаление всего
     */
    _setEmpty() {
        document.getElementsByClassName(this._baseDom)[0]
            .innerHTML = emptyTemplate('You dont have any liked tracks');
    }

    /**
     * Отправка лайка
     * @param {number} id
     * @param {Object} domItem
     */
    _doLike(id, domItem) {
        Api.trackLike(id.toString()).then((res) => {
            switch (res.status) {
            case RESPONSE.OK:
                this._changeImage.bind(this)(id, domItem);
                break;
            default:
                console.log(res);
                console.error('I am a teapot');
            }
        });
    }

    /**
     * Добавляет в очередь плеера
     * @param {Object} event
     */
    addToPlayerQueue() {
        const track = this.getIdByClick(event);
        globalEventBus.emit(GLOBAL.ADD_TO_QUEUE, track.id);
    }

    /**
     * Переход на страницу артиста
     * @param {Object} event
     */
    artistClicked(event) {
        event.stopImmediatePropagation();
        let target = event.target;
        while (!target.classList.contains('l-track-big')) {
            target = target.parentNode;
        }
        globalEventBus.emit(GLOBAL.REDIRECT, target.children[3].children[1].getAttribute('href'));
    }
}
