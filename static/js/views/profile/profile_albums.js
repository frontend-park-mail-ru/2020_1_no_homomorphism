/**
 * вью для альбомов профиля
 */
export class ProfileAlbumsView {
    /**
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        eventBus.on('get-profile-albums', this.drawAlbums.bind(this));
        this.eventBus = eventBus;
    }

    /**
     * Нажатие
     */
    drawAlbums() {
        const elem = document.getElementById('profile-album-list');
        elem.className += ' l-profile-base';
        // eslint-disable-next-line no-undef,max-len
        elem.innerHTML += nunjucks.render('../../../views/profile/profile_albums.njk');
    }

}
