import {EventBus} from '../eventBus.js';
import {PlayerModel} from '../models/player.js';
import {PlayerView} from '../views/player.js';

/**
 * контроллер для плеера
 */
export class PlayerController {
    /**
     * Конструктор
     * @param {Router} router
     */
    constructor(router) {
        this.eventBus = new EventBus();
        this.model = new PlayerModel(this.eventBus);
        this.view = new PlayerView(this.eventBus);
        this.eventBus.on('redirect to main', router.redirectToMain);

        this.eventBus.on('init', this.model.getFirst.bind(this.model));
        this.eventBus.on('pause', this.model.pause.bind(this.model));
        this.eventBus.on('play', this.model.play.bind(this.model));
        this.eventBus.on('prev', this.model.prev.bind(this.model));
        this.eventBus.on('next', this.model.next.bind(this.model));
        this.eventBus.on('rewind', this.model.rewind.bind(this.model));
        this.eventBus.on('shuffle', this.model.shuffle.bind(this.model));
        this.eventBus.on('unshuffle', this.model.unshuffle.bind(this.model));
        this.eventBus.on('repeat', this.model.repeat.bind(this.model));
        this.eventBus.on('repeat one', this.model.repeatOne.bind(this.model));
        this.eventBus.on('unrepeat', this.model.unrepeat.bind(this.model));
        this.eventBus.on('mute', this.model.mute.bind(this.model));
        this.eventBus.on('unmute', this.model.unmute.bind(this.model));

        this.eventBus.on('draw play', this.view.drawPlay.bind(this.view));
        this.eventBus.on('draw pause', this.view.drawPause.bind(this.view));
        this.eventBus.on('track update', this.view.updateTrack.bind(this.view));
        this.eventBus.on('draw tracklist', this.view.drawTracklist.bind(this.view));
        this.eventBus.on('draw timeline', this.view.drawTimeline.bind(this.view));
        this.eventBus.on('draw shuffle', this.view.drawShuffle.bind(this.view));
        this.eventBus.on('draw unshuffle', this.view.drawUnshuffle.bind(this.view));
        this.eventBus.on('draw repeat', this.view.drawRepeat.bind(this.view));
        this.eventBus.on('draw repeat one', this.view.drawRepeatOne.bind(this.view));
        this.eventBus.on('draw unrepeat', this.view.drawUnrepeat.bind(this.view));
        this.eventBus.on('draw mute', this.view.drawMute.bind(this.view));
        this.eventBus.on('draw unmute', this.view.drawUnmute.bind(this.view));

        this.eventBus.on('logout', this.model.logout);
    }
}
