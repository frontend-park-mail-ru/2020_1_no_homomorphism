import template from '@components/playlist_list/playlist.tmpl.xml';
import newPlaylist from '@components/playlist_list/new_playlist.tmpl.xml';
import {globalEventBus} from '@libs/eventBus';
import PlaylistComponent from '@components/playlist/playlist';
import PopUp from '@components/pop-up/pop-up';
import {GLOBAL, PROFILE, SEARCH} from '@libs/constants';
import {lang} from '@libs/language';

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
        this.uploadClickBinded = this.uploadClick.bind(this);
        this.inputChangeBinded = this.inputChange.bind(this);
        this.imageChangeBinded = this.imageChange.bind(this);
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
        list.lang = lang;
        list.type = this._type === 'playlist';
        list.href = `/${this._type}/`;
        return list;
    }

    /**
     * Set EventListeners
     */
    setEventListeners() {
        document.getElementsByClassName(this._domItem)[0].onclick = (event) => {
            const card = document.getElementsByClassName('l-list-card').find((card) => {
                return card.contains(event.target);
            });
            if (!card && this._edit && event.target !== document
                .getElementsByClassName('m-playlist-section-edit-button')[0]
            ) {
                this.renderEdit();
            }
        };
        document.querySelectorAll('img.m-list-image').forEach((elem) => {
            elem.onclick = this.elemClick.bind(this);
        });
        if (this._type === 'playlist') {
            document.getElementsByClassName('m-button-without-size')[0]
                .onclick = this.createPlaylistClick.bind(this);
            document.getElementsByClassName('m-small-input')[0]
                .onkeyup = (event) => {
                    if (event.keyCode === 13) {
                        this.createPlaylistClick.bind(this)(event);
                    }
                };
            document.getElementsByClassName('m-playlist-section-edit-button')[0]
                .onclick = this.renderEdit.bind(this);
        }
    }

    /**
     * Set dynamic EventListeners
     */
    setDynamicEventListeners() {
        const newPlaylist = document.getElementById('new playlist input');
        document.getElementsByClassName('m-small-input').forEach((input) => {
            if (!newPlaylist.contains(input)) {
                input.addEventListener('change', this.inputChangeBinded);
            }
        });
        document.getElementsByClassName('m-hidden-input').forEach((input) => {
            input.addEventListener('change', this.imageChangeBinded);
        });
        document.getElementsByClassName('m-playlist-delete-button').forEach((button) => {
            button.addEventListener('click', this.deleteClickBinded);
        });
        document.getElementsByClassName('m-playlist-image-upload-button').forEach((button) => {
            button.addEventListener('click', this.uploadClickBinded);
        });
    }

    /**
     * Unset dynamic EventListeners
     */
    unsetDynamicEventListeners() {
        const newPlaylist = document.getElementById('new playlist input');
        document.getElementsByClassName('m-small-input').forEach((input) => {
            if (!newPlaylist.contains(input)) {
                input.removeEventListener('change', this.inputChangeBinded);
            }
        });
        document.getElementsByClassName('m-hidden-input').forEach((input) => {
            input.removeEventListener('change', this.imageChangeBinded);
        });
        document.getElementsByClassName('m-playlist-delete-button').forEach((button) => {
            button.removeEventListener('click', this.deleteClickBinded);
        });
        document.getElementsByClassName('m-playlist-image-upload-button').forEach((button) => {
            button.removeEventListener('click', this.uploadClickBinded);
        });
    }

    /**
     * Рендерит в состояние редактирования или обратно
     */
    renderEdit() {
        if (this._type !== 'playlist') {
            return;
        }
        this._edit = !this._edit;
        if (!this._edit) {
            this.unsetDynamicEventListeners();
        }
        document.getElementsByClassName('l-list-card').forEach((card) => {
            if (card.getAttribute('id') !== 'new playlist input') {
                const description = card.getElementsByClassName('l-list-card-description')[0];
                const input = card.getElementsByClassName('l-small-input')[0];
                description.classList.toggle('is-geometricaly-invisible');
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
                card.getElementsByClassName('m-playlist-image-upload-button')[0].classList
                    .toggle('is-not-displayed');
                card.getElementsByClassName('l-button-play-track')[0].classList
                    .toggle('is-not-displayed');
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
            new PopUp(lang.popUp.PLAYLIST_EMPTY_NAME_ERROR, true);
        }
    }

    /**
     * analyze click of playlist deletion
     * @param {Object} event
     */
    deleteClick(event) {
        const id = event.target.parentElement.parentElement.parentElement.getAttribute('a-id');
        this._playlistComponent.deletePlaylist(this.updatePlaylistList.bind(this), id);
    }

    /**
     * analyze click of playlist image upload
     * @param {Object} event
     */
    uploadClick(event) {
        const label = event.target.parentElement.parentElement.parentElement
            .getElementsByTagName('label')[0];
        console.log(label);
        label.click();
    }

    /**
     * Слушает изменение названия плейлиста
     * @param {Object} event
     */
    inputChange(event) {
        const id = event.target.parentElement.parentElement.getAttribute('a-id');
        this._playlistComponent.changeName(id, event.target.value, this.updatePlaylist.bind(this));
    }

    /**
     * Слушает изменение картинки плейлиста
     * @param {Object} event
     */
    imageChange(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        const id = event.target.parentElement.parentElement.getAttribute('a-id');
        this._playlistComponent.changeImage(id, event.target, this.updatePlaylist.bind(this));
    }

    /**
     * Рендеринг обновлённого списка плейлистов
     * @param {Object} playlist
     */
    updatePlaylistList(playlist) {
        if (playlist['name']) {
            document.getElementsByClassName(this._domItem)[0].innerHTML += newPlaylist({
                playlist: playlist,
                lang: lang,
            });
            this.eventBus.emit(PROFILE.CHANGE_PLAYLIST_AMOUNT, 1);
        } else {
            const card = document.getElementsByClassName('l-list-card').find((card) => {
                return card.getAttribute('a-id') === playlist['id'];
            });
            card.remove();
            this.eventBus.emit(PROFILE.CHANGE_PLAYLIST_AMOUNT, -1);
        }
    }

    /**
     * Обновление названия или картинки плейлиста
     * @param {string} id
     * @param {string} name
     * @param {string} image
     */
    updatePlaylist(id, name = '', image = '') {
        document.getElementsByClassName('l-list-card').forEach((card) => {
            if (card.getAttribute('a-id') === id) {
                if (name !== '') {
                    card.getElementsByClassName('is-geometricaly-invisible')[0].innerText = name;
                }
                if (image !== '') {
                    this._playlistComponent.getPlaylist(id, this.setImage.bind(this));
                }
            }
        });
    }

    /**
     * Обновление картинки
     * @param {String} id
     * @param {String} image
     */
    setImage(id, image) {
        document.getElementsByClassName('l-list-card').forEach((card) => {
            if (card.getAttribute('a-id') === id) {
                card.getElementsByClassName('m-list-image')[0].src = image;
                card.getElementsByClassName('m-list-image')[1].src = image;
            }
        });
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
