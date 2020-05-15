import {PLAYER} from '@libs/constants';
import template from '@components/top_track/top_track.tmpl.xml';

/**
 * Компонент - верхний трек в плеере
 */
export default class TopTrackComponent {
    /**
     * Конструткор
     * @param {Object} eventBus
     */
    constructor(eventBus) {
        eventBus.on(PLAYER.TRACK_UPDATE, this.updateTrack.bind(this));
    }

    /**
     * Рендер
     */
    render() {
        document.getElementsByClassName('l-music-bar')[0].innerHTML = template();
    }

    /**
     * Обновляет текущий воспроизводимый трек
     * @param {Object} track
     */
    updateTrack(track) {
        document.getElementById('cover').src = track.image;
        document.getElementById('artist').innerHTML = track.artist;
        document.getElementById('artist').href = `/artist/${track.artist_id}`;

        document.getElementById('title').innerHTML = track.name;
        document.getElementById('title').title = track.name;
    }
}
