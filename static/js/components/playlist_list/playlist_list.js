import template from '@components/playlist_list/playlist.tmpl.xml';
import newPlaylist from '@components/playlist_list/new_playlist.tmpl.xml';
import {globalEventBus} from '@libs/eventBus';
import PlaylistComponent from '@components/playlist/playlist';
import PopUp from '@components/pop-up/pop-up';
import {GLOBAL, PROFILE, SEARCH, POPUP} from '@libs/constants';

/**
 * Список плейлистов или альбомомв
 */
export default class PlaylistsComponent {
    /**
     * @param {EventBus} eventBus
     * @param {String} command
     * @param {String} anotherCommand
     */
    constructor(eventBus, command, anotherCommand = '') {
        this._type = '';
        this._edit = false;
        this._domItem = '';
        this._playlistComponent = new PlaylistComponent(this.setEventListeners.bind(this));
        this.eventBus = eventBus;
        this.eventBus.on(command, this.render.bind(this));
        if (anotherCommand !== '') {
            this.eventBus.on(anotherCommand, this.render.bind(this));
        }
        if (command === SEARCH.RENDER_ALBUMS) {
            this.eventBus.on(SEARCH.SET_LISTENERS, this.setEventListeners.bind(this));
        }
        this.deleteClickBinded = this.deleteClick.bind(this);
    }

    /**
     * Отрисовка списка плейлистов или альбомомв
     * @param {Object} data
     */
    render(data) {
        this._type = data.type;
        this._domItem = data.domItem;
        const elem = document.getElementsByClassName(data.domItem)[0];
        if (elem !== undefined) {
            elem.innerHTML = template(this.generateHref(data.list));
            this.setEventListeners();
        }
    }

    /**
     * Добавляет тип компонента и необходимые ссылки для проигрывания
     * @param {Array} list
     * @return {Array}
     */
    generateHref(list) {
        list.type = this._type === 'playlist';
        list.href = `/${this._type}/`;
        return list;
    }

    /**
     * Set EventListeners
     */
    setEventListeners() {
        document.querySelectorAll('img.m-list-image').forEach((elem) => {
            elem.addEventListener('click', this.elemClick.bind(this));
        });
        if (this._type === 'playlist') {
            document.getElementsByClassName('m-button-without-size')[0]
                .addEventListener('click', this.createPlaylistClick.bind(this));
            document.getElementsByClassName('m-small-input')[0]
                .addEventListener('keyup', (event) => {
                    if (event.keyCode === 13) {
                        this.createPlaylistClick.bind(this)(event);
                    }
                });
            document.getElementsByClassName('m-playlist-section-edit-button')[0]
                .addEventListener('click', this.renderEdit.bind(this));
        }
    }

    /**
     * Set dynamic EventListeners
     */
    setDynamicEventListeners() {
        // имя document.getElementsByClassName('')[0].
        // картинка
        document.getElementsByClassName('m-playlist-delete-button').forEach((button) => {
            button.addEventListener('click', this.deleteClickBinded);
        });
    }

    /**
     * Unset dynamic EventListeners
     */
    // unsetDynamicEventListeners() {
    // имя document.getElementsByClassName('')[0].
    // картинка
    // удалить
    // }

    /**
     * Рендерит в состояние редактирования или обратно
     */
    renderEdit() {
        if (this._type !== 'playlist') {
            return;
        }
        this._edit = !this._edit;
        if (this._edit) {
            this.unsetDynamicEventListeners();
        }
        document.getElementsByClassName('l-list-card').forEach((card) => {
            if (card.getAttribute('id') !== 'new playlist input') {
                const description = card.getElementsByClassName('l-list-card-description')[0];
                const input = card.getElementsByClassName('l-small-input')[0];
                description.classList.toggle('is-not-displayed');
                input.classList.toggle('is-not-displayed');
                if (this._edit) {
                    input.getElementsByTagName('input')[0].value = description.innerText;
                }
                card.getElementsByClassName('l-list-image')[0].classList.toggle('is-not-displayed');
                card.getElementsByTagName('label')[0].classList.toggle('is-not-displayed');
                card.getElementsByClassName('m-hidden-input')[0].classList
                    .toggle('is-not-displayed');
                card.getElementsByClassName('m-playlist-delete-button')[0].classList
                    .toggle('is-not-displayed');
                // card.getElementsByClassName('l-button-play-track')[0].classList
                //     .toggle('is-not-displayed');
            }
        });
        if (this._edit) {
            this.setDynamicEventListeners();
        }
    }

    /**
     * analyze click of playlist creation
     * @param {Object} event
     */
    createPlaylistClick(event) {
        const value = document.getElementsByClassName('m-small-input')[0].value;
        if (value !== '') {
            document.getElementsByClassName('m-small-input')[0].value = '';
            this._playlistComponent.createPlaylist(this.updatePlaylistList.bind(this), value);
        } else {
            new PopUp(POPUP.PLAYLIST_EMPTY_NAME_ERROR, true);
        }
    }

    /**
     * analyze click of playlist deletion
     */
    deleteClick() {}

    /**
     * Рендеринг нового плейлиста
     * @param {Object} playlist
     */
    updatePlaylistList(playlist) {
        document.getElementsByClassName(this._domItem)[0].innerHTML += newPlaylist(playlist);
        this.eventBus.emit(PROFILE.CHANGE_PLAYLIST_AMOUNT, 1);
    }

    /**
     * Получени id плейлиста или альбома
     * @param {Object} event
     */
    elemClick(event) {
        if (this._edit) {
            return;
        }
        globalEventBus.emit(GLOBAL.REDIRECT, `/${this._type}/${event.target.getAttribute('a-id')}`);
    }
}
