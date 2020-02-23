import {PlayerModel} from '../models/player.js'
import {PlayerView} from '../views/player.js'

export class PlayerController {
    constructor(eventBus/*, globalEventBus*/) {
        this.model = new PlayerModel(eventBus, {
            track   : {},
            queue   : [],
            mix     : false,
            loop    : false,
            loopOne : false,
        }),
        this.view = new PlayerView(eventBus, {
            cover : document.getElementbyId('cover'),
            artist : document.getElementbyId('artist'),
            title : document.getElementbyId('title'),
            //playPauseButton : document.getElementbyId('play-pause-button'),
            //nextButton : document.getElementbyId('next-button'),
            //prevButton : document.getElementbyId('prev-button'),
            //timeline : document.getElementbyId('timeline'),
            //volume : document.getElementById('volume'),
            //mixButton : document.getElementById('mix-button'),
            //loopButton : document.getElementbyId('loop-button'),
            //addButtons : document.getElementsByClassName('add-buttons'),
            //deleteButtons : document.getElementsByClassName('delete-buttons'),
        }),
        this.eventBus = eventBus;
        //this.globalEventBus = globalEventBus;
    }
};
