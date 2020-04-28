export const SERVER_PATH = 'http://localhost:8081';
// export const SERVER_PATH = 'https://virusmusic.fun';

export const API = '/api/v1';

export const RESPONSE = {
    OK: 200,
    OK_ADDED: 201,
    BAD_REQUEST: 400,
    UNAUTH: 401,
    NO_ACCESS_RIGHT: 403,
    EXISTS: 409,
    SERVER_ERROR: 500,
};

export const DOM = {
    CONTENT: 'l-content',
    PLAYER: 'l-player',
    NAVBAR: 'l-navbar',
    TOP_CONTENT: 'l-top-content',
};

export const URL = {
    MAIN: '/',
    NAVBAR: 'navbar',
    PLAYER: 'player',
    LOGIN: '/login',
    SIGN_UP: '/signup',
    PROFILE: '/profile',
    PROFILE_TRACKS: '/profile/tracks',
    PROFILE_ALBUMS: '/profile/albums',
    PROFILE_PLAYLISTS: '/profile/playlists',
    PROFILE_ARTISTS: '/profile/artists',
    SETTINGS: '/settings',
    ARTIST: /(\/artist\/)[0-9]+(\/albums|\/tracks|\/info)*/,
    PLAYLIST: /(\/playlist\/)[0-9]+/,
    ALBUM: /(\/album\/)[0-9]+/,
    SEARCH: /(\/search\/)(.)+/,
};

export const PAGINATION = {
    ALBUMS: 20,
    TRACKS: 50,
};

export const VALIDATION = {
    EMAIL_EMPTY: 'Enter email',
    EMAIL_INCORRECT: 'Incorrect email syntax',
    LOGIN_EMPTY: 'Enter login',
    LOGIN_INCORRECT: 'Login must contain at least 3 letters or numbers',
    PASS_EMPTY: 'Enter password',
    REPEAT_PASS_EMPTY: 'Repeat the password',
    PASSES_DIFF: 'Passwords must match',
    PASS_INCORRECT: 'Password must contain at least 3 letters or numbers',
    IMG_TOO_BIG: 'Max allowable size - 1Mb',
    IMG_WRONG_EXT: 'Allowable extensions - png, jpg, jpeg, gif',
    REGEX_EMAIL: '(.)+@(.)+',
    REGEX_LOGIN: '^[a-zA-Z0-9_.]{3,}$',
    REGEX_PASSWORD: '^[a-zA-Z0-9]{3,}$',
    ALLOWABLE_EXTENSIONS: ['png', 'jpg', 'jpeg', 'gif'],
};

export const GLOBAL = {
    GET_ARTIST_TRACKS: 'global-get-artist-tracks',
    PLAY_ARTIST_TRACKS: 'global-play-artist-tracks',
    PLAY_PLAYLIST_TRACKS: 'global-play-playlist-tracks',
    PLAY_ALBUM_TRACKS: 'global-play-album-tracks',
    PLAY_TRACKS: 'global-play-track-tracks',
    PLAY_PLAYLIST: 'global-play-playlist',
    PLAY_ALBUM: 'global-play-album',
    CLEAR_AND_LOCK: 'global-clear-and-lock',
    COLLAPSE: 'global-collapse',
    REDIRECT: 'redirect',
    HREF: 'global-href',
    LOGOUT_REDIRECT: 'global-logout-redirect',
    CLOSE_SEARCH: 'global-close-search',
    PAUSE: 'global-pause',
};

export const MAIN = {
    GET_LIST_DATA: 'get-all-artists-data',
    RENDER_ARTIST: 'render-artist-list',
    NO_ANSWER: 'no-answer',
    // REDIRECT: 'redirect',
};

export const LOGIN = {
    // REDIRECT: 'redirect',
    INVALID: 'login-invalid',
    SUBMIT: 'login-submit',
    LOGIN_SUCCESS: 'login-success',
};

export const NAVBAR = {
    HEIGHT: 55,
    LOGIN_SUCCESS: 'navbar-login-success',
    CHECK_COOKIE: 'navbar-check-cookie',
    DRAW_COOKIE_RESULT: 'navbar-draw-cookie-result',
    RENDER_LOGGED: 'navbar-logged-in',
    RENDER_NOT_LOGGED: 'navbar-guest',
    GET_USER_DATA: 'navbar-get-user-data',
    LOGOUT_CLICKED: 'navbar-logout-clicked',
};

export const PLAYER = {
    // REDIRECT: 'player-redirect',
    GET_TRACK: 'player-get-track',
    GET_TRACKS: 'player-get-tracks',
    RESIZE: 'player-resize',
    PAUSE: 'player-pause',
    PLAY: 'player-play',
    PREVIOUS: 'player-previous-track',
    NEXT: 'player-next-track',
    REWIND: 'player-rewind',
    SHUFFLE: 'player-shuffle',
    UNSHUFFLE: 'player-unshuffle',
    REPEAT: 'player-repeat',
    REPEAT_ONE: 'player-repeat-one',
    UNREPEAT: 'player-unrepeat',
    MUTE: 'player-mute',
    UNMUTE: 'player-unmute',
    DELETE: 'player-delete',
    LIKE: 'player-like',
    ADD: 'player-add',
    DRAW_PLAY: 'player-draw-play',
    DRAW_PAUSE: 'player-draw-pause',
    TRACK_UPDATE: 'player-track-update',
    MOVE_MARKER: 'player-move-marker',
    DRAW_TRACKLIST: 'player-draw-tracklist',
    REMOVE_FROM_TRACKLIST: 'player-remove-from-tracklist',
    REMOVE_FROM_TRACKLIST_ALL: 'player-remove-from-tracklist-all',
    DRAW_TIMELINE: 'player-draw-timeline',
    DRAW_SHUFFLE: 'player-draw-shuffle',
    DRAW_UNSHUFLE: 'player-draw-unshuffle',
    DRAW_REPEAT: 'player-draw-repeat',
    DRAW_REPEAT_ONE: 'player-draw-repeat-one',
    DRAW_UNREPEAT: 'player-draw-unrepeat',
    DRAW_MUTE: 'player-draw-mute',
    DRAW_UNMUTE: 'player-draw-unmute',
};

