import {Api} from '../libs/api.js';

// import {Router} from '../libs/router.js';

/**
 * Модель Профиля
 */
export class ProfileModel {
    /**
     * конструктор
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.data = {
            queue: [],
            playlist: [],
            current: 0,
            playing: false,
            shuffle: false,
            repeat: false,
        };
        this.eventBus.on('get user data', this.getUserData.bind(this));
        this.eventBus.on('get user tracks', this.getTracks.bind(this));
    }

    /**
     * получает профиль юзера
     */
    getUserData() {
        Api.profileFetch()
            .then((res) => {
                if (res === undefined) {
                    this.eventBus.emit('redirect', '/');
                    return;
                }
                if (res.ok) {
                    res.json()
                        .then((data) => {
                            this.eventBus.emit('user data', data);
                        });
                } else {
                    this.eventBus.emit('no answer', '/');
                }
            });
    }

    /**
     * Получение списка треков
     */
    getTracks() {
        console.log('getTracks');
        for (let i = 12345; i < 12350; i++) {
            Api.trackFetch(i.toString())
                .then((response) => response.json())
                .then((track) => {
                    this.data.playlist.push(track);
                    this.data.queue.push(this.data.playlist.length - 1);
                })
                .then(() => {
                    console.log('EMIT');
                    if (this.data.playlist.length === 5) {
                        this.eventBus.emit('draw profile tracklist', this.data.playlist);
                    }
                });
        }
    }
}
