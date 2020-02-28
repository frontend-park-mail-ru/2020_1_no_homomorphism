import {EventBus} from '../eventBus.js'
import {PlayerModel} from '../models/player.js'
import {PlayerView} from '../views/player.js'

/**
 * контроллер для плеера
 */
export class PlayerController {
    /**
     * Конструктор
     * @param router {Router}
     */
    constructor(router) {
        this.eventBus = new EventBus();
        this.model = new PlayerModel(this.eventBus);
        this.view = new PlayerView(this.eventBus);
        this.eventBus.on('redirect to main', router.redirectToMain);

        this.eventBus.on('init', this.model.getFirst.bind(this));
        this.eventBus.on('pause', this.model.pause.bind(this));
        this.eventBus.on('play', this.model.play.bind(this));
        this.eventBus.on('prev', this.model.prev.bind(this));
        this.eventBus.on('next', this.model.next.bind(this));
        this.eventBus.on('rewind', this.model.rewind.bind(this));
        this.eventBus.on('shuffle', this.model.shuffle.bind(this));
        this.eventBus.on('unshuffle', this.model.unshuffle.bind(this));
        this.eventBus.on('repeat', this.model.repeat.bind(this));
        this.eventBus.on('repeat one', this.model.repeatOne.bind(this));
        this.eventBus.on('unrepeat', this.model.unrepeat.bind(this));
        this.eventBus.on('mute', this.model.mute.bind(this));
        this.eventBus.on('unmute', this.model.unmute.bind(this));

        this.eventBus.on('draw play', this.view.drawPlay.bind(this));
        this.eventBus.on('draw pause', this.view.drawPause.bind(this));
        this.eventBus.on('track update', this.view.updateTrack.bind(this));
        this.eventBus.on('draw tracklist', this.view.drawTracklist.bind(this));
        this.eventBus.on('draw timeline', this.view.drawTimeline.bind(this));
        this.eventBus.on('draw shuffle', this.view.drawShuffle.bind(this));
        this.eventBus.on('draw unshuffle', this.view.drawUnshuffle.bind(this));
        this.eventBus.on('draw repeat', this.view.drawRepeat.bind(this));
        this.eventBus.on('draw repeat one', this.view.drawRepeatOne.bind(this));
        this.eventBus.on('draw unrepeat', this.view.drawUnrepeat.bind(this));
        this.eventBus.on('draw mute', this.view.drawMute.bind(this));
        this.eventBus.on('draw unmute', this.view.drawUnmute.bind(this));

        this.eventBus.on('logout', this.model.logout);
    }
}