export const SETTINGS = {
    GET_USER_DATA: 'settings-get-user-data',
    GET_CSRF_TOKEN: 'settings-get-csrf-token',
    RENDER_LOGGED: 'settings-logged-in',
    AVATAR_UPLOAD: 'settings-avatar-upload',
    SUBMIT: 'settings-submit',
    SUBMIT_PASSWORD: 'settings-submit-password',
    INVALID: 'settings-invalid',
    // REDIRECT: 'settings-redirect',
};

export const SIGN_UP = {
    LOGIN_SUCCESS: 'signup-success',
    SUBMIT: 'signup-submit',
    INVALID: 'signup-invalid',
};

export const PROFILE = {
    SELECTED_CLASS: 'is-touched-section',
    // --
    ID_TRACKS_SECTION: 'profile-tracks-title',
    ID_PLAYLISTS_SECTION: 'profile-playlists-title',
    ID_ALBUMS_SECTION: 'profile-albums-title',
    ID_ARTISTS_SECTION: 'profile-artists-title',
    // --
    // NO_ANSWER: 'profile-no-answer',
    // REDIRECT: 'profile-redirect',
    GET_DATA: 'profile-get-profile-data',
    GET_STAT: 'profile-get-profile-stat',
    GET_TRACKS: 'profile-get-profile-tracks',
    RENDER_DATA: 'profile-render-profile-data',
    RENDER_STAT: 'profile-render-profile-stat',
    CHOOSE_SECTION: 'profile-choose-section',
    // --
    RENDER_TRACKS: 'profile-render-profile-track',
    RENDER_PLAYLISTS: 'profile-render-profile-playlist',
    RENDER_ALBUMS: 'profile-render-profile-album',
    RENDER_ARTISTS: 'profile-render-profile-artist',
    // --
    SET_PLAYLIST_ID: 'profile-set-playlist-id',
    SET_ALBUM_ID: 'profile-set-album-id',
    CHANGE_PLAYLIST_AMOUNT: 'profile-change-playlist-amount',
    DROPDOWN: 'profile-dropdown',
};

export const ARTIST = {
    SELECTED_CLASS: 'is-touched-section',
    SET_ID: 'artist-set-id',
    ID_TRACKS_SECTION: 'artist-tracks',
    ID_ALBUMS_SECTION: 'artist-albums',
    ID_INFO_SECTION: 'artist-info',
    // NO_ANSWER: 'artist-no-answer',
    // REDIRECT: 'artist-redirect',
    GET_DATA: 'artist-get-artist-data',
    RENDER_DATA: 'artist-render-artist-data',
    RENDER_TRACKS: 'artist-render-track',
    RENDER_ALBUMS: 'artist-render-album',
    RENDER_INFO: 'artist-render-info',
    // --
    SET_ARTIST_ID: 'artist-set-artist-id',
    DROPDOWN: 'artist-dropdown',
};

export const PLAYLIST = {
    DROPDOWN: 'playlist-dropdown',
    SET_TRACKS_AMOUNT: 'playlist-set-tracks-amount',
    // REDIRECT: 'playlist-redirect',
    SET_PLAYLIST_ID: 'playlist-set-id',
    GET_PLAYLIST_DATA: 'playlist-get-playlist-data',
    GET_TRACKS_DATA: 'playlist-get-tracks-data',
    RENDER_DATA: 'playlist-render-playlist',
    RENDER_PLAYLIST_DATA: 'playlist-render-playlist-data',
    RENDER_TRACKS: 'playlist-render-tracks-data',
    DELETE_PLAYLIST: 'playlist-delete',
    ERROR: 'playlist-show-errors',
    RENDER_DELETED: 'playlist-render-deleted',
    CHANGE_TRACK_AMOUNT: 'playlist-change-track-amount',
};

export const ALBUM = {
    // REDIRECT: 'album-redirect',
    GET_ALBUM_DATA: 'album-get-album-data',
    GET_TRACKS_DATA: 'album-get-tracks-data',
    RENDER_ALBUM: 'album-render-album',
    RENDER_TRACKS: 'album-render-tracks',
    SET_TRACKS_AMOUNT: 'album-set-tracks-amount',
    SET_ALBUM_ID: 'set-album-id',
    ERROR: 'album-show-errors',
};

export const SEARCH = {
    'AMOUNT_TOP': '3',
    'AMOUNT': '10',
    'INTERVAL': 0,
    // 'REDIRECT': 'search-redirect',
    'GET_DATA': 'search-get-data',
    'RENDER_DATA': 'search-render-data',
    'RENDER_ALBUMS': 'search-render-albums',
    'RENDER_ARTISTS': 'search-render-artists',
    'RENDER_TRACKS': 'search-render-tracks',
    'SET_LISTENERS': 'search-set-listeners',
};
