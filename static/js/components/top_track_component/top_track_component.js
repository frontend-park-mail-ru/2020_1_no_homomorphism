import template from '@components/top_track_component/top_track.tmpl.xml';
import {PLAYER} from '@libs/constans';

/**
 * Компонент - верхний трек в плеере
 */
export default class TopTrackComponent {
    /**
     * Конструткор
     * @param {EventBus} eventBus
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
        document.getElementById('title').innerHTML = track.name;
        document.getElementById('title').title = track.name;
    }
}
